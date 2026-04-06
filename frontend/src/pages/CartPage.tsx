import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { formatCurrency } from "@/lib/pricing";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const cartCopy = {
  en: {
    eyebrow: "Cart",
    title: "A cleaner cart that still encourages customers to add more",
    intro:
      "The cart should not feel like the end of the journey. It should reassure the customer, show the selected products clearly, and still encourage a few more additions before checkout.",
    clear: "Clear Cart",
    selectedWeight: "Selected weight",
    quantity: "Quantity",
    lineTotal: "Line Total",
    orderSummary: "Order Summary",
    shipping: "Shipping added in checkout after pincode confirmation",
    continueToCheckout: "Continue to Checkout",
    continueShopping: "Continue Shopping",
    emptyTitle: "Your cart is still waiting",
    emptyDescription:
      "Browse the store collections and add your preferred pickles, podulu, and fryums to start the order.",
    suggestionsEyebrow: "Add more before checkout",
    suggestionsTitle: "Customers usually add one more favourite from here",
  },
  te: {
    eyebrow: "కార్ట్",
    title: "ఇంకా కొన్ని ఉత్పత్తులు జోడించాలని ప్రోత్సహించే శుభ్రమైన కార్ట్",
    intro:
      "కార్ట్ అనేది ప్రయాణం ముగిసే స్థలం కాకూడదు. కస్టమర్ ఎంచుకున్న వాటిని స్పష్టంగా చూపిస్తూ, చెక్‌అవుట్‌కు వెళ్లే ముందు ఇంకొంచెం కొనాలనిపించేలా ఉండాలి.",
    clear: "కార్ట్ ఖాళీ చేయండి",
    selectedWeight: "ఎంచుకున్న బరువు",
    quantity: "పరిమాణం",
    lineTotal: "లైన్ మొత్తం",
    orderSummary: "ఆర్డర్ సారాంశం",
    shipping: "పిన్ కోడ్ నిర్ధారణ తర్వాత చెక్‌అవుట్‌లో షిప్పింగ్ జత అవుతుంది",
    continueToCheckout: "చెక్‌అవుట్‌కి వెళ్లండి",
    continueShopping: "ఇంకా కొనుగోలు చేయండి",
    emptyTitle: "మీ కార్ట్ ఇంకా ఎదురు చూస్తోంది",
    emptyDescription:
      "స్టోర్ కలెక్షన్లు చూసి మీకు నచ్చిన పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్ జత చేయండి.",
    suggestionsEyebrow: "చెక్‌అవుట్‌కు ముందు ఇంకొంచెం జోడించండి",
    suggestionsTitle: "చాలా మంది ఇక్కడి నుంచి ఇంకో ప్రియమైన ఐటమ్ జత చేస్తారు",
  },
} as const;

type QuantityEditorProps = {
  value: number;
  onChange: (value: number) => void;
};

