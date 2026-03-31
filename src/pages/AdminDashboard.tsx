/**
 * Admin Dashboard Page
 * Overview of orders and key metrics
 */
import { useOrdersQuery } from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";
import { formatCurrency } from "@/lib/pricing";
import { ShoppingBag, Truck, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const { data: orders = [], isLoading } = useOrdersQuery();

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    recentOrders: orders.slice(0, 5),
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eadfce]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#9b6a27]">Total Orders</p>
                <p className="mt-2 text-3xl font-bold text-[#241612]">
                  {isLoading ? "..." : stats.totalOrders}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-[#8B0000]/30" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eadfce]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#9b6a27]">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold text-[#241612]">
                  {isLoading ? "..." : formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500/30" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#eadfce]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#9b6a27]">Avg. Order Value</p>
                <p className="mt-2 text-3xl font-bold text-[#241612]">
                  {isLoading
                    ? "..."
                    : formatCurrency(
                        stats.totalOrders > 0
                          ? stats.totalRevenue / stats.totalOrders
                          : 0
                      )}
                </p>
              </div>
              <Truck className="w-8 h-8 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-[#eadfce] overflow-hidden">
          <div className="p-6 border-b border-[#eadfce]">
            <h3 className="text-lg font-bold text-[#241612]">Recent Orders</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fffaf4] border-b border-[#eadfce]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#9b6a27]">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#9b6a27]">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#9b6a27]">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-[#9b6a27]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#eadfce] hover:bg-[#fffaf4]/50">
                    <td className="px-6 py-4 text-sm font-mono text-[#8B0000]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#241612]">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#241612]">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
