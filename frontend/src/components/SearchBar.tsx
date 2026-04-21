import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { type ProductRecord } from "@/data/site";
import { getDynamicProductName } from "@/lib/translation";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  products: ProductRecord[];
  onSelect: (product: ProductRecord) => void;
  onClose?: () => void;
  placeholder?: string;
  maxResults?: number;
};

const SearchBar = ({
  products,
  onSelect,
  onClose,
  placeholder = "Search pickles, podi, recipes...",
  maxResults = 8,
}: SearchBarProps) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return products
      .filter((product) => {
        const searchableText = `${product.name} ${getDynamicProductName(product, language)} ${product.description} ${product.category}`.toLowerCase();
        return searchableText.includes(lowerQuery);
      })
      .slice(0, maxResults);
  }, [language, maxResults, products, query]);

  const handleSelect = useCallback(
    (product: ProductRecord) => {
      onSelect(product);
      setQuery("");
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.2 },
    }),
  };

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="relative flex items-center rounded-full border border-[#3D7A52] bg-[#2E5C3E] shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-theme-heading" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 pl-12 pr-10 text-sm font-body text-theme-contrast placeholder:text-theme-body-soft outline-none"
          />
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuery("")}
              className="absolute right-4 p-1 text-theme-body transition-colors hover:text-theme-heading"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || query.trim()) && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#3D7A52] bg-[#2E5C3E] shadow-lg"
          >
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((product, idx) => (
                  <motion.button
                    key={product.id}
                    custom={idx}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelect(product)}
                    className="group w-full border-b border-[#3D7A52] px-4 py-3 text-left transition-colors hover:bg-[#214634] last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={getDynamicProductName(product, language)}
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-theme-contrast group-hover:text-theme-heading">
                          {getDynamicProductName(product, language)}
                        </p>
                        <p className="text-xs text-theme-body">{product.category}</p>
                      </div>
                      <span className="flex-shrink-0 text-sm font-semibold text-theme-heading">
                        ₹{product.price_per_kg.toLocaleString()}/kg
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="px-4 py-8 text-center text-theme-body"
              >
                <p className="text-sm font-medium">No pickles found</p>
                <p className="mt-1 text-xs text-theme-body-soft">Try different keywords</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (query || results.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
};

export default SearchBar;
