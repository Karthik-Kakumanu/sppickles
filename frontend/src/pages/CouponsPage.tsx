import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BadgePercent, Ticket } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { getCoupons, type AdminCoupon } from "@/lib/api";
import { translateDynamicText } from "@/lib/translation";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const formatDiscount = (type: "percentage" | "fixed", value: number) =>
  type === "percentage" ? `${value}% OFF` : `₹${Math.round(value)} OFF`;

const couponsCopy = {
  en: {
    seoDescription: "Explore active coupons and apply them during checkout.",
    eyebrow: "Coupons",
    title: "Active Coupon Offers",
    intro:
      "These coupons are managed from the admin dashboard and apply directly in checkout based on product or category rules.",
    emptyTitle: "Sorry, no coupons there.",
    emptyBody: "New offers from admin will show up here automatically.",
    fallbackDescription: "Special discount available.",
    minOrder: "Min order",
    code: "Code",
    checkoutCta: "Go to Checkout to Apply Coupon",
    noExpiry: "Validity: No expiry window",
    now: "Now",
    noEndDate: "No end date",
    validPrefix: "Valid",
    appliesAll: "Applies to: All products",
    appliesCategory: "Applies to",
    appliesProduct: "Applies to product",
    selectedCategory: "Selected category",
    selectedProduct: "Selected product",
    categories: {
      "salted-pickles": "Salted Pickles",
      "tempered-pickles": "Tempered Pickles",
      pickles: "Pickles",
      powders: "Podulu",
      fryums: "Fryums",
    },
  },
  te: {
    seoDescription: "యాక్టివ్ కూపన్లను చూసి చెక్‌అవుట్ సమయంలో అమలు చేయండి.",
    eyebrow: "కూపన్లు",
    title: "యాక్టివ్ కూపన్ ఆఫర్లు",
    intro:
      "ఈ కూపన్లు అడ్మిన్ డ్యాష్‌బోర్డ్ నుంచి నిర్వహించబడతాయి మరియు ఉత్పత్తి లేదా విభాగ నియమాల ఆధారంగా చెక్‌అవుట్‌లో నేరుగా వర్తిస్తాయి.",
    emptyTitle: "క్షమించండి, ప్రస్తుతం కూపన్లు లేవు.",
    emptyBody: "అడ్మిన్ కొత్త ఆఫర్లు జోడించిన వెంటనే ఇక్కడ కనిపిస్తాయి.",
    fallbackDescription: "ప్రత్యేక తగ్గింపు అందుబాటులో ఉంది.",
    minOrder: "కనీస ఆర్డర్",
    code: "కోడ్",
    checkoutCta: "కూపన్ అమలుకు చెక్‌అవుట్‌కి వెళ్లండి",
    noExpiry: "వ్యాలిడిటీ: గడువు లేదు",
    now: "ఇప్పటి నుంచి",
    noEndDate: "ముగింపు తేదీ లేదు",
    validPrefix: "చెల్లుబాటు",
    appliesAll: "వర్తింపు: అన్ని ఉత్పత్తులు",
    appliesCategory: "వర్తింపు",
    appliesProduct: "వర్తింపు ఉత్పత్తి",
    selectedCategory: "ఎంచుకున్న విభాగం",
    selectedProduct: "ఎంచుకున్న ఉత్పత్తి",
    categories: {
      "salted-pickles": "ఉప్పు పచ్చళ్ళు",
      "tempered-pickles": "తాలింపు పచ్చళ్ళు",
      pickles: "పచ్చళ్ళు",
      powders: "పొడులు",
      fryums: "ఫ్రైయమ్స్",
    },
  },
} as const;

const formatCategoryLabel = (
  category: AdminCoupon["targetCategory"],
  copy: (typeof couponsCopy)["en"] | (typeof couponsCopy)["te"],
) => {
  if (category && category in copy.categories) {
    return copy.categories[category as keyof typeof copy.categories];
  }

  return copy.selectedCategory;
};

const getApplicabilityText = (
  coupon: AdminCoupon,
  copy: (typeof couponsCopy)["en"] | (typeof couponsCopy)["te"],
  language: "en" | "te",
) => {
  if (coupon.appliesTo === "all") {
    return copy.appliesAll;
  }

  if (coupon.appliesTo === "category") {
    return `${copy.appliesCategory}: ${formatCategoryLabel(coupon.targetCategory, copy)}`;
  }

  const targetName = coupon.targetProductName || coupon.targetProductId || copy.selectedProduct;
  return `${copy.appliesProduct}: ${translateDynamicText(targetName, language)}`;
};

