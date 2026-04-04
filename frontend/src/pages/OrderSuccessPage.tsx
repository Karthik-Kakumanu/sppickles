import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, Home, MessageCircle, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";

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
};

type OrderSuccessItem = {
  key: string;
  name: string;
  weight: string;
  quantity: number;
  totalPrice: number;
};

type OrderSuccessState = {
  orderId: string;
  whatsappUrl?: string;
  checkoutData: CheckoutData;
  paymentMethod: "bank" | "cod";
  items: OrderSuccessItem[];
};

const successCopy = {
  en: {
    eyebrow: "Order Confirmed",
    title: "Your order is recorded and ready for the next step",
    intro:
      "The order has been captured successfully. The customer can now continue to WhatsApp, keep the order ID safe, and wait for the next delivery or payment update.",
    deliveryTitle: "Delivery address",
    paymentTitle: "Payment note",
    paymentMessages: {
      bank: "The team can now continue manual payment confirmation or transfer guidance directly with you.",
      cod: "Cash on delivery is selected. Payment is expected when the order reaches you.",
    },
    nextStepsTitle: "What happens next",
    nextSteps: {
      bank: [
        "Save the order ID and continue the conversation on WhatsApp.",
        "The team can confirm payment or transfer guidance after reviewing the order.",
        "Packing and dispatch follow after confirmation.",
      ],
      cod: [
        "Save the order ID and continue the conversation on WhatsApp if needed.",
        "The order moves to packing and dispatch after team review.",
        "Payment is completed with the delivery handoff.",
      ],
    },
    chat: "Continue on WhatsApp",
    shop: "Continue Shopping",
    home: "Back to Home",
  },
  te: {
    eyebrow: "ఆర్డర్ నిర్ధారించబడింది",
    title: "మీ ఆర్డర్ నమోదు అయింది. తరువాతి దశకు సిద్ధంగా ఉంది",
    intro:
      "ఆర్డర్ విజయవంతంగా నమోదైంది. ఇప్పుడు కస్టమర్ వాట్సాప్‌లో కొనసాగవచ్చు, ఆర్డర్ IDని భద్రపరచుకోవచ్చు, తరువాతి డెలివరీ లేదా చెల్లింపు అప్‌డేట్ కోసం వేచి ఉండవచ్చు.",
    deliveryTitle: "డెలివరీ చిరునామా",
    paymentTitle: "చెల్లింపు సమాచారం",
    paymentMessages: {
      bank: "ఇప్పుడు టీమ్ మీతో నేరుగా మాట్లాడి చెల్లింపు నిర్ధారణ లేదా బ్యాంక్ ట్రాన్స్‌ఫర్ వివరాలు అందిస్తుంది.",
      cod: "క్యాష్ ఆన్ డెలివరీ ఎంపిక చేయబడింది. ఆర్డర్ చేరినప్పుడు చెల్లింపు పూర్తవుతుంది.",
    },
    nextStepsTitle: "తరువాత ఏమవుతుంది",
    nextSteps: {
      bank: [
        "ఆర్డర్ IDను సేవ్ చేసి వాట్సాప్‌లో కొనసాగండి.",
        "టీమ్ ఆర్డర్‌ను పరిశీలించి చెల్లింపు వివరాలు లేదా బ్యాంక్ ట్రాన్స్‌ఫర్ సమాచారం పంపిస్తుంది.",
        "నిర్ధారణ తర్వాత ప్యాకింగ్ మరియు పంపిణీ మొదలవుతుంది.",
      ],
      cod: [
        "ఆర్డర్ IDను సేవ్ చేసుకోండి. అవసరమైతే వాట్సాప్‌లో మాట్లాడండి.",
        "టీమ్ సమీక్షించిన తర్వాత ప్యాకింగ్ మరియు పంపిణీ జరుగుతుంది.",
        "డెలివరీ సమయంలో చెల్లింపు పూర్తవుతుంది.",
      ],
    },
    chat: "వాట్సాప్‌లో కొనసాగండి",
    shop: "ఇంకా కొనుగోలు చేయండి",
    home: "హోమ్‌కు తిరుగు",
  },
} as const;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = successCopy[language];
  const [orderData, setOrderData] = useState<OrderSuccessState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = location.state as OrderSuccessState | null;

    if (!data?.orderId) {
      navigate("/");
      return;
    }

    setOrderData(data);
  }, [location.state, navigate]);

  if (!orderData) {
    return null;
  }

  const total = orderData.checkoutData.subtotal + orderData.checkoutData.shipping;
  const nextSteps = t.nextSteps[orderData.paymentMethod];

  const handleCopyOrderId = async () => {
    await navigator.clipboard.writeText(orderData.orderId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (orderData.whatsappUrl) {
      window.open(orderData.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Order Confirmed"
        description="Your SP Traditional Pickles order has been confirmed."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-10`}>
          <div className="max-w-5xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#edf5ee] text-[#2f7a43] shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <span className="mt-6 inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
              {t.eyebrow}
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold text-theme-heading md:text-5xl xl:text-6xl">
              {t.title}
            </h1>
            <p
              className={`mt-5 max-w-4xl text-base leading-8 text-theme-body md:text-lg ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.intro}
            </p>
          </div>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-10 lg:grid-cols-[1.08fr_0.92fr]`}>
        <div className="space-y-8">
          <div className="section-shell px-7 py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#956d00]">
              {language === "te" ? "ఆర్డర్ ID" : "Order ID"}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-heading text-3xl font-bold break-all text-theme-heading">
                  {orderData.orderId}
                </p>
                {copied ? (
                  <p className="mt-2 text-sm font-medium text-[#2f7a43]">
                    {language === "te" ? "ఆర్డర్ ID కాపీ అయింది." : "Order ID copied."}
                  </p>
                ) : null}
              </div>
              <button
                onClick={handleCopyOrderId}
                className="rounded-xl border border-[#d8e5d8] bg-white p-3 text-theme-body transition hover:bg-[#edf5ee]"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.deliveryTitle}</h2>
            <div className="mt-6 space-y-3 text-theme-body">
              <p className="font-semibold text-theme-heading">{orderData.checkoutData.name}</p>
              <p>{orderData.checkoutData.address}</p>
              <p>
                {orderData.checkoutData.city}, {orderData.checkoutData.state} {orderData.checkoutData.pincode}
              </p>
              <div className="flex items-center gap-2 border-t border-[#d8e5d8] pt-4 font-semibold text-theme-heading">
                <Phone className="h-4 w-4" />
                {orderData.checkoutData.phone}
              </div>
            </div>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.paymentTitle}</h2>
            <p
              className={`mt-4 text-base leading-8 text-theme-body ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.paymentMessages[orderData.paymentMethod]}
            </p>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.nextStepsTitle}</h2>
            <ol className="mt-6 space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#edf5ee] text-sm font-bold text-[#2f7a43]">
                    {index + 1}
                  </div>
                  <p
                    className={`pt-1 text-sm leading-7 text-theme-body ${
                      language === "te" ? "font-telugu" : ""
                    }`}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleWhatsApp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-8 py-4 font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              {t.chat}
            </button>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-8 py-4 font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto"
            >
              <ArrowRight className="h-5 w-5" />
              {t.shop}
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-8 py-4 font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto"
            >
              <Home className="h-5 w-5" />
              {t.home}
            </button>
          </div>
        </div>

        <aside className="section-shell h-fit px-7 py-8 lg:sticky lg:top-36">
          <h2 className="font-heading text-3xl font-semibold text-theme-heading">
            {language === "te" ? "ఆర్డర్ సారాంశం" : "Order Summary"}
          </h2>

          <div className="mt-8 max-h-96 space-y-4 overflow-y-auto border-b border-[#d8e5d8] pb-8">
            {orderData.items.length > 0 ? (
              orderData.items.map((item) => (
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
              ))
            ) : (
              <p className="text-sm text-theme-body">
                {language === "te" ? "ఆర్డర్ చేసిన ఐటమ్స్ ఇక్కడ కనిపిస్తాయి." : "Your ordered items will appear here."}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm text-theme-body">
              <span>{language === "te" ? "ఉప మొత్తం" : "Subtotal"}</span>
              <span className="price-figure">{formatCurrency(orderData.checkoutData.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-theme-body">
              <span>{language === "te" ? "షిప్పింగ్" : "Shipping"}</span>
              <span className="price-figure">{formatCurrency(orderData.checkoutData.shipping)}</span>
            </div>
            <div className="border-t border-[#d8e5d8] pt-3">
              <div className="flex justify-between font-heading text-2xl font-bold text-theme-heading">
                <span>{language === "te" ? "మొత్తం" : "Total"}</span>
                <span className="price-figure text-[#2f7a43]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default OrderSuccessPage;
