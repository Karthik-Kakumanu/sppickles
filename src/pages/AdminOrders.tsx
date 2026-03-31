/**
 * Admin Orders Page
 * View and manage all orders with real-time updates
 */
import { useOrdersQuery, useUpdateOrderMutation } from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";
import { formatCurrency } from "@/lib/pricing";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCw, AlertCircle, CheckCircle2, Clock, Truck, Package } from "lucide-react";
import type { OrderRecord } from "@/data/site";

const STATUS_CONFIG: Record<OrderRecord["status"], { badge: string; icon: React.ReactNode; color: string }> = {
  new: {
    badge: "bg-yellow-100 text-yellow-800",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-yellow-600",
  },
  processing: {
    badge: "bg-blue-100 text-blue-800",
    icon: <Clock className="w-4 h-4" />,
    color: "text-blue-600",
  },
  shipped: {
    badge: "bg-purple-100 text-purple-800",
    icon: <Truck className="w-4 h-4" />,
    color: "text-purple-600",
  },
  delivered: {
    badge: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-green-600",
  },
  cancelled: {
    badge: "bg-red-100 text-red-800",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-red-600",
  },
};

const NEXT_STATUS: Record<OrderRecord["status"], OrderRecord["status"] | null> = {
  new: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

export function AdminOrders() {
  const { data: orders = [], isLoading, refetch } = useOrdersQuery();
  const updateMutation = useUpdateOrderMutation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh orders every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  return (
    <AdminLayout title="Orders">
      <div className="space-y-4">
        {/* Header with Stats and Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <p className="text-sm text-[#9b6a27] font-semibold">Order Management</p>
            <p className="text-2xl font-bold text-[#241612]">
              {isLoading ? "..." : `${orders.length} Orders`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#eadfce] bg-white px-4 py-2 text-sm font-semibold text-[#241612] transition hover:bg-[#fffaf4] disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                autoRefresh
                  ? "border-[#8B0000] bg-[#8B0000] text-white"
                  : "border-[#eadfce] bg-white text-[#241612] hover:bg-[#fffaf4]"
              }`}
            >
              {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
            </button>
          </div>
        </div>

        {/* Order Status Summary */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <div key={status} className="rounded-lg border border-[#eadfce] bg-white p-3 text-center">
                <div className={`flex justify-center mb-1 ${config.color}`}>{config.icon}</div>
                <p className="text-xs font-semibold text-[#241612] capitalize">{status}</p>
                <p className="text-lg font-bold text-[#8B0000]">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <RefreshCw className="w-8 h-8 animate-spin text-[#8B0000]" />
              </div>
              <p className="mt-2 text-[#6b5643] font-medium">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 rounded-lg border-2 border-dashed border-[#eadfce] bg-[#fffaf4]/50">
              <Package className="mx-auto w-12 h-12 text-[#9b6a27] opacity-50" />
              <p className="mt-3 text-[#6b5643] font-medium">No orders yet</p>
              <p className="text-sm text-[#9b8b7b]">Orders will appear here when customers place them</p>
            </div>
          ) : (
            orders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const nextStatus = NEXT_STATUS[order.status];

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-[#eadfce] shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#fffaf4]/50 transition"
                  >
                    <div className="flex-1 text-left space-y-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-[#241612]">{order.customer.name}</p>
                          <p className="text-sm text-[#6b5643]">Order {order.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1`}>
                          {config.icon}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-[#9b6a27]">📞 {order.customer.phone}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-[#241612]">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-[#6b5643]">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {expandedId === order.id ? (
                        <ChevronUp className="w-5 h-5 text-[#9b6a27]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#9b6a27]" />
                      )}
                    </div>
                  </button>

                  {/* Order Details - Expanded */}
                  {expandedId === order.id && (
                    <div className="border-t border-[#eadfce] px-6 py-4 bg-[#fffaf4]/30 space-y-4">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-[#241612] text-sm mb-2">📍 Delivery Address</h4>
                        <div className="bg-white rounded px-3 py-2 space-y-1 text-sm text-[#6b5643]">
                          <p>{order.customer.address}</p>
                          <p>{order.customer.city}, {order.customer.state}</p>
                          {order.customer.country === "IN" && <p>📮 {order.customer.pincode}</p>}
                          <p className="font-medium text-[#2a1f1d]">🌍 {order.customer.country === "IN" ? "India" : order.customer.country}</p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-[#241612] text-sm mb-3">📦 Items Ordered</h4>
                        <div className="bg-white rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-[#fffaf4] border-b border-[#eadfce]">
                              <tr>
                                <th className="text-left py-3 px-3 font-semibold text-[#9b6a27]">Product</th>
                                <th className="text-center py-3 px-3 font-semibold text-[#9b6a27]">Weight</th>
                                <th className="text-center py-3 px-3 font-semibold text-[#9b6a27]">Qty</th>
                                <th className="text-right py-3 px-3 font-semibold text-[#9b6a27]">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-[#eadfce] hover:bg-[#fffaf4] transition"
                                >
                                  <td className="py-3 px-3 text-[#241612] font-medium">{item.name}</td>
                                  <td className="text-center py-3 px-3 text-[#6b5643]">{item.weight}</td>
                                  <td className="text-center py-3 px-3 text-[#6b5643] font-medium">{item.quantity}</td>
                                  <td className="text-right py-3 px-3 font-semibold text-[#241612]">
                                    {formatCurrency(item.totalPrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-gradient-to-r from-[#fffaf4] to-white rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#6b5643]">Subtotal</span>
                          <span className="font-semibold text-[#241612]">{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b5643]">Shipping</span>
                          <span className="font-semibold text-[#241612]">{formatCurrency(order.shipping)}</span>
                        </div>
                        <div className="border-t border-[#eadfce] pt-2 mt-2 flex justify-between">
                          <span className="font-bold text-[#241612]">Total</span>
                          <span className="font-bold text-lg text-[#8B0000]">{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {nextStatus && (
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                orderId: order.id,
                                status: nextStatus,
                              })
                            }
                            disabled={updateMutation.isPending}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#6b0000] text-white font-semibold text-sm transition hover:shadow-lg disabled:opacity-50"
                          >
                            {updateMutation.isPending ? "Updating..." : `Mark as ${nextStatus}`}
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "delivered" && (
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                orderId: order.id,
                                status: "cancelled",
                              })
                            }
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 rounded-lg border border-red-300 text-red-600 bg-red-50 font-semibold text-sm transition hover:bg-red-100 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;
