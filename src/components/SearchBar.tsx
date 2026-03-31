import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { type ProductRecord } from "@/data/site";
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
  placeholder = "Search pickles, powders, recipes...",
  maxResults = 8,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return products
      .filter((product) => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchableText.includes(lowerQuery);
      })
      .slice(0, maxResults);
  }, [query, products, maxResults]);

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
        <div className="relative flex items-center rounded-full border border-[#efe2cf] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
          <Search className="absolute left-4 h-5 w-5 text-[#9b6a27] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent pl-12 pr-10 py-3 text-sm font-body text-[#241612] placeholder-[#9b6a27]/50 outline-none"
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
              className="absolute right-4 p-1 text-[#9b6a27] hover:text-[#8B0000] transition-colors"
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
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#efe2cf] shadow-lg z-50 overflow-hidden"
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
                    className="w-full px-4 py-3 text-left hover:bg-[#fff7ec] transition-colors border-b border-[#efe2cf] last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#241612] text-sm truncate group-hover:text-[#8B0000]">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#9b6a27]">{product.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#8B0000] flex-shrink-0">
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
                className="px-4 py-8 text-center text-[#9b6a27]"
              >
                <p className="text-sm font-medium">No pickles found</p>
                <p className="text-xs text-[#6b5643] mt-1">Try different keywords</p>
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
