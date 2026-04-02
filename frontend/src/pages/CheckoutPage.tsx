import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, MapPin, ShoppingBag } from "lucide-react";
import { getRegionByPincode, validatePincode } from "@/lib/pincode";
import { formatCurrency } from "@/lib/pricing";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";
import { brand } from "@/data/site";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";
const inputClassName =
  "theme-input w-full rounded-2xl border px-4 py-3 outline-none transition focus:border-[#e2b93b] focus:ring-4 focus:ring-[#e2b93b]/10";

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
      "This page is redesigned to feel cleaner and more premium on desktop. Customers can complete address details, confirm the destination on Google Maps, and see the final total update once the pincode is validated.",
    indiaNote:
      "We do not display shipping prices loudly on top of the page. Shipping is added after pincode confirmation so the total feels cleaner and more relevant.",
    intlNote:
      "India orders calculate shipping after pincode validation. USA and overseas orders are reviewed and confirmed separately after checkout.",
    mapTitle: "Address preview on Google Maps",
    mapBody:
      "Use this preview to double-check the delivery location before continuing to the payment page.",
    shippingLabel: "Estimated shipping",
    pendingShipping: "Will update after pincode check",
    summaryNote:
      "Secure packing and leakage-conscious handling remain part of the order experience.",
    backToCart: "Back to Cart",
  },
  te: {
    eyebrow: "చెక్‌అవుట్",
    heading: "ముందు డెలివరీ వివరాలు, తరువాత చెల్లింపు",
    intro:
      "ఈ పేజీని ఇప్పుడు డెస్క్‌టాప్‌లో మరింత శుభ్రంగా, ప్రీమియంగా మార్చాం. కస్టమర్ పూర్తి చిరునామా నమోదు చేసి, Google Maps‌లో లొకేషన్ చూసి, పిన్ కోడ్ ధృవీకరణ తర్వాత మొత్తం మొత్తాన్ని చూడగలడు.",
    indiaNote:
      "షిప్పింగ్ ధరలను పేజీపై పైభాగంలో పెద్దగా చూపడం లేదు. పిన్ కోడ్ నిర్ధారణ తర్వాతే షిప్పింగ్ జత అవుతుంది.",
    intlNote:
      "భారతదేశం ఆర్డర్లకు పిన్ కోడ్ తర్వాత షిప్పింగ్ లెక్కిస్తాం. USA మరియు విదేశీ ఆర్డర్లను చెక్‌అవుట్ తర్వాత ప్రత్యేకంగా నిర్ధారిస్తాం.",
    mapTitle: "Google Maps‌లో చిరునామా ప్రివ్యూ",
    mapBody:
      "చెల్లింపు పేజీకి వెళ్లే ముందు డెలివరీ లొకేషన్ సరైనదేనా అనేది ఇక్కడ చూసుకోండి.",
    shippingLabel: "అంచనా షిప్పింగ్",
    pendingShipping: "పిన్ కోడ్ తర్వాత అప్డేట్ అవుతుంది",
    summaryNote: "సురక్షితమైన ప్యాకింగ్ మరియు లీకేజీ నియంత్రణపై శ్రద్ధ కొనసాగుతుంది.",
    backToCart: "కార్ట్‌కి తిరుగు",
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal } = useStore();
  const { language } = useLanguage();
  const t = content[language];
  const copy = checkoutPageCopy[language];
  const [form, setForm] = useState<CheckoutForm>(defaultForm);
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizedPhone = form.phone.replace(/\D/g, "").slice(0, 10);
  const sanitizedPincode = form.pincode.replace(/\D/g, "").slice(0, 6);
  const isPincodeValid = validatePincode(sanitizedPincode);
  const regionInfo = isPincodeValid ? getRegionByPincode(sanitizedPincode) : null;
  const shipping = form.country === "IN" && regionInfo ? regionInfo.shippingCost : 0;
  const total = subtotal + shipping;

  const orderPreview = useMemo(
    () =>
      cart.map((line) => ({
        key: line.key,
        name: line.product.name,
        weight: line.weight,
        quantity: line.quantity,
        totalPrice: line.totalPrice,
      })),
    [cart],
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

    if (form.country === "IN" && !isPincodeValid) {
      setErrorMessage(t.checkout.errors.invalidPincode);
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
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/payment", { state: { checkoutData } });
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Checkout"
        description="Complete your SP Traditional Pickles order with a cleaner checkout flow."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-6 sm:py-7`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#956d00] sm:px-4 sm:py-2 sm:text-xs">
            {copy.eyebrow}
          </span>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start`}>
        <form onSubmit={handleSubmit} className="section-shell px-7 py-8">
          <div className="space-y-6">
            <div className="rounded-[1.6rem] border border-[#d8e5d8] bg-[#fff9ed] px-5 py-4 text-sm leading-7 text-theme-body">
              {form.country === "IN" ? copy.indiaNote : copy.intlNote}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
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

            <div className="grid gap-5 md:grid-cols-2">
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
              <div className="grid gap-5 md:grid-cols-[1fr_220px]">
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

            {form.country === "IN" && sanitizedPincode.length > 0 ? (
              isPincodeValid && regionInfo ? (
                <div className="flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-[#edf5ee] px-4 py-4 text-sm text-theme-body">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2f7a43]" />
                  <div>
                    <p className="font-semibold text-theme-heading">
                      {language === "te" ? regionInfo.regionTe : regionInfo.region}
                    </p>
                    <p className="mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {language === "te" ? "పిన్ కోడ్ రేంజ్" : "Pincode range"}: {regionInfo.pincodeRange}
                    </p>
                    <p className="mt-2 font-semibold text-theme-heading">
                      {copy.shippingLabel}:{" "}
                      <span className="price-figure text-[#2f7a43]">
                        {formatCurrency(regionInfo.shippingCost)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl border border-[#d9644c]/30 bg-[#fff4f1] px-4 py-4 text-sm text-[#d9644c]">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {language === "te" ? "తప్పు పిన్ కోడ్" : "Invalid pincode"}
                    </p>
                    <p className="mt-1">
                      {language === "te"
                        ? "చెల్లుబాటు అయ్యే 6 అంకెల పిన్ కోడ్ నమోదు చేయండి."
                        : "Enter a valid 6-digit pincode to continue."}
                    </p>
                  </div>
                </div>
              )
            ) : null}

            <div className="rounded-[1.6rem] border border-[#d8e5d8] bg-white p-3">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-theme-heading">
                    {copy.mapTitle}
                  </h2>
                  <p
                    className={`mt-2 text-sm leading-7 text-theme-body ${
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
                  className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-[#edf5ee] px-5 py-3 text-sm font-semibold text-[#2f7a43] transition hover:bg-[#e5f0e7]"
                >
                  {language === "te" ? "మ్యాప్‌లో తెరవండి" : "Open in Google Maps"}
                </a>
              </div>
              <iframe
                title="Delivery address preview"
                src={mapPreviewUrl}
                className="h-[280px] w-full rounded-[1.3rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d9644c]/30 bg-[#fff4f1] px-4 py-4 text-sm text-[#d9644c]">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={cart.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              style={{ color: "#ffffff" }}
            >
              <ArrowRight className="h-4 w-4" />
              {t.checkout.placeOrder}
            </button>
            <Link
              to="/cart"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-6 py-4 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto"
            >
              {copy.backToCart}
            </Link>
          </div>
        </form>

        <aside className="section-shell h-fit px-7 py-8 lg:sticky lg:top-36">
          <h2 className="font-heading text-3xl font-semibold text-theme-heading">
            {t.checkout.orderSummary}
          </h2>

          {cart.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-theme-heading" />
              <p className="mt-4 text-base text-theme-body">{t.cart.emptyTitle}</p>
              <Link
                to="/products"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#28683a]"
              >
                {t.cart.browseProducts}
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4 border-b border-[#d8e5d8] pb-8">
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

              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-sm text-theme-body">
                  <span>{language === "te" ? "ఉప మొత్తం" : "Subtotal"}</span>
                  <span className="price-figure">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-theme-body">
                  <span>{copy.shippingLabel}</span>
                  <span className={form.country === "IN" && regionInfo ? "price-figure" : undefined}>
                    {form.country === "IN" && regionInfo
                      ? formatCurrency(shipping)
                      : copy.pendingShipping}
                  </span>
                </div>
                <div className="border-t border-[#d8e5d8] pt-3">
                  <div className="flex justify-between font-heading text-2xl font-bold text-theme-heading">
                    <span>{t.checkout.total}</span>
                    <span className="price-figure text-[#2f7a43]">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] px-5 py-4 text-sm leading-7 text-theme-body">
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
