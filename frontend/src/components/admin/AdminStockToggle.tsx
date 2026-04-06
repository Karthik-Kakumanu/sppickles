import { useState, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProductAvailability,
  useProductsQuery,
  useStockQuery,
  useUpdateStockMutation,
} from "@/lib/api";
import { Loader2, Package, Search, X, ToggleRight, ToggleLeft, SlidersHorizontal } from "lucide-react";

/* ─── tiny reusable stat card ─────────────────────────────────────────────── */
const StatCard = ({
  label,
  count,
  total,
  accent,
  bg,
  border,
  sub,
}: {
  label: string;
  count: number;
  total: number;
  accent: string;
  bg: string;
  border: string;
  sub: string;
}) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-5`}>
      {/* subtle fill bar behind content */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 opacity-[0.07] transition-all duration-700"
        style={{ width: `${pct}%`, background: accent }}
      />
      <p className={`relative text-[10px] font-black uppercase tracking-[0.22em] ${accent.replace("bg-", "text-")} opacity-80`}
        style={{ color: accent.startsWith("#") ? accent : undefined }}
      >
        {label}
      </p>
      <div className="relative mt-3 flex items-end gap-2">
        <span className="text-[2.6rem] font-black leading-none tracking-tight" style={{ color: accent.startsWith("#") ? accent : undefined }}>
          {count}
        </span>
        <span className="mb-1 text-sm font-semibold opacity-40" style={{ color: accent.startsWith("#") ? accent : undefined }}>
          / {total}
        </span>
      </div>
      <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-black/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent.startsWith("#") ? accent : undefined }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      <p className="relative mt-2.5 text-xs font-medium text-theme-body opacity-70">{sub}</p>
    </div>
  );
};

/* ─── main component ───────────────────────────────────────────────────────── */
export const AdminStockToggle = () => {
  const { data: products = [], isLoading: loadingProducts } = useProductsQuery();
  const { data: stockData = new Map(), isLoading: loadingStock } = useStockQuery();
  const updateStockMutation = useUpdateStockMutation();

  const [updating, setUpdating] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "salt" | "tempered" | "powders" | "fryums">("all");
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  // ── business logic unchanged ──────────────────────────────────────────────
  const handleToggleStock = async (productId: string, currentStatus: boolean) => {
    const exactProductId = String(productId).trim();
    setUpdating(exactProductId);
    try {
      await updateStockMutation.mutateAsync({ productId: exactProductId, isAvailable: !currentStatus });
    } catch (error) {
      console.error("Error updating stock:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(deferredSearchQuery) ||
      product.category.toLowerCase().includes(deferredSearchQuery);

    if (!matchesSearch) {
      return false;
    }

    if (categoryFilter === "all") {
      return true;
    }

    if (categoryFilter === "salt") {
      return product.category === "pickles" && product.subcategory === "salt";
    }

    if (categoryFilter === "tempered") {
      return product.category === "pickles" && product.subcategory === "asafoetida";
    }

    if (categoryFilter === "powders") {
      return product.category === "powders";
    }

    return product.category === "fryums";
  });

  const inStockCount  = products.filter((product) => {
    return getProductAvailability(stockData, product);
  }).length;
  const outStockCount = products.length - inStockCount;

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (loadingProducts || loadingStock) {
    return (
      <div className="flex items-center justify-center py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 rounded-2xl border border-[#e8dfc8] bg-[#fff9ec] px-7 py-4 shadow-sm"
        >
          <Loader2 className="h-4 w-4 animate-spin text-[#8a651a]" />
          <span className="text-sm font-semibold text-theme-heading">Loading products…</span>
        </motion.div>
      </div>
    );
  }

  // ── empty state ───────────────────────────────────────────────────────────
  const isEmpty = filteredProducts.length === 0;

  return (
    <div className="space-y-6">

      {/* ── Summary stats ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          label="In Stock"
          count={inStockCount}
          total={products.length}
          accent="#2f7a43"
          bg="bg-[#edf8f1]/70"
          border="border-[#bde2cd]"
          sub="Visible to customers"
        />
        <StatCard
          label="Out of Stock"
          count={outStockCount}
          total={products.length}
          accent="#8a651a"
          bg="bg-[#fef5e8]/70"
          border="border-[#f0d8b8]"
          sub="Hidden from customers"
        />
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        {/* left icon */}
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-body-soft" />

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or category…"
          className="
            theme-input w-full rounded-2xl border border-[#ddd6c4]
            bg-white/80 py-3.5 pl-11 pr-11 text-[14px] font-medium
            outline-none ring-0
            transition-all duration-200
            placeholder:text-theme-body-soft/60
            focus:border-[#e2b93b] focus:bg-white focus:ring-4 focus:ring-[#e2b93b]/10
          "
        />

        {/* clear button */}
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-theme-body-soft transition hover:bg-[#f0e8d8] hover:text-theme-heading"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-first category chips for premium quick filtering */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All" },
          { key: "salt", label: "Salt Pickles" },
          { key: "tempered", label: "Tempered Pickles" },
          { key: "powders", label: "Podulu" },
          { key: "fryums", label: "Fryums" },
        ].map((filterItem) => (
          <button
            key={filterItem.key}
            type="button"
            onClick={() => setCategoryFilter(filterItem.key as typeof categoryFilter)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
              categoryFilter === filterItem.key
                ? "border-[#2f7a43] bg-[#2f7a43] text-white"
                : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#2f7a43]/35 hover:bg-[#edf5ee] hover:text-theme-heading"
            }`}
          >
            {filterItem.label}
          </button>
        ))}
      </div>

      {/* ── Result meta line ── */}
      <AnimatePresence mode="wait">
        {searchQuery && (
          <motion.div
            key="meta"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-theme-body-soft" />
            <p className="text-xs font-semibold text-theme-body-soft">
              {filteredProducts.length} of {products.length} products
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product list / empty state ── */}
      <AnimatePresence mode="wait">
        {isEmpty ? (
          /* empty */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-[#d9d2c2] bg-white/40 py-24 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e3ddd0] bg-[#f8f3e8]">
              <Package className="h-7 w-7 text-theme-body opacity-30" />
            </div>
            <div>
              <p className="text-sm font-semibold text-theme-heading">
                {searchQuery ? "No products match your search" : "No products found"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs font-semibold text-[#2f7a43] underline-offset-2 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* list */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            /* outer card wrapping all rows */
            className="overflow-hidden rounded-[2rem] border border-[#e3ebe0] bg-white/60 shadow-[0_4px_24px_rgba(15,35,25,0.06)]"
          >
            {filteredProducts.map((product, index) => {
              const dbProductId = String(product.id).trim();
              const isAvailable = getProductAvailability(stockData, product);
              const isUpdating  = updating === dbProductId;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.035, ease: "easeOut" }}
                  /* divider between rows */
                  className={`
                    flex flex-col gap-3 px-5 py-4 transition-colors duration-200
                    sm:flex-row sm:items-center sm:justify-between
                    ${index !== filteredProducts.length - 1 ? "border-b border-[#eee8da]" : ""}
                    ${isAvailable
                      ? "hover:bg-[#f2fbf5]"
                      : "hover:bg-[#fdf8ef]"
                    }
                  `}
                >
                  {/* ── Left: product info ── */}
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    {/* colored accent dot */}
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                        isAvailable ? "bg-[#2f7a43]" : "bg-[#e2b93b]"
                      }`}
                    />

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-theme-heading sm:text-[15px]">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-theme-body-soft">
                        <span className="font-medium text-theme-body">{product.category}</span>
                        <span className="opacity-40">·</span>
                        {/* fixed encoding: use ₹ entity */}
                        <span className="font-semibold text-theme-heading">
                          &#8377;{product.price_per_kg}/kg
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ── Right: badge + toggle ── */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">

                    {/* status badge */}
                    <span
                      className={`
                        inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black
                        uppercase tracking-[0.16em] transition-colors duration-300
                        ${isAvailable
                          ? "bg-[#2f7a43]/10 text-[#2f7a43]"
                          : "bg-[#e2b93b]/15 text-[#8a651a]"
                        }
                      `}
                    >
                      {isAvailable ? "In Stock" : "Out of Stock"}
                    </span>

                    {/* toggle button */}
                    <motion.button
                      onClick={() => handleToggleStock(dbProductId, isAvailable)}
                      disabled={isUpdating}
                      whileHover={{ scale: isUpdating ? 1 : 1.08 }}
                      whileTap={{ scale: isUpdating ? 1 : 0.92 }}
                      aria-label={isAvailable ? "Mark out of stock" : "Mark in stock"}
                      className={`
                        group relative inline-flex h-9 items-center justify-center gap-1.5
                        rounded-xl border px-3 transition-all duration-200
                        ${isUpdating
                          ? "cursor-not-allowed opacity-50"
                          : isAvailable
                            ? "border-[#bde2cd] bg-[#edf8f1] hover:border-[#2f7a43] hover:bg-[#2f7a43] hover:shadow-[0_4px_14px_rgba(47,122,67,0.28)]"
                            : "border-[#f0d8b8] bg-[#fef5e8] hover:border-[#e2b93b] hover:bg-[#e2b93b] hover:shadow-[0_4px_14px_rgba(226,185,59,0.28)]"
                        }
                      `}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#2f7a43]" />
                          <span className="hidden text-[11px] font-semibold sm:inline">Updating</span>
                        </>
                      ) : isAvailable ? (
                        <>
                          <ToggleRight className="h-4 w-4 text-[#2f7a43] transition-colors group-hover:text-white" />
                          <span className="hidden text-[11px] font-semibold text-[#2f7a43] transition-colors group-hover:text-white sm:inline">
                            Mark Out
                          </span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 text-[#a8845a] transition-colors group-hover:text-white" />
                          <span className="hidden text-[11px] font-semibold text-[#a8845a] transition-colors group-hover:text-white sm:inline">
                            Mark In
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
