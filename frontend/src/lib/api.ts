import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  type OrderCustomer,
  type OrderRecord,
  type ProductCategory,
  type ProductRecord,
  type WeightOption,
} from "@/data/site";
import { productCatalog } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { buildWhatsAppOrderUrl } from "@/lib/order";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

const isLocalHostname = (hostname: string) => LOCAL_HOSTNAMES.has(String(hostname).trim().toLowerCase());

const isUnsafeRuntimeApiBaseUrl = (baseUrl: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const isCurrentHostLocal = isLocalHostname(currentHost);

  try {
    const parsed = new URL(baseUrl);

    if (!isCurrentHostLocal && isLocalHostname(parsed.hostname)) {
      return true;
    }

    if (currentProtocol === "https:" && parsed.protocol === "http:") {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

const getDefaultApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }

  return "/api";
};

const ensureApiSuffix = (value: string) =>
  value.endsWith("/api") ? value : `${value}/api`;

const normalizeApiBaseUrl = (baseUrl?: string) => {
  const normalizedBaseUrl = String(baseUrl ?? "")
    .trim()
    .replace(/\/+$/, "");

  if (!normalizedBaseUrl) {
    return getDefaultApiBaseUrl();
  }

  if (isUnsafeRuntimeApiBaseUrl(normalizedBaseUrl)) {
    return "/api";
  }

  return ensureApiSuffix(normalizedBaseUrl);
};

const productImageFallbackByName = new Map(
  productCatalog.map((product) => [product.name.trim().toLowerCase(), product.image]),
);

const normalizeProductImageUrl = (image: unknown, name: unknown) => {
  const imageUrl = String(image ?? "").trim();

  if (!imageUrl) {
    return "";
  }

  try {
    const parsed = new URL(imageUrl);

    if (!isLocalHostname(parsed.hostname)) {
      return imageUrl;
    }
  } catch {
    return imageUrl;
  }

  const nameKey = String(name ?? "").trim().toLowerCase();
  return productImageFallbackByName.get(nameKey) ?? imageUrl;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const LEGACY_API_BASE_URL = API_BASE_URL.endsWith("/api") && API_BASE_URL.length > "/api".length
  ? API_BASE_URL.slice(0, -"/api".length)
  : API_BASE_URL;
const ORDER_STATUS_MAP: Record<string, OrderRecord["status"]> = {
  new: "pending",
  pending: "pending",
  processing: "processing",
  shipped: "delivered",
  delivered: "delivered",
  cancelled: "cancelled",
};

const PRODUCTS_UPDATED_AT_KEY = "sp-products-updated-at";
const COUPONS_UPDATED_AT_KEY = "sp-coupons-updated-at";
const ADS_UPDATED_AT_KEY = "sp-ads-updated-at";
const ADMIN_NEW_ORDER_EVENT = "sp-admin-new-order";
export const MAX_ADMIN_ADS = 2;

const notifyProductsUpdated = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(PRODUCTS_UPDATED_AT_KEY, String(Date.now()));
  } catch {
    // Ignore storage write failures in restricted environments.
  }

  if (typeof BroadcastChannel !== "undefined") {
    try {
      new BroadcastChannel("sp-products").postMessage({ type: "products-updated", at: Date.now() });
    } catch {
      // Ignore BroadcastChannel failures.
    }
  }
};

type CouponRealtimePayload = {
  type?: string;
  action?: "created" | "updated" | "deleted";
  coupon?: unknown;
  couponId?: string;
  coupon_id?: string;
  updatedAt?: number;
};

const notifyCouponsUpdated = (payload: CouponRealtimePayload = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const updatedAt = Date.now();

  try {
    window.localStorage.setItem(COUPONS_UPDATED_AT_KEY, String(updatedAt));
  } catch {
    // Ignore storage write failures in restricted environments.
  }

  if (typeof BroadcastChannel !== "undefined") {
    let couponChannel: BroadcastChannel | null = null;

    try {
      couponChannel = new BroadcastChannel("sp-coupons");
      couponChannel.postMessage({ type: "coupons-updated", at: updatedAt, ...payload });
    } catch {
      // Ignore BroadcastChannel failures.
    } finally {
      couponChannel?.close();
    }
  }
};

