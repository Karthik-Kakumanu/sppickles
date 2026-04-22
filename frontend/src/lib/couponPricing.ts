import type { AdminCoupon } from "@/lib/api";

type CouponCartLine = {
  key: string;
  productId: string;
  totalPrice: number;
  product: {
    category: string;
    subcategory?: "salt" | "asafoetida";
  };
};

type CouponLineBreakdown = {
  key: string;
  originalTotalPrice: number;
  discountAmount: number;
  adjustedTotalPrice: number;
  isEligible: boolean;
};

const getEligibleCategoryKey = (category: string, subcategory?: "salt" | "asafoetida") => {
  if (category !== "pickles") {
    return category;
  }

  if (subcategory === "salt") {
    return "salted-pickles";
  }

  if (subcategory === "asafoetida") {
    return "tempered-pickles";
  }

  return "pickles";
};

const isLineEligibleForCoupon = (coupon: AdminCoupon, line: CouponCartLine) => {
  if (coupon.appliesTo === "all") {
    return true;
  }

  if (coupon.appliesTo === "product") {
    return line.productId === coupon.targetProductId;
  }

  const eligibleCategoryKey = getEligibleCategoryKey(line.product.category, line.product.subcategory);
  return eligibleCategoryKey === coupon.targetCategory;
};

export const getEligibleSubtotalForCoupon = (coupon: AdminCoupon, cart: CouponCartLine[]) =>
  cart.reduce((sum, line) => (isLineEligibleForCoupon(coupon, line) ? sum + line.totalPrice : sum), 0);

export const getCouponDiscountAmount = (coupon: AdminCoupon, eligibleSubtotal: number) => {
  if (eligibleSubtotal <= 0) {
    return 0;
  }

  const minOrderAmount = coupon.minOrderAmount === null ? null : Number(coupon.minOrderAmount);

  if (minOrderAmount !== null && (!Number.isFinite(minOrderAmount) || eligibleSubtotal < minOrderAmount)) {
    return 0;
  }

  const discountAmount =
    coupon.discountType === "percentage"
      ? Math.round((eligibleSubtotal * Number(coupon.discountValue)) / 100)
      : Math.round(Number(coupon.discountValue));

  const maxDiscountAmount = coupon.maxDiscountAmount === null ? null : Number(coupon.maxDiscountAmount);
  const cappedDiscountAmount =
    maxDiscountAmount !== null && Number.isFinite(maxDiscountAmount)
      ? Math.min(discountAmount, Math.round(maxDiscountAmount))
      : discountAmount;

  return Math.max(0, Math.min(cappedDiscountAmount, eligibleSubtotal));
};

const allocateDiscountAcrossEligibleLines = (
  eligibleLines: Array<{ key: string; totalPrice: number }>,
  discountAmount: number,
) => {
  if (discountAmount <= 0 || eligibleLines.length === 0) {
    return new Map<string, number>();
  }

  const eligibleSubtotal = eligibleLines.reduce((sum, line) => sum + line.totalPrice, 0);

  if (eligibleSubtotal <= 0) {
    return new Map<string, number>();
  }

  const allocations = eligibleLines.map((line) => {
    const exactShare = (discountAmount * line.totalPrice) / eligibleSubtotal;
    const baseShare = Math.floor(exactShare);

    return {
      key: line.key,
      baseShare,
      remainder: exactShare - baseShare,
    };
  });

  let allocatedDiscount = allocations.reduce((sum, allocation) => sum + allocation.baseShare, 0);
  let remainingDiscount = discountAmount - allocatedDiscount;

  allocations
    .sort((left, right) => right.remainder - left.remainder)
    .forEach((allocation) => {
      if (remainingDiscount <= 0) {
        return;
      }

      allocation.baseShare += 1;
      remainingDiscount -= 1;
    });

  allocatedDiscount = allocations.reduce((sum, allocation) => sum + allocation.baseShare, 0);

  if (allocatedDiscount > discountAmount) {
    let overflow = allocatedDiscount - discountAmount;

    for (let index = allocations.length - 1; index >= 0 && overflow > 0; index -= 1) {
      if (allocations[index].baseShare > 0) {
        allocations[index].baseShare -= 1;
        overflow -= 1;
      }
    }
  }

  return new Map(allocations.map((allocation) => [allocation.key, allocation.baseShare]));
};

export const getCouponBreakdown = (coupon: AdminCoupon, cart: CouponCartLine[]) => {
  const eligibleSubtotal = getEligibleSubtotalForCoupon(coupon, cart);
  const discountAmount = getCouponDiscountAmount(coupon, eligibleSubtotal);
  const eligibleLines = cart.filter((line) => isLineEligibleForCoupon(coupon, line));
  const discountAllocation = allocateDiscountAcrossEligibleLines(eligibleLines, discountAmount);

  const lineBreakdown: CouponLineBreakdown[] = cart.map((line) => {
    const lineDiscount = discountAllocation.get(line.key) ?? 0;

    return {
      key: line.key,
      originalTotalPrice: line.totalPrice,
      discountAmount: lineDiscount,
      adjustedTotalPrice: Math.max(0, line.totalPrice - lineDiscount),
      isEligible: lineDiscount > 0,
    };
  });

  return {
    eligibleSubtotal,
    discountAmount,
    lineBreakdown,
  };
};
