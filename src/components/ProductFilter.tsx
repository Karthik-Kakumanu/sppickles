import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type ProductCategory, type ProductRecord } from "@/data/site";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FilterState = {
  category: ProductCategory | null;
  priceRange: [number, number] | null;
  availability: "all" | "available" | "best-sellers";
};

type ProductFilterProps = {
  products: ProductRecord[];
  onFilter: (filtered: ProductRecord[]) => void;
  onFilterChange?: (filters: FilterState) => void;
};

const categories: Array<{ key: ProductCategory; label: string }> = [
  { key: "pickles", label: "Pickles" },
  { key: "powders", label: "Powders" },
  { key: "snacks", label: "Snacks" },
];

const priceRanges = [
  { label: "₹0 - ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹750", min: 500, max: 750 },
  { label: "₹750 - ₹1000", min: 750, max: 1000 },
  { label: "₹1000+", min: 1000, max: Infinity },
];

const ProductFilter = ({ products, onFilter, onFilterChange }: ProductFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceRange: null,
    availability: "all",
  });

  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);

    let filtered = products;

    if (newFilters.category) {
      filtered = filtered.filter((p) => p.category === newFilters.category);
    }

    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange;
      filtered = filtered.filter((p) => p.price_per_kg >= min && p.price_per_kg <= max);
    }

    if (newFilters.availability === "available") {
      filtered = filtered.filter((p) => p.isAvailable);
    } else if (newFilters.availability === "best-sellers") {
      filtered = filtered.filter((p) => p.isBestSeller);
    }

    onFilter(filtered);
  };

  const handleCategoryChange = (category: ProductCategory | null) => {
    applyFilters({
      ...filters,
      category,
    });
  };

  const handlePriceChange = (priceRange: [number, number] | null) => {
    applyFilters({
      ...filters,
      priceRange,
    });
  };

  const handleAvailabilityChange = (availability: FilterState["availability"]) => {
    applyFilters({
      ...filters,
      availability,
    });
  };

  const resetFilters = () => {
    applyFilters({
      category: null,
      priceRange: null,
      availability: "all",
    });
  };

  const hasActiveFilters =
    filters.category || filters.priceRange || filters.availability !== "all";

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="rounded-2xl border border-[#efe2cf] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-[#241612]">Filter</h3>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="text-xs font-semibold text-[#8B0000] hover:text-[#720000] transition-colors"
            >
              Reset Filters
            </motion.button>
          )}
        </div>

        <div className="space-y-5">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#241612] mb-3">
              Category
            </label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <motion.label
                  key={cat.key}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.category === cat.key}
                    onChange={() =>
                      handleCategoryChange(filters.category === cat.key ? null : cat.key)
                    }
                    className="h-4 w-4 rounded border-[#efe2cf] text-[#8B0000] cursor-pointer accent-[#8B0000]"
                  />
                  <span className="text-sm text-[#5f4a39] group-hover:text-[#241612] transition-colors">
                    {cat.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#241612] mb-3">
              Price Range (per kg)
            </label>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <motion.label
                  key={`${range.min}-${range.max}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.priceRange?.[0] === range.min &&
                      filters.priceRange?.[1] === range.max
                    }
                    onChange={() =>
                      handlePriceChange(
                        filters.priceRange?.[0] === range.min ? null : [range.min, range.max]
                      )
                    }
                    className="h-4 w-4 rounded border-[#efe2cf] text-[#8B0000] cursor-pointer accent-[#8B0000]"
                  />
                  <span className="text-sm text-[#5f4a39] group-hover:text-[#241612] transition-colors">
                    {range.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-semibold text-[#241612] mb-3">
              Availability
            </label>
            <div className="space-y-2">
              {["all" as const, "available" as const, "best-sellers" as const].map((avail) => (
                <motion.label
                  key={avail}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === avail}
                    onChange={() => handleAvailabilityChange(avail)}
                    className="h-4 w-4 border-[#efe2cf] text-[#8B0000] cursor-pointer accent-[#8B0000]"
                  />
                  <span className="text-sm text-[#5f4a39] group-hover:text-[#241612] transition-colors capitalize">
                    {avail === "all" ? "All Products" : avail === "available" ? "In Stock" : "Best Sellers"}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFilter;
