import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Loader2,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useAdminAnalyticsQuery } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

const metricCard =
  "rounded-[1.4rem] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_rgba(18,54,34,0.08)] backdrop-blur-xl";

const barHeights = [32, 48, 64, 52, 74, 58, 88];

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

const AdminDashboardPage = () => {
  const { isAdminReady, isAdminAuthenticated, adminEmail } = useStore();
  const { data: analytics, isLoading, isRefetching, refetch } = useAdminAnalyticsQuery();

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-20">
        <div className="theme-card mx-auto max-w-2xl rounded-[2rem] border px-8 py-16 text-center shadow-md">
          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.26em]">Loading</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-theme-heading">
            Preparing business overview
          </h1>
        </div>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const summary = analytics?.summary;
  const revenueByDay = analytics?.revenueByDay ?? [];
  const topProducts = analytics?.topProducts ?? [];
  const recentOrders = analytics?.recentOrders ?? [];

  const overviewCards = [
    {
      label: "Total orders",
      value: summary?.totalOrders ?? 0,
      icon: ShoppingCart,
      accent: "text-[#1f7a4d]",
      hint: "All orders received so far",
    },
    {
      label: "Revenue",
      value: formatCurrency(summary?.totalRevenue ?? 0),
      icon: TrendingUp,
      accent: "text-[#8a651a]",
      hint: "Gross revenue from orders",
    },
    {
      label: "Average order",
      value: formatCurrency(summary?.avgOrderValue ?? 0),
      icon: BarChart3,
      accent: "text-[#1e6b43]",
      hint: "Mean basket value",
    },
    {
      label: "In stock",
      value: summary?.inStock ?? 0,
      icon: Package,
      accent: "text-[#1f7a4d]",
      hint: "Products currently visible to customers",
    },
  ];

  const businessSignals = [
    {
      label: "Pending",
      value: summary?.pending ?? 0,
      icon: Clock,
      tone: "border-[#ead9a2] bg-[#fff7df] text-[#8a651a]",
    },
    {
      label: "Processing",
      value: summary?.processing ?? 0,
      icon: RefreshCw,
      tone: "border-[#bde2cd] bg-[#edf8f1] text-[#1f7a4d]",
    },
    {
      label: "Delivered",
      value: summary?.delivered ?? 0,
      icon: Truck,
      tone: "border-[#b4dec3] bg-[#e9f8ef] text-[#1e6b43]",
    },
    {
      label: "Out of stock",
      value: summary?.outOfStock ?? 0,
      icon: TrendingDown,
      tone: "border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]",
    },
  ];

  return (
    <>
      <Seo
        title="SP Traditional Pickles | Admin Dashboard"
        description="Business overview with orders, revenue analysis, product health, and recent activity."
        noIndex
      />
      <AdminLayout title="Dashboard">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,249,233,0.98)_0%,rgba(244,251,246,0.98)_50%,rgba(232,243,236,0.98)_100%)] p-4 shadow-[0_14px_42px_rgba(17,51,32,0.1)] sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c58a] bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a651a]">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Business overview
                </span>
                <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-theme-heading md:text-4xl">
                  Dashboard overview
                </h1>
                <p className="max-w-2xl text-sm leading-5 text-theme-body md:text-[0.95rem]">
                  Orders, revenue, and products.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2.5 text-sm font-semibold text-theme-heading transition hover:border-[#b9d7be] hover:bg-[#f7fbf8]"
                >
                  Open orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_14px_30px_rgba(31,122,77,0.24)]"
                  style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                >
                  Manage products
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.label} className={metricCard}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">
                        {card.label}
                      </p>
                      <p className={`mt-1.5 text-2xl font-extrabold tracking-[-0.03em] ${card.accent}`}>
                        {card.value}
                      </p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] text-theme-heading">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-theme-body">{card.hint}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(47,122,67,0.04)_0%,rgba(31,122,77,0.02)_100%)] p-4 shadow-[0_14px_42px_rgba(31,122,77,0.12)] backdrop-blur-xl sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4 sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">
                    💰 Revenue analysis
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-theme-heading sm:text-3xl">Last 7 day revenue</h2>
                  <p className="mt-1 text-xs text-theme-body">Detailed performance metrics and trends</p>
                </div>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  disabled={isLoading || isRefetching}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2f7a43]/30 bg-[#2f7a43]/8 px-4 py-2 text-sm font-semibold text-[#1f7a4d] transition hover:border-[#2f7a43]/60 hover:bg-[#2f7a43]/12 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {revenueByDay.length > 0 ? (
                <>
                  <div className="mb-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-[#2f7a43]/20 bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Total revenue</p>
                      <p className="mt-2 text-2xl font-bold text-theme-heading">
                        {formatCurrency(revenueByDay.reduce((sum, day) => sum + day.revenue, 0))}
                      </p>
                      <p className="mt-1 text-[11px] text-[#2f7a43] font-semibold">Across 7 days</p>
                    </div>

                    <div className="rounded-[1.2rem] border border-[#8a651a]/20 bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Daily average</p>
                      <p className="mt-2 text-2xl font-bold text-theme-heading">
                        {formatCurrency(Math.round(revenueByDay.reduce((sum, day) => sum + day.revenue, 0) / revenueByDay.length))}
                      </p>
                      <p className="mt-1 text-[11px] text-[#8a651a] font-semibold">Per day</p>
                    </div>

                    <div className="rounded-[1.2rem] border border-[#1f7a4d]/20 bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">Best day</p>
                      <p className="mt-2 text-2xl font-bold text-theme-heading">
                        {formatCurrency(Math.max(...revenueByDay.map((d) => d.revenue)))}
                      </p>
                      <p className="mt-1 text-[11px] text-[#1f7a4d] font-semibold">Peak performance</p>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-[#e5eee5] bg-white/95 p-4 sm:p-6">
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {revenueByDay.map((day, index) => {
                        const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1);
                        const normalizedHeight = ((day.revenue / maxRevenue) * 100) * 2.5;
                        const isHighPerformer = day.revenue > Math.max(...revenueByDay.map((d) => d.revenue)) * 0.7;
                        const isLowPerformer = day.revenue < Math.max(...revenueByDay.map((d) => d.revenue)) * 0.3;

                        return (
                          <div key={`${day.label}-${index}`} className="flex flex-col items-center gap-2">
                            <div className="w-full space-y-1">
                              <div className="relative h-32 w-full rounded-t-[0.8rem] bg-[#f5f5f0] overflow-hidden">
                                <div
                                  className={`absolute bottom-0 w-full rounded-t-[0.6rem] transition-all duration-300 ${
                                    isHighPerformer
                                      ? "bg-[linear-gradient(180deg,#1f9d5d_0%,#2f7a43_100%)]"
                                      : isLowPerformer
                                        ? "bg-[linear-gradient(180deg,#e8a76f_0%,#c87d54_100%)]"
                                        : "bg-[linear-gradient(180deg,#2f7a43_0%,#1f7a4d_100%)]"
                                  }`}
                                  style={{ height: `${normalizedHeight}%` }}
                                  title={`${day.label}: ${formatCurrency(day.revenue)} (${day.orders} orders)`}
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-theme-body-soft">{day.label}</p>
                                <p className="mt-0.5 text-xs font-bold text-theme-heading">{formatCurrency(day.revenue)}</p>
                                <p className="text-[10px] text-theme-body-soft">{day.orders} orders</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[linear-gradient(180deg,#1f9d5d_0%,#2f7a43_100%)]" />
                      <span className="text-theme-body">Strong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[linear-gradient(180deg,#2f7a43_0%,#1f7a4d_100%)]" />
                      <span className="text-theme-body">Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[linear-gradient(180deg,#e8a76f_0%,#c87d54_100%)]" />
                      <span className="text-theme-body">Low</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-[#fbfdfb] p-6 text-center sm:p-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-[#d8e5d8] mb-3" />
                  <p className="text-sm font-semibold text-theme-heading">No revenue data yet</p>
                  <p className="mt-1 text-xs text-theme-body-soft">New orders will appear here automatically</p>
                </div>
              )}
            </article>

            <article className="rounded-[1.5rem] border border-[#d8e5d8] bg-white/90 p-4 shadow-[0_14px_36px_rgba(18,54,34,0.08)] backdrop-blur-xl sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">Product health</p>
              <h2 className="mt-1 text-2xl font-semibold text-theme-heading">What the inventory is saying</h2>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                {businessSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <div key={signal.label} className={`rounded-[1.4rem] border px-4 py-4 ${signal.tone}`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em]">{signal.label}</p>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-3xl font-extrabold tracking-[-0.03em]">{signal.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-[1.2rem] border border-[#e5eee5] bg-[#fbfdfb] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">Admin email</p>
                <p className="mt-2 break-all text-sm font-semibold text-theme-heading">{adminEmail}</p>
              </div>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[1.5rem] border border-[#d8e5d8] bg-white/90 p-4 shadow-[0_14px_36px_rgba(18,54,34,0.08)] backdrop-blur-xl sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">Top products</p>
              <h2 className="mt-1 text-2xl font-semibold text-theme-heading">Highest-selling catalog items</h2>

              <div className="mt-4 space-y-2.5">
                {topProducts.length > 0 ? (
                  topProducts.slice(0, 6).map((product, index) => (
                    <div key={product.productId} className="rounded-[1.2rem] border border-[#e5eee5] bg-[#fbfdfb] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                            #{index + 1} {product.category}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-theme-heading">{product.name}</h3>
                        </div>
                        <p className="text-right text-sm font-semibold text-theme-heading">
                          {product.unitsSold} sold
                          <span className="block text-xs text-theme-body-soft">{formatCurrency(product.revenue)}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-[#fbfdfb] p-5 text-center text-sm text-theme-body-soft">
                    Top products will appear here once orders are placed.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-[#d8e5d8] bg-white/90 p-4 shadow-[0_14px_36px_rgba(18,54,34,0.08)] backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">Recent activity</p>
                  <h2 className="mt-1 text-2xl font-semibold text-theme-heading">Latest orders and business movement</h2>
                </div>
                <Link
                  to="/admin/orders"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-sm font-semibold text-theme-heading transition hover:border-[#b9d7be] hover:bg-[#f7fbf8]"
                >
                  Orders
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 space-y-2.5">
                {recentOrders.length > 0 ? (
                  recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="rounded-[1.2rem] border border-[#e5eee5] bg-[#fbfdfb] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                            {order.status}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold text-theme-heading">{order.customerName}</h3>
                          <p className="text-sm text-theme-body">{order.id}</p>
                        </div>
                        <p className="text-right text-sm font-semibold text-theme-heading">
                          {formatCurrency(order.total)}
                          <span className="block text-xs text-theme-body-soft">{formatShortDate(order.createdAt)}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-[#fbfdfb] p-5 text-center text-sm text-theme-body-soft">
                    Recent orders will appear here after the next checkout.
                  </div>
                )}
              </div>
            </article>
          </section>

          {isLoading ? (
            <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-white/80 p-5 text-center text-sm text-theme-body-soft">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#1f7a4d]" />
              <p className="mt-2">Loading overview data...</p>
            </div>
          ) : null}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;
