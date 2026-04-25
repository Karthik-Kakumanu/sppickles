import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import {
  createRazorpayOrder,
  getCoupons,
  verifyRazorpayPayment,
  type CheckoutOrderPayload,
  type AdminCoupon,
} from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";
import { getCouponBreakdown, getEligibleSubtotalForCoupon } from "@/lib/couponPricing";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";
import { getDynamicProductName } from "@/lib/translation";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

type CheckoutData = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  shipping: number;
  subtotal: number;
  discountAmount?: number;
  couponCode?: string | null;
};

type OrderPreviewItem = {
  key: string;
  name: string;
  weight: string;
  quantity: number;
  totalPrice: number;
};

type CartLineForCoupon = {
  key: string;
  productId: string;
  totalPrice: number;
  product: {
    category: string;
    subcategory?: "salt" | "asafoetida";
  };
};

type DisplayPreviewItem = OrderPreviewItem & {
  originalTotalPrice: number;
  discountedTotalPrice: number;
  discountAmount: number;
  isDiscounted: boolean;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const paymentCopy = {
  en: {
    eyebrow: "Payment",
    title: "Choose how this order should be confirmed",
    intro:
      "Use UPI/Card to complete your order securely. This checkout step is simplified for a faster and clearer payment experience.",
    comingSoonTitle: "UPI / Card",
    comingSoonBody:
      "Pay using any UPI app or card via Razorpay secure checkout.",
    bankTitle: "UPI / Card",
    bankBody:
      "UPI and card payments are supported for this order.",
    backWarningTitle: "Important",
    backWarningBody:
      "Do not press back or refresh until payment is confirmed. Closing this step early can interrupt payment verification.",
    confirm: "Confirm Order",
    back: "Back to Checkout",
  },
  te: {
    eyebrow: "చెల్లింపు",
    title: "ఈ ఆర్డర్‌ను ఎలా నిర్ధారించాలో ఎంచుకోండి",
    intro:
      "మీ ఆర్డర్‌ను సురక్షితంగా పూర్తి చేయడానికి UPI/Card ఉపయోగించండి. వేగంగా మరియు సులభంగా ఉండేలా ఈ checkout దశను సరళీకరించాం.",
    comingSoonTitle: "UPI / కార్డ్",
    comingSoonBody:
      "Razorpay సురక్షిత checkout ద్వారా ఏదైనా UPI యాప్ లేదా కార్డ్‌తో చెల్లించవచ్చు.",
    bankTitle: "UPI / కార్డ్",
    bankBody:
      "ఈ ఆర్డర్‌కు UPI మరియు కార్డ్ చెల్లింపులు అందుబాటులో ఉన్నాయి.",
    codTitle: "డెలివరీ సమయంలో చెల్లింపు",
    codBody: "ఇప్పుడే ఆర్డర్ పెట్టండి, డెలివరీ సమయంలో చెల్లించండి.",
    backWarningTitle: "ముఖ్యం",
    backWarningBody:
      "చెల్లింపు నిర్ధారణ అయ్యే వరకు వెనక్కి వెళ్లకండి లేదా refresh చేయకండి. మధ్యలో ఆపితే payment verification అంతరాయం కలగవచ్చు.",
    confirm: "ఆర్డర్ నిర్ధారించండి",
    back: "చెక్‌అవుట్‌కి తిరుగు",
  },
} as const;

const paymentUiCopy = {
  en: {
    checkoutUnavailable: "Razorpay checkout is unavailable.",
    cancelled: "Payment was cancelled.",
    confirmError: "Unable to confirm the order.",
    itemCouponApplied: "Coupon applied to this item",
    subtotal: "Subtotal",
    shipping: "Shipping",
    couponDiscount: "Coupon discount",
    couponHelp: "Coupon discounts apply only to eligible items. Shipping stays unchanged.",
  },
  te: {
    checkoutUnavailable: "Razorpay checkout అందుబాటులో లేదు.",
    cancelled: "చెల్లింపు రద్దు చేయబడింది.",
    confirmError: "ఆర్డర్ నిర్ధారణ చేయలేకపోయాం.",
    itemCouponApplied: "ఈ అంశానికి కూపన్ అమలైంది",
    subtotal: "ఉప మొత్తం",
    shipping: "షిప్పింగ్",
    couponDiscount: "కూపన్ తగ్గింపు",
    couponHelp: "కూపన్ తగ్గింపు వర్తించే ఉత్పత్తులకే వర్తిస్తుంది. షిప్పింగ్ యథాతథంగా ఉంటుంది.",
  },
} as const;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useStore();
  const { language } = useLanguage();
  const t = content[language];
  const copy = paymentCopy[language];
  const ui = paymentUiCopy[language];
  const { data: coupons = [] } = useQuery({
    queryKey: ["storefront-coupons"],
    queryFn: getCoupons,
    staleTime: 0,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data =
      location.state?.checkoutData ?? JSON.parse(sessionStorage.getItem("checkoutData") || "null");

    if (!data) {
      navigate("/checkout");
      return;
    }

    setCheckoutData(data);
  }, [location.state, navigate]);

  useEffect(() => {
    // Warm up Razorpay script while user is reviewing the payment details.
    void loadRazorpayScript().catch(() => {
      // Keep silent here; checkout flow already shows a clear error if script fails.
    });
  }, []);

  const previewItems: OrderPreviewItem[] = cart.map((line) => ({
    key: line.key,
    name: getDynamicProductName(line.product, language),
    weight: line.weight,
    quantity: line.quantity,
    totalPrice: line.totalPrice,
  }));

  const couponCode = String(checkoutData?.couponCode ?? "").trim().toUpperCase();
  const appliedCoupon = useMemo(
    () => coupons.find((coupon: AdminCoupon) => coupon.code === couponCode) ?? null,
    [couponCode, coupons],
  );

  const couponSummary = useMemo(() => {
    if (!appliedCoupon) {
      return null;
    }

    const couponCart: CartLineForCoupon[] = cart.map((line) => ({
      key: line.key,
      productId: line.productId,
      totalPrice: line.totalPrice,
      product: {
        category: line.product.category,
        subcategory: line.product.subcategory,
      },
    }));

    return getCouponBreakdown(appliedCoupon, couponCart);
  }, [appliedCoupon, cart]);

  const couponValidationPending = Boolean(checkoutData?.couponCode) && coupons.length === 0;

  const displayItems: DisplayPreviewItem[] = useMemo(
    () =>
      previewItems.map((item) => {
        const breakdownItem = couponSummary?.lineBreakdown.find((line) => line.key === item.key);

        return {
          ...item,
          originalTotalPrice: item.totalPrice,
          discountedTotalPrice: breakdownItem?.adjustedTotalPrice ?? item.totalPrice,
          discountAmount: breakdownItem?.discountAmount ?? 0,
          isDiscounted: Boolean(breakdownItem?.isEligible),
        };
      }),
    [couponSummary, previewItems],
  );

  const checkoutDiscountAmount = Math.max(0, Number(checkoutData?.discountAmount ?? 0));
  const discountAmount = couponCode ? (couponSummary?.discountAmount ?? 0) : checkoutDiscountAmount;
  const total = Math.max(0, Number(checkoutData?.subtotal ?? 0) + Number(checkoutData?.shipping ?? 0) - discountAmount);

  if (!checkoutData) {
    return null;
  }

  const openRazorpayCheckout = (options: RazorpayOptions) =>
    new Promise<RazorpaySuccessResponse>((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error(ui.checkoutUnavailable));
        return;
      }

      const checkout = new window.Razorpay({
        ...options,
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () => reject(new Error(ui.cancelled)),
        },
      });

      checkout.open();
    });

  const handlePaymentConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cart.length === 0) {
      setErrorMessage(t.checkout.errors.emptyCart);
      return;
    }

    if (couponValidationPending) {
      setErrorMessage("Validating coupon, please wait and try again.");
      return;
    }

    const hasInvalidCartValues = cart.some((line) => {
      const quantity = Number(line.quantity);
      const unitPrice = Number(line.price);
      return !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice <= 0;
    });

    if (hasInvalidCartValues) {
      setErrorMessage("One or more cart items has invalid pricing. Please go back to cart and refresh item quantities.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    if (appliedCoupon) {
      const eligibleSubtotal = getEligibleSubtotalForCoupon(appliedCoupon, cart);

      if (eligibleSubtotal <= 0) {
        setErrorMessage("This coupon does not apply to the current cart.");
        setIsProcessing(false);
        return;
      }

      if (appliedCoupon.minOrderAmount !== null && eligibleSubtotal < Number(appliedCoupon.minOrderAmount)) {
        setErrorMessage(`Eligible items must reach ${formatCurrency(Number(appliedCoupon.minOrderAmount))} for this coupon.`);
        setIsProcessing(false);
        return;
      }
    }

    try {
      const orderPayload: CheckoutOrderPayload = {
        name: checkoutData.name,
        phone: checkoutData.phone,
        address: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        country: checkoutData.country,
        pincode: checkoutData.pincode,
        shipping: checkoutData.shipping,
        couponCode: appliedCoupon?.code ?? null,
        paymentMethod: "upi",
        items: cart.map((line) => {
          const fallbackUnitPrice = Math.round(line.totalPrice / Math.max(1, Number(line.quantity) || 1));
          const unitPrice = Number.isFinite(Number(line.price)) ? Number(line.price) : fallbackUnitPrice;

          return {
            productId: line.productId,
            name: line.product.name,
            quantity: line.quantity,
            weight: line.weight,
            price: unitPrice,
          };
        }),
      };

      const razorpayOrder = await createRazorpayOrder(orderPayload);
      await loadRazorpayScript();

      const paymentResponse = await openRazorpayCheckout({
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.orderId,
        name: "SP Traditional Pickles",
        description: `Order payment - ${formatCurrency(total)}`,
        prefill: {
          name: checkoutData.name,
          contact: checkoutData.phone,
        },
        notes: {
          customer_name: checkoutData.name,
          customer_phone: checkoutData.phone,
        },
        theme: {
          color: "#2f7a43",
        },
        handler: () => {},
      });

      const { order } = await verifyRazorpayPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        checkoutPayload: orderPayload,
      });
      const finalizedCheckoutData = { ...checkoutData, discountAmount };

      clearCart();
      sessionStorage.removeItem("checkoutData");

      navigate("/order-success", {
        state: {
          orderId: order.id,
          whatsappUrl: order.whatsappUrl,
          checkoutData: finalizedCheckoutData,
          paymentMethod: "upi",
          items: previewItems,
        },
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : ui.confirmError);
      setIsProcessing(false);
    }
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Payment"
        description="Choose the payment confirmation method for your SP Traditional Pickles order."
        noIndex
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-6 sm:py-7`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#956d00] sm:px-4 sm:py-2 sm:text-xs">
            {copy.eyebrow}
          </span>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start`}>
        <form onSubmit={handlePaymentConfirm} className="section-shell space-y-6 px-7 py-8">
          <div className="rounded-[1.8rem] border border-dashed border-[#d8e5d8] bg-[#f8fbf8] px-5 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#956d00]">
              {copy.comingSoonTitle}
            </p>
            <p
              className={`mt-3 text-sm leading-7 text-theme-body ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {copy.comingSoonBody}
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#e2b93b] bg-[#fff9ed] p-5 shadow-[0_20px_40px_rgba(30,79,46,0.1)]">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ee]">
                <CreditCard className="h-5 w-5 text-[#2f7a43]" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                  {copy.bankTitle}
                </p>
                <p className={`mt-1 text-sm text-theme-body ${language === "te" ? "font-telugu" : ""}`}>
                  {copy.bankBody}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d9644c]/35 bg-[#fff4f1] px-4 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c14f3a]">
              {copy.backWarningTitle}
            </p>
            <p className={`mt-2 text-sm leading-6 text-[#b84c39] ${language === "te" ? "font-telugu" : ""}`}>
              {copy.backWarningBody}
            </p>
          </div>

          {errorMessage ? (
            <div className="flex items-start gap-3 rounded-2xl border border-[#d9644c]/30 bg-[#fff4f1] px-4 py-4 text-sm text-[#d9644c]">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={isProcessing || couponValidationPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-6 py-4 text-sm font-semibold !text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {copy.confirm}
            </button>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-6 py-4 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto"
            >
              {copy.back}
            </button>
          </div>
        </form>

        <aside className="section-shell h-fit px-7 py-8 lg:sticky lg:top-36">
          <h2 className="font-heading text-3xl font-semibold text-theme-heading">
            {t.checkout.orderSummary}
          </h2>

          <div className="mt-8 max-h-96 space-y-4 overflow-y-auto border-b border-[#d8e5d8] pb-8">
            {displayItems.map((item) => (
              <div key={item.key} className="flex justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-theme-heading">{item.name}</p>
                  <p className="mt-1 text-theme-body">
                    {item.weight} x {item.quantity}
                  </p>
                  {item.isDiscounted ? (
                    <p className="mt-1 text-xs font-medium text-[#1f6a3b]">
                      {ui.itemCouponApplied}
                    </p>
                  ) : null}
                </div>
                <div className="text-right">
                  {item.isDiscounted ? (
                    <>
                      <p className="price-figure text-xs text-theme-body line-through">
                        {formatCurrency(item.originalTotalPrice)}
                      </p>
                      <p className="price-figure font-semibold text-[#1f6a3b]">
                        {formatCurrency(item.discountedTotalPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="price-figure font-semibold text-theme-heading">
                      {formatCurrency(item.originalTotalPrice)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm text-theme-body">
              <span>{ui.subtotal}</span>
              <span className="price-figure">{formatCurrency(checkoutData.subtotal)}</span>
            </div>
            {discountAmount > 0 ? (
              <div className="flex justify-between text-sm text-[#1f6a3b]">
                <span>{ui.couponDiscount}</span>
                <span className="price-figure">- {formatCurrency(discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm text-theme-body">
              <span>{ui.shipping}</span>
              <span className="price-figure">{formatCurrency(checkoutData.shipping)}</span>
            </div>
            <p className="text-xs leading-6 text-theme-body-soft">
              {ui.couponHelp}
            </p>
            <div className="border-t border-[#d8e5d8] pt-3">
              <div className="flex justify-between font-heading text-2xl font-bold text-theme-heading">
                <span>{t.checkout.total}</span>
                <span className="price-figure text-[#2f7a43]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default PaymentPage;
