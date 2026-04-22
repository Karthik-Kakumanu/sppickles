import { type FormEvent, Fragment, useDeferredValue, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  PlusCircle,
  RefreshCw,
  Search,
  ShoppingCart,
  TrendingUp,
  Trash2,
  Truck,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { type OrderRecord, type OrderStatus, type ProductRecord, type WeightOption } from "@/data/site";
import { defaultProducts } from "@/data/site";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateManualOrderMutation,
  useDeleteOrderMutation,
  useOrdersQuery,
  useProductsQuery,
  useUpdateOrderMutation,
  refundCancelledOrder,
} from "@/lib/api";
import { calculateWeightPrice, formatCurrency } from "@/lib/pricing";
import { resolvePickleImage } from "@/lib/pickleImages";

const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "delivered", "cancelled"];

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; select: string; count: string; panel: string }
> = {
  pending: {
    label: "Pending",
    badge: "border-[#ead9a2] bg-[#fff7df] text-[#8a651a]",
    select: "border-[#ead9a2] bg-[#fffdf4] text-[#8a651a]",
    count: "text-[#8a651a]",
    panel: "border-[#ead9a2] bg-[linear-gradient(145deg,#fffdfa_0%,#fff8e8_100%)]",
  },
  processing: {
    label: "Processing",
    badge: "border-[#bde2cd] bg-[#edf8f1] text-[#1f7a4d]",
    select: "border-[#bde2cd] bg-[#f7fcf8] text-[#1f7a4d]",
    count: "text-[#1f7a4d]",
    panel: "border-[#bde2cd] bg-[linear-gradient(145deg,#f8fdf9_0%,#edf8f1_100%)]",
  },
  delivered: {
    label: "Delivered",
    badge: "border-[#b4dec3] bg-[#e9f8ef] text-[#1e6b43]",
    select: "border-[#b4dec3] bg-[#f4fbf7] text-[#1e6b43]",
    count: "text-[#1e6b43]",
    panel: "border-[#b4dec3] bg-[linear-gradient(145deg,#f9fefb_0%,#e8f7ef_100%)]",
  },
  cancelled: {
    label: "Cancelled",
    badge: "border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]",
    select: "border-[#f0c8bf] bg-[#fff8f5] text-[#b64d39]",
    count: "text-[#b64d39]",
    panel: "border-[#f0c8bf] bg-[linear-gradient(145deg,#fffaf8_0%,#fff0eb_100%)]",
  },
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const resolveCapturedAmount = (order: OrderRecord) => {
  const status = String(order.paymentStatus ?? "").toLowerCase();
  if (status === "captured" || status === "refunded") {
    return Number(order.total ?? 0);
  }
  return 0;
};

const resolveRefundedAmount = (order: OrderRecord) => {
  if (Number.isFinite(Number(order.refundAmount))) {
    return Number(order.refundAmount);
  }

  const status = String(order.paymentStatus ?? "").toLowerCase();
  if (status === "refunded") {
    return Number(order.total ?? 0);
  }

  return 0;
};

const paymentStatusBadgeClass = (paymentStatus?: string) => {
  const status = String(paymentStatus ?? "pending").toLowerCase();

  if (status === "refunded") {
    return "border-[#bde2cd] bg-[#edf8f1] text-[#1f7a4d]";
  }

  if (status === "captured") {
    return "border-[#b4dec3] bg-[#e9f8ef] text-[#1e6b43]";
  }

  if (status === "failed") {
    return "border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]";
  }

  return "border-[#ead9a2] bg-[#fff7df] text-[#8a651a]";
};

const thClass = "px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.22em] text-theme-body-soft";

const emptyManualOrder = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
  customerState: "",
  customerCountry: "IN",
  customerPincode: "",
  shipping: "0",
  paymentId: "",
  paymentStatus: "captured" as "captured" | "authorized" | "pending" | "failed",
};

type ManualOrderItem = {
  productId: string;
  name: string;
  weight: WeightOption;
  quantity: number;
  unitPrice: number;
};

type ProductPickerState = Record<
  string,
  {
    quantity: string;
    weight: WeightOption;
  }
>;

const escapeCsvCell = (value: string | number) => {
  const normalized = String(value ?? "");
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const weightOptions: WeightOption[] = ["250g", "500g", "1kg"];

const createBasketItem = (product: ProductRecord): ManualOrderItem => ({
  productId: product.id,
  name: product.name,
  weight: "500g",
  quantity: 1,
  unitPrice: calculateWeightPrice(product.price_per_kg, "500g"),
});

const calculateBasketItemPrice = (item: ManualOrderItem) => item.unitPrice * item.quantity;

const normalizeIndiaPhone = (value: string) => {
  const digitsOnly = String(value ?? "").replace(/\D/g, "");

  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return digitsOnly.slice(2);
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return digitsOnly.slice(1);
  }

  return digitsOnly;
};

