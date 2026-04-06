import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultProducts,
  type OrderCustomer,
  type OrderRecord,
  type ProductCategory,
  type ProductRecord,
  type WeightOption,
} from "@/data/site";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppOrderUrl } from "@/lib/order";

const DEFAULT_API_ORIGIN =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin
    : "http://localhost:5000";
const normalizeApiBaseUrl = (baseUrl?: string) => {
  const normalizedBaseUrl = String(baseUrl ?? "")
    .trim()
    .replace(/\/+$/, "");

  if (!normalizedBaseUrl) {
    return `${DEFAULT_API_ORIGIN}/api`;
  }

  return normalizedBaseUrl.endsWith("/api") ? normalizedBaseUrl : `${normalizedBaseUrl}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const LEGACY_API_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -"/api".length)
  : API_BASE_URL;
const ORDER_STATUS_MAP: Record<string, OrderRecord["status"]> = {
  new: "pending",
  pending: "pending",
  processing: "processing",
  shipped: "delivered",
  delivered: "delivered",
  cancelled: "pending",
};

class ApiError extends Error {
  status;
  details;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string | null;
  error?: string;
  details?: unknown;
};

type StockRecord = {
  product_id: string;
  is_available: boolean;
  updated_at: string;
};

type StockState = {
  isAvailable: boolean;
  updatedAt: number;
};

const buildRequestUrl = (baseUrl: string, endpoint: string) =>
  `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

const performRequest = async (requestUrl: string, options: RequestInit, headers: Headers) => {
  try {
    return await fetch(requestUrl, {
      ...options,
      cache: "no-store",
      credentials: "include",
      headers,
    });
  } catch (error) {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "the admin dashboard origin";
    const message = error instanceof Error ? error.message : "Network request failed.";

    throw new ApiError(
      `Unable to reach ${requestUrl}. Original error: ${message}. Check that the backend is running and CORS allows requests from ${origin}.`,
      0,
      { cause: message, requestUrl },
    );
  }
};

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}) => {
  const requestUrl = buildRequestUrl(API_BASE_URL, endpoint);
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let response = await performRequest(requestUrl, options, headers);
  let payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  const shouldRetryLegacyRoute =
    LEGACY_API_BASE_URL !== API_BASE_URL &&
    response.status === 404 &&
    (payload?.error === "Route not found." || payload?.message === "Route not found.");

  if (shouldRetryLegacyRoute) {
    response = await performRequest(buildRequestUrl(LEGACY_API_BASE_URL, endpoint), options, headers);
    payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error || payload?.message || `API Error: ${response.status}`,
      response.status,
      payload?.details,
    );
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const productCrudDisabled = () => {
  throw new ApiError("Product CRUD is disabled. Products are static on the frontend.", 400);
};

const normalizeOrderStatus = (status: unknown): OrderRecord["status"] =>
  ORDER_STATUS_MAP[String(status ?? "").trim().toLowerCase()] ?? "pending";

const normalizeOrder = (order: any): OrderRecord => {
  const customer: OrderCustomer = {
    name: String(order.customer?.name ?? order.customer_name ?? ""),
    phone: String(order.customer?.phone ?? order.customer_phone ?? ""),
    address: String(order.customer?.address ?? order.customer_address ?? ""),
    city: String(order.customer?.city ?? order.customer_city ?? ""),
    state: String(order.customer?.state ?? order.customer_state ?? ""),
    country: String(order.customer?.country ?? order.customer_country ?? "IN"),
    pincode: String(order.customer?.pincode ?? order.customer_pincode ?? ""),
  };

  const items = Array.isArray(order.items)
    ? order.items.map((item) => ({
        productId: String(item.productId ?? item.product_id ?? ""),
        name: String(item.name ?? item.product_name ?? ""),
        weight: String(item.weight ?? "") as WeightOption,
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0),
        totalPrice: Number(item.totalPrice ?? item.total_price ?? 0),
      }))
    : [];

  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? Math.max(Number(order.total ?? 0) - subtotal, 0));
  const total = Number(order.total ?? subtotal + shipping);

  return {
    id: String(order.id ?? ""),
    items,
    customer,
    subtotal,
    shipping,
    total,
    status: normalizeOrderStatus(order.status),
    createdAt: String(order.createdAt ?? order.created_at ?? new Date().toISOString()),
    whatsappUrl:
      typeof order.whatsappUrl === "string" && order.whatsappUrl.length > 0
        ? order.whatsappUrl
        : buildWhatsAppOrderUrl(
            items.map((item) => ({
              name: item.name,
              weight: item.weight,
              quantity: item.quantity,
            })),
            total,
            customer,
          ),
  };
};

