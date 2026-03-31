import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/PrimaryButton";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import SkeletonCard from "@/components/SkeletonCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useStore } from "@/components/StoreProvider";
import { categoryContent, type ProductCategory, type StoreFilter } from "@/data/site";
import { useToast } from "@/hooks/use-toast";

type ProductsPageProps = {
  initialFilter?: StoreFilter;
};

const ProductsPage = ({ initialFilter = "all" }: ProductsPageProps) => {
  const { products, isProductsLoading, productsError } = useStore();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<StoreFilter>(initialFilter);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedCategory(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    if (!productsError) {
      return;
    }

    toast({
      title: "Stock service unavailable",
      description: productsError.message,
      variant: "destructive",
    });
  }, [productsError, toast]);

  const productCounts = useMemo(
    () =>
      products.reduce(
        (counts, product) => {
          counts.all += 1;
          counts[product.category] += 1;
          return counts;
        },
        { all: 0, pickles: 0, powders: 0, snacks: 0 } as Record<StoreFilter, number>,
      ),
    [products],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        selectedCategory === "all" ? true : product.category === selectedCategory,
      ),
    [products, selectedCategory],
  );

  const tabs: Array<{ key: StoreFilter; label: string; count: number }> = [
    { key: "all", label: "All Products", count: productCounts.all },
    ...categoryContent.map((category) => ({
      key: category.key as ProductCategory,
      label: category.label,
      count: productCounts[category.key],
    })),
  ];

  const activeCategoryLabel =
    tabs.find((tab) => tab.key === selectedCategory)?.label ?? "All Products";

  const handleSelectCategory = (category: StoreFilter) => {
    setSelectedCategory(category);

    window.requestAnimationFrame(() => {
      const gridNode = gridRef.current;

      if (!gridNode) {
        return;
      }

      const targetTop = gridNode.getBoundingClientRect().top + window.scrollY - 132;

      if (window.scrollY < targetTop - 24) {
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    });
  };

  return (
    <main className="bg-[#fffaf4]">
      <Seo
        title="SP Traditional Pickles | Products"
        description="Browse static products with live stock status from SP Traditional Pickles."
      />

      <SectionWrapper
        disableAnimation
        className="relative overflow-hidden border-b border-[#eadfd5] bg-[radial-gradient(circle_at_top_right,rgba(139,30,30,0.08),transparent_18%),radial-gradient(circle_at_bottom_left,rgba(49,91,69,0.05),transparent_24%),linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)]"
        contentClassName="space-y-10"
      >
        <div className="rounded-[2.4rem] border border-[#eadfd5] bg-white/85 px-6 py-10 shadow-md backdrop-blur-sm md:px-10 md:py-12 lg:px-12">
          <SectionTitle
            eyebrow="Products"
            title={activeCategoryLabel}
            subtitle="Static product data, live stock status, and a clean order flow built for mobile and desktop."
            align="center"
            className="mx-auto max-w-4xl"
            titleClassName="text-4xl md:text-5xl lg:text-[3.5rem]"
            subtitleClassName="mx-auto max-w-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectCategory(tab.key)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
                  selectedCategory === tab.key
                    ? "bg-[#8b1e1e] text-white shadow-sm"
                    : "bg-white text-[#4f3829] ring-1 ring-[#eadfd5] hover:bg-[#fff3ef]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    selectedCategory === tab.key
                      ? "bg-white/18 text-white"
                      : "bg-[#fff4f1] text-[#8b1e1e]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {isProductsLoading ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <div ref={gridRef} className="space-y-6">
            <div className="sticky top-24 z-10 flex flex-col gap-3 rounded-[1.6rem] border border-[#eadfd5] bg-white/88 px-5 py-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                  Showing {visibleProducts.length} products
                </p>
                <p className="mt-2 text-sm leading-7 text-[#685448]">
                  Out-of-stock products remain visible so customers can still browse the full range.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#eadfd5] bg-[#fff8f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b1e1e]">
                Live stock from backend
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isAvailable={product.isAvailable}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="rounded-[2.4rem] border border-[#eadfd5] bg-white px-8 py-14 text-center shadow-md"
          >
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8b1e1e]">
                No products found
              </p>
              <h2 className="mt-5 font-heading text-4xl font-semibold text-[#241612] md:text-5xl">
                Nothing is available in this filter right now
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#685448]">
                Switch back to the full catalog or contact SP Traditional Pickles directly on WhatsApp.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSelectCategory("all")}
                  className="inline-flex items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-3.5 text-sm font-semibold text-[#241612] shadow-sm transition duration-300 hover:border-[#8b1e1e]/20 hover:bg-[#fff3ef]"
                >
                  View All Products
                </button>
                <PrimaryButton to="/" className="w-full sm:w-auto">
                  Back to Home
                </PrimaryButton>
                <PrimaryButton to="/contact" variant="secondary" className="w-full sm:w-auto">
                  Contact Us
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    </main>
  );
};

export default ProductsPage;
