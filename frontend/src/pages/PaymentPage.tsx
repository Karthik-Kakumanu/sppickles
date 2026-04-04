import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, BadgeCheck, Loader2, Wallet } from "lucide-react";
import { useCreateOrderMutation } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

type PaymentMethod = "bank" | "cod";

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
};

type OrderPreviewItem = {
  key: string;
  name: string;
  weight: string;
  quantity: number;
  totalPrice: number;
};

const paymentCopy = {
  en: {
    eyebrow: "Payment",
    title: "Choose how this order should be confirmed",
    intro:
      "The payment page is cleaned up for launch readiness. Online gateway space is reserved for Razorpay later, while manual confirmation and cash on delivery keep the current flow honest and usable.",
    comingSoonTitle: "Online payment",
    comingSoonBody:
      "Razorpay or another gateway can be connected here in the next phase. This card is kept visible so the layout is already ready for that integration.",
    bankTitle: "Manual confirmation / transfer",
    bankBody:
      "Choose this if the payment will be confirmed directly with the team. Final transfer details can be shared after the order is recorded.",
    codTitle: "Cash on Delivery",
    codBody:
      "Choose this when the customer wants to complete payment at the time of delivery, if the location is eligible.",
    confirm: "Confirm Order",
    back: "Back to Checkout",
  },
  te: {
    eyebrow: "చెల్లింపు",
    title: "ఈ ఆర్డర్‌ను ఎలా నిర్ధారించాలో ఎంచుకోండి",
    intro:
      "లాంచ్‌కి సిద్ధంగా ఉండేలా ఈ చెల్లింపు పేజీని శుభ్రంగా రూపొందించాం. ప్రస్తుతం నేరుగా నిర్ధారణ మరియు క్యాష్ ఆన్ డెలివరీతో ప్రక్రియను సులభంగా ఉంచి, తరువాత Razorpay కోసం స్థలం సిద్ధంగా ఉంచాం.",
    comingSoonTitle: "ఆన్‌లైన్ చెల్లింపు",
    comingSoonBody:
      "తరువాతి దశలో Razorpay లేదా మరొక చెల్లింపు గేట్‌వేను ఇక్కడ జత చేయవచ్చు. అందుకోసం ఈ రూపకల్పన ఇప్పటికే సిద్ధంగా ఉంది.",
    bankTitle: "నేరుగా నిర్ధారణ / బ్యాంక్ ట్రాన్స్‌ఫర్",
    bankBody:
      "టీమ్‌తో నేరుగా మాట్లాడి చెల్లింపు నిర్ధారించాలనుకుంటే ఈ ఎంపికను ఎంచుకోండి. ఆర్డర్ నమోదు అయిన తర్వాత బ్యాంక్ ట్రాన్స్‌ఫర్ వివరాలు పంచుకుంటాం.",
    codTitle: "క్యాష్ ఆన్ డెలివరీ",
    codBody:
      "లొకేషన్‌కు అందుబాటులో ఉంటే, డెలివరీ సమయానికి చెల్లించాలనుకునే కస్టమర్ ఈ ఎంపికను ఎంచుకోవచ్చు.",
    confirm: "ఆర్డర్ నిర్ధారించండి",
    back: "చెక్‌అవుట్‌కి తిరుగు",
  },
} as const;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useStore();
  const { language } = useLanguage();
  const t = content[language];
  const copy = paymentCopy[language];
  const createOrderMutation = useCreateOrderMutation();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data =
      location.state?.checkoutData ?? JSON.parse(sessionStorage.getItem("checkoutData") || "null");

    if (!data || !cart.length) {
      navigate("/checkout");
      return;
    }

    setCheckoutData(data);
  }, [location.state, cart.length, navigate]);

  if (!checkoutData) {
    return null;
  }

  const previewItems: OrderPreviewItem[] = cart.map((line) => ({
    key: line.key,
    name: line.product.name,
    weight: line.weight,
    quantity: line.quantity,
    totalPrice: line.totalPrice,
  }));

  const total = checkoutData.subtotal + checkoutData.shipping;

  const handlePaymentConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPayment) {
      setErrorMessage(language === "te" ? "దయచేసి ఒక ఎంపికను ఎంచుకోండి." : "Please select a payment method.");
      return;
    }

    if (cart.length === 0) {
      setErrorMessage(t.checkout.errors.emptyCart);
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const order = await createOrderMutation.mutateAsync({
        name: checkoutData.name,
        phone: checkoutData.phone,
        address: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        country: checkoutData.country,
        pincode: checkoutData.pincode,
        shipping: checkoutData.shipping,
        paymentMethod: selectedPayment,
        items: cart.map((line) => ({
          productId: line.productId,
          name: line.product.name,
          quantity: line.quantity,
          weight: line.weight,
          price: line.price,
        })),
      });

      clearCart();
      sessionStorage.removeItem("checkoutData");

      navigate("/order-success", {
        state: {
          orderId: order.id,
          whatsappUrl: order.whatsappUrl,
          checkoutData,
          paymentMethod: selectedPayment,
          items: previewItems,
        },
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to confirm the order.");
      setIsProcessing(false);
    }
  };

  const getOptionClassName = (method: PaymentMethod) =>
    `block cursor-pointer rounded-[1.8rem] border p-5 transition duration-300 ${
      selectedPayment === method
        ? "border-[#e2b93b] bg-[#fff9ed] shadow-[0_20px_40px_rgba(30,79,46,0.1)]"
        : "border-[#d8e5d8] bg-white hover:border-[#e2b93b] hover:bg-[#fffdf7]"
    }`;

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Payment"
        description="Choose the payment confirmation method for your SP Traditional Pickles order."
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

          <label className={getOptionClassName("bank")}>
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={selectedPayment === "bank"}
                onChange={(event) => setSelectedPayment(event.target.value as PaymentMethod)}
                className="mt-1 h-4 w-4 accent-[#2f7a43]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ee]">
                    <Wallet className="h-5 w-5 text-[#2f7a43]" />
                  </div>
                  <div>
                    <p className={`font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                      {copy.bankTitle}
                    </p>
                    <p
                      className={`mt-1 text-sm text-theme-body ${
                        language === "te" ? "font-telugu" : ""
                      }`}
                    >
                      {copy.bankBody}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <label className={getOptionClassName("cod")}>
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={selectedPayment === "cod"}
                onChange={(event) => setSelectedPayment(event.target.value as PaymentMethod)}
                className="mt-1 h-4 w-4 accent-[#2f7a43]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ee]">
                    <BadgeCheck className="h-5 w-5 text-[#2f7a43]" />
                  </div>
                  <div>
                    <p className={`font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                      {copy.codTitle}
                    </p>
                    <p
                      className={`mt-1 text-sm text-theme-body ${
                        language === "te" ? "font-telugu" : ""
                      }`}
                    >
                      {copy.codBody}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </label>

          {errorMessage ? (
            <div className="flex items-start gap-3 rounded-2xl border border-[#d9644c]/30 bg-[#fff4f1] px-4 py-4 text-sm text-[#d9644c]">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="submit"
              disabled={isProcessing || !selectedPayment}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
            {previewItems.map((item) => (
              <div key={item.key} className="flex justify-between gap-4 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-theme-heading">{item.name}</p>
                  <p className="mt-1 text-theme-body">
                    {item.weight} x {item.quantity}
                  </p>
                </div>
                <p className="price-figure font-semibold text-theme-heading">
                  {formatCurrency(item.totalPrice)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm text-theme-body">
              <span>{language === "te" ? "ఉప మొత్తం" : "Subtotal"}</span>
              <span className="price-figure">{formatCurrency(checkoutData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-theme-body">
              <span>{language === "te" ? "షిప్పింగ్" : "Shipping"}</span>
              <span className="price-figure">{formatCurrency(checkoutData.shipping)}</span>
            </div>
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
