import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { calculateShippingByWeight, getRegionByPincode, validatePincode } from "@/lib/pincode";
import { formatCurrency, getWeightMultiplier } from "@/lib/pricing";
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
      "Fill your delivery details, check location on Google Maps, and continue securely to payment.",
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
      "డెలివరీ వివరాలు పూర్తి చేసి, Google Maps‌లో లొకేషన్ చూసి, సురక్షితంగా చెల్లింపుకి వెళ్లండి.",
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
  const totalWeightKg = useMemo(
    () => cart.reduce((sum, line) => sum + getWeightMultiplier(line.weight) * line.quantity, 0),
    [cart],
  );
  const shipping =
    form.country === "IN" && regionInfo
      ? calculateShippingByWeight(regionInfo.shippingRatePerKg, totalWeightKg)
      : 0;
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6 sm:py-4"
              style={{ color: "#ffffff" }}
            >
              <ArrowRight className="h-4 w-4" />
              {t.checkout.placeOrder}
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
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#28683a]"
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
                  <div className="flex justify-between font-heading text-xl font-bold text-theme-heading sm:text-2xl">
                    <span>{t.checkout.total}</span>
                    <span className="price-figure text-[#2f7a43]">{formatCurrency(total)}</span>
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