const defaultImageLookup = new Map(defaultProducts.map((product) => [product.name, product.image] as const));

const resolveOrderProductImage = (product: ProductRecord) => {
  const explicitImage = String(product.image ?? "").trim();

  if (explicitImage) {
    return explicitImage;
  }

  const fallbackImage = defaultImageLookup.get(product.name)?.trim();

  if (fallbackImage) {
    return fallbackImage;
  }

  if (product.category === "pickles") {
    return resolvePickleImage(product.name);
  }

  return explicitImage;
};

const resolveOrderProductFallbackImage = (product: ProductRecord) => {
  const fallbackImage = defaultImageLookup.get(product.name)?.trim();

  if (fallbackImage) {
    return fallbackImage;
  }

  if (product.category === "pickles") {
    return resolvePickleImage(product.name);
  }

  return "/";
};

const AdminOrdersPage = () => {
  const { isAdminReady, isAdminAuthenticated, adminEmail, logoutAdmin } = useStore();
  const { toast } = useToast();
  const { data: orders = [], isLoading, isRefetching, refetch } = useOrdersQuery();
  const { data: products = [], isLoading: isProductsLoading } = useProductsQuery();
  const updateOrderMutation = useUpdateOrderMutation();
  const deleteOrderMutation = useDeleteOrderMutation();
  const createManualOrderMutation = useCreateManualOrderMutation();
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualOrder, setManualOrder] = useState(emptyManualOrder);
  const [manualItems, setManualItems] = useState<ManualOrderItem[]>([]);
  const [productPickerState, setProductPickerState] = useState<ProductPickerState>({});
  const [catalogSearch, setCatalogSearch] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const metrics = useMemo(() => {
    const counts = { pending: 0, processing: 0, delivered: 0, cancelled: 0 } as Record<OrderStatus, number>;
    let revenue = 0;

    for (const order of orders) {
      counts[order.status] += 1;
      revenue += order.total;
    }

    return { counts, revenue, totalOrders: orders.length };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const phoneSearch = deferredSearchQuery.replace(/\D/g, "");

    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!deferredSearchQuery) return true;

      const orderId = order.id.toLowerCase();
      const phone = order.customer.phone.replace(/\D/g, "");
      return orderId.includes(deferredSearchQuery) || (phoneSearch && phone.includes(phoneSearch));
    });
  }, [deferredSearchQuery, orders, statusFilter]);

  const basketSubtotal = useMemo(
    () => manualItems.reduce((sum, item) => sum + calculateBasketItemPrice(item), 0),
    [manualItems],
  );

  const basketShipping = Number(manualOrder.shipping || 0);
  const basketTotal = basketSubtotal + basketShipping;

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    setStatusUpdateError(null);
    setUpdatingId(orderId);

    try {
      await updateOrderMutation.mutateAsync({ orderId, status: nextStatus });
    } catch (mutationError) {
      const message =
        mutationError instanceof Error ? mutationError.message : "Failed to update the order status.";
      setStatusUpdateError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportToSheets = () => {
    if (filteredOrders.length === 0) {
      toast({
        title: "Nothing to export",
        description: "There are no orders in the current view.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Order ID",
      "Created At",
      "Payment Time",
      "Payment ID",
      "Payment Status",
      "Status",
      "Customer Name",
      "Phone",
      "Address",
      "City",
      "State",
      "Country",
      "Pincode",
      "Product Name",
      "Product ID",
      "Weight",
      "Quantity",
      "Unit Price",
      "Line Total",
      "Order Subtotal",
      "Shipping",
      "Order Total",
    ];

    const rows = filteredOrders.flatMap((order) => {
      const baseColumns = [
        order.id,
        formatDateTime(order.createdAt),
        formatDateTime(order.paymentTime ?? order.createdAt),
        order.paymentId || "-",
        order.paymentStatus || "pending",
        STATUS_META[order.status].label,
        order.customer.name,
        order.customer.phone,
        order.customer.address,
        order.customer.city,
        order.customer.state,
        order.customer.country,
        order.customer.pincode,
      ];

      if (order.items.length === 0) {
        return [
          [
            ...baseColumns,
            "",
            "",
            "",
            "",
            "",
            "",
            order.subtotal,
            order.shipping ?? 0,
            order.total,
          ],
        ];
      }

      return order.items.map((item) => [
        ...baseColumns,
        item.name,
        item.productId,
        item.weight,
        item.quantity,
        item.unitPrice,
        item.totalPrice,
        order.subtotal,
        order.shipping ?? 0,
        order.total,
      ]);
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `sp-pickles-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);

    toast({
      title: "Export ready",
      description: "Downloaded a Sheets-friendly CSV for the current orders view.",
    });
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      `Delete order ${orderId} completely? This will permanently remove the order and its items.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(orderId);

    try {
      await deleteOrderMutation.mutateAsync({ orderId });
      setExpandedId((currentExpandedId) => (currentExpandedId === orderId ? null : currentExpandedId));
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    const confirmed = window.confirm(`Refund order ${orderId} through Razorpay? This should only be used for cancelled paid orders.`);

    if (!confirmed) {
      return;
    }

    setRefundingId(orderId);

    try {
      await refundCancelledOrder(orderId);
      await refetch();
      toast({
        title: "Refund initiated",
        description: `Refund started for ${orderId}.`,
      });
    } catch (error) {
      toast({
        title: "Refund failed",
        description: error instanceof Error ? error.message : "Unable to start the refund.",
        variant: "destructive",
      });
    } finally {
      setRefundingId(null);
    }
  };

  const handleAddProductToBasket = (product: ProductRecord) => {
    const defaultPicker = productPickerState[product.id] ?? { quantity: "1", weight: "500g" as WeightOption };
    const nextItem = createBasketItem(product);
    nextItem.weight = defaultPicker.weight;
    nextItem.quantity = Math.max(1, Number(defaultPicker.quantity || 1) || 1);
    nextItem.unitPrice = calculateWeightPrice(product.price_per_kg, defaultPicker.weight);

    setManualItems((current) => {
      const existingItemIndex = current.findIndex((item) => item.productId === product.id);

      if (existingItemIndex >= 0) {
        const updatedItems = [...current];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          ...nextItem,
        };
        return updatedItems;
      }

      return [...current, nextItem];
    });
  };

  const handleRemoveBasketItem = (productId: string) => {
    setManualItems((current) => current.filter((item) => item.productId !== productId));
  };

  const handleUpdateBasketItem = (productId: string, patch: Partial<ManualOrderItem>) => {
    setManualItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              ...patch,
              quantity: patch.quantity ?? item.quantity,
              unitPrice: patch.weight
                ? calculateWeightPrice(
                    products.find((product) => product.id === productId)?.price_per_kg ?? item.unitPrice,
                    patch.weight,
                  )
                : item.unitPrice,
            }
          : item,
      ),
    );
  };

  const handleManualProductPickerChange = (
    productId: string,
    patch: Partial<{ quantity: string; weight: WeightOption }>,
  ) => {
    setProductPickerState((current) => ({
      ...current,
      [productId]: {
        quantity: patch.quantity ?? current[productId]?.quantity ?? "1",
        weight: patch.weight ?? current[productId]?.weight ?? "500g",
      },
    }));
  };

  const resetManualOrderForm = () => {
    setManualOrder(emptyManualOrder);
    setManualItems([]);
    setProductPickerState({});
    setCatalogSearch("");
    setShowManualEntry(false);
  };

  const handleManualOrderSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = normalizeIndiaPhone(manualOrder.customerPhone);

    if (!/^\d{10}$/.test(normalizedPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Enter a valid 10-digit mobile number (you can include +91 or leading 0).",
        variant: "destructive",
      });
      return;
    }

    if (manualItems.length === 0) {
      toast({
        title: "Add at least one product",
        description: "Pick one or more products before saving the manual order.",
        variant: "destructive",
      });
      return;
    }

    await createManualOrderMutation.mutateAsync({
      name: manualOrder.customerName.trim(),
      phone: normalizedPhone,
      address: manualOrder.customerAddress.trim(),
      city: manualOrder.customerCity.trim(),
      state: manualOrder.customerState.trim(),
      country: manualOrder.customerCountry.trim() || "IN",
      pincode: manualOrder.customerPincode.trim(),
      shipping: Number(manualOrder.shipping || 0),
      paymentMethod: "upi",
      paymentId: manualOrder.paymentId.trim() || undefined,
      paymentStatus: manualOrder.paymentStatus,
      items: manualItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        price: item.unitPrice,
      })),
    });

    resetManualOrderForm();
  };

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-20">
        <div className="theme-card mx-auto max-w-2xl rounded-[2rem] border px-8 py-16 text-center shadow-md">
          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.26em]">Loading</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-theme-heading">
            Preparing order management
          </h1>
        </div>
      </main>
    );
  }

  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <>
      <Seo title="SP Traditional Pickles | Admin Orders" description="Premium admin order management." noIndex />
      <AdminLayout title="Orders">
        <div className="space-y-8">
          <div className="space-y-8">
              <div className="theme-card rounded-[1.25rem] border p-4 shadow-sm xl:p-5">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                  <div className="max-w-4xl">
                    <p className="text-theme-heading text-[10px] font-semibold uppercase tracking-[0.18em]">
                      Orders
                    </p>
                    <h1 className="mt-2 font-heading text-2xl font-semibold text-theme-heading md:text-3xl">
                      Order overview
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-theme-body">
                      Track and update orders.
                    </p>
                        <div className="mt-4 rounded-[1.2rem] border border-[#e7cf91] bg-[#fff9eb] px-4 py-3 text-sm leading-6 text-theme-body">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8a651a]" />
                            <p>
                              Customers can cancel within 6 hours of purchase. Cancelled orders stay visible here and can be refunded from the order card.
                            </p>
                          </div>
                        </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[1.15rem] border border-[#ead9a2] bg-[linear-gradient(145deg,#fffdfa_0%,#fff5db_100%)] p-3 shadow-[0_10px_22px_rgba(30,79,46,0.08)]">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0c6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a651a]">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Total Orders
                        </div>
                        <p className="mt-2 font-heading text-3xl font-bold leading-none text-theme-heading">
                          {metrics.totalOrders}
                        </p>
                        <p className="mt-1 text-[11px] leading-4 text-theme-body">
                          Total revenue: {formatCurrency(metrics.revenue)}
                        </p>
                      </div>

                      {ORDER_STATUSES.map((status) => {
                        const Icon =
                          status === "pending" ? Clock : status === "processing" ? TrendingUp : Truck;

                        return (
                          <div
                            key={status}
                            className={`rounded-[1.15rem] border p-3 shadow-[0_10px_22px_rgba(30,79,46,0.08)] ${STATUS_META[status].panel}`}
                          >
                            <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_META[status].badge}`}>
                              <Icon className="h-3.5 w-3.5" />
                              {STATUS_META[status].label}
                            </div>
                            <p className={`mt-2 font-heading text-3xl font-bold leading-none ${STATUS_META[status].count}`}>
                              {metrics.counts[status]}
                            </p>
                            <p className="mt-1 text-[11px] leading-4 text-theme-body">
                              {status === "pending"
                                ? "Fresh orders waiting for action"
                                : status === "processing"
                                  ? "Orders being prepared now"
                                  : "Successfully completed"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[1rem] border border-[#ead9a2] bg-[#fff7e3] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a651a]">
                        Logged In
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-theme-heading">
                        {adminEmail}
                      </p>
                    </div>

                    <div className="rounded-[1rem] border border-[#d8e5d8] bg-[#f7fbf7] p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={handleExportToSheets}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-body transition hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                        >
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          Export to Sheets
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void refetch();
                          }}
                          disabled={isLoading || isRefetching}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-body transition hover:border-[#e2b93b] hover:bg-[#fff8e8] hover:text-theme-heading disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                          Refresh orders
                        </button>
                        <button
                          type="button"
                          onClick={logoutAdmin}
                          className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-body transition hover:border-[#d9c5b5] hover:bg-[#fdf7f2] hover:text-theme-heading"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="theme-card rounded-[2rem] border p-6 shadow-md xl:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8e5d8] bg-[#f7fbf7] px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                      Manual order entry
                    </p>
                    <p className="text-sm text-theme-body">Create an order directly from admin. Payment ID is optional.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (showManualEntry) {
                        resetManualOrderForm();
                        return;
                      }

                      setShowManualEntry(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#2f7a43] bg-[#2f7a43] px-4 py-2 text-sm font-semibold !text-white"
                    style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                  >
                    <PlusCircle className="h-4 w-4" />
                    {showManualEntry ? "Close manual form" : "Add manual order"}
                  </button>
                </div>

                {showManualEntry ? (
                  <form onSubmit={handleManualOrderSubmit} className="mb-6 space-y-4 rounded-2xl border border-[#d8e5d8] bg-white p-4 shadow-sm">
                    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                            Customer details
                          </p>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <input
                              required
                              value={manualOrder.customerName}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerName: event.target.value }))
                              }
                              placeholder="Customer name"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <input
                              required
                              value={manualOrder.customerPhone}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerPhone: event.target.value }))
                              }
                              placeholder="Phone (10 digits)"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <input
                              required
                              value={manualOrder.customerCity}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerCity: event.target.value }))
                              }
                              placeholder="City"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <input
                              required
                              value={manualOrder.customerState}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerState: event.target.value }))
                              }
                              placeholder="State"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                          </div>

                          <textarea
                            required
                            rows={2}
                            value={manualOrder.customerAddress}
                            onChange={(event) =>
                              setManualOrder((current) => ({ ...current, customerAddress: event.target.value }))
                            }
                            placeholder="Full address"
                            className="theme-input mt-3 w-full rounded-xl border px-3 py-2 text-sm"
                          />

                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <input
                              required
                              value={manualOrder.customerCountry}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerCountry: event.target.value }))
                              }
                              placeholder="Country (IN)"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <input
                              required
                              value={manualOrder.customerPincode}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, customerPincode: event.target.value }))
                              }
                              placeholder="Pincode"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                            Payment and totals
                          </p>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <input
                              value={manualOrder.paymentId}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, paymentId: event.target.value }))
                              }
                              placeholder="Payment ID (optional)"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <select
                              value={manualOrder.paymentStatus}
                              onChange={(event) =>
                                setManualOrder((current) => ({
                                  ...current,
                                  paymentStatus: event.target.value as "captured" | "authorized" | "pending" | "failed",
                                }))
                              }
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            >
                              <option value="captured">Captured</option>
                              <option value="authorized">Authorized</option>
                              <option value="pending">Pending</option>
                              <option value="failed">Failed</option>
                            </select>
                            <input
                              type="number"
                              min="0"
                              required
                              value={manualOrder.shipping}
                              onChange={(event) =>
                                setManualOrder((current) => ({ ...current, shipping: event.target.value }))
                              }
                              placeholder="Shipping"
                              className="theme-input rounded-xl border px-3 py-2 text-sm"
                            />
                            <div className="rounded-xl border border-[#d8e5d8] bg-white px-3 py-2 text-sm text-theme-body">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                                Order total
                              </p>
                              <p className="mt-1 text-lg font-semibold text-theme-heading">{formatCurrency(basketTotal)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                            Selected items
                          </p>
                          <div className="mt-3 space-y-3">
                            {manualItems.length === 0 ? (
                              <div className="rounded-xl border border-dashed border-[#d8e5d8] bg-white px-4 py-5 text-sm text-theme-body">
                                No products selected yet. Use the catalog on the right.
                              </div>
                            ) : (
                              manualItems.map((item) => {
                                const basketLine = calculateBasketItemPrice(item);

                                return (
                                  <div key={item.productId} className="rounded-xl border border-[#e5eee5] bg-white p-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="font-semibold text-theme-heading">{item.name}</p>
                                        <p className="text-xs text-theme-body-soft">{item.productId}</p>
                                      </div>
                                      <p className="text-right text-sm font-semibold text-theme-heading">
                                        {formatCurrency(basketLine)}
                                        <span className="block text-xs text-theme-body-soft">{formatCurrency(item.unitPrice)} each</span>
                                      </p>
                                    </div>

                                    <div className="mt-3 grid gap-2 md:grid-cols-[120px_100px_1fr]">
                                      <select
                                        value={item.weight}
                                        onChange={(event) =>
                                          handleUpdateBasketItem(item.productId, { weight: event.target.value as WeightOption })
                                        }
                                        className="theme-input rounded-xl border px-3 py-2 text-sm"
                                      >
                                        {weightOptions.map((weight) => (
                                          <option key={weight} value={weight}>
                                            {weight}
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="number"
                                        min="1"
                                        value={String(item.quantity)}
                                        onChange={(event) =>
                                          handleUpdateBasketItem(item.productId, { quantity: Number(event.target.value || 1) })
                                        }
                                        className="theme-input rounded-xl border px-3 py-2 text-sm"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveBasketItem(item.productId)}
                                        className="rounded-xl border border-[#f0c8bf] bg-[#fff4ef] px-3 py-2 text-sm font-semibold text-[#9f4128]"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] p-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                            Product catalog
                          </p>
                          <p className="mt-1 text-sm text-theme-body">
                            Click add or adjust quantity and weight before adding.
                          </p>
                        </div>

                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-body-soft" />
                          <input
                            value={catalogSearch}
                            onChange={(event) => setCatalogSearch(event.target.value)}
                            placeholder="Search products"
                            className="theme-input w-full rounded-full border py-2.5 pl-10 pr-4 text-sm"
                          />
                        </div>

                        <div className="max-h-[38rem] overflow-auto pr-1">
                          {isProductsLoading ? (
                            <div className="flex items-center gap-2 rounded-xl border border-[#d8e5d8] bg-white px-4 py-5 text-sm text-theme-body">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading products...
                            </div>
                          ) : (
                            <div className="grid gap-3 lg:grid-cols-2">
                              {products
                                .filter((product) => {
                                  const query = catalogSearch.trim().toLowerCase();
                                  if (!query) return true;
                                  return [product.name, product.category, product.description, product.id]
                                    .join(" ")
                                    .toLowerCase()
                                    .includes(query);
                                })
                                .map((product) => {
                                  const picker = productPickerState[product.id] ?? { quantity: "1", weight: "500g" };
                                  const previewPrice = calculateWeightPrice(product.price_per_kg, picker.weight) *
                                    Math.max(1, Number(picker.quantity || 1));
                                  const isSelected = manualItems.some((item) => item.productId === product.id);

                                  return (
                                    <article key={product.id} className="rounded-2xl border border-[#e5eee5] bg-white p-3 shadow-sm">
                                      <div className="flex items-start gap-3">
                                        <img
                                          src={resolveOrderProductImage(product)}
                                          alt={product.name}
                                          className="h-16 w-16 rounded-xl object-cover"
                                          onError={(event) => {
                                            const fallbackImage = resolveOrderProductFallbackImage(product);
                                            if (fallbackImage && event.currentTarget.src !== fallbackImage) {
                                              event.currentTarget.src = fallbackImage;
                                            }
                                          }}
                                        />
                                        <div className="min-w-0 flex-1">
                                          <p className="truncate font-semibold text-theme-heading">{product.name}</p>
                                          <p className="text-xs text-theme-body-soft">{product.category}</p>
                                          <p className="mt-1 text-sm font-semibold text-theme-heading">
                                            {formatCurrency(product.price_per_kg)} / kg
                                          </p>
                                        </div>
                                      </div>

                                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        <select
                                          value={picker.weight}
                                          onChange={(event) =>
                                            handleManualProductPickerChange(product.id, {
                                              weight: event.target.value as WeightOption,
                                            })
                                          }
                                          className="theme-input rounded-xl border px-3 py-2 text-sm"
                                        >
                                          {weightOptions.map((weight) => (
                                            <option key={weight} value={weight}>
                                              {weight}
                                            </option>
                                          ))}
                                        </select>
                                        <input
                                          type="number"
                                          min="1"
                                          value={picker.quantity}
                                          onChange={(event) =>
                                            handleManualProductPickerChange(product.id, {
                                              quantity: event.target.value,
                                            })
                                          }
                                          className="theme-input rounded-xl border px-3 py-2 text-sm"
                                        />
                                      </div>

                                      <div className="mt-3 flex items-center justify-between gap-3">
                                        <div>
                                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                                            Line total
                                          </p>
                                          <p className="text-sm font-semibold text-theme-heading">{formatCurrency(previewPrice)}</p>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleAddProductToBasket(product)}
                                          className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${isSelected ? "bg-[#1f7a4d]" : "bg-[#2f7a43]"}`}
                                          style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                                        >
                                          {isSelected ? "Update basket" : "Add to basket"}
                                        </button>
                                      </div>
                                    </article>
                                  );
                                })}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-[#d8e5d8] bg-white p-4">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-theme-body">Items selected</span>
                            <span className="font-semibold text-theme-heading">{manualItems.length}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                            <span className="text-theme-body">Basket subtotal</span>
                            <span className="font-semibold text-theme-heading">{formatCurrency(basketSubtotal)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                            <span className="text-theme-body">Shipping</span>
                            <span className="font-semibold text-theme-heading">{formatCurrency(basketShipping)}</span>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e5eee5] pt-3 text-base">
                            <span className="font-semibold text-theme-heading">Total</span>
                            <span className="font-semibold text-theme-heading">{formatCurrency(basketTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-[#e5eee5] pt-4">
                      <button
                        type="submit"
                        disabled={createManualOrderMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2f7a43] px-5 py-2.5 text-sm font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                      >
                        {createManualOrderMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Create manual order
                      </button>
                    </div>
                  </form>
                ) : null}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.24em]">
                      Search & Filter
                    </p>
                    <p className="mt-2 text-sm leading-7 text-theme-body">
                      Search by order ID or phone. Use status chips to narrow results.
                    </p>
                  </div>

                  <div className="relative w-full xl:max-w-md">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-body-soft" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by order ID or phone"
                      className="theme-input w-full rounded-full border py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#e2b93b]"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === "all"
                        ? "border-[#2f7a43] bg-[#2f7a43] !text-white"
                        : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                    }`}
                    style={statusFilter === "all" ? { color: "#ffffff", WebkitTextFillColor: "#ffffff" } : undefined}
                  >
                    All ({orders.length})
                  </button>
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        statusFilter === status
                          ? STATUS_META[status].select
                          : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                      }`}
                    >
                      {STATUS_META[status].label} ({metrics.counts[status]})
                    </button>
                  ))}
                </div>

                {statusUpdateError ? (
                  <div className="mt-5 rounded-2xl border border-[#d9a08f] bg-[#fff4ef] px-4 py-3 text-sm text-[#9f4128]">
                    {statusUpdateError}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4 rounded-[2rem] border border-[#d8e5d8] bg-white/92 p-4 shadow-sm xl:p-6">
                <div className="space-y-3 md:hidden">
                  {isLoading ? (
                    <div className="rounded-2xl border border-[#e7eee7] bg-white px-4 py-6 text-center text-sm text-theme-body">
                      Loading orders...
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#d8e5d8] bg-[#fbfdfb] px-4 py-6 text-center">
                      <p className="text-base font-semibold text-theme-heading">No matching orders</p>
                      <p className="mt-2 text-sm text-theme-body">Try resetting filters or adjust your search.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("all");
                        }}
                        className="mt-4 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-heading transition hover:border-[#bfd2c1] hover:bg-[#f7fbf8]"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={`mobile-${order.id}`} className="rounded-2xl border border-[#e7eee7] bg-white p-4 shadow-sm">
                        {(() => {
                          const capturedAmount = resolveCapturedAmount(order);
                          const refundedAmount = resolveRefundedAmount(order);

                          return (
                            <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-theme-heading">{order.id}</p>
                            <p className="text-xs text-theme-body-soft">{order.items.length} item(s)</p>
                          </div>
                          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[order.status].badge}`}>
                            {STATUS_META[order.status].label}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1 text-sm">
                          <p className="font-semibold text-theme-heading">{order.customer.name}</p>
                          <p className="text-theme-body">{order.customer.phone}</p>
                          <p className="text-theme-body-soft">{formatDateTime(order.createdAt)}</p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#eaf1ea] bg-[#f8fbf8] px-3 py-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-theme-body-soft">Total</span>
                          <span className="text-sm font-semibold text-theme-heading">{formatCurrency(order.total)}</span>
                        </div>

                        <div className="mt-3 rounded-xl border border-[#eaf1ea] bg-[#fcfdfb] px-3 py-2">
                          <div className="flex items-center justify-between gap-3 text-xs text-theme-body">
                            <span>Captured amount</span>
                            <span className="font-semibold text-theme-heading">{formatCurrency(capturedAmount)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-theme-body">
                            <span>Refunded amount</span>
                            <span className="font-semibold text-theme-heading">{formatCurrency(refundedAmount)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="text-xs text-theme-body">Payment status</span>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${paymentStatusBadgeClass(order.paymentStatus)}`}>
                              {order.paymentStatus ?? "pending"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <select
                            value={order.status}
                            onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                            disabled={updatingId === order.id}
                            className={`w-full rounded-full border px-3 py-3 text-sm font-semibold outline-none sm:py-2 ${STATUS_META[order.status].select}`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_META[status].label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedId((current) => (current === order.id ? null : order.id))}
                            className="w-full rounded-full border border-[#d8e5d8] bg-white px-3 py-3 text-sm font-semibold text-theme-body transition hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading sm:w-auto sm:flex-1 sm:py-2 sm:text-xs"
                          >
                            {expandedId === order.id ? "Hide items" : "View items"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingId === order.id}
                            className="inline-flex min-w-[8rem] flex-1 items-center justify-center rounded-full border border-[#f0c8bf] bg-[#fff4ef] px-3 py-3 text-sm font-semibold text-[#9f4128] transition hover:bg-[#ffe9e2] disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 sm:text-xs"
                          >
                            {deletingId === order.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                          {order.status === "cancelled" && order.paymentStatus !== "refunded" ? (
                            <button
                              type="button"
                              onClick={() => handleRefundOrder(order.id)}
                              disabled={refundingId === order.id}
                              className="inline-flex min-w-[8rem] flex-1 items-center justify-center rounded-full border border-[#ead9a2] bg-[#fffaf0] px-3 py-3 text-sm font-semibold text-[#8a651a] transition hover:bg-[#fff4db] disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 sm:text-xs"
                            >
                              {refundingId === order.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>Refund</span>}
                            </button>
                          ) : null}
                        </div>

                        {expandedId === order.id ? (
                          <div className="mt-3 space-y-2 border-t border-[#edf1ec] pt-3">
                            {order.items.map((item) => (
                              <div key={`mobile-${order.id}-${item.productId}`} className="rounded-xl border border-[#e4eee4] bg-[#fbfdfb] px-3 py-2">
                                <p className="text-sm font-semibold text-theme-heading">{item.name}</p>
                                <p className="text-xs text-theme-body-soft">
                                  {item.weight} x {item.quantity} · {formatCurrency(item.totalPrice)}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                            </>
                          );
                        })()}
                      </div>
                    ))
                  )}
                </div>

                <div className="hidden overflow-x-auto rounded-[1.5rem] border border-[#e7eee7] bg-white md:block">
                  <table className="min-w-[1200px] w-full border-collapse">
                    <thead className="bg-[#fafcf8]">
                      <tr>
                        <th className={thClass}>Order</th>
                        <th className={thClass}>Customer</th>
                        <th className={thClass}>Amount</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Created</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-sm text-theme-body">
                            Loading orders...
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center">
                            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-[#d8e5d8] bg-[#fbfdfb] px-6 py-6">
                              <p className="text-base font-semibold text-theme-heading">No matching orders</p>
                              <p className="mt-2 text-sm text-theme-body">Try resetting filters or adjust your search.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery("");
                                  setStatusFilter("all");
                                }}
                                className="mt-4 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-heading transition hover:border-[#bfd2c1] hover:bg-[#f7fbf8]"
                              >
                                Reset filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <Fragment key={order.id}>
                            {(() => {
                              const capturedAmount = resolveCapturedAmount(order);
                              const refundedAmount = resolveRefundedAmount(order);

                              return (
                                <>
                            <tr className="border-t border-[#edf1ec] hover:bg-[#fafdf9]">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-theme-heading">{order.id}</div>
                                <div className="text-xs text-theme-body-soft">{order.items.length} item(s)</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-theme-heading">{order.customer.name}</div>
                                <div className="text-xs text-theme-body-soft">{order.customer.phone}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-theme-heading">{formatCurrency(order.total)}</div>
                                <div className="mt-1 text-xs text-theme-body-soft">Captured: {formatCurrency(capturedAmount)}</div>
                                <div className="text-xs text-theme-body-soft">Refunded: {formatCurrency(refundedAmount)}</div>
                                <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${paymentStatusBadgeClass(order.paymentStatus)}`}>
                                  {order.paymentStatus ?? "pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.status}
                                  onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                                  disabled={updatingId === order.id}
                                  className={`rounded-full border px-3 py-2 text-sm font-semibold outline-none ${STATUS_META[order.status].select}`}
                                >
                                  {ORDER_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                      {STATUS_META[status].label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm text-theme-body">{formatDateTime(order.createdAt)}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedId((current) => (current === order.id ? null : order.id))}
                                    className="rounded-full border border-[#d8e5d8] bg-white px-3 py-2 text-xs font-semibold text-theme-body transition hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                                  >
                                    {expandedId === order.id ? "Hide" : "View"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOrder(order.id)}
                                    disabled={deletingId === order.id}
                                    className="rounded-full border border-[#f0c8bf] bg-[#fff4ef] px-3 py-2 text-xs font-semibold text-[#9f4128] transition hover:bg-[#ffe9e2] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {deletingId === order.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                  </button>
                                  {order.status === "cancelled" && order.paymentStatus !== "refunded" ? (
                                    <button
                                      type="button"
                                      onClick={() => handleRefundOrder(order.id)}
                                      disabled={refundingId === order.id}
                                      className="rounded-full border border-[#ead9a2] bg-[#fffaf0] px-3 py-2 text-xs font-semibold text-[#8a651a] transition hover:bg-[#fff4db] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {refundingId === order.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refund"}
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                            {expandedId === order.id ? (
                              <tr>
                                <td colSpan={6} className="bg-[#fbfdfb] px-6 py-5">
                                  <div className="mb-4 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border border-[#e4eee4] bg-white p-4">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Captured amount</p>
                                      <p className="mt-1 text-base font-semibold text-theme-heading">{formatCurrency(capturedAmount)}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#e4eee4] bg-white p-4">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Refunded amount</p>
                                      <p className="mt-1 text-base font-semibold text-theme-heading">{formatCurrency(refundedAmount)}</p>
                                    </div>
                                    <div className="rounded-2xl border border-[#e4eee4] bg-white p-4">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Refund status</p>
                                      <p className="mt-1 text-base font-semibold text-theme-heading">{order.refundStatus ?? "not_refunded"}</p>
                                    </div>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {order.items.map((item) => (
                                      <div key={`${order.id}-${item.productId}`} className="rounded-2xl border border-[#e4eee4] bg-white p-4">
                                        <div className="font-semibold text-theme-heading">{item.name}</div>
                                        <div className="text-xs text-theme-body-soft">
                                          {item.weight} x {item.quantity} · {formatCurrency(item.totalPrice)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                                </>
                              );
                            })()}
                          </Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminOrdersPage;
