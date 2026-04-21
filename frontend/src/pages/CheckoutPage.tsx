import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { calculateShippingByWeight, getRegionByState, validatePincode } from "@/lib/pincode";
import { formatCurrency, getWeightMultiplier } from "@/lib/pricing";
import { getEligibleSubtotalForCoupon } from "@/lib/couponPricing";
import { getCoupons, type AdminCoupon } from "@/lib/api";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import WhatsAppLogo from "@/components/WhatsAppLogo";
import { content } from "@/content/translations";
import { brand } from "@/data/site";
import { getDynamicProductName } from "@/lib/translation";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";
const inputClassName =
  "theme-input w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#e2b93b] focus:ring-4 focus:ring-[#e2b93b]/10";
const BULK_ORDER_WEIGHT_LIMIT_KG = 10;

const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "UAE", name: "United Arab Emirates" },
];

const INDIA_LOCATIONS = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const checkoutPageCopy = {
  en: {
    eyebrow: "Checkout",
    heading: "Delivery details first, payment next",
    intro:
      "Fill your delivery details, check location on Google Maps, and continue securely to payment.",
    mapTitle: "Address preview on Google Maps",
    mapBody:
      "Use this preview to double-check the delivery location before continuing to the payment page.",
    shippingLabel: "Estimated shipping",
    pendingShipping: "Will update after state selection",
    summaryNote:
      "Secure packing and leakage-conscious handling remain part of the order experience.",
    backToCart: "Back to Cart",
  },
  te: {
    eyebrow: "చెక్‌అవుట్",
    heading: "ముందు డెలివరీ వివరాలు, తరువాత చెల్లింపు",
    intro:
      "డెలివరీ వివరాలు పూర్తి చేసి, Google Maps‌లో లొకేషన్ చూసి, సురక్షితంగా చెల్లింపుకి వెళ్లండి.",
    mapTitle: "Google Maps‌లో చిరునామా ప్రివ్యూ",
    mapBody:
      "చెల్లింపు పేజీకి వెళ్లే ముందు డెలివరీ లొకేషన్ సరైనదేనా అనేది ఇక్కడ చూసుకోండి.",
    shippingLabel: "అంచనా షిప్పింగ్",
    pendingShipping: "రాష్ట్రం ఎంచుకున్న తర్వాత అప్డేట్ అవుతుంది",
    summaryNote: "సురక్షితమైన ప్యాకింగ్ మరియు లీకేజీ నియంత్రణపై శ్రద్ధ కొనసాగుతుంది.",
    backToCart: "కార్ట్‌కి తిరుగు",
  },
} as const;

const checkoutUiCopy = {
  en: {
    couponLabel: "Coupon",
    viewCoupons: "View coupons",
    couponInputPlaceholder: "Enter coupon code",
    apply: "Apply",
    remove: "Remove",
    appliedPrefix: "Applied:",
    activeCoupons: (count: number) => `${count} active coupon${count === 1 ? "" : "s"} available.`,
    couponHelp: "Coupon discounts apply only to eligible items. Shipping is never discounted.",
    couponDiscount: "Coupon discount",
    enterCoupon: "Enter a coupon code.",
    invalidCoupon: "Coupon code is invalid or inactive.",
    minOrderRequired: (amount: number) => `Minimum order ${formatCurrency(amount)} required for this coupon.`,
    notApplicable: "This coupon does not apply to the selected products.",
    appliedSuccess: (code: string) => `Coupon ${code} applied successfully.`,
    removedSuccess: "Coupon removed.",
    subtotal: "Subtotal",
  },
  te: {
    couponLabel: "కూపన్",
    viewCoupons: "కూపన్లు చూడండి",
    couponInputPlaceholder: "కూపన్ కోడ్ నమోదు చేయండి",
    apply: "అమలు చేయండి",
    remove: "తొలగించండి",
    appliedPrefix: "అమలులో ఉంది:",
    activeCoupons: (count: number) => `${count} యాక్టివ్ కూపన్${count === 1 ? "" : "లు"} అందుబాటులో ఉన్నాయి.`,
    couponHelp: "కూపన్ తగ్గింపు వర్తించే ఉత్పత్తులకే వర్తిస్తుంది. షిప్పింగ్‌పై తగ్గింపు ఉండదు.",
    couponDiscount: "కూపన్ తగ్గింపు",
    enterCoupon: "కూపన్ కోడ్ నమోదు చేయండి.",
    invalidCoupon: "కూపన్ కోడ్ చెల్లదు లేదా యాక్టివ్‌లో లేదు.",
    minOrderRequired: (amount: number) => `ఈ కూపన్‌కి కనీస ఆర్డర్ ${formatCurrency(amount)} అవసరం.`,
    notApplicable: "ఈ కూపన్ ఎంచుకున్న ఉత్పత్తులకు వర్తించదు.",
    appliedSuccess: (code: string) => `${code} కూపన్ విజయవంతంగా అమలైంది.`,
    removedSuccess: "కూపన్ తొలగించబడింది.",
    subtotal: "ఉప మొత్తం",
  },
} as const;

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

