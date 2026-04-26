import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, Loader2, ShieldAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { cancelOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

type LocationState = {
  orderId?: string;
  phone?: string;
};

const pageCopy = {
  en: {
    seoTitle: "SP Traditional Pickles | Cancel Order",
    seoDescription: "Cancel your order within 6 hours of purchase.",
    badge: "Cancellation window",
    title: "Cancel an order within 6 hours",
    intro:
      "Once 6 hours pass after purchase, the order is locked for packing and delivery. If your order is still eligible, enter the order ID and phone number used at checkout.",
    panelTitle: "Order cancellation",
    successTitle: "Order cancelled",
    successBody:
      "Your request has been recorded. If the payment was captured, the refund process has been initiated and will be completed shortly.",
    refundHint:
      "For prepaid orders, Razorpay or payment gateway charges may apply as per policy. The remaining eligible amount is usually credited within 1 working day, depending on bank timelines.",
    orderId: "Order ID",
    status: "Status",
    paymentStatus: "Payment status",
    total: "Total",
    pending: "pending",
    backHome: "Back to home",
    continueShopping: "Continue shopping",
    phoneNumber: "Phone number",
    reason: "Reason for cancellation",
    optional: "Optional",
    warning:
      "Orders can only be cancelled within 6 hours of purchase. Once the window expires, the order stays active for packing and dispatch.",
    submit: "Cancel order",
    genericError: "Unable to cancel order.",
    afterCancelTitle: "What happens after cancel?",
    afterCancelPoints: [
      "The order status becomes cancelled and remains available in your order records.",
      "If the payment was captured, a Razorpay refund is initiated from the order record.",
      "Razorpay or gateway charges may apply as per policy, and the remaining eligible amount is typically credited within 1 working day.",
      "Refund tracking is saved on the order so completion can be verified if needed.",
    ],
  },
  te: {
    seoTitle: "SP Traditional Pickles | ఆర్డర్ రద్దు",
    seoDescription: "కొనుగోలు చేసిన 6 గంటల లోపు మీ ఆర్డర్‌ను రద్దు చేయండి.",
    badge: "రద్దు గడువు",
    title: "6 గంటల లోపు ఆర్డర్‌ను రద్దు చేయండి",
    intro:
      "కొనుగోలు చేసిన తర్వాత 6 గంటలు దాటితే ఆర్డర్ ప్యాకింగ్ మరియు డెలివరీ కోసం లాక్ అవుతుంది. మీ ఆర్డర్ ఇంకా అర్హతలో ఉంటే, చెకౌట్ సమయంలో ఉపయోగించిన ఆర్డర్ ID మరియు ఫోన్ నంబర్ నమోదు చేయండి.",
    panelTitle: "ఆర్డర్ రద్దు",
    successTitle: "ఆర్డర్ రద్దు అయింది",
    successBody:
      "మీ అభ్యర్థన నమోదు అయింది. చెల్లింపు ఇప్పటికే క్యాప్చర్ అయితే, రీఫండ్ ప్రక్రియ ప్రారంభమై త్వరలో పూర్తవుతుంది.",
    refundHint:
      "ప్రీపెయిడ్ ఆర్డర్‌లకు Razorpay లేదా పేమెంట్ గేట్‌వే ఛార్జీలు పాలసీ ప్రకారం వర్తించవచ్చు. మిగిలిన అర్హమైన మొత్తం సాధారణంగా 1 పని దినంలో జమ అవుతుంది; బ్యాంక్ సమయం మారవచ్చు.",
    orderId: "ఆర్డర్ ID",
    status: "స్థితి",
    paymentStatus: "చెల్లింపు స్థితి",
    total: "మొత్తం",
    pending: "పెండింగ్",
    backHome: "హోమ్‌కు తిరుగు",
    continueShopping: "ఇంకా కొనుగోలు చేయండి",
    phoneNumber: "ఫోన్ నంబర్",
    reason: "రద్దు కారణం",
    optional: "ఐచ్ఛికం",
    warning:
      "కొనుగోలు చేసిన 6 గంటల లోపు మాత్రమే ఆర్డర్‌ను రద్దు చేయవచ్చు. ఆ గడువు దాటితే ఆర్డర్ ప్యాకింగ్ మరియు పంపిణీ కోసం యాక్టివ్‌గా ఉంటుంది.",
    submit: "ఆర్డర్ రద్దు చేయండి",
    genericError: "ఆర్డర్‌ను రద్దు చేయలేకపోయాం.",
    afterCancelTitle: "రద్దు చేసిన తర్వాత ఏమవుతుంది?",
    afterCancelPoints: [
      "ఆర్డర్ స్థితి రద్దయింది అని మారుతుంది మరియు మీ ఆర్డర్ రికార్డుల్లో అలాగే కనిపిస్తుంది.",
      "చెల్లింపు క్యాప్చర్ అయితే, ఆర్డర్ రికార్డ్‌ నుంచి Razorpay రీఫండ్ ప్రారంభమవుతుంది.",
      "పాలసీ ప్రకారం చార్జీలు వర్తించవచ్చు; మిగిలిన అర్హమైన మొత్తం సాధారణంగా 1 పని దినంలో జమ అవుతుంది.",
      "రీఫండ్ ట్రాకింగ్ ఆర్డర్‌లోనే భద్రపరచబడుతుంది కాబట్టి అవసరమైతే తర్వాత తనిఖీ చేయవచ్చు.",
    ],
  },
} as const;

const CancelOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = pageCopy[language];
  const isTe = language === "te";
  const locationState = (location.state as LocationState | null) ?? null;

  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [cancelledOrder, setCancelledOrder] = useState<any | null>(null);

  useEffect(() => {
    if (locationState?.orderId) {
      setOrderId(locationState.orderId);
    }
    if (locationState?.phone) {
      setPhone(locationState.phone);
    }
  }, [locationState?.orderId, locationState?.phone]);

  const cancelMutation = useMutation({
    mutationFn: async () => cancelOrder(orderId.trim(), phone.trim(), reason.trim() || undefined),
    onSuccess: (order) => {
      setCancelledOrder(order);
    },
  });

  const canSubmit = useMemo(() => orderId.trim().length > 0 && phone.replace(/\D/g, "").length >= 10, [orderId, phone]);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f2e8_0%,#eef7ef_100%)]">
      <Seo title={t.seoTitle} description={t.seoDescription} noIndex />

      <section className="border-b border-[#d8e5d8] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(255,249,233,0.98))]">
        <div className={`${pageWrap} py-10 sm:py-14`}>
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e7cf91] bg-white/90 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#8a651a] shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1 className={`mt-5 font-heading text-3xl font-semibold tracking-[-0.03em] text-theme-heading md:text-5xl ${isTe ? "font-telugu" : ""}`}>
              {t.title}
            </h1>
            <p className={`mt-4 max-w-3xl text-sm leading-7 text-theme-body md:text-base ${isTe ? "font-telugu" : ""}`}>
              {t.intro}
            </p>
          </div>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-6 py-10 lg:grid-cols-[1fr_0.9fr]`}>
        <article className="section-shell h-fit px-7 py-8 shadow-[0_18px_42px_rgba(34,73,47,0.08)]">
          <div className="flex items-center gap-3 text-[#8a651a]">
            <Clock3 className="h-5 w-5" />
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${isTe ? "font-telugu" : ""}`}>{t.panelTitle}</p>
          </div>

          {cancelledOrder ? (
            <div className="mt-6 rounded-[1.4rem] border border-[#bfe0c7] bg-[#f2fbf4] p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#1f7a4d]" />
                <div>
                  <h2 className={`text-xl font-bold text-theme-heading ${isTe ? "font-telugu" : ""}`}>{t.successTitle}</h2>
                  <p className={`mt-2 text-sm leading-7 text-theme-body ${isTe ? "font-telugu" : ""}`}>{t.successBody}</p>
                  <div className={`mt-3 rounded-xl border border-[#e7cf91] bg-[#fff9eb] p-3 text-sm leading-7 text-theme-body ${isTe ? "font-telugu" : ""}`}>
                    {t.refundHint}
                  </div>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <dt className={`text-theme-body-soft ${isTe ? "font-telugu" : ""}`}>{t.orderId}</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{cancelledOrder.id}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className={`text-theme-body-soft ${isTe ? "font-telugu" : ""}`}>{t.status}</dt>
                  <dd className={`mt-1 font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>{cancelledOrder.status}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className={`text-theme-body-soft ${isTe ? "font-telugu" : ""}`}>{t.paymentStatus}</dt>
                  <dd className={`mt-1 font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>{cancelledOrder.paymentStatus ?? t.pending}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className={`text-theme-body-soft ${isTe ? "font-telugu" : ""}`}>{t.total}</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{formatCurrency(Number(cancelledOrder.total ?? 0))}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-full bg-[#2f7a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28683a]"
                >
                  {t.backHome}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="rounded-full border border-[#d8e5d8] bg-white px-5 py-3 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee]"
                >
                  {t.continueShopping}
                </button>
              </div>
            </div>
          ) : (
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSubmit || cancelMutation.isPending) {
                  return;
                }
                cancelMutation.mutate();
              }}
            >
              <div>
                <label htmlFor="cancel-order-id" className={`block text-sm font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>
                  {t.orderId}
                </label>
                <input
                  id="cancel-order-id"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  placeholder="SPP-..."
                  className="mt-2 w-full rounded-2xl border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43]"
                />
              </div>

              <div>
                <label htmlFor="cancel-phone" className={`block text-sm font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>
                  {t.phoneNumber}
                </label>
                <input
                  id="cancel-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={isTe ? "10 అంకెల మొబైల్ నంబర్" : "10-digit mobile number"}
                  className="mt-2 w-full rounded-2xl border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43]"
                />
              </div>

              <div>
                <label htmlFor="cancel-reason" className={`block text-sm font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>
                  {t.reason}
                </label>
                <textarea
                  id="cancel-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={4}
                  placeholder={t.optional}
                  className="mt-2 w-full rounded-[1.2rem] border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43]"
                />
              </div>

              <div className={`rounded-[1.4rem] border border-[#e7cf91] bg-[#fff9eb] p-4 text-sm leading-7 text-theme-body ${isTe ? "font-telugu" : ""}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8a651a]" />
                  <p>{t.warning}</p>
                </div>
              </div>

              {cancelMutation.isError ? (
                <div className={`rounded-[1.2rem] border border-[#f0c8bf] bg-[#fff0eb] p-4 text-sm text-[#b64d39] ${isTe ? "font-telugu" : ""}`}>
                  {cancelMutation.error instanceof Error ? cancelMutation.error.message : t.genericError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit || cancelMutation.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-[#8a651a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#735416] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                {t.submit}
              </button>
            </form>
          )}
        </article>

        <aside className="section-shell h-fit px-7 py-8">
          <h2 className={`font-heading text-2xl font-semibold text-theme-heading ${isTe ? "font-telugu" : ""}`}>{t.afterCancelTitle}</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-theme-body">
            {t.afterCancelPoints.map((point) => (
              <li key={point} className={`rounded-2xl bg-[#f7fbf8] p-4 ${isTe ? "font-telugu" : ""}`}>{point}</li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
};

export default CancelOrderPage;
