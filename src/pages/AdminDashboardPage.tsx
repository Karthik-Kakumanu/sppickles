import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, LogOut, Package2, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useUpdateStockMutation } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

const AdminDashboardPage = () => {
  const { products, isAdminReady, isAdminAuthenticated, adminEmail, logoutAdmin } = useStore();
  const updateStockMutation = useUpdateStockMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        `${a.category}-${a.name}`.localeCompare(`${b.category}-${b.name}`),
      ),
    [products],
  );

  const totals = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((product) => product.isAvailable).length,
      outOfStock: products.filter((product) => !product.isAvailable).length,
    }),
    [products],
  );

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-[#fffaf4] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#eadfd5] bg-white px-8 py-16 text-center shadow-md">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b1e1e]">
            Loading
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-[#241612]">
            Preparing stock management
          </h1>
        </div>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleToggle = async (productId: string, currentState: boolean) => {
    setUpdatingId(productId);

    try {
      await updateStockMutation.mutateAsync({
        productId,
        isAvailable: !currentState,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ed_55%,#fffaf4_100%)] py-16">
      <Seo
        title="SP Traditional Pickles | Admin Dashboard"
        description="Stock management for SP Traditional Pickles."
      />

      <section className={pageWrap}>
        <div className="rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b1e1e]">
                Admin Panel
              </p>
              <h1 className="mt-4 font-heading text-5xl font-semibold text-[#241612] md:text-6xl">
                Stock management only
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#685448]">
                Products stay static on the frontend. This panel only controls whether each product
                is shown as in stock or out of stock.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-full border border-[#dfe8da] bg-[#f4f8f3] px-5 py-3 text-sm font-semibold text-[#2e6a34]">
                Logged in as {adminEmail}
              </div>
              <button
                type="button"
                onClick={logoutAdmin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#eadfd5] bg-white px-5 py-3 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-[#fff8f3] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                Total Products
              </p>
              <p className="mt-3 font-heading text-4xl font-semibold text-[#241612]">
                {totals.total}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f4f8f3] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2e6a34]">
                In Stock
              </p>
              <p className="mt-3 font-heading text-4xl font-semibold text-[#241612]">
                {totals.inStock}
              </p>
            </div>
            <div className="rounded-2xl bg-[#fff5f1] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                Out of Stock
              </p>
              <p className="mt-3 font-heading text-4xl font-semibold text-[#241612]">
                {totals.outOfStock}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#eadfd5] bg-white shadow-md">
          <div className="flex flex-col gap-4 border-b border-[#eadfd5] px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                Product Stock Table
              </p>
              <p className="mt-2 text-sm leading-7 text-[#685448]">
                Toggle stock status to immediately update the storefront.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-[#fffaf6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#685448]">
              <ShieldCheck className="h-4 w-4 text-[#2e6a34]" />
              Static catalog + live stock
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-[#fffaf6] text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#685448]">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#685448]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#685448]">
                    Price / kg
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#685448]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.22em] text-[#685448]">
                    Toggle
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => {
                  const isUpdating = updatingId === product.id && updateStockMutation.isPending;

                  return (
                    <tr key={product.id} className="border-t border-[#f1e6db] align-top">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5f1] text-[#8b1e1e]">
                            <Package2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#241612]">{product.name}</p>
                            {product.name_te ? (
                              <p className="mt-1 text-sm text-[#8b1e1e]">{product.name_te}</p>
                            ) : null}
                            <p className="mt-2 text-sm text-[#685448]">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-[#fff8f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b1e1e]">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-[#241612]">
                        {formatCurrency(product.price_per_kg)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            product.isAvailable
                              ? "bg-[#f4f8f3] text-[#2e6a34]"
                              : "bg-[#fff5f1] text-[#8b1e1e]"
                          }`}
                        >
                          {product.isAvailable ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggle(product.id, Boolean(product.isAvailable))}
                          disabled={isUpdating}
                          className={`inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                            product.isAvailable
                              ? "bg-[#fff5f1] text-[#8b1e1e] hover:bg-[#ffe8df]"
                              : "bg-[#f4f8f3] text-[#2e6a34] hover:bg-[#e7f2e4]"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          {product.isAvailable ? "Mark Out of Stock" : "Mark In Stock"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
