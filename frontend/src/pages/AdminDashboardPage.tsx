import { Fragment, useDeferredValue, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  ChevronDown,
  Clock,
  FileSpreadsheet,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Truck,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminStockToggle } from "@/components/admin/AdminStockToggle";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { type OrderRecord, type OrderStatus } from "@/data/site";
import { useToast } from "@/hooks/use-toast";
import { useDeleteOrderMutation, useOrdersQuery, useUpdateOrderMutation } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "delivered"];

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
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const formatAddress = (order: OrderRecord) =>
  [
    order.customer.address,
    order.customer.city,
    order.customer.state,
    order.customer.country === "IN" ? "India" : order.customer.country,
    order.customer.pincode,
  ]
    .filter(Boolean)
    .join(", ");

const thClass =
  "px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.22em] text-theme-body-soft";

const escapeCsvCell = (value: string | number) => {
  const normalized = String(value ?? "");
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const AdminDashboardPage = () => {
  const { isAdminReady, isAdminAuthenticated, adminEmail, logoutAdmin } = useStore();
  const { toast } = useToast();
  const { data: orders = [], isLoading, isRefetching, error, refetch } = useOrdersQuery();
  const updateOrderMutation = useUpdateOrderMutation();
  const deleteOrderMutation = useDeleteOrderMutation();
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const metrics = useMemo(() => {
    const counts = { pending: 0, processing: 0, delivered: 0 } as Record<OrderStatus, number>;
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
      <Seo
        title="SP Traditional Pickles | Admin Dashboard"
        description="Premium admin dashboard for order tracking and stock management."
        noIndex
      />
      <AdminLayout title="Dashboard">
        <div className="space-y-8">
          <div className="space-y-8">
              <div className="theme-card rounded-[1.25rem] border p-4 shadow-sm xl:p-5">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                  <div className="max-w-4xl">
                    <p className="text-theme-heading text-[10px] font-semibold uppercase tracking-[0.18em]">
                      Admin Orders
                    </p>
                    <h1 className="mt-2 font-heading text-2xl font-semibold text-theme-heading md:text-3xl">
                      Real order management
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-theme-body">
                      Review customer orders, update delivery progress, and open each row to inspect
                      the full item list before dispatch.
                    </p>
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

                <div className="mt-10 grid gap-5 xl:grid-cols-4">
                  <div className="rounded-[1.9rem] border border-[#ead9a2] bg-[linear-gradient(145deg,#fffdfa_0%,#fff5db_100%)] p-7 shadow-[0_16px_36px_rgba(30,79,46,0.08)]">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fff0c6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a651a]">
                      <ShoppingCart className="h-4 w-4" />
                      Total Orders
                    </div>
                    <p className="mt-6 font-heading text-5xl font-bold text-theme-heading">
                      {metrics.totalOrders}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-theme-body">
                      Total revenue: {formatCurrency(metrics.revenue)}
                    </p>
                  </div>

                  {ORDER_STATUSES.map((status) => {
                    const Icon =
                      status === "pending" ? Clock : status === "processing" ? TrendingUp : Truck;

                    return (
                      <div
                        key={status}
                        className={`rounded-[1.9rem] border p-7 shadow-[0_16px_36px_rgba(30,79,46,0.08)] ${STATUS_META[status].panel}`}
                      >
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_META[status].badge}`}>
                          <Icon className="h-4 w-4" />
                          {STATUS_META[status].label}
                        </div>
                        <p className={`mt-6 font-heading text-5xl font-bold ${STATUS_META[status].count}`}>
                          {metrics.counts[status]}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-theme-body">
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

              <div className="theme-card rounded-[2rem] border p-6 shadow-md xl:p-8">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.24em]">
                      Filters
                    </p>
                    <p className="mt-2 text-sm leading-7 text-theme-body">
                      Search by phone number or order ID, then click any row to view the full items
                      list, shipping amount, and delivery details.
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

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === "all"
                        ? "border-[#2f7a43] bg-[#2f7a43] text-white"
                        : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                    }`}
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
                          ? "border-[#2f7a43] bg-[#2f7a43] text-white"
                          : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
                      }`}
                    >
                      {STATUS_META[status].label} ({metrics.counts[status]})
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-sm font-medium text-theme-body-muted">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              </div>

              <div className="theme-card overflow-hidden rounded-[2rem] border shadow-md">
                {statusUpdateError ? (
                  <div className="border-b border-[#ead9a2] bg-[#fff7e3] px-6 py-4">
                    <p className="text-sm font-semibold text-[#8a651a]">Status update failed</p>
                    <p className="mt-1 text-sm leading-6 text-[#8a651a]">{statusUpdateError}</p>
                  </div>
                ) : null}

                <div className="overflow-x-auto">
                  <table className="min-w-[1180px] w-full border-collapse">
                    <thead className="bg-[#f7faf6]">
                      <tr>
                        <th className={thClass}>Order ID</th>
                        <th className={thClass}>Customer Name</th>
                        <th className={thClass}>Phone</th>
                        <th className={thClass}>Address</th>
                        <th className={thClass}>Total</th>
                        <th className={thClass}>Date &amp; Time</th>
                        <th className={thClass}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr className="border-t border-[#e6ece4]">
                          <td colSpan={7} className="px-6 py-14 text-center">
                            <div className="inline-flex items-center gap-3 rounded-full bg-[#fff3ce] px-5 py-3 text-sm font-semibold text-[#8a651a]">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading orders
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr className="border-t border-[#e6ece4]">
                          <td colSpan={7} className="px-6 py-14 text-center">
                            <div className="mx-auto max-w-xl rounded-2xl border border-[#ead9a2] bg-[#fff7e3] px-6 py-6">
                              <p className="text-lg font-semibold text-[#8a651a]">Unable to load orders</p>
                              <p className="mt-2 text-sm leading-7 text-[#8a651a]">
                                {error instanceof Error ? error.message : "Please try refreshing the page."}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredOrders.length === 0 ? (
                        <tr className="border-t border-[#e6ece4]">
                          <td colSpan={7} className="px-6 py-14 text-center">
                            <div className="theme-card-soft mx-auto max-w-xl rounded-2xl border border-dashed px-6 py-8">
                              <p className="text-theme-heading text-lg font-semibold">No matching orders</p>
                              <p className="mt-2 text-sm leading-7 text-theme-body">
                                Adjust the status filter or search text to see more results.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const isExpanded = expandedId === order.id;
                          const isUpdating =
                            updatingId === order.id && updateOrderMutation.isPending;

                          return (
                            <Fragment key={order.id}>
                              <tr
                                onClick={() =>
                                  setExpandedId((currentExpandedId) =>
                                    currentExpandedId === order.id ? null : order.id,
                                  )
                                }
                                className="cursor-pointer border-t border-[#e6ece4] align-top transition hover:bg-[#f7faf6]"
                              >
                                <td className="px-6 py-5">
                                  <div className="flex items-start gap-3">
                                    <span className="mt-1 rounded-full border border-[#ead9a2] bg-[#fff7e3] p-1 text-[#8a651a]">
                                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </span>
                                    <div>
                                      <p className="font-semibold text-theme-heading">{order.id}</p>
                                      <p className="mt-1 text-sm text-theme-body">
                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="font-semibold text-theme-heading">{order.customer.name}</p>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-theme-heading">
                                  {order.customer.phone}
                                </td>
                                <td className="px-6 py-5">
                                  <p className="max-w-[320px] text-sm leading-6 text-theme-body">
                                    {formatAddress(order)}
                                  </p>
                                </td>
                                <td className="px-6 py-5 text-sm font-semibold text-theme-heading">
                                  {formatCurrency(order.total)}
                                </td>
                                <td className="px-6 py-5 text-sm text-theme-body">
                                  {formatDateTime(order.createdAt)}
                                </td>
                                <td className="px-6 py-5">
                                  <div onClick={(event) => event.stopPropagation()}>
                                    <select
                                      value={order.status}
                                      onChange={(event) =>
                                        void handleStatusChange(order.id, event.target.value as OrderStatus)
                                      }
                                      disabled={isUpdating}
                                      className={`min-w-[170px] rounded-full border px-4 py-2.5 text-sm font-semibold outline-none transition ${STATUS_META[order.status].select} disabled:cursor-not-allowed disabled:opacity-70`}
                                    >
                                      {ORDER_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                          {STATUS_META[status].label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                              </tr>

                              {isExpanded ? (
                                <tr className="bg-[#fafcf9]">
                                  <td colSpan={7} className="px-6 pb-6 pt-0">
                                    <div className="grid gap-4 border-t border-[#e6ece4] pt-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
                                      <div className="theme-card rounded-[1.5rem] border p-5 shadow-sm">
                                        <div className="flex items-center justify-between gap-4 border-b border-[#e6ece4] pb-4">
                                          <div>
                                            <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.22em]">
                                              Order Details
                                            </p>
                                            <h2 className="mt-2 text-xl font-semibold text-theme-heading">
                                              Full items list
                                            </h2>
                                          </div>
                                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_META[order.status].badge}`}>
                                            {STATUS_META[order.status].label}
                                          </span>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                          {order.items.map((item, index) => (
                                            <div
                                              key={`${order.id}-${item.productId}-${item.weight}-${index}`}
                                              className="theme-card-soft grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_120px_90px_140px]"
                                            >
                                              <div>
                                                <p className="font-semibold text-theme-heading">{item.name}</p>
                                                <p className="mt-1 text-sm text-theme-body">Product ID: {item.productId}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-body-soft">Weight</p>
                                                <p className="mt-2 text-sm font-medium text-theme-heading">{item.weight}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-body-soft">Qty</p>
                                                <p className="mt-2 text-sm font-medium text-theme-heading">{item.quantity}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-theme-body-soft">Line Total</p>
                                                <p className="mt-2 text-sm font-semibold text-theme-heading">{formatCurrency(item.totalPrice)}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="space-y-4">
                                        <div className="theme-card rounded-[1.5rem] border p-5 shadow-sm">
                                          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.22em]">Customer</p>
                                          <div className="mt-4 space-y-3 text-sm leading-7 text-theme-body">
                                            <div>
                                              <p className="font-semibold text-theme-heading">{order.customer.name}</p>
                                              <p>{order.customer.phone}</p>
                                            </div>
                                            <div>
                                              <p className="font-semibold text-theme-heading">Delivery address</p>
                                              <p>{formatAddress(order)}</p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="theme-card rounded-[1.5rem] border p-5 shadow-sm">
                                          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.22em]">Totals</p>
                                          <div className="mt-4 space-y-3 text-sm text-theme-body">
                                            <div className="flex items-center justify-between gap-4">
                                              <span>Subtotal</span>
                                              <span className="font-semibold text-theme-heading">{formatCurrency(order.subtotal)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                              <span>Shipping</span>
                                              <span className="font-semibold text-theme-heading">{formatCurrency(order.shipping ?? 0)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-[#e6ece4] pt-3">
                                              <span className="font-semibold text-theme-heading">Total</span>
                                              <span className="font-semibold text-theme-heading">{formatCurrency(order.total)}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 border-t border-[#e6ece4] pt-3">
                                              <span className="font-semibold text-theme-heading">Placed on</span>
                                              <span className="text-right text-theme-body">{formatDateTime(order.createdAt)}</span>
                                            </div>
                                          </div>

                                          {isUpdating ? (
                                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff3ce] px-4 py-2 text-sm font-semibold text-[#8a651a]">
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                              Updating status
                                            </div>
                                          ) : null}

                                          <button
                                            type="button"
                                            onClick={() => void handleDeleteOrder(order.id)}
                                            disabled={deletingId === order.id}
                                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e8c4c4] bg-[#fff4f4] px-4 py-3 text-sm font-semibold text-[#b23434] transition hover:border-[#d88e8e] hover:bg-[#ffe8e8] disabled:cursor-not-allowed disabled:opacity-60"
                                          >
                                            {deletingId === order.id ? (
                                              <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Deleting order...
                                              </>
                                            ) : (
                                              <>
                                                <Trash2 className="h-4 w-4" />
                                                Delete Order Completely
                                              </>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Orders shown above; stock manager stays below in a single dashboard flow */}
              <div className="theme-card rounded-[2.25rem] border p-8 shadow-md xl:p-10">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
                  <div className="max-w-3xl">
                    <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.26em]">
                      Stock Management
                    </p>
                    <h2 className="mt-4 font-heading text-4xl font-semibold text-theme-heading md:text-5xl">
                      Live inventory controls
                    </h2>
                    <p className="mt-4 text-base leading-8 text-theme-body">
                      Product status changes sync through shared stock state so storefront visibility updates immediately.
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] border border-[#d8e5d8] bg-[#f7fbf7] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-body-soft">
                      Admin Session
                    </p>
                    <p className="mt-3 break-all text-base font-semibold text-theme-heading">{adminEmail}</p>
                    <p className="mt-3 text-sm leading-7 text-theme-body">
                      Use filters to manage Salt Pickles, Tempered Pickles, Podulu, and Fryums faster.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-[#d8e5d8] bg-white/70 p-4 sm:p-6">
                  <AdminStockToggle />
                </div>
              </div>
            </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