const defaultForm: CheckoutForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "IN",
  pincode: "",
};

const isCouponActiveNow = (coupon: AdminCoupon) => {
  const now = Date.now();
  const startsAt = coupon.startsAt ? new Date(coupon.startsAt).getTime() : null;
  const endsAt = coupon.endsAt ? new Date(coupon.endsAt).getTime() : null;

  if (startsAt !== null && Number.isFinite(startsAt) && now < startsAt) {
    return false;
  }

  if (endsAt !== null && Number.isFinite(endsAt) && now > endsAt) {
    return false;
  }

  return coupon.isActive;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal } = useStore();
  const { language } = useLanguage();
  const t = content[language];
  const copy = checkoutPageCopy[language];
  const ui = checkoutUiCopy[language];
  const [form, setForm] = useState<CheckoutForm>(defaultForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState("");

  const { data: coupons = [], refetch: refetchCoupons } = useQuery({
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
        void refetchCoupons();
      }
    };

    const couponChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("sp-coupons") : null;
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "coupons-updated") {
        void refetchCoupons();
      }
    };

    window.addEventListener("storage", handleStorage);
    couponChannel?.addEventListener("message", handleBroadcast);

    const couponEvents = typeof window !== "undefined" ? new EventSource("/api/coupon-events", { withCredentials: true }) : null;
    const handleServerEvent = () => {
      void refetchCoupons();
    };

    couponEvents?.addEventListener("coupon-update", handleServerEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      couponChannel?.removeEventListener("message", handleBroadcast);
      couponChannel?.close();
      couponEvents?.removeEventListener("coupon-update", handleServerEvent);
      couponEvents?.close();
    };
  }, [refetchCoupons]);

  const sanitizedPhone = form.phone.replace(/\D/g, "").slice(0, 10);
  const sanitizedPincode = form.pincode.replace(/\D/g, "").slice(0, 6);
  const isPincodeValid = validatePincode(sanitizedPincode);
  const regionInfo = form.country === "IN" && form.state.trim() ? getRegionByState(form.state) : null;
  const totalWeightKg = useMemo(
    () => cart.reduce((sum, line) => sum + getWeightMultiplier(line.weight) * line.quantity, 0),
    [cart],
  );
  const isBulkOrder = totalWeightKg > BULK_ORDER_WEIGHT_LIMIT_KG;
  const shipping =
    form.country === "IN" && regionInfo
      ? calculateShippingByWeight(regionInfo.shippingRatePerKg, totalWeightKg)
      : 0;
  const activeCoupons = useMemo(() => coupons.filter(isCouponActiveNow), [coupons]);
  const appliedCoupon = useMemo(
    () => activeCoupons.find((coupon) => coupon.code === appliedCouponCode) ?? null,
    [activeCoupons, appliedCouponCode],
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    if (appliedCoupon.minOrderAmount !== null && subtotal < Number(appliedCoupon.minOrderAmount)) {
      return 0;
    }

    const eligibleSubtotal = getEligibleSubtotalForCoupon(appliedCoupon, cart);

    if (eligibleSubtotal <= 0) {
      return 0;
    }

    let discount =
      appliedCoupon.discountType === "percentage"
        ? Math.round((eligibleSubtotal * Number(appliedCoupon.discountValue)) / 100)
        : Math.round(Number(appliedCoupon.discountValue));

    return Math.max(0, Math.min(discount, eligibleSubtotal));
  }, [appliedCoupon, cart, subtotal]);

  const total = Math.max(0, subtotal + shipping - discountAmount);

  const orderPreview = useMemo(
    () =>
      cart.map((line) => ({
        key: line.key,
        name: getDynamicProductName(line.product, language),
        weight: line.weight,
        quantity: line.quantity,
        totalPrice: line.totalPrice,
      })),
    [cart, language],
  );

  const mapQuery = [form.address, form.city, form.state, sanitizedPincode]
    .filter(Boolean)
    .join(", ");
  const mapPreviewUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : brand.mapEmbedUrl;
  const mapSearchUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : brand.mapUrl;
  const bulkOrderWhatsappText = useMemo(() => {
    const lines = [
      language === "te"
        ? "నమస్కారం, నాకు 10 కిలోల పైబడి బల్క్ ఆర్డర్ ఉంది. షిప్పింగ్ ధరను WhatsApp‌లో చర్చించాలి."
        : "Hello, I have a bulk order above 10 kg. I would like to discuss the shipping price on WhatsApp.",
      "",
      language === "te" ? "ఆర్డర్ వివరాలు:" : "Order details:",
      `- ${language === "te" ? "పేరు" : "Name"}: ${form.name.trim()}`,
      `- ${language === "te" ? "ఫోన్" : "Phone"}: ${sanitizedPhone}`,
      `- ${language === "te" ? "చిరునామా" : "Address"}: ${form.address.trim()}`,
      `- ${language === "te" ? "నగరం" : "City"}: ${form.city.trim()}`,
      `- ${language === "te" ? "రాష్ట్రం" : "State"}: ${form.state.trim()}`,
      form.country === "IN"
        ? `- ${language === "te" ? "పిన్ కోడ్" : "Pincode"}: ${sanitizedPincode}`
        : null,
      "",
      language === "te" ? "కార్ట్‌లోని ఉత్పత్తులు:" : "Products in cart:",
      ...cart.map(
        (line) =>
          `- ${getDynamicProductName(line.product, language)} (${line.weight}) x ${line.quantity} = ${formatCurrency(line.totalPrice)}`,
      ),
      "",
      `- ${language === "te" ? "మొత్తం బరువు" : "Total weight"}: ${totalWeightKg.toFixed(2)} kg`,
      `- ${language === "te" ? "ఉప మొత్తం" : "Subtotal"}: ${formatCurrency(subtotal)}`,
      `- ${language === "te" ? "గమనిక" : "Note"}: ${language === "te" ? "10 కిలోల పైబడి ఆర్డర్లకు తుది షిప్పింగ్ ధర వాట్సాప్‌లో నిర్ణయించబడుతుంది." : "Final shipping price for orders above 10 kg will be confirmed on WhatsApp."}`,
      "",
      `${language === "te" ? "వాట్సాప్" : "WhatsApp"}: ${brand.whatsappDisplay}`,
    ];

    return lines.filter(Boolean).join("\n");
  }, [cart, form.address, form.city, form.country, form.name, form.pincode, form.state, language, sanitizedPincode, sanitizedPhone, subtotal, totalWeightKg]);
  const bulkOrderWhatsappUrl = useMemo(
    () => `${brand.whatsappUrl}?text=${encodeURIComponent(bulkOrderWhatsappText)}`,
    [bulkOrderWhatsappText],
  );

  const handleFieldChange =
    (field: keyof CheckoutForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setErrorMessage("");

      if (field === "phone") {
        setForm((current) => ({ ...current, phone: value.replace(/\D/g, "").slice(0, 10) }));
        return;
      }

      if (field === "pincode") {
        setForm((current) => ({ ...current, pincode: value.replace(/\D/g, "").slice(0, 6) }));
        return;
      }

      setForm((current) => ({ ...current, [field]: value }));
    };

  const handleApplyCoupon = () => {
    const normalizedCode = couponInput.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponMessage(ui.enterCoupon);
      return;
    }

    const coupon = activeCoupons.find((item) => item.code === normalizedCode);

    if (!coupon) {
      setCouponMessage(ui.invalidCoupon);
      setAppliedCouponCode(null);
      return;
    }

    if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
      setCouponMessage(ui.minOrderRequired(Number(coupon.minOrderAmount)));
      setAppliedCouponCode(null);
      return;
    }

    const eligibleSubtotal = getEligibleSubtotalForCoupon(coupon, cart);

    if (eligibleSubtotal <= 0) {
      setCouponMessage(ui.notApplicable);
      setAppliedCouponCode(null);
      return;
    }

    setAppliedCouponCode(coupon.code);
    setCouponMessage(ui.appliedSuccess(coupon.code));
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(null);
    setCouponInput("");
    setCouponMessage(ui.removedSuccess);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage(t.checkout.errors.emptyCart);
      return;
    }

    if (
      !form.name.trim() ||
      !sanitizedPhone ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.country
    ) {
      setErrorMessage(t.checkout.errors.required);
      return;
    }

    if (!/^\d{10}$/.test(sanitizedPhone)) {
      setErrorMessage(t.checkout.errors.invalidPhone);
      return;
    }

    if (form.country === "IN" && !sanitizedPincode) {
      setErrorMessage(t.checkout.errors.invalidPincode);
      return;
    }

    if (form.country === "IN" && !form.state.trim()) {
      setErrorMessage(t.checkout.errors.invalidState);
      return;
    }

    if (form.country === "IN" && sanitizedPincode && !isPincodeValid) {
      setErrorMessage(t.checkout.errors.invalidPincode);
      return;
    }

    if (isBulkOrder) {
      window.open(bulkOrderWhatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const checkoutData = {
      name: form.name.trim(),
      phone: sanitizedPhone,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country,
      pincode: sanitizedPincode,
      shipping,
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code ?? null,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/payment", { state: { checkoutData } });
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Checkout"
        description="Complete your SP Traditional Pickles order with a cleaner checkout flow."
        noIndex
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-6 sm:py-7`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#956d00] sm:px-4 sm:py-2 sm:text-xs">
            {copy.eyebrow}
          </span>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-5 py-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-7 lg:py-8`}>
        <form onSubmit={handleSubmit} className="section-shell px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-4 sm:space-y-5">

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-theme-heading">{t.checkout.name}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleFieldChange("name")}
                  placeholder={t.checkout.namePlaceholder}
                  className={inputClassName}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-theme-heading">{t.checkout.phone}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleFieldChange("phone")}
                  placeholder={t.checkout.phonePlaceholder}
                  className={inputClassName}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-theme-heading">{t.checkout.address}</span>
              <textarea
                rows={4}
                value={form.address}
                onChange={handleFieldChange("address")}
                placeholder={t.checkout.addressPlaceholder}
                className={`${inputClassName} resize-none`}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-theme-heading">{t.checkout.country}</span>
                <select
                  value={form.country}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      country: event.target.value,
                      state: "",
                      pincode: "",
                    }));
                    setErrorMessage("");
                  }}
                  className={inputClassName}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-theme-heading">{t.checkout.city}</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={handleFieldChange("city")}
                  placeholder={t.checkout.cityPlaceholder}
                  className={inputClassName}
                />
              </label>
            </div>

            {form.country === "IN" ? (
              <div className="grid gap-4 md:grid-cols-[1fr_200px]">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-theme-heading">{t.checkout.state}</span>
                  <select
                    value={form.state}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, state: event.target.value }));
                      setErrorMessage("");
                    }}
                    className={inputClassName}
                  >
                    <option value="">{t.checkout.selectState}</option>
                    {INDIA_LOCATIONS.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-theme-heading">{t.checkout.pincode}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={form.pincode}
                    onChange={handleFieldChange("pincode")}
                    placeholder={t.checkout.pincodePlaceholder}
                    className={inputClassName}
                  />
                </label>
              </div>
            ) : (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-theme-heading">{t.checkout.state}</span>
                <input
                  type="text"
                  value={form.state}
                  onChange={handleFieldChange("state")}
                  placeholder={t.checkout.selectState}
                  className={inputClassName}
                />
              </label>
            )}

            <div className="rounded-[1.4rem] border border-[#d8e5d8] bg-[#f8fbf8] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-body-soft">{ui.couponLabel}</p>
                <Link
                  to="/coupons"
                  className="inline-flex items-center rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-[#2f7a43] transition hover:bg-[#edf5ee]"
                >
                  {ui.viewCoupons}
                </Link>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                  placeholder={ui.couponInputPlaceholder}
                  className={`${inputClassName} flex-1 bg-white uppercase`}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="inline-flex items-center justify-center rounded-full bg-[#2f7a43] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#28683a]"
                >
                  {ui.apply}
                </button>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-5 py-3 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee]"
                  >
                    {ui.remove}
                  </button>
                ) : null}
              </div>

              {appliedCoupon ? (
                <p className="mt-3 text-sm font-semibold text-[#1f6a3b]">
                  {ui.appliedPrefix} {appliedCoupon.code}
                </p>
              ) : null}

              {coupons.length > 0 ? (
                <p className="mt-2 text-xs text-theme-body-soft">
                  {ui.activeCoupons(coupons.filter(isCouponActiveNow).length)}
                </p>
              ) : null}

              {couponMessage ? <p className="mt-2 text-sm text-theme-body">{couponMessage}</p> : null}
              <p className="mt-2 text-xs leading-6 text-theme-body-soft">
                {ui.couponHelp}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-[#d8e5d8] bg-white p-2.5 sm:p-3">
              <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-theme-heading sm:text-2xl">
                    {copy.mapTitle}
                  </h2>
                  <p
                    className={`mt-1.5 text-xs leading-6 text-theme-body sm:text-sm sm:leading-7 ${
                      language === "te" ? "font-telugu" : ""
                    }`}
                  >
                    {copy.mapBody}
                  </p>
                </div>
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-[#edf5ee] px-4 py-2.5 text-xs font-semibold text-[#2f7a43] transition hover:bg-[#e5f0e7] sm:px-5 sm:py-3 sm:text-sm"
                >
                  {language === "te" ? "మ్యాప్‌లో తెరవండి" : "Open in Google Maps"}
                </a>
              </div>
              <iframe
                title="Delivery address preview"
                src={mapPreviewUrl}
                className="h-[210px] w-full rounded-[1.1rem] sm:h-[280px] sm:rounded-[1.3rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {isBulkOrder ? (
              <div className="rounded-[1.4rem] border border-[#e2b93b]/30 bg-[#fff9ed] px-4 py-4 text-sm leading-7 text-[#8a6400] sm:px-5 sm:py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#956d00]">
                  {t.checkout.bulkOrderNoticeTitle}
                </p>
                <p className={`mt-2 ${language === "te" ? "font-telugu" : ""}`}>
                  {t.checkout.bulkOrderNotice}
                </p>
                <div className="mt-4 rounded-2xl border border-[#f1d28d] bg-white px-4 py-3 text-xs text-theme-body">
                  <p className="font-semibold uppercase tracking-[0.18em] text-theme-body-soft">
                    {t.checkout.bulkOrderWhatsappLabel}
                  </p>
                  <a
                    href={bulkOrderWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 font-semibold text-[#2f7a43] transition hover:text-[#245f33]"
                  >
                    <WhatsAppLogo className="h-4 w-4" />
                    {brand.whatsappDisplay}
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d9644c]/30 bg-[#fff4f1] px-4 py-4 text-sm text-[#d9644c]">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
            <button
              type="submit"
              disabled={cart.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold !text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6 sm:py-4"
              style={{ color: "#ffffff" }}
            >
              {isBulkOrder ? <WhatsAppLogo className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              {isBulkOrder ? t.checkout.bulkOrderCta : t.checkout.placeOrder}
            </button>
            <Link
              to="/cart"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-5 py-3.5 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto sm:px-6 sm:py-4"
            >
              {copy.backToCart}
            </Link>
          </div>
        </form>

        <aside className="section-shell h-fit px-5 py-6 lg:sticky lg:top-36 sm:px-6 sm:py-7">
          <h2 className="font-heading text-2xl font-semibold text-theme-heading sm:text-3xl">
            {t.checkout.orderSummary}
          </h2>

          {cart.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-theme-heading" />
              <p className="mt-4 text-base text-theme-body">{t.cart.emptyTitle}</p>
              <Link
                to="/products"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold !text-white transition hover:bg-[#28683a]"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              >
                {t.cart.browseProducts}
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-3 border-b border-[#d8e5d8] pb-6 sm:mt-8 sm:space-y-4 sm:pb-8">
                {orderPreview.map((item) => (
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

              <div className="mt-6 space-y-3 sm:mt-8">
                <div className="flex justify-between text-sm text-theme-body">
                  <span>{ui.subtotal}</span>
                  <span className="price-figure">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-theme-body">
                  <span>{copy.shippingLabel}</span>
                  <span
                    className={
                      isBulkOrder || form.country !== "IN" || !regionInfo ? undefined : "price-figure"
                    }
                  >
                    {isBulkOrder
                      ? t.checkout.bulkOrderShipping
                      : form.country === "IN" && regionInfo
                        ? formatCurrency(shipping)
                        : copy.pendingShipping}
                  </span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex justify-between text-sm text-[#1f6a3b]">
                    <span>{ui.couponDiscount}</span>
                    <span className="price-figure">- {formatCurrency(discountAmount)}</span>
                  </div>
                ) : null}
                <div className="border-t border-[#d8e5d8] pt-3">
                  <div className="flex justify-between font-heading text-xl font-bold text-theme-heading sm:text-2xl">
                    <span>{t.checkout.total}</span>
                    <span className={isBulkOrder ? "text-[#956d00]" : "price-figure text-[#2f7a43]"}>
                      {isBulkOrder ? t.checkout.bulkOrderTotal : formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] px-4 py-3 text-xs leading-6 text-theme-body sm:mt-6 sm:px-5 sm:py-4 sm:text-sm sm:leading-7">
                {copy.summaryNote}
              </div>
            </>
          )}
        </aside>
      </section>
    </main>
  );
};

export default CheckoutPage;
