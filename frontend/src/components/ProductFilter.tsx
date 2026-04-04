import { motion } from "framer-motion";
import { useState } from "react";
import { type ProductCategory, type ProductRecord } from "@/data/site";

type FilterState = {
  category: ProductCategory | null;
  subcategory: "salt" | "asafoetida" | null;
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
  { key: "powders", label: "Podi" },
  { key: "fryums", label: "Fryums" },
];

const pickleSubcategories = [
  { key: "salt", label: "Salt Pickles", teluguLabel: "ఉప్పు పచ్చళ్ళు" },
  { key: "asafoetida", label: "Asafoetida Pickles", teluguLabel: "ఇంగువ తాలింపు పచ్చళ్ళు" },
] as const;

const priceRanges = [
  { label: "Rs.0 - Rs.500", min: 0, max: 500 },
  { label: "Rs.500 - Rs.750", min: 500, max: 750 },
  { label: "Rs.750 - Rs.1000", min: 750, max: 1000 },
  { label: "Rs.1000+", min: 1000, max: Infinity },
];

const checkboxClassName = "h-4 w-4 rounded border-[#3D7A52] bg-[#1A3A2A] accent-[#F5C518]";
const radioClassName = "h-4 w-4 border-[#3D7A52] bg-[#1A3A2A] accent-[#F5C518]";

const ProductFilter = ({ products, onFilter, onFilterChange }: ProductFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    subcategory: null,
    priceRange: null,
    availability: "all",
  });

  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);

    let filtered = products;

    if (newFilters.category) {
      filtered = filtered.filter((product) => product.category === newFilters.category);
    }

    if (newFilters.subcategory) {
      filtered = filtered.filter((product) => product.subcategory === newFilters.subcategory);
    }

    if (newFilters.priceRange) {
      const [min, max] = newFilters.priceRange;
      filtered = filtered.filter(
        (product) => product.price_per_kg >= min && product.price_per_kg <= max,
      );
    }

    if (newFilters.availability === "available") {
      filtered = filtered.filter((product) => product.isAvailable);
    } else if (newFilters.availability === "best-sellers") {
      filtered = filtered.filter((product) => product.isBestSeller);
    }

    onFilter(filtered);
  };

  const resetFilters = () => {
    applyFilters({
      category: null,
      subcategory: null,
      priceRange: null,
      availability: "all",
    });
  };

  const hasActiveFilters =
    filters.category || filters.subcategory || filters.priceRange || filters.availability !== "all";

  const fieldLabelClassName = "mb-3 block text-sm font-semibold text-theme-contrast";
  const optionTextClassName =
    "text-sm text-theme-body transition-colors group-hover:text-theme-contrast";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <div className="theme-card rounded-2xl border border-[#3D7A52] p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-theme-heading">Filter</h3>
          {hasActiveFilters ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="text-xs font-semibold text-theme-body transition-colors hover:text-theme-heading"
            >
              Reset Filters
            </motion.button>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <label className={fieldLabelClassName}>Category</label>
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.label
                  key={category.key}
                  whileHover={{ x: 4 }}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={filters.category === category.key}
                    onChange={() =>
                      applyFilters({
                        ...filters,
                        category: filters.category === category.key ? null : category.key,
                        subcategory: null,
                      })
                    }
                    className={checkboxClassName}
                  />
                  <span className={optionTextClassName}>{category.label}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {filters.category === "pickles" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t border-[#3D7A52] pt-4"
            >
              <label className={fieldLabelClassName}>Pickle Type</label>
              <div className="space-y-2">
                {pickleSubcategories.map((subcategory) => (
                  <motion.label
                    key={subcategory.key}
                    whileHover={{ x: 4 }}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={filters.subcategory === subcategory.key}
                      onChange={() =>
                        applyFilters({
                          ...filters,
                          subcategory:
                            filters.subcategory === subcategory.key ? null : subcategory.key,
                        })
                      }
                      className={checkboxClassName}
                    />
                    <span className={optionTextClassName}>
                      {subcategory.label}
                      <span className="ml-2 text-xs text-theme-body-soft">
                        ({subcategory.teluguLabel})
                      </span>
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          ) : null}

          <div>
            <label className={fieldLabelClassName}>Price Range (per kg)</label>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <motion.label
                  key={`${range.min}-${range.max}`}
                  whileHover={{ x: 4 }}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.priceRange?.[0] === range.min &&
                      filters.priceRange?.[1] === range.max
                    }
                    onChange={() =>
                      applyFilters({
                        ...filters,
                        priceRange:
                          filters.priceRange?.[0] === range.min ? null : [range.min, range.max],
                      })
                    }
                    className={checkboxClassName}
                  />
                  <span className={optionTextClassName}>{range.label}</span>
                </motion.label>
              ))}
            </div>
          </div>

          <div>
            <label className={fieldLabelClassName}>Availability</label>
            <div className="space-y-2">
              {["all", "available", "best-sellers"].map((availability) => (
                <motion.label
                  key={availability}
                  whileHover={{ x: 4 }}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === availability}
                    onChange={() =>
                      applyFilters({
                        ...filters,
                        availability: availability as FilterState["availability"],
                      })
                    }
                    className={radioClassName}
                  />
                  <span className={`${optionTextClassName} capitalize`}>
                    {availability === "all"
                      ? "All Products"
                      : availability === "available"
                        ? "In Stock"
                        : "Best Sellers"}
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
