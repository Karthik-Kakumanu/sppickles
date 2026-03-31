import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  getStoredAdminEmail,
  isAuthenticated,
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

const STORAGE_KEYS = {
  cart: "sp-traditional-pickles-cart-v1",
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
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  loginAdmin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logoutAdmin: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const buildCartKey = (productId: string, weight: WeightOption) => `${productId}::${weight}`;

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cartLines, setCartLines] = useState<CartLine[]>(() =>
    readStorage<CartLine[]>(STORAGE_KEYS.cart, []),
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdminReady, setIsAdminReady] = useState(false);
  const { data: stockMap = new Map(), isLoading, error } = useStockQuery();

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cartLines);
  }, [cartLines]);

  useEffect(() => {
    setAdminEmail(isAuthenticated() ? getStoredAdminEmail() : null);
    setIsAdminReady(true);
  }, []);

  const productsError = error instanceof Error ? error : null;

  const products = useMemo(
    () =>
      defaultProducts.map((product) => ({
        ...product,
        isAvailable: stockMap.has(product.id) ? stockMap.get(product.id) : product.isAvailable ?? true,
      })),
    [stockMap],
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

  const logoutAdmin = () => {
    apiAdminLogout();
    setAdminEmail(null);
  };

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      availableProducts,
      bestSellers,
      isProductsLoading: isLoading,
      productsError,
      cart,
      cartCount,
      subtotal,
      isAdminReady,
      isAdminAuthenticated: Boolean(adminEmail),
      adminEmail,
      addToCart,
      updateCartLineQuantity,
      removeFromCart,
      clearCart,
      loginAdmin,
      logoutAdmin,
    }),
    [
      products,
      availableProducts,
      bestSellers,
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
