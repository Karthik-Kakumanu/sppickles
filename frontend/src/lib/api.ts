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

const DEFAULT_API_ORIGIN = "http://localhost:5000";
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
const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_EMAIL_KEY = "adminEmail";
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

const getStoredToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
};

const persistAdminSession = (token: string, email: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_EMAIL_KEY, email);
};

const buildRequestUrl = (baseUrl: string, endpoint: string) =>
  `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

const performRequest = async (requestUrl: string, options: RequestInit, headers: Headers) => {
  try {
    return await fetch(requestUrl, {
      ...options,
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

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
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
    if ((response.status === 401 || response.status === 403) && token) {
      clearAdminSession();
    }

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

// Convert frontend numeric product ID to database string ID format
// e.g., 1, "Chintakaya Thokku" -> "product-1-chintakaya-thokku"
export const getDbProductId = (id: number, name: string): string => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[()]/g, "")  // Remove parentheses
    .replace(/--+/g, "-"); // Replace multiple hyphens with single hyphen
  return `product-${id}-${slug}`;
};

export const createProduct = async () => productCrudDisabled();
export const updateProduct = async () => productCrudDisabled();
export const deleteProduct = async () => productCrudDisabled();

export const getStock = async (): Promise<Map<string, boolean>> => {
  try {
    const records = await apiFetch<StockRecord[]>("/stock");
    return new Map(records.map((item) => [String(item.product_id), Boolean(item.is_available)]));
  } catch (error) {
    console.warn("Failed to fetch stock data:", error);
    return new Map();
  }
};

export const updateStock = async (productId: string, isAvailable: boolean) =>
  apiFetch<StockRecord>(`/stock/${productId}`, {
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

export const adminLogin = async (email: string, password: string) => {
  const response = await apiFetch<{ token: string; admin: { id: string; email: string } }>(
    "/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  );

  if (response.token) {
    persistAdminSession(response.token, response.admin?.email ?? email.trim().toLowerCase());
  }

  return response;
};

export const adminLogout = () => {
  clearAdminSession();
};

export const isAuthenticated = () => Boolean(getStoredToken());
export const getStoredAdminEmail = () => localStorage.getItem(ADMIN_EMAIL_KEY);

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
    staleTime: 1000 * 20, // 20 seconds
    refetchInterval: 1000 * 20, // Auto-refresh every 20 seconds
  });

export const useUpdateStockMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, isAvailable }: { productId: string; isAvailable: boolean }) =>
      updateStock(productId, isAvailable),
    onMutate: async ({ productId, isAvailable }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["stock"] });
      
      // Snapshot previous data
      const previousStock = queryClient.getQueryData<Map<string, boolean>>(["stock"]);
      
      // Optimistically update the UI
      queryClient.setQueryData(["stock"], (old: Map<string, boolean> | undefined) => {
        const newStock = new Map(old || []);
        newStock.set(productId, isAvailable);
        return newStock;
      });
      
      return { previousStock };
    },
    onSuccess: (_, { isAvailable }) => {
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
    enabled: isAuthenticated(),
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
