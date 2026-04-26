import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Copy, Home, MessageCircle, Phone, ShieldAlert } from "lucide-react";
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
  discountAmount?: number;
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
  paymentMethod: "upi";
  items: OrderSuccessItem[];
};

const successCopy = {
  en: {
    eyebrow: "Order Confirmed",
    title: "Your order is recorded and ready for the next step",
    intro:
      "Your order has been received successfully. Save the order ID, continue on WhatsApp if needed, and wait for the next payment or dispatch update from the team.",
    deliveryTitle: "Delivery address",
    paymentTitle: "Payment update",
    cancellationTitle: "Cancellation window",
    cancellationBody:
      "You can cancel this order within 6 hours of purchase. After that, the order moves into packing and dispatch preparation.",
    reminderTitle: "Important reminder",
    reminderBody:
      "If you need support later, keep both the order ID and checkout phone number ready. Copy the order ID now and save it safely.",
    refundNoteTitle: "Refund note for prepaid orders",
    refundNoteBody:
      "If a prepaid order is cancelled, the refund is initiated immediately. Payment gateway charges may apply according to policy, and the remaining eligible amount is usually credited within 1 working day.",
    paymentMessages: {
      upi: "UPI or card payment was selected. Continue on WhatsApp if the team needs to share or confirm the payment details.",
    },
    nextStepsTitle: "What happens next",
    nextSteps: {
      upi: [
        "Save your order ID for future reference.",
        "Continue on WhatsApp if the team needs to confirm payment or dispatch details.",
        "Packing and dispatch updates will follow after confirmation.",
      ],
    },
    orderId: "Order ID",
    orderIdCopied: "Order ID copied.",
    chat: "Continue on WhatsApp",
    cancelOrder: "Cancel order",
    shop: "Continue Shopping",
    home: "Back to Home",
    orderSummary: "Order Summary",
    emptyItems: "Your ordered items will appear here.",
    subtotal: "Subtotal",
    couponDiscount: "Coupon discount",
    shipping: "Shipping",
    total: "Total",
  },
  te: {
    eyebrow: "ఆర్డర్ నిర్ధారించబడింది",
    title: "మీ ఆర్డర్ నమోదు అయింది. తదుపరి దశకు సిద్ధంగా ఉంది",
    intro:
      "మీ ఆర్డర్ విజయవంతంగా నమోదు అయింది. ఆర్డర్ ఐడిని భద్రపరచుకోండి, అవసరమైతే వాట్సాప్‌లో కొనసాగండి, తదుపరి చెల్లింపు లేదా పంపిణీ సమాచారం కోసం వేచి ఉండండి.",
    deliveryTitle: "డెలివరీ చిరునామా",
    paymentTitle: "చెల్లింపు సమాచారం",
    cancellationTitle: "రద్దు గడువు",
    cancellationBody:
      "కొనుగోలు చేసిన 6 గంటలలోపు మాత్రమే ఈ ఆర్డర్‌ను రద్దు చేయవచ్చు. ఆ తర్వాత ప్యాకింగ్ మరియు పంపిణీకి ఆర్డర్ సిద్ధం అవుతుంది.",
    reminderTitle: "ముఖ్యమైన గుర్తుంచుకోవాల్సిన విషయం",
    reminderBody:
      "తర్వాత సహాయం అవసరమైతే ఆర్డర్ ఐడి మరియు చెకౌట్ ఫోన్ నంబర్ రెండూ దగ్గర ఉంచుకోండి. ఆర్డర్ ఐడిని ఇప్పుడు కాపీ చేసి భద్రపరచండి.",
    refundNoteTitle: "ముందస్తు చెల్లింపు ఆర్డర్ల రిఫండ్ గమనిక",
    refundNoteBody:
      "ముందస్తు చెల్లింపు చేసిన ఆర్డర్ రద్దయితే రిఫండ్ వెంటనే ప్రారంభమవుతుంది. గేట్‌వే విధానం ప్రకారం చార్జీలు వర్తించవచ్చు. మిగిలిన అర్హమైన మొత్తం సాధారణంగా 1 పని దినంలో జమ అవుతుంది.",
    paymentMessages: {
      upi: "UPI లేదా కార్డ్ చెల్లింపు ఎంపిక చేయబడింది. చెల్లింపు నిర్ధారణ లేదా వివరాల కోసం అవసరమైతే వాట్సాప్‌లో కొనసాగండి.",
    },
    nextStepsTitle: "తర్వాత ఏమవుతుంది",
    nextSteps: {
      upi: [
        "మీ ఆర్డర్ ఐడిని భద్రపరచుకోండి.",
        "టీమ్ చెల్లింపు లేదా పంపిణీ వివరాలు నిర్ధారించాల్సి ఉంటే వాట్సాప్‌లో కొనసాగండి.",
        "నిర్ధారణ తర్వాత ప్యాకింగ్ మరియు పంపిణీ సమాచారం వస్తుంది.",
      ],
    },
    orderId: "ఆర్డర్ ఐడి",
    orderIdCopied: "ఆర్డర్ ఐడి కాపీ అయింది.",
    chat: "వాట్సాప్‌లో కొనసాగండి",
    cancelOrder: "ఆర్డర్ రద్దు చేయండి",
    shop: "ఇంకా కొనుగోలు చేయండి",
    home: "హోమ్‌కు తిరుగు",
    orderSummary: "ఆర్డర్ సారాంశం",
    emptyItems: "మీ ఆర్డర్ చేసిన ఉత్పత్తులు ఇక్కడ కనిపిస్తాయి.",
    subtotal: "ఉప మొత్తం",
    couponDiscount: "కూపన్ తగ్గింపు",
    shipping: "షిప్పింగ్",
    total: "మొత్తం",
  },
} as const;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = successCopy[language];
  const isTelugu = language === "te";
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

  const discountAmount = Math.max(0, Number(orderData.checkoutData.discountAmount ?? 0));
  const total = Math.max(0, orderData.checkoutData.subtotal + orderData.checkoutData.shipping - discountAmount);
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

  const handleCancelOrder = () => {
    navigate("/cancel-order", {
      state: {
        orderId: orderData.orderId,
        phone: orderData.checkoutData.phone,
      },
    });
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title={isTelugu ? "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ | ఆర్డర్ నిర్ధారించబడింది" : "SP Traditional Pickles | Order Confirmed"}
        description={isTelugu ? "మీ ఎస్‌పి ట్రెడిషనల్ పికిల్స్ ఆర్డర్ నిర్ధారించబడింది." : "Your SP Traditional Pickles order has been confirmed."}
        noIndex
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
            <p className={`mt-5 max-w-4xl text-base leading-8 text-theme-body md:text-lg ${isTelugu ? "font-telugu" : ""}`}>
              {t.intro}
            </p>
          </div>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-10 lg:grid-cols-[1.08fr_0.92fr]`}>
        <div className="space-y-8">
          <div className="section-shell px-7 py-8">
            <p className={`text-sm font-semibold uppercase tracking-[0.22em] text-[#956d00] ${isTelugu ? "font-telugu" : ""}`}>
              {t.orderId}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="break-all font-heading text-3xl font-bold text-theme-heading">{orderData.orderId}</p>
                {copied ? <p className={`mt-2 text-sm font-medium text-[#2f7a43] ${isTelugu ? "font-telugu" : ""}`}>{t.orderIdCopied}</p> : null}
              </div>
              <button
                onClick={handleCopyOrderId}
                className="rounded-xl border border-[#d8e5d8] bg-white p-3 text-theme-body transition hover:bg-[#edf5ee]"
                aria-label={t.orderId}
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-[#e7cf91] bg-[#fff9eb] p-4">
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] text-[#8a651a] ${isTelugu ? "font-telugu" : ""}`}>{t.reminderTitle}</p>
              <p className={`mt-2 text-sm leading-7 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.reminderBody}</p>
            </div>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.deliveryTitle}</h2>
            <div className={`mt-6 space-y-3 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
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
            <p className={`mt-4 text-base leading-8 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
              {t.paymentMessages[orderData.paymentMethod]}
            </p>
          </div>

          <div className="section-shell border border-[#e7cf91] bg-[linear-gradient(180deg,#fff9eb_0%,#fffdf6_100%)] px-7 py-8">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1c9] text-[#8a651a]">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.cancellationTitle}</h2>
                <p className={`mt-3 text-sm leading-7 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.cancellationBody}</p>
                <div className="mt-4 rounded-xl border border-[#f0dfb1] bg-white/70 p-3">
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-[#8a651a] ${isTelugu ? "font-telugu" : ""}`}>{t.refundNoteTitle}</p>
                  <p className={`mt-2 text-sm leading-7 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.refundNoteBody}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-2xl font-semibold text-theme-heading">{t.nextStepsTitle}</h2>
            <ol className="mt-6 space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#edf5ee] text-sm font-bold text-[#2f7a43]">
                    {index + 1}
                  </div>
                  <p className={`pt-1 text-sm leading-7 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleWhatsApp}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-8 py-4 font-semibold !text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              {t.chat}
            </button>
            <button
              onClick={handleCancelOrder}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e7cf91] bg-[#fffaf0] px-8 py-4 font-semibold text-[#8a651a] transition hover:bg-[#fff4db] sm:w-auto"
            >
              <ShieldAlert className="h-5 w-5" />
              {t.cancelOrder}
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
          <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.orderSummary}</h2>

          <div className="mt-8 max-h-96 space-y-4 overflow-y-auto border-b border-[#d8e5d8] pb-8">
            {orderData.items.length > 0 ? (
              orderData.items.map((item) => (
                <div key={item.key} className="flex justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-theme-heading">{item.name}</p>
                    <p className={`mt-1 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
                      {item.weight} x {item.quantity}
                    </p>
                  </div>
                  <p className="price-figure font-semibold text-theme-heading">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.emptyItems}</p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-sm text-theme-body">
              <span className={isTelugu ? "font-telugu" : ""}>{t.subtotal}</span>
              <span className="price-figure">{formatCurrency(orderData.checkoutData.subtotal)}</span>
            </div>
            {discountAmount > 0 ? (
              <div className="flex justify-between text-sm text-[#1f6a3b]">
                <span className={isTelugu ? "font-telugu" : ""}>{t.couponDiscount}</span>
                <span className="price-figure">- {formatCurrency(discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm text-theme-body">
              <span className={isTelugu ? "font-telugu" : ""}>{t.shipping}</span>
              <span className="price-figure">{formatCurrency(orderData.checkoutData.shipping)}</span>
            </div>
            <div className="border-t border-[#d8e5d8] pt-3">
              <div className="flex justify-between font-heading text-2xl font-bold text-theme-heading">
                <span className={isTelugu ? "font-telugu" : ""}>{t.total}</span>
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
