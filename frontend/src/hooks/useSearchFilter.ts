import { useMemo } from "react";
import { type ProductRecord, weightOptions } from "@/data/site";
import { type FilterOptions } from "@/components/FilterPanel";
import { translateDynamicText } from "@/lib/translation";

const CATEGORY_SEARCH_TERMS: Record<ProductRecord["category"], string[]> = {
  pickles: ["pickle", "pickles", "pachadi", "orugu"],
  powders: ["powder", "powders", "podi", "podulu", "karam"],
  fryums: ["fryum", "fryums", "appadalu", "vadiyalu"],
};

const SUBCATEGORY_SEARCH_TERMS: Record<NonNullable<ProductRecord["subcategory"]>, string[]> = {
  salt: ["salt", "salted", "uppu"],
  asafoetida: ["asafoetida", "hing", "inguva", "tempered"],
};

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/250\s*(?:grams?|gm|g|గ్రా)/gu, "250g")
    .replace(/500\s*(?:grams?|gm|g|గ్రా)/gu, "500g")
    .replace(/1\s*(?:kg|kgs|kilogram|kilograms|kilo|కేజీ|కిలో)/gu, "1kg")
    .replace(/\bhalf(?:\s*(?:kg|kilo|kilogram))?\b/gu, "500g")
    .replace(/\bquarter(?:\s*(?:kg|kilo|kilogram))?\b/gu, "250g")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildSearchIndex = (product: ProductRecord) => {
  const weightTerms = weightOptions.flatMap(({ label }) => {
    const spacedLabel = label.replace(/(\d)([a-z]+)/i, "$1 $2");
    return [label, spacedLabel];
  });

  const keywords = [
    product.name,
    product.name_te ?? "",
    product.nameTeluguguTelugu ?? "",
    translateDynamicText(product.name, "te"),
    product.description,
    product.category,
    ...CATEGORY_SEARCH_TERMS[product.category],
    product.subcategory ?? "",
    ...(product.subcategory ? SUBCATEGORY_SEARCH_TERMS[product.subcategory] : []),
    ...weightTerms,
  ];

  return normalizeSearchText(keywords.join(" "));
};

export function useSearchFilter(
  products: ProductRecord[],
  searchQuery: string,
  filters: FilterOptions
) {
  return useMemo(() => {
    let filtered = [...products];

    // 1. Search filter - support names, Telugu labels, category aliases, and size keywords
    const normalizedQuery = normalizeSearchText(searchQuery);
    if (normalizedQuery) {
      const queryTerms = normalizedQuery.split(" ").filter(Boolean);
      filtered = filtered.filter((product) => {
        const searchIndex = buildSearchIndex(product);
        return queryTerms.every((term) => searchIndex.includes(term));
      });
    }

    // 2. Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // 3. Price filter
    filtered = filtered.filter((product) => {
      // Assuming price_per_kg is the base price, calculate average 250g price
      const avgPrice = (product.price_per_kg * 250) / 1000;
      return (
        avgPrice >= filters.priceRange[0] && avgPrice <= filters.priceRange[1]
      );
    });

    // 4. Sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = (a.price_per_kg * 250) / 1000;
          const priceB = (b.price_per_kg * 250) / 1000;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = (a.price_per_kg * 250) / 1000;
          const priceB = (b.price_per_kg * 250) / 1000;
          return priceB - priceA;
        });
        break;
      case "popularity":
        // Sort by isBestSeller first, then by id
        filtered.sort((a, b) => {
          if (a.isBestSeller === b.isBestSeller) {
            return 0;
          }
          return a.isBestSeller ? -1 : 1;
        });
        break;
      case "newest":
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, filters]);
}

// Helper to get product count by category
export function getCategoryCount(
  products: ProductRecord[],
  category: string
): number {
  return products.filter((p) => p.category === category).length;
}

// Helper to check if filters are active
export function hasActiveFilters(filters: FilterOptions): boolean {
  return (
    filters.categories.length > 0 ||
    filters.priceRange[1] !== Infinity ||
    filters.sortBy !== "newest"
  );
}
