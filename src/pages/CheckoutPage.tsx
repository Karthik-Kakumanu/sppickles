import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCreateOrderMutation } from "@/lib/api";
import { getRegionByPincode, validatePincode } from "@/lib/pincode";
import { formatCurrency } from "@/lib/pricing";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

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

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  orderReference?: string;
};

type PlacedOrderState = {
  id: string;
  whatsappUrl: string;
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
  const { cart, subtotal, clearCart } = useStore();
  const { language } = useLanguage();
  const t = content[language];
  const createOrderMutation = useCreateOrderMutation();
  const [form, setForm] = useState<CheckoutForm>(defaultForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderState | null>(null);

  const sanitizedPhone = form.phone.replace(/\D/g, "").slice(0, 10);
  const sanitizedPincode = form.pincode.replace(/\D/g, "").slice(0, 6);
  const isPincodeValid = validatePincode(sanitizedPincode);
  const regionInfo = isPincodeValid ? getRegionByPincode(sanitizedPincode) : null;
  const shipping = form.country === "IN" ? (regionInfo?.shippingCost ?? 0) : 0;
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

  const handleFieldChange =
    (field: keyof CheckoutForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setPlacedOrder(null);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlacedOrder(null);
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage(t.checkout.errors.emptyCart);
      return;
    }

    if (!form.name.trim() || !sanitizedPhone || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.country) {
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

    try {
      const order = await createOrderMutation.mutateAsync({
        name: form.name.trim(),
        phone: sanitizedPhone,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country,
        pincode: sanitizedPincode,
        shipping,
        items: cart.map((line) => ({
          productId: line.productId,
          name: line.product.name,
          quantity: line.quantity,
          weight: line.weight,
          price: line.price,
        })),
      });

      clearCart();
      setForm(defaultForm);
      setPlacedOrder({ id: order.id, whatsappUrl: order.whatsappUrl });

      if (order.whatsappUrl) {
        window.open(order.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to place order.");
    }
  };

  return (
    <main className="bg-[#fffaf4] py-20">
      <Seo
        title="SP Traditional Pickles | Checkout"
        description="Complete your SP Traditional Pickles order with flexible shipping options."
      />

      <section className={pageWrap}>
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b1e1e]">
            {t.checkout.title}
          </p>
          <h1 className="mt-4 font-heading text-5xl font-semibold text-[#241612] md:text-6xl">
            {t.checkout.subtitle}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md"
          >
            <div className="grid gap-6">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#241612]">{t.checkout.name}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleFieldChange("name")}
                  placeholder={t.checkout.namePlaceholder}
                  className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#241612]">{t.checkout.phone}</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleFieldChange("phone")}
                  placeholder={t.checkout.phonePlaceholder}
                  className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#241612]">{t.checkout.address}</span>
                <textarea
                  rows={4}
                  value={form.address}
                  onChange={handleFieldChange("address")}
                  placeholder={t.checkout.addressPlaceholder}
                  className="w-full resize-none rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#241612]">{t.checkout.country}</span>
                <select
                  value={form.country}
                  onChange={(e) => {
                    setForm((current) => ({ ...current, country: e.target.value, state: "", pincode: "" }));
                    setPlacedOrder(null);
                    setErrorMessage("");
                  }}
                  className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>

              {form.country === "IN" ? (
                <>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#241612]">{t.checkout.state}</span>
                    <select
                      value={form.state}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, state: e.target.value }));
                        setPlacedOrder(null);
                        setErrorMessage("");
                      }}
                      className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                    >
                      <option value="">{t.checkout.selectState}</option>
                      {INDIA_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#241612]">{t.checkout.city}</span>
                    <input
                      type="text"
                      value={form.city}
                      onChange={handleFieldChange("city")}
                      placeholder={t.checkout.cityPlaceholder}
                      className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#241612]">{t.checkout.pincode}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleFieldChange("pincode")}
                      placeholder={t.checkout.pincodePlaceholder}
                      className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                    />
                  </label>

                  {sanitizedPincode.length > 0 ? (
                    isPincodeValid && regionInfo ? (
                      <div className="flex items-start gap-3 rounded-2xl bg-[#f2f8f0] px-4 py-4 text-sm text-[#2e6a34]">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">{regionInfo.region}</p>
                          <p className="mt-1">Shipping charge: {formatCurrency(regionInfo.shippingCost)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f1] px-4 py-4 text-sm text-[#8b1e1e]">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Invalid pincode</p>
                          <p className="mt-1">Enter a valid 6-digit pincode to continue.</p>
                        </div>
                      </div>
                    )
                  ) : null}

                  <div className="rounded-2xl bg-[#fff8f3] px-5 py-4 text-sm leading-7 text-[#685448]">
                    All India delivery available. Shipping charged based on pincode.
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[#241612]">{t.checkout.state}</span>
                      <input
                        type="text"
                        value={form.state}
                        onChange={handleFieldChange("state")}
                        placeholder={t.checkout.selectState}
                        className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[#241612]">{t.checkout.city}</span>
                      <input
                        type="text"
                        value={form.city}
                        onChange={handleFieldChange("city")}
                        placeholder={t.checkout.cityPlaceholder}
                        className="w-full rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 text-[#241612] outline-none transition focus:border-[#8b1e1e] focus:bg-white"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl bg-[#fff8f3] px-5 py-4 text-sm leading-7 text-[#685448]">
                    International shipping will be quoted separately after order review.
                  </div>
                </>
              )}
            </div>

            {errorMessage ? (
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#fff5f1] px-4 py-4 text-sm text-[#8b1e1e]">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : null}

            {placedOrder ? (
              <div className="mt-6 rounded-2xl bg-[#f2f8f0] px-5 py-5">
                <div className="flex items-start gap-3 text-sm text-[#2e6a34]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Order {placedOrder.id} placed successfully.</p>
                    <p className="mt-1">
                      WhatsApp should open automatically. If it does not, use the button below.
                    </p>
                  </div>
                </div>
                <a
                  href={placedOrder.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#2e6a34]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#2e6a34] transition hover:bg-[#f8fff7] sm:w-auto"
                >
                  Continue on WhatsApp
                </a>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={createOrderMutation.isPending || cart.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8b1e1e] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#741616] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {createOrderMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {t.checkout.placeOrder}
              </button>
              <Link
                to="/cart"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-4 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef] sm:w-auto"
              >
                {t.cart.browseProducts}
              </Link>
            </div>
          </form>

          <aside className="h-fit rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md">
            <h2 className="font-heading text-3xl font-semibold text-[#241612]">{t.checkout.orderSummary}</h2>

            {cart.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-[#fffaf6] px-6 py-12 text-center">
                <ShoppingBag className="mx-auto h-10 w-10 text-[#8b1e1e]" />
                <p className="mt-4 text-base text-[#685448]">{t.cart.emptyTitle}</p>
                <Link
                  to="/products"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8b1e1e] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#741616]"
                >
                  {t.cart.browseProducts}
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 space-y-4 border-b border-[#eadfd5] pb-8">
                  {orderPreview.map((item) => (
                    <div key={item.key} className="flex justify-between gap-4 text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#241612]">{item.name}</p>
                        <p className="mt-1 text-[#685448]">
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-[#241612]">{formatCurrency(item.totalPrice)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex justify-between text-sm text-[#685448]">
                    <span>{t.checkout.orderSummary}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#685448]">
                    <span>Shipping</span>
                    <span>{form.country === "IN" ? formatCurrency(shipping) : "To be calculated"}</span>
                  </div>
                  <div className="border-t border-[#eadfd5] pt-3">
                    <div className="flex justify-between font-heading text-2xl font-bold text-[#241612]">
                      <span>{t.checkout.total}</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