const notifyAdsUpdated = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(ADS_UPDATED_AT_KEY, String(Date.now()));
  } catch {
    // Ignore storage write failures in restricted environments.
  }

  if (typeof BroadcastChannel !== "undefined") {
    try {
      new BroadcastChannel("sp-ads").postMessage({ type: "ads-updated", at: Date.now() });
    } catch {
      // Ignore BroadcastChannel failures.
    }
  }
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

const formatApiErrorMessage = (message: string, details: unknown) => {
  if (!details || typeof details !== "object") {
    return message;
  }

  const detailRecord = details as Record<string, unknown>;
  const keySource = String(detailRecord.keySource ?? "").trim();
  const mode = String(detailRecord.mode ?? "").trim();
  const keyIdPrefix = String(detailRecord.keyIdPrefix ?? "").trim();
  if (
    message.toLowerCase().includes("razorpay") &&
    (keySource || mode || keyIdPrefix)
  ) {
    const diagnosticParts = [
      mode ? `mode: ${mode}` : "",
      keySource ? `source: ${keySource}` : "",
      keyIdPrefix ? `key: ${keyIdPrefix}` : "",
    ].filter(Boolean);

    if (diagnosticParts.length > 0) {
      return `${message} Backend diagnostic: ${diagnosticParts.join(", ")}.`;
    }
  }

  return message;
};

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

export type AdminDeviceSession = {
  id: string;
  adminUserId: string;
  adminEmail: string;
  deviceLabel: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string | null;
  lastSeenAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  isCurrent: boolean;
};

type ApiProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory?: "salt" | "asafoetida" | null;
  price_per_kg: number;
  image: string;
  description: string;
  customTag?: string | null;
  custom_tag?: string | null;
  isAvailable: boolean;
  isBestSeller?: boolean;
  isBrahminHeritage?: boolean;
  isGreenTouch?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type AdminAnalytics = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    inStock: number;
    outOfStock: number;
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
  revenueByDay: Array<{ label: string; revenue: number; orders: number }>;
  topProducts: Array<{ productId: string; name: string; category: ProductCategory; unitsSold: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    total: number;
    status: OrderRecord["status"];
    createdAt: string;
    customerName: string;
    customerPhone: string;
    paymentStatus: string;
    itemCount: number;
  }>;
};

export type CouponDiscountType = "percentage" | "fixed";
export type CouponScope = "all" | "category" | "product";
export type CouponCategoryScope = ProductCategory | "salted-pickles" | "tempered-pickles";

export type AdminCoupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  appliesTo: CouponScope;
  targetCategory: CouponCategoryScope | null;
  targetProductId: string | null;
  targetProductName: string | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AdminCouponInput = {
  code: string;
  title: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  appliesTo: CouponScope;
  targetCategory?: CouponCategoryScope | null;
  targetProductId?: string | null;
  minOrderAmount?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
};

export type AdMediaType = "image" | "video";

export type AdminAd = {
  id: string;
  title: string;
  description: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  ctaText: string | null;
  ctaUrl: string | null;
  displayOrder: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type AdminAdInput = {
  title: string;
  description?: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  displayOrder?: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
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
      formatApiErrorMessage(payload?.error || payload?.message || `API Error: ${response.status}`, payload?.details),
      response.status,
      payload?.details,
    );
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const normalizeOrderStatus = (status: unknown): OrderRecord["status"] =>
  ORDER_STATUS_MAP[String(status ?? "").trim().toLowerCase()] ?? "pending";

const normalizeProduct = (product: any): ProductRecord => ({
  id: String(product.id ?? ""),
  name: String(product.name ?? ""),
  name_te: product.name_te ? String(product.name_te) : undefined,
  nameTeluguguTelugu: product.nameTeluguguTelugu ? String(product.nameTeluguguTelugu) : undefined,
  category: String(product.category ?? "pickles") as ProductCategory,
  subcategory: product.subcategory ? (String(product.subcategory) as "salt" | "asafoetida") : undefined,
  price_per_kg: Number(product.price_per_kg ?? 0),
  image: normalizeProductImageUrl(product.image, product.name),
  description: String(product.description ?? ""),
  customTag: product.customTag ?? product.custom_tag ?? null,
  isAvailable: Boolean(product.isAvailable ?? product.is_available ?? true),
  isBestSeller: Boolean(product.isBestSeller ?? product.is_best_seller ?? false),
  isBrahminHeritage: Boolean(product.isBrahminHeritage ?? product.is_brahmin_heritage ?? true),
  isGreenTouch: Boolean(product.isGreenTouch ?? product.is_green_touch ?? true),
  deletedAt: product.deletedAt ?? product.deleted_at ?? null,
});

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
    paymentMethod: String(order.paymentMethod ?? order.payment_method ?? "upi"),
    paymentStatus: String(order.paymentStatus ?? order.payment_status ?? "pending"),
    paymentId: String(order.paymentId ?? order.razorpayPaymentId ?? order.razorpay_payment_id ?? ""),
    paymentTime: String(
      order.paymentTime ??
        order.payment_time ??
        order.paymentCapturedAt ??
        order.payment_captured_at ??
        order.createdAt ??
        order.created_at ??
        new Date().toISOString(),
    ),
      cancelledAt: order.cancelledAt ?? order.cancelled_at ?? null,
      cancellationReason: order.cancellationReason ?? order.cancellation_reason ?? null,
      refundId: order.refundId ?? order.refund_id ?? null,
      refundStatus: order.refundStatus ?? order.refund_status ?? null,
      refundAmount: Number(order.refundAmount ?? order.refund_amount ?? 0),
      refundedAt: order.refundedAt ?? order.refunded_at ?? null,
      cancelEligibleUntil: String(order.cancelEligibleUntil ?? order.cancel_eligible_until ?? order.cancelEligibleUntil ?? ""),
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

const normalizeCoupon = (coupon: any): AdminCoupon => ({
  id: String(coupon.id ?? ""),
  code: String(coupon.code ?? ""),
  title: String(coupon.title ?? ""),
  description: String(coupon.description ?? ""),
  discountType: String(coupon.discountType ?? coupon.discount_type ?? "percentage") as CouponDiscountType,
  discountValue: Number(coupon.discountValue ?? coupon.discount_value ?? 0),
  appliesTo: String(coupon.appliesTo ?? coupon.applies_to ?? "all") as CouponScope,
  targetCategory: (coupon.targetCategory ?? coupon.target_category ?? null) as CouponCategoryScope | null,
  targetProductId: coupon.targetProductId ?? coupon.target_product_id ?? null,
  targetProductName: coupon.targetProductName ?? coupon.target_product_name ?? null,
  minOrderAmount:
    coupon.minOrderAmount ?? coupon.min_order_amount ?? null,
  maxDiscountAmount:
    coupon.maxDiscountAmount ?? coupon.max_discount_amount ?? null,
  startsAt: coupon.startsAt ?? coupon.starts_at ?? null,
  endsAt: coupon.endsAt ?? coupon.ends_at ?? null,
  isActive: Boolean(coupon.isActive ?? coupon.is_active ?? true),
  createdAt: coupon.createdAt ?? coupon.created_at ?? null,
  updatedAt: coupon.updatedAt ?? coupon.updated_at ?? null,
});

const normalizeAd = (ad: any): AdminAd => ({
  id: String(ad.id ?? ""),
  title: String(ad.title ?? ""),
  description: String(ad.description ?? ""),
  mediaType: String(ad.mediaType ?? ad.media_type ?? "image") as AdMediaType,
  mediaUrl: String(ad.mediaUrl ?? ad.media_url ?? ""),
  ctaText: ad.ctaText ?? ad.cta_text ?? null,
  ctaUrl: ad.ctaUrl ?? ad.cta_url ?? null,
  displayOrder: Number(ad.displayOrder ?? ad.display_order ?? 0),
  startsAt: ad.startsAt ?? ad.starts_at ?? null,
  endsAt: ad.endsAt ?? ad.ends_at ?? null,
  isActive: Boolean(ad.isActive ?? ad.is_active ?? true),
  createdAt: ad.createdAt ?? ad.created_at ?? null,
  updatedAt: ad.updatedAt ?? ad.updated_at ?? null,
});

const upsertById = <T extends { id: string }>(items: T[] | undefined, nextItem: T) => {
  const currentItems = items ?? [];
  const itemIndex = currentItems.findIndex((item) => item.id === nextItem.id);

  if (itemIndex === -1) {
    return [nextItem, ...currentItems];
  }

  return currentItems.map((item) => (item.id === nextItem.id ? nextItem : item));
};

const removeById = <T extends { id: string }>(items: T[] | undefined, itemId: string) =>
  (items ?? []).filter((item) => item.id !== itemId);

const isWithinDisplayWindow = (startsAt: string | null, endsAt: string | null) => {
  const now = Date.now();
  const startTime = new Date(startsAt).getTime();
  const endTime = new Date(endsAt).getTime();
  const startsOk = !startsAt || (Number.isFinite(startTime) && startTime <= now);
  const endsOk = !endsAt || (Number.isFinite(endTime) && endTime >= now);

  return startsOk && endsOk;
};

const isStorefrontCoupon = (coupon: AdminCoupon) =>
  coupon.isActive && isWithinDisplayWindow(coupon.startsAt, coupon.endsAt);

const isStorefrontAd = (ad: AdminAd) =>
  ad.isActive && isWithinDisplayWindow(ad.startsAt, ad.endsAt);

const sortCouponsForAdmin = (coupons: AdminCoupon[]) =>
  [...coupons].sort((left, right) => {
    if (left.isActive !== right.isActive) return left.isActive ? -1 : 1;
    return new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() - new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
  });

const sortCouponsForStorefront = (coupons: AdminCoupon[]) =>
  [...coupons].sort(
    (left, right) =>
      new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() -
      new Date(left.updatedAt ?? left.createdAt ?? 0).getTime(),
  );

const updateCouponCaches = (
  queryClient: QueryClient,
  coupon: AdminCoupon,
  { includeAdmin = true }: { includeAdmin?: boolean } = {},
) => {
  if (includeAdmin) {
    queryClient.setQueryData<AdminCoupon[]>(["admin-coupons"], (old) =>
      sortCouponsForAdmin(upsertById(old, coupon)),
    );
  }

  queryClient.setQueryData<AdminCoupon[]>(["storefront-coupons"], (old) => {
    if (!isStorefrontCoupon(coupon)) {
      return removeById(old, coupon.id);
    }

    return sortCouponsForStorefront(upsertById(old, coupon));
  });
};

const removeCouponFromCaches = (
  queryClient: QueryClient,
  couponId: string,
  { includeAdmin = true }: { includeAdmin?: boolean } = {},
) => {
  if (includeAdmin) {
    queryClient.setQueryData<AdminCoupon[]>(["admin-coupons"], (old) => removeById(old, couponId));
  }

  queryClient.setQueryData<AdminCoupon[]>(["storefront-coupons"], (old) => removeById(old, couponId));
};

const invalidateCouponQueries = (
  queryClient: QueryClient,
  { includeAdmin = true }: { includeAdmin?: boolean } = {},
) => {
  if (includeAdmin) {
    void queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
  }

  void queryClient.invalidateQueries({ queryKey: ["storefront-coupons"] });
};

const parseCouponRealtimePayload = (rawPayload: unknown): CouponRealtimePayload | null => {
  if (!rawPayload) {
    return null;
  }

  if (typeof rawPayload === "string") {
    try {
      return JSON.parse(rawPayload) as CouponRealtimePayload;
    } catch {
      return null;
    }
  }

  if (typeof rawPayload === "object") {
    return rawPayload as CouponRealtimePayload;
  }

  return null;
};

const applyCouponRealtimePayload = (queryClient: QueryClient, rawPayload: unknown) => {
  const payload = parseCouponRealtimePayload(rawPayload);

  if (!payload || payload.type === "connected") {
    return true;
  }

  const coupon = payload.coupon ? normalizeCoupon(payload.coupon) : null;
  const couponId = String(payload.couponId ?? payload.coupon_id ?? coupon?.id ?? "").trim();

  if (payload.action === "deleted") {
    if (couponId) {
      removeCouponFromCaches(queryClient, couponId, { includeAdmin: false });
      return true;
    }

    return false;
  }

  if (coupon?.id) {
    updateCouponCaches(queryClient, coupon, { includeAdmin: false });
    return true;
  }

  return false;
};

export const getCouponEventsUrl = () => buildRequestUrl(API_BASE_URL, "/coupon-events");

export const useCouponRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refreshCoupons = () => invalidateCouponQueries(queryClient, { includeAdmin: false });
    const applyOrRefresh = (payload: unknown) => {
      if (!applyCouponRealtimePayload(queryClient, payload)) {
        refreshCoupons();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === COUPONS_UPDATED_AT_KEY) {
        refreshCoupons();
      }
    };

    const couponChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("sp-coupons") : null;
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "coupons-updated") {
        applyOrRefresh(event.data);
      }
    };

    window.addEventListener("storage", handleStorage);
    couponChannel?.addEventListener("message", handleBroadcast);

    let couponEvents: EventSource | null = null;
    const handleServerEvent = (event: Event) => {
      applyOrRefresh((event as MessageEvent).data);
    };

    try {
      couponEvents = new EventSource(getCouponEventsUrl(), { withCredentials: true });
      couponEvents.addEventListener("coupon-update", handleServerEvent);
    } catch {
      couponEvents = null;
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      couponChannel?.removeEventListener("message", handleBroadcast);
      couponChannel?.close();
      couponEvents?.removeEventListener("coupon-update", handleServerEvent);
      couponEvents?.close();
    };
  }, [queryClient]);
};

const sortAdsForStorefront = (ads: AdminAd[]) =>
  [...ads].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) return left.displayOrder - right.displayOrder;
    return new Date(right.updatedAt ?? right.createdAt ?? 0).getTime() - new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
  });

export const getProducts = async (
  category: ProductCategory | null = null,
  includeDeleted = false,
) => {
  const products = await apiFetch<ApiProduct[]>(includeDeleted ? "/admin/products/deleted" : "/products");
  const normalizedProducts = products.map(normalizeProduct);

  return category
    ? normalizedProducts.filter((product) => product.category === category)
    : normalizedProducts;
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

export const createProduct = async (productData: Partial<ProductRecord>) =>
  apiFetch<ProductRecord>("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });

export const cancelOrder = async (orderId: string, phone: string, reason?: string) => {
  const response = await apiFetch<any>(`/orders/${orderId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ phone, reason }),
  });

  return normalizeOrder(response);
};

export const refundCancelledOrder = async (orderId: string) => {
  const response = await apiFetch<any>(`/admin/orders/${orderId}/refund`, {
    method: "POST",
  });

  return normalizeOrder(response);
};

export const updateProduct = async (productId: string, productData: Partial<ProductRecord>) =>
  apiFetch<ProductRecord>(`/products/${String(productId).trim()}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
  });

export const deleteProduct = async (productId: string) =>
  apiFetch<{ id: string; deleted: boolean }>(`/products/${String(productId).trim()}`, {
    method: "DELETE",
  });

export const permanentlyDeleteProduct = async (productId: string) =>
  apiFetch<{ id: string; name: string; deleted: boolean; permanent: boolean }>(
    `/products/${String(productId).trim()}/permanent`,
    {
      method: "DELETE",
    },
  );

export const restoreProduct = async (productId: string) =>
  apiFetch<ProductRecord>(`/products/${String(productId).trim()}/restore`, {
    method: "POST",
  });

export const importProducts = async (products: ProductRecord[]) =>
  apiFetch<{ imported: number; products: ProductRecord[] }>("/admin/products/import", {
    method: "POST",
    body: JSON.stringify({ products }),
  });

export const getAdminAnalytics = async () => apiFetch<AdminAnalytics>("/admin/analytics");

export const getAdminCoupons = async () => {
  const coupons = await apiFetch<any[]>("/admin/coupons");
  return coupons.map(normalizeCoupon);
};

export const getCoupons = async () => {
  const coupons = await apiFetch<any[]>("/coupons");
  return coupons.map(normalizeCoupon);
};

export const createAdminCoupon = async (couponData: AdminCouponInput) => {
  const response = await apiFetch<any>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(couponData),
  });

  const coupon = normalizeCoupon(response);
  notifyCouponsUpdated({ action: "created", couponId: coupon.id, coupon, updatedAt: Date.now() });
  return coupon;
};

export const updateAdminCoupon = async (couponId: string, couponData: Partial<AdminCouponInput>) => {
  const response = await apiFetch<any>(`/admin/coupons/${String(couponId).trim()}`, {
    method: "PATCH",
    body: JSON.stringify(couponData),
  });

  const coupon = normalizeCoupon(response);
  notifyCouponsUpdated({ action: "updated", couponId: coupon.id, coupon, updatedAt: Date.now() });
  return coupon;
};

export const deleteAdminCoupon = async (couponId: string) => {
  const response = await apiFetch<{ id: string; code: string; deleted: boolean }>(`/admin/coupons/${String(couponId).trim()}`, {
    method: "DELETE",
  });

  notifyCouponsUpdated({ action: "deleted", couponId: response.id, updatedAt: Date.now() });
  return response;
};

export const getAdminAds = async () => {
  const ads = await apiFetch<any[]>("/admin/ads");
  return ads.map(normalizeAd);
};

export const getAds = async () => {
  const ads = await apiFetch<any[]>("/ads");
  return ads.map(normalizeAd);
};

export const createAdminAd = async (adData: AdminAdInput) => {
  const response = await apiFetch<any>("/admin/ads", {
    method: "POST",
    body: JSON.stringify(adData),
  });

  notifyAdsUpdated();
  return normalizeAd(response);
};

export const updateAdminAd = async (adId: string, adData: Partial<AdminAdInput>) => {
  const response = await apiFetch<any>(`/admin/ads/${String(adId).trim()}`, {
    method: "PATCH",
    body: JSON.stringify(adData),
  });

  notifyAdsUpdated();
  return normalizeAd(response);
};

export const deleteAdminAd = async (adId: string) => {
  const response = await apiFetch<{ id: string; title: string; deleted: boolean }>(`/admin/ads/${String(adId).trim()}`, {
    method: "DELETE",
  });

  notifyAdsUpdated();
  return response;
};

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

export type CheckoutOrderPayload = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  shipping: number;
  couponCode?: string | null;
  paymentMethod?: "upi";
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    weight: WeightOption;
    price: number;
  }>;
};

export type AdminManualOrderPayload = CheckoutOrderPayload & {
  paymentId?: string;
  paymentStatus?: "captured" | "authorized" | "pending" | "failed";
};

export const createRazorpayOrder = async (orderData: CheckoutOrderPayload) =>
  apiFetch<{
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  }>("/payments/razorpay/order", {
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
      couponCode: orderData.couponCode ?? null,
      paymentMethod: orderData.paymentMethod || "upi",
      items: orderData.items.map((item) => ({
        product_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        price: item.price,
      })),
    }),
  });

export const verifyRazorpayPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  checkoutPayload: CheckoutOrderPayload;
}) => {
  const response = await apiFetch<{
    order: any;
    payment: {
      provider: "razorpay";
      razorpayOrderId: string;
      razorpayPaymentId: string;
      status: string;
    };
  }>("/payments/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    order: normalizeOrder(response.order),
    payment: response.payment,
  };
};

