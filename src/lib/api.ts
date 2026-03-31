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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_EMAIL_KEY = "adminEmail";
const DEV_ADMIN_EMAIL = "admin@sppickles.in";
const DEV_ADMIN_PASSWORD = "SPPickles@2026";
const DEV_ADMIN_TOKEN = "sp-traditional-pickles-local-admin-token";

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

const persistAdminSession = (token: string, email: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_EMAIL_KEY, email);
};

const isDevMode = () =>
  Boolean(import.meta.env.DEV) ||
  String(import.meta.env.VITE_NODE_ENV ?? "").toLowerCase() !== "production";

const shouldUseDevAdminFallback = (error: unknown, email: string, password: string) => {
  if (!isDevMode()) {
    return false;
  }

  if (email.trim().toLowerCase() !== DEV_ADMIN_EMAIL || password !== DEV_ADMIN_PASSWORD) {
    return false;
  }

  if (!(error instanceof ApiError)) {
    return true;
  }

  return error.status >= 500 || error.status === 0;
};

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

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

const normalizeOrder = (order: any): OrderRecord => {
  const customer: OrderCustomer = {
    name: String(order.customer?.name ?? order.customer_name ?? ""),
    phone: String(order.customer?.phone ?? order.customer_phone ?? ""),
    address: String(order.customer?.address ?? order.customer_address ?? ""),
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
    status: String(order.status ?? "new") as OrderRecord["status"],
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
  pincode: string;
  shipping: number;
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
        pincode: orderData.pincode,
      },
      shipping: orderData.shipping,
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
  const response = await apiFetch<any[]>("/orders");
  return response.map(normalizeOrder);
};

export const adminLogin = async (email: string, password: string) => {
  try {
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
  } catch (error) {
    if (shouldUseDevAdminFallback(error, email, password)) {
      persistAdminSession(DEV_ADMIN_TOKEN, DEV_ADMIN_EMAIL);

      return {
        token: DEV_ADMIN_TOKEN,
        admin: {
          id: "local-dev-admin",
          email: DEV_ADMIN_EMAIL,
        },
      };
    }

    throw error;
  }
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
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
    staleTime: 1000 * 60 * 2,
  });

export const useUpdateStockMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, isAvailable }: { productId: string; isAvailable: boolean }) =>
      updateStock(productId, isAvailable),
    onSuccess: (_, { isAvailable }) => {
      toast({
        title: "Stock updated",
        description: isAvailable ? "Marked as in stock." : "Marked as out of stock.",
      });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
    onError: (error: Error) => {
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
    staleTime: 1000 * 60 * 2,
    enabled: isAuthenticated(),
  });

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
