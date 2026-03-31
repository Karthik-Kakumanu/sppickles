import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { type ProductRecord, type WeightOption } from "@/data/site";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

const STORAGE_KEY = "sp-pickles-wishlist-v1";

export type WishlistItem = {
  productId: string;
  product: ProductRecord;
  addedAt: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  count: number;
  addToWishlist: (product: ProductRecord) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: ProductRecord) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

type WishlistProviderProps = {
  children: ReactNode;
  products: ProductRecord[];
};

export const WishlistProvider = ({ children, products }: WishlistProviderProps) => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    const stored = readStorage(STORAGE_KEY);
    return new Set(typeof stored === "string" ? JSON.parse(stored) : []);
  });

  const items = useMemo(() => {
    return Array.from(wishlistIds)
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is ProductRecord => p !== undefined)
      .map((product) => ({
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
      }));
  }, [wishlistIds, products]);

  const addToWishlist = (product: ProductRecord) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      writeStorage(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      writeStorage(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const toggleWishlist = (product: ProductRecord): boolean => {
    const isIn = wishlistIds.has(product.id);
    if (isIn) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.has(productId);
  };

  const clearWishlist = () => {
    setWishlistIds(new Set());
    removeStorage(STORAGE_KEY);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