export const getProducts = async (category: ProductCategory | null = null) => {
  const products = category
    ? defaultProducts.filter((product) => product.category === category)
    : defaultProducts;
  return products;
};

const slugifyProductName = (name: string) =>
  String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/--+/g, "-");

// Convert frontend product IDs to the database string ID format.
// If the product already has a canonical ID, keep it unchanged.
export const getDbProductId = (id: string | number, name: string): string => {
  const rawId = String(id).trim();

  if (!rawId) {
    return `product-${slugifyProductName(name)}`;
  }

  if (rawId.startsWith("product-")) {
    return rawId;
  }

  return `product-${rawId}-${slugifyProductName(name)}`;
};

export const getProductAvailability = (
  stockMap: Map<string, boolean>,
  product: Pick<ProductRecord, "id" | "name" | "isAvailable">,
) => {
  const exactProductId = String(product.id).trim();

  if (stockMap.has(exactProductId)) {
    return stockMap.get(exactProductId) ?? true;
  }

  return product.isAvailable ?? true;
};

export const createProduct = async () => productCrudDisabled();
export const updateProduct = async () => productCrudDisabled();
export const deleteProduct = async () => productCrudDisabled();

export const getStock = async (): Promise<Map<string, boolean>> => {
  try {
    const records = await apiFetch<StockRecord[]>("/stock");
    const normalizedStock = new Map<string, StockState>();

    records.forEach((item, index) => {
      const rawProductId = String(item.product_id).trim();
      const normalizedProductId = rawProductId;
      const updatedAt = Date.parse(item.updated_at);
      const timestamp = Number.isFinite(updatedAt) ? updatedAt : index;
      const previous = normalizedStock.get(normalizedProductId);

      if (!previous || timestamp >= previous.updatedAt) {
        normalizedStock.set(normalizedProductId, {
          isAvailable: Boolean(item.is_available),
          updatedAt: timestamp,
        });
      }
    });

    return new Map(
      Array.from(normalizedStock.entries(), ([productId, state]) => [productId, state.isAvailable]),
    );
  } catch (error) {
    console.warn("Failed to fetch stock data:", error);
    return new Map();
  }
};

export const updateStock = async (productId: string, isAvailable: boolean) =>
  apiFetch<StockRecord>(`/stock/${String(productId).trim()}`, {
    method: "PUT",
    body: JSON.stringify({ is_available: isAvailable }),
  });

export const createOrder = async (orderData: {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  shipping: number;
  paymentMethod?: "upi" | "bank" | "cod";
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    weight: WeightOption;
    price: number;
  }>;
}) => {
  const response = await apiFetch<any>("/orders", {
    method: "POST",
    body: JSON.stringify({
      customer: {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        country: orderData.country,
        pincode: orderData.pincode,
      },
      shipping: orderData.shipping,
      paymentMethod: orderData.paymentMethod || "cod",
      items: orderData.items.map((item) => ({
        product_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        price: item.price,
      })),
    }),
  });

  return normalizeOrder(response);
};

export const getOrders = async () => {
  const response = await apiFetch<{ orders: any[]; pagination: any }>("/orders");
  return response.orders.map(normalizeOrder);
};