const formatValidityText = (
  coupon: AdminCoupon,
  copy: (typeof couponsCopy)["en"] | (typeof couponsCopy)["te"],
) => {
  if (!coupon.startsAt && !coupon.endsAt) {
    return copy.noExpiry;
  }

  const startsAt = coupon.startsAt ? new Date(coupon.startsAt).toLocaleDateString() : copy.now;
  const endsAt = coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : copy.noEndDate;
  return `${copy.validPrefix}: ${startsAt} - ${endsAt}`;
};

export default function CouponsPage() {
  const { language } = useLanguage();
  const copy = couponsCopy[language];

  const { data: coupons = [], isLoading, refetch } = useQuery({
    queryKey: ["storefront-coupons"],
    queryFn: getCoupons,
    staleTime: 0,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "sp-coupons-updated-at") {
        void refetch();
      }
    };

    const couponChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("sp-coupons") : null;
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "coupons-updated") {
        void refetch();
      }
    };

    window.addEventListener("storage", handleStorage);
    couponChannel?.addEventListener("message", handleBroadcast);

    const couponEvents = typeof window !== "undefined" ? new EventSource("/api/coupon-events", { withCredentials: true }) : null;
    const handleServerEvent = () => {
      void refetch();
    };

    couponEvents?.addEventListener("coupon-update", handleServerEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      couponChannel?.removeEventListener("message", handleBroadcast);
      couponChannel?.close();
      couponEvents?.removeEventListener("coupon-update", handleServerEvent);
      couponEvents?.close();
    };
  }, [refetch]);

  const activeCoupons = useMemo(
    () => coupons.filter((coupon) => coupon.isActive),
    [coupons],
  );

  return (
    <main className="bg-[var(--color-bg-primary)] pb-8">
      <Seo
        title="SP Traditional Pickles | Coupons"
        description={copy.seoDescription}
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-8`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#956d00]">
            {copy.eyebrow}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-theme-heading sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-theme-body sm:text-base">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className={`${pageWrap} py-8`}>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-[#d8e5d8] bg-white p-5 shadow-[0_12px_30px_rgba(30,79,46,0.08)]"
              >
                <div className="h-7 w-28 animate-pulse rounded-full bg-[#edf5ee]" />
                <div className="mt-4 h-7 w-44 animate-pulse rounded-md bg-[#f3f7f3]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#f3f7f3]" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#f3f7f3]" />
              </div>
            ))}
          </div>
        ) : activeCoupons.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d8e5d8] bg-white px-6 py-10 text-center">
            <Ticket className="mx-auto h-10 w-10 text-[#2f7a43]" />
            <p className="mt-4 text-base font-semibold text-theme-heading">{copy.emptyTitle}</p>
            <p className="mt-2 text-sm text-theme-body">{copy.emptyBody}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {activeCoupons.map((coupon) => (
              <article
                key={coupon.id}
                className="rounded-3xl border border-[#d8e5d8] bg-white p-5 shadow-[0_12px_30px_rgba(30,79,46,0.08)]"
              >
                <p className="inline-flex items-center gap-2 rounded-full bg-[#edf5ee] px-3 py-1 text-xs font-bold text-[#2f7a43]">
                  <BadgePercent className="h-3.5 w-3.5" />
                  {formatDiscount(coupon.discountType, coupon.discountValue)}
                </p>
                <p className="mt-3 text-lg font-bold text-theme-heading">
                  {translateDynamicText(coupon.title, language)}
                </p>
                <p className="mt-1 text-sm text-theme-body">
                  {coupon.description ? translateDynamicText(coupon.description, language) : copy.fallbackDescription}
                </p>
                <div className="mt-3 rounded-xl border border-[#e8ede8] bg-[#fcfdfb] px-3 py-2 text-xs text-theme-body">
                  <p className="font-semibold text-theme-heading">{getApplicabilityText(coupon, copy, language)}</p>
                  {coupon.minOrderAmount !== null ? (
                    <p className="mt-1">{copy.minOrder}: ₹{Math.round(Number(coupon.minOrderAmount))}</p>
                  ) : null}
                  <p className="mt-1">{formatValidityText(coupon, copy)}</p>
                </div>
                <div className="mt-4 rounded-2xl border border-[#e8ede8] bg-[#f8fbf8] px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-body-soft">{copy.code}</p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#1f6a3b]">{coupon.code}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          {!isLoading && activeCoupons.length > 0 ? (
            <Link
              to="/checkout"
              className="inline-flex items-center rounded-full bg-[#2f7a43] px-5 py-3 text-sm font-semibold !text-white shadow-[0_16px_36px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a]"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              {copy.checkoutCta}
            </Link>
          ) : !isLoading ? (
            <p className="text-sm font-semibold text-theme-body">{copy.emptyTitle}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
