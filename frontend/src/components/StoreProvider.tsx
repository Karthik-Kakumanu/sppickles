import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  getAdminSession,
  getProductAvailability,
  useProductsQuery,
  useStockQuery,
} from "@/lib/api";
import {
  type CartLine,
  defaultProducts,
  type ProductRecord,
  type WeightOption,
} from "@/data/site";
import { calculateWeightPrice } from "@/lib/pricing";
import { readStorage, writeStorage } from "@/lib/storage";
import { resolvePickleImage } from "@/lib/pickleImages";

const STORAGE_KEYS = {
  cart: "sp-traditional-pickles-cart-v1",
  productsUpdatedAt: "sp-products-updated-at",
};

type ResolvedCartLine = CartLine & {
  key: string;
  totalPrice: number;
  product: ProductRecord;
};

type StoreContextValue = {
  products: ProductRecord[];
  availableProducts: ProductRecord[];
  bestSellers: ProductRecord[];
  isProductsLoading: boolean;
  productsError: Error | null;
  cart: ResolvedCartLine[];
  cartCount: number;
  subtotal: number;
  isAdminReady: boolean;
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  addToCart: (product: ProductRecord, weight: WeightOption, quantity: number) => void;
  updateCartLineQuantity: (key: string, quantity: number) => void;
  updateCartLineWeight: (key: string, newWeight: WeightOption) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const buildCartKey = (productId: string, weight: WeightOption) => `${productId}::${weight}`;

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cartLines, setCartLines] = useState<CartLine[]>(() =>
    readStorage<CartLine[]>(STORAGE_KEYS.cart, []),
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdminReady, setIsAdminReady] = useState(false);
  const {
    data: backendProducts = [],
    isLoading: isProductsLoading,
    error: productsQueryError,
    refetch: refetchProducts,
  } = useProductsQuery();
  const { data: stockMap = new Map(), isLoading, error } = useStockQuery();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cartLines);
  }, [cartLines]);

  useEffect(() => {
    let isMounted = true;

    const loadAdminSession = async () => {
      try {
        const session = await getAdminSession();

        if (isMounted) {
          setAdminEmail(session?.admin.email ?? null);
        }
      } finally {
        if (isMounted) {
          setIsAdminReady(true);
        }
      }
    };

    void loadAdminSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!adminEmail) {
      return;
    }

    let isMounted = true;

    const verifyAdminSession = async () => {
      const session = await getAdminSession();

      if (!isMounted) {
        return;
      }

      setAdminEmail(session?.admin.email ?? null);
    };

    const handleFocus = () => {
      void verifyAdminSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void verifyAdminSession();
      }
    };

    const intervalId = window.setInterval(() => {
      void verifyAdminSession();
    }, 5_000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [adminEmail]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.productsUpdatedAt) {
        void refetchProducts();
      }
    };

    const productChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("sp-products") : null;
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "products-updated") {
        void refetchProducts();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", refetchProducts);
    document.addEventListener("visibilitychange", refetchProducts);

    productChannel?.addEventListener("message", handleBroadcast);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", refetchProducts);
      document.removeEventListener("visibilitychange", refetchProducts);
      productChannel?.removeEventListener("message", handleBroadcast);
      productChannel?.close();
    };
  }, [refetchProducts]);

  const productsError = (productsQueryError instanceof Error ? productsQueryError : null) ??
    (error instanceof Error ? error : null);

  const productsSource = backendProducts.length > 0 ? backendProducts : defaultProducts;
  const defaultImageLookup = useMemo(
    () => new Map(defaultProducts.map((product) => [product.name, product.image] as const)),
    [],
  );

  const resolveProductImage = (product: ProductRecord) => {
    const explicitImage = String(product.image ?? "").trim();

    if (explicitImage) {
      return explicitImage;
    }

    const catalogImage = defaultImageLookup.get(product.name)?.trim();

    if (catalogImage) {
      return catalogImage;
    }

    if (product.category === "pickles") {
      return resolvePickleImage(product.name);
    }

    return explicitImage;
  };

  const products = useMemo(
    () =>
      productsSource.map((product) => ({
        ...product,
        image: resolveProductImage(product),
        isAvailable: getProductAvailability(stockMap, product),
      })),
    [defaultImageLookup, productsSource, stockMap],
  );

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const availableProducts = useMemo(
    () => products.filter((product) => product.isAvailable),
    [products],
  );

  const bestSellers = useMemo(
    () => products.filter((product) => product.isBestSeller).slice(0, 6),
    [products],
  );

  const cart = useMemo<ResolvedCartLine[]>(
    () =>
      cartLines
        .map((line) => {
          const product = productMap.get(line.productId);

          if (!product) {
            return null;
          }

          const price = calculateWeightPrice(product.price_per_kg, line.weight);

          return {
            ...line,
            name: product.name,
            image: product.image,
            category: product.category,
            price,
            key: buildCartKey(line.productId, line.weight),
            totalPrice: price * line.quantity,
            product,
          };
        })
        .filter(Boolean) as ResolvedCartLine[],
    [cartLines, productMap],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.totalPrice, 0),
    [cart],
  );

  const addToCart = (product: ProductRecord, weight: WeightOption, quantity: number) => {
    if (!product.isAvailable || quantity <= 0) {
      return;
    }

    const price = calculateWeightPrice(product.price_per_kg, weight);

    setCartLines((current) => {
      const existing = current.find(
        (line) => line.productId === product.id && line.weight === weight,
      );

      if (existing) {
        return current.map((line) =>
          line.productId === product.id && line.weight === weight
            ? { ...line, quantity: line.quantity + quantity, price }
            : line,
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price,
          weight,
          quantity,
        },
      ];
    });
  };

  const updateCartLineQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      setCartLines((current) =>
        current.filter((line) => buildCartKey(line.productId, line.weight) !== key),
      );
      return;
    }

    setCartLines((current) =>
      current.map((line) =>
        buildCartKey(line.productId, line.weight) === key ? { ...line, quantity } : line,
      ),
    );
  };

  const updateCartLineWeight = (key: string, newWeight: WeightOption) => {
    setCartLines((current) => {
      const lineIndex = current.findIndex((line) => buildCartKey(line.productId, line.weight) === key);
      if (lineIndex === -1) return current;
      const line = current[lineIndex];
      // If already same weight, do nothing
      if (line.weight === newWeight) return current;
      // Check if another line with same product and newWeight exists
      const mergeIndex = current.findIndex((l, i) =>
        i !== lineIndex && l.productId === line.productId && l.weight === newWeight
      );
      if (mergeIndex !== -1) {
        // Merge quantities
        const merged = [
          ...current.slice(0, mergeIndex),
          {
            ...current[mergeIndex],
            quantity: current[mergeIndex].quantity + line.quantity,
          },
          ...current.slice(mergeIndex + 1, lineIndex),
          ...current.slice(lineIndex + 1),
        ];
        return merged;
      }
      // Otherwise, just update weight
      return current.map((l, i) =>
        i === lineIndex ? { ...l, weight: newWeight } : l
      );
    });
  };

  const removeFromCart = (key: string) => {
    setCartLines((current) =>
      current.filter((line) => buildCartKey(line.productId, line.weight) !== key),
    );
  };

  const clearCart = () => setCartLines([]);

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await apiAdminLogin(email.trim().toLowerCase(), password);
      setAdminEmail(response.admin?.email ?? email.trim().toLowerCase());
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to login.",
      };
    }
  };

  const logoutAdmin = async () => {
    try {
      await apiAdminLogout();
    } finally {
      setAdminEmail(null);
    }
  };

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      availableProducts,
      bestSellers,
      isProductsLoading: isProductsLoading || isLoading,
      productsError,
      cart,
      cartCount,
      subtotal,
      isAdminReady,
      isAdminAuthenticated: Boolean(adminEmail),
      adminEmail,
      addToCart,
      updateCartLineQuantity,
      updateCartLineWeight,
      removeFromCart,
      clearCart,
      loginAdmin,
      logoutAdmin,
    }),
    [
      products,
      availableProducts,
      bestSellers,
      isProductsLoading,
      isLoading,
      productsError,
      cart,
      cartCount,
      subtotal,
      isAdminReady,
      adminEmail,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }

  return context;
};
