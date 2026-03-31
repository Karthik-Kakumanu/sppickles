import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import { useToast } from "@/hooks/use-toast";
import { brand, type ProductRecord, type WeightOption, weightOptions } from "@/data/site";
import { calculateWeightPrice, formatCurrency } from "@/lib/pricing";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";

type ProductCardProps = {
  product: ProductRecord;
  index?: number;
  isAvailable?: boolean;
};

const ProductCard = ({ product, index = 0, isAvailable = true }: ProductCardProps) => {
  const { toast } = useToast();
  const { addToCart } = useStore();
  const { t } = useLanguage();
  const [weight, setWeight] = useState<WeightOption>("250g");
  const [quantity, setQuantity] = useState(1);

  const livePrice = useMemo(
    () => calculateWeightPrice(product.price_per_kg, weight),
    [product.price_per_kg, weight],
  );

  const teluguName = product.name_te ?? product.nameTeluguguTelugu;

  const handleAddToCart = () => {
    if (!isAvailable) {
      toast({
        title: t('productCard.outOfStock') || 'Out of Stock',
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    addToCart(product, weight, quantity);
    toast({
      title: t('productCard.addedToCartTitle'),
      description: t('productCard.addedToCartDescription', { name: product.name, weight, quantity }),
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.24) }}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-md transition-all duration-300 hover:shadow-lg ${
        !isAvailable ? "opacity-70" : ""
      }`}
    >
      <div className="relative overflow-hidden bg-[#f6eee5]">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="aspect-[4/4.2] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,22,18,0.02)_0%,rgba(36,22,18,0.2)_100%)]" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {!isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#b42318] px-3 py-1 text-xs font-semibold text-white shadow-md">
              <AlertCircle className="h-3.5 w-3.5" />
              {t('productCard.outOfStock') || 'Out of Stock'}
            </span>
          ) : null}
          <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#5f4a39] shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-balance font-heading text-2xl font-bold leading-tight text-[#241612]">
                {product.name}
              </h3>
              {teluguName ? (
                <p className="mt-2 text-sm font-medium text-[#8b1e1e]">{teluguName}</p>
              ) : null}
            </div>
            {product.isBestSeller ? (
              <span className="whitespace-nowrap rounded-full border border-[#f0d9d9] bg-[#fff5f3] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8b1e1e]">
                {t('featured.bestSeller')}
              </span>
            ) : null}
          </div>

          <p className="text-sm leading-7 text-[#685448]">{product.description}</p>
        </div>

        <div className="grid gap-6 rounded-2xl border border-[#eee3d9] bg-[#fffdfa] p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
              Weight
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {weightOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setWeight(option.label)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                    weight === option.label
                      ? "border-[#8b1e1e] bg-[#8b1e1e] text-white shadow-sm"
                      : "border-[#eadfd5] bg-[#fffaf6] text-[#5f4a39] hover:border-[#8b1e1e]/20 hover:bg-[#fff2ef]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                Quantity
              </p>
              <div className="mt-3 inline-flex items-center rounded-full border border-[#eadfd5] bg-[#fffaf6] shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="px-3 py-2 text-[#685448] transition hover:text-[#8b1e1e]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-semibold text-[#241612]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="px-3 py-2 text-[#685448] transition hover:text-[#8b1e1e]"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                Price
              </p>
              <p className="mt-3 font-heading text-4xl font-bold leading-none tracking-[-0.04em] text-[#8b1e1e]">
                {formatCurrency(livePrice * quantity)}
              </p>
              <p className="mt-2 text-sm text-[#685448]">
                {formatCurrency(product.price_per_kg)} / kg
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-full ${!isAvailable ? "border-[#d8d0ca] bg-[#d8d0ca] text-[#7b7168]" : ""}`}
            icon={<ShoppingCart className="h-4 w-4" />}
          >
            {isAvailable ? "Add to Cart" : "Out of Stock"}
          </PrimaryButton>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
