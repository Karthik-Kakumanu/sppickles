import { type ProductRecord, type WeightOption, weightOptions } from "@/data/site";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const getWeightMultiplier = (weight: WeightOption) =>
  weightOptions.find((option) => option.label === weight)?.multiplier ?? 1;

export const calculateWeightPrice = (pricePerKg: number, weight: WeightOption) =>
  Math.round(pricePerKg * getWeightMultiplier(weight));

export const calculateCartLinePrice = (
  product: ProductRecord,
  weight: WeightOption,
  quantity: number,
) => calculateWeightPrice(product.price_per_kg, weight) * quantity;