export const updateOrderStatus = async (orderId: string, status: OrderRecord["status"]) => {
  const response = await apiFetch<any>(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return normalizeOrder(response);
};

export const deleteOrder = async (orderId: string) =>
  apiFetch<{ id: string; deleted: boolean }>(`/orders/${orderId}`, {
    method: "DELETE",
  });

export const adminLogin = async (email: string, password: string) => {
  const response = await apiFetch<{ admin: { id: string; email: string } }>(
    "/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  return response;
};

export const adminLogout = () => {
  return apiFetch<{ loggedOut: boolean }>("/admin/logout", {
    method: "POST",
  });
};

export const getAdminSession = async (): Promise<{ admin: { id: string; email: string } } | null> => {
  try {
    return await apiFetch<{ admin: { id: string; email: string } }>("/admin/session");
  } catch {
    return null;
  }
};

export const useProductsQuery = (category: ProductCategory | null = null) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: () => getProducts(category),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useStockQuery = () =>
  useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
    staleTime: 1000, // keep UI responsive to rapid stock changes
    refetchInterval: 1000 * 2, // refresh every 2 seconds for near-instant visibility
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

export const useUpdateStockMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, isAvailable }: { productId: string; isAvailable: boolean }) =>
      updateStock(productId, isAvailable),
    onMutate: async ({ productId, isAvailable }) => {
      const exactProductId = String(productId).trim();

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["stock"] });
      
      // Snapshot previous data
      const previousStock = queryClient.getQueryData<Map<string, boolean>>(["stock"]);
      
      // Optimistically update the UI
      queryClient.setQueryData(["stock"], (old: Map<string, boolean> | undefined) => {
        const newStock = new Map(old || []);
        newStock.set(exactProductId, isAvailable);
        return newStock;
      });
      
      return { previousStock };
    },
    onSuccess: (_, { isAvailable }) => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast({
        title: "Stock updated",
        description: isAvailable ? "Marked as in stock." : "Marked as out of stock.",
      });
    },
    onError: (error: Error, _, context: any) => {
      // Rollback on error
      if (context?.previousStock) {
        queryClient.setQueryData(["stock"], context.previousStock);
      }
      toast({
        title: "Update failed",
        description: error.message || "Failed to update stock.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      toast({
        title: "Order placed",
        description: `Order ${order.id} created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      return order;
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message || "Failed to create order.",
        variant: "destructive",
      });
    },
  });
};

export const useOrdersQuery = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
  });

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderRecord["status"] }) =>
      updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["orders"] });
      
      // Snapshot previous data
      const previousOrders = queryClient.getQueryData<OrderRecord[]>(["orders"]);
      
      // Optimistically update the UI
      queryClient.setQueryData(["orders"], (old: OrderRecord[] | undefined) => {
        if (!old) return old;
        return old.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
      });
      
      return { previousOrders };
    },
    onSuccess: (_, { status }) => {
      toast({
        title: "Order updated",
        description: `Status changed to ${status}.`,
      });
    },
    onError: (error: Error, _, context: any) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }
      toast({
        title: "Update failed",
        description: error.message || "Failed to update order.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOrderMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => deleteOrder(orderId),
    onMutate: async ({ orderId }) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] });

      const previousOrders = queryClient.getQueryData<OrderRecord[]>(["orders"]);

      queryClient.setQueryData(["orders"], (old: OrderRecord[] | undefined) => {
        if (!old) return old;
        return old.filter((order) => order.id !== orderId);
      });

      return { previousOrders };
    },
    onSuccess: (_, { orderId }) => {
      toast({
        title: "Order deleted",
        description: `${orderId} was removed completely.`,
      });
    },
    onError: (error: Error, _, context: any) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["orders"], context.previousOrders);
      }

      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete order.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCreateProductMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createProduct,
    onError: (error: Error) => {
      toast({
        title: "Disabled",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateProduct,
    onError: (error: Error) => {
      toast({
        title: "Disabled",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteProduct,
    onError: (error: Error) => {
      toast({
        title: "Disabled",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