export const createOrder = async (orderData: CheckoutOrderPayload) => {
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
      couponCode: orderData.couponCode ?? null,
      paymentMethod: orderData.paymentMethod || "upi",
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

export const createAdminManualOrder = async (orderData: AdminManualOrderPayload) => {
  const paymentId = String(orderData.paymentId ?? "").trim();

  const response = await apiFetch<any>("/admin/orders/manual", {
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
      couponCode: orderData.couponCode ?? null,
      paymentMethod: orderData.paymentMethod || "upi",
      ...(paymentId ? { payment_id: paymentId } : {}),
      payment_status: orderData.paymentStatus || "captured",
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

export const requestAdminPasswordResetOtp = async (mobile: string) =>
  apiFetch<{ eligible: boolean; expiresInSeconds: number; devOtp?: string }>(
    "/admin/password-reset/request-otp",
    {
      method: "POST",
      body: JSON.stringify({ mobile }),
    },
  );

export const confirmAdminPasswordResetOtp = async (mobile: string, otp: string, newPassword: string) =>
  apiFetch<{ passwordUpdated: boolean; sessionsRevoked: boolean }>(
    "/admin/password-reset/confirm",
    {
      method: "POST",
      body: JSON.stringify({ mobile, otp, newPassword }),
    },
  );

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

export const getAdminSessions = async (): Promise<{ sessions: AdminDeviceSession[] }> =>
  apiFetch<{ sessions: AdminDeviceSession[] }>("/admin/sessions");

export const useProductsQuery = (category: ProductCategory | null = null, includeDeleted = false) =>
  useQuery({
    queryKey: ["products", category, includeDeleted],
    queryFn: () => getProducts(category, includeDeleted),
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 15,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
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

export const useCreateManualOrderMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createAdminManualOrder,
    onSuccess: (order) => {
      toast({
        title: "Manual order added",
        description: `Order ${order.id} created from admin panel.`,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(ADMIN_NEW_ORDER_EVENT, {
            detail: { count: 1, source: "manual", orderId: order.id },
          }),
        );
      }

      return order;
    },
    onError: (error: Error) => {
      toast({
        title: "Manual entry failed",
        description: error.message || "Unable to create manual order.",
        variant: "destructive",
      });
    },
  });
};

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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productData: Partial<ProductRecord>) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Product saved",
        description: "The catalog has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: Partial<ProductRecord> }) =>
      updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Product updated",
        description: "The catalog changes were saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Product deleted",
        description: "The product moved to Deleted products and can be restored.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const usePermanentDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) => permanentlyDeleteProduct(productId),
    onSuccess: (product) => {
      queryClient.setQueryData<ProductRecord[]>(["products", null, true], (old) =>
        removeById(old, product.id),
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Product permanently deleted",
        description: `${product.name || product.id} was removed completely.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Permanent delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useRestoreProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) => restoreProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Product restored",
        description: "The deleted product is back in the live catalog.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Restore failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useImportProductsMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (products: ProductRecord[]) => importProducts(products),
    onSuccess: (_, products) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      notifyProductsUpdated();
      toast({
        title: "Catalog imported",
        description: `${products.length} products were synchronized to the database.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAdminAnalyticsQuery = () =>
  useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
    staleTime: 0,
    refetchInterval: 1000 * 20,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

export const useAdminCouponsQuery = () =>
  useQuery({
    queryKey: ["admin-coupons"],
    queryFn: getAdminCoupons,
    staleTime: 0,
    refetchInterval: 1000 * 5,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (couponData: AdminCouponInput) => createAdminCoupon(couponData),
    onSuccess: (coupon) => {
      updateCouponCaches(queryClient, coupon);
      invalidateCouponQueries(queryClient);
      toast({
        title: "Coupon created",
        description: `${coupon.code} is now available in the coupon list.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create coupon.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      couponId,
      couponData,
    }: {
      couponId: string;
      couponData: Partial<AdminCouponInput>;
    }) => updateAdminCoupon(couponId, couponData),
    onSuccess: (coupon) => {
      updateCouponCaches(queryClient, coupon);
      invalidateCouponQueries(queryClient);
      toast({
        title: "Coupon updated",
        description: `${coupon.code} has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update coupon.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (couponId: string) => deleteAdminCoupon(couponId),
    onSuccess: (coupon) => {
      removeCouponFromCaches(queryClient, coupon.id);
      invalidateCouponQueries(queryClient);
      toast({
        title: "Coupon deleted",
        description: `${coupon.code} was removed.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete coupon.",
        variant: "destructive",
      });
    },
  });
};

export const useAdminAdsQuery = (enabled = true) =>
  useQuery({
    queryKey: ["admin-ads"],
    queryFn: getAdminAds,
    enabled,
    staleTime: 0,
    refetchInterval: 1000 * 5,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

export const useAdsQuery = () =>
  useQuery({
    queryKey: ["storefront-ads"],
    queryFn: getAds,
    staleTime: 0,
    refetchInterval: 1000 * 2,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

export const useCreateAdMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (adData: AdminAdInput) => createAdminAd(adData),
    onSuccess: (ad) => {
      queryClient.setQueryData<AdminAd[]>(["admin-ads"], (old) => upsertById(old, ad));
      queryClient.setQueryData<AdminAd[]>(["storefront-ads"], (old) =>
        isStorefrontAd(ad) ? sortAdsForStorefront(upsertById(old, ad)) : removeById(old, ad.id),
      );
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["storefront-ads"] });
      toast({
        title: "Ad created",
        description: `${ad.title} is now available in ads list.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create ad.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAdMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      adId,
      adData,
    }: {
      adId: string;
      adData: Partial<AdminAdInput>;
    }) => updateAdminAd(adId, adData),
    onSuccess: (ad) => {
      queryClient.setQueryData<AdminAd[]>(["admin-ads"], (old) => upsertById(old, ad));
      queryClient.setQueryData<AdminAd[]>(["storefront-ads"], (old) =>
        isStorefrontAd(ad) ? sortAdsForStorefront(upsertById(old, ad)) : removeById(old, ad.id),
      );
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["storefront-ads"] });
      toast({
        title: "Ad updated",
        description: `${ad.title} has been updated.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update ad.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAdMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (adId: string) => deleteAdminAd(adId),
    onSuccess: (ad) => {
      queryClient.setQueryData<AdminAd[]>(["admin-ads"], (old) => removeById(old, ad.id));
      queryClient.setQueryData<AdminAd[]>(["storefront-ads"], (old) => removeById(old, ad.id));
      queryClient.invalidateQueries({ queryKey: ["admin-ads"] });
      queryClient.invalidateQueries({ queryKey: ["storefront-ads"] });
      toast({
        title: "Ad deleted",
        description: `${ad.title} was removed.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete ad.",
        variant: "destructive",
      });
    },
  });
};