const QuantityEditor = ({ value, onChange }: QuantityEditorProps) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitValue = (nextValue: string) => {
    const parsed = Number.parseInt(nextValue, 10);
    const normalized = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    setDraft(String(normalized));
    onChange(normalized);
  };

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-2xl border border-[#d8e5d8] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-11 w-11 items-center justify-center text-theme-body transition hover:bg-[#edf5ee] hover:text-theme-heading active:scale-95"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        min={1}
        inputMode="numeric"
        value={draft}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === "" || /^\d+$/.test(nextValue)) {
            setDraft(nextValue);
          }

          if (/^\d+$/.test(nextValue)) {
            onChange(Math.max(1, Number.parseInt(nextValue, 10)));
          }
        }}
        onBlur={() => commitValue(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="h-11 w-14 border-x border-[#e3ebe0] bg-transparent text-center text-sm font-semibold text-theme-heading outline-none [appearance:textfield] focus:bg-[#f8fbf8] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-11 w-11 items-center justify-center text-theme-body transition hover:bg-[#edf5ee] hover:text-theme-heading active:scale-95"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

const CartPage = () => {
  const {
    cart,
    cartCount,
    subtotal,
    updateCartLineQuantity,
    removeFromCart,
    clearCart,
    bestSellers,
  } = useStore();
  const { language } = useLanguage();
  const t = cartCopy[language];

  const recommendations = bestSellers
    .filter((product) => !cart.some((line) => line.productId === product.id))
    .slice(0, 3);

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Cart"
        description="Review your cart and continue to checkout for SP Traditional Pickles."
        noIndex
      />

      {/* ── Top bar ── */}
      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} flex items-center justify-between gap-3 py-4 sm:py-5`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#956d00] sm:px-4 sm:py-1.5 sm:text-xs">
            {t.eyebrow}
          </span>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-xs font-semibold text-theme-body shadow-sm transition-all duration-200 hover:bg-[#edf5ee] hover:shadow-md active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {t.clear}
            </button>
          )}
        </div>
      </section>

      <section className={`${pageWrap} py-5 md:py-8`}>

        {/* ══════════════════════════════════════
            EMPTY STATE
        ══════════════════════════════════════ */}
        {cart.length === 0 ? (
          <div className="section-shell px-6 py-14 text-center sm:px-8 sm:py-16">

            {/* Icon with subtle halo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf5ee] ring-8 ring-[#edf5ee]/40 sm:h-20 sm:w-20">
              <ShoppingBag className="h-7 w-7 text-[#2f7a43] sm:h-9 sm:w-9" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold text-theme-heading sm:text-3xl md:text-4xl">
              {t.emptyTitle}
            </h2>

            <p
              className={`mx-auto mt-3 max-w-sm text-sm leading-7 text-theme-body sm:max-w-xl sm:text-base sm:leading-8 ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.emptyDescription}
            </p>

            {/*
              FIX ✅ — Button text visibility
              ──────────────────────────────────────────────────────────────────
              Root cause: `!text-white` can be defeated by higher-specificity
              global CSS (e.g. `a { color: var(--color-link) }`).
              Fix: removed the `!` bang, added `text-white` without the bang,
              AND added an inline `style={{ color:"#ffffff" }}` as a
              belt-and-suspenders fallback.  The inline style wins the cascade
              over any stylesheet rule, so the label is ALWAYS visible on the
              green pill.
            */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(47,122,67,0.25)] transition-all duration-200 hover:bg-[#28683a] hover:shadow-[0_20px_44px_rgba(47,122,67,0.32)] active:scale-[0.97] sm:w-auto"
                style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
              >
                <span style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}>
                  {language === "te" ? "ఉత్పత్తులు చూడండి" : "Browse Products"}
                </span>
              </Link>

              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-7 py-3.5 text-sm font-semibold text-theme-heading transition-all duration-200 hover:bg-[#edf5ee] active:scale-[0.97] sm:w-auto"
              >
                {language === "te" ? "హోమ్‌కు తిరుగు" : "Back to Home"}
              </Link>
            </div>
          </div>

        ) : (
          <>
            {/* ══════════════════════════════════════
                FILLED CART
            ══════════════════════════════════════ */}
            <div className="grid gap-4 lg:grid-cols-[1.18fr_0.82fr]">

              {/* Line items */}
              <div className="space-y-3 sm:space-y-4">
                {cart.map((line) => (
                  <article
                    key={line.key}
                    className="section-shell group overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3 p-3.5 sm:gap-4 sm:p-5">

                      {/*
                        FIX ✅ — Mobile image size
                        ──────────────────────────────────────────────────────
                        On mobile the image is now only 52 px (h-13 w-13) —
                        very small, purely decorative thumbnail.
                        It scales up to 88 px on sm and 104 px on lg.
                        `shrink-0` prevents it from being squeezed by flex.
                      */}
                      <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl border border-[#e1eadf] bg-[#f5faf6] shadow-[0_6px_18px_rgba(30,79,46,0.08)] sm:h-[88px] sm:w-[88px] lg:h-[104px] lg:w-[104px]">
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#956d00] sm:text-[10px]">
                            {line.product.category}
                          </p>
                          <h2 className="max-w-[16rem] font-heading text-[0.98rem] font-semibold leading-tight text-theme-heading sm:max-w-none sm:text-[1.25rem]">
                            {line.product.name}
                          </h2>
                          <p
                            className={`text-[10px] leading-5 text-theme-body sm:text-sm sm:leading-6 ${
                              language === "te" ? "font-telugu" : ""
                            }`}
                          >
                            {t.selectedWeight}: {line.weight}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-theme-heading sm:text-[10px]">
                              {t.quantity}
                            </p>
                            <div className="mt-1.5">
                              <QuantityEditor
                                value={line.quantity}
                                onChange={(nextValue) => updateCartLineQuantity(line.key, nextValue)}
                              />
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-theme-heading sm:text-[10px]">
                              {t.lineTotal}
                            </p>
                            <p className="price-figure mt-1 text-[1rem] font-extrabold text-[#2f7a43] sm:text-[1.35rem]">
                              {formatCurrency(line.totalPrice)}
                            </p>
                            <p className="price-figure mt-0.5 text-[10px] text-theme-body sm:text-xs">
                              {formatCurrency(line.price)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <div className="shrink-0 pt-0.5">
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.key)}
                          className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white p-2 text-theme-body transition-all duration-200 hover:border-[#d9644c] hover:text-[#d9644c] active:scale-90 sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">
                            {language === "te" ? "తొలగించండి" : "Remove"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Order summary ── */}
              <aside className="section-shell h-fit px-4 py-5 lg:sticky lg:top-36 sm:px-6 sm:py-7">
                <h2 className="font-heading text-[1.25rem] font-semibold text-theme-heading sm:text-2xl md:text-3xl">
                  {t.orderSummary}
                </h2>

                <div className="mt-4 space-y-3 border-b border-[#d8e5d8] pb-4 sm:mt-6 sm:space-y-4 sm:pb-6">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-theme-body">
                      {language === "te"
                        ? `ఐటమ్స్ (${cartCount})`
                        : `Items (${cartCount} ${cartCount === 1 ? "unit" : "units"})`}
                    </span>
                    <span className="price-figure font-semibold text-theme-heading">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#d8e5d8] bg-[#f8fbf8] px-4 py-3 text-xs leading-6 text-theme-body sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm sm:leading-7">
                    {t.shipping}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#edf5ee] px-4 py-3 sm:mt-5 sm:rounded-2xl sm:px-5 sm:py-4">
                  <span className="text-sm font-semibold text-theme-heading sm:text-base">
                    {language === "te" ? "ఉప మొత్తం" : "Subtotal"}
                  </span>
                  <span className="price-figure text-lg font-extrabold text-[#2f7a43] sm:text-2xl">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3">
                  {/* FIX ✅ — same belt-and-suspenders colour fix as above */}
                  <Link
                    to="/checkout"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(47,122,67,0.22)] transition-all duration-200 hover:bg-[#28683a] hover:shadow-[0_20px_44px_rgba(47,122,67,0.30)] active:scale-[0.97] sm:px-6 sm:py-4"
                    style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                  >
                    <span style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}>
                      {t.continueToCheckout}
                    </span>
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-5 py-3 text-sm font-semibold text-theme-heading transition-all duration-200 hover:bg-[#edf5ee] active:scale-[0.97] sm:px-6 sm:py-3.5"
                  >
                    {t.continueShopping}
                  </Link>
                </div>
              </aside>
            </div>

            {/* ── Recommendations ── */}
            {recommendations.length > 0 && (
              <div className="mt-12 sm:mt-14">
                <div className="max-w-4xl">
                  <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
                    {t.suggestionsEyebrow}
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-semibold text-theme-heading sm:mt-5 sm:text-4xl md:text-5xl">
                    {t.suggestionsTitle}
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:mt-7 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isAvailable={product.isAvailable}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default CartPage;