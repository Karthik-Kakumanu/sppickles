import { Link } from "react-router-dom";
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
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} flex items-center justify-between gap-4 py-6 sm:py-7`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#956d00] sm:px-4 sm:py-2 sm:text-xs">
            {t.eyebrow}
          </span>

          {cart.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-5 py-2.5 text-sm font-semibold text-theme-body shadow-sm transition hover:bg-[#edf5ee] sm:px-6 sm:py-3"
            >
              {t.clear}
            </button>
          ) : null}
        </div>
      </section>

      <section className={`${pageWrap} py-10 md:py-12`}>
        {cart.length === 0 ? (
          <div className="section-shell px-8 py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-theme-heading" />
            <h2 className="mt-6 font-heading text-3xl font-semibold text-theme-heading md:text-4xl">
              {t.emptyTitle}
            </h2>
            <p
              className={`mx-auto mt-4 max-w-2xl text-base leading-8 text-theme-body ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.emptyDescription}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] sm:w-auto"
                style={{ color: "#ffffff" }}
              >
                {language === "te" ? "ఉత్పత్తులు చూడండి" : "Browse Products"}
              </Link>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-6 py-3.5 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee] sm:w-auto"
              >
                {language === "te" ? "హోమ్‌కు తిరుగు" : "Back to Home"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
              <div className="space-y-6">
                {cart.map((line) => (
                  <article
                    key={line.key}
                    className="section-shell group overflow-hidden px-6 py-6 transition duration-300 hover:-translate-y-1"
                  >
                    <div className="grid gap-6 lg:grid-cols-[180px_1fr_auto]">
                      <div className="overflow-hidden rounded-[1.6rem]">
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="aspect-[4/4.4] w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#956d00]">
                            {line.product.category}
                          </p>
                          <h2 className="mt-3 font-heading text-3xl font-semibold text-theme-heading">
                            {line.product.name}
                          </h2>
                          <p
                            className={`mt-3 text-sm leading-7 text-theme-body ${
                              language === "te" ? "font-telugu" : ""
                            }`}
                          >
                            {t.selectedWeight}: {line.weight}
                          </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-heading">
                              {t.quantity}
                            </p>
                            <div className="mt-3 inline-flex w-fit items-center rounded-full border border-[#d8e5d8] bg-white shadow-sm">
                              <button
                                type="button"
                                onClick={() => updateCartLineQuantity(line.key, line.quantity - 1)}
                                className="px-4 py-2 text-theme-body transition hover:text-theme-heading"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-10 text-center text-sm font-semibold text-theme-heading">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartLineQuantity(line.key, line.quantity + 1)}
                                className="px-4 py-2 text-theme-body transition hover:text-theme-heading"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-theme-heading">
                              {t.lineTotal}
                            </p>
                            <p className="price-figure mt-3 text-3xl font-extrabold text-[#2f7a43]">
                              {formatCurrency(line.totalPrice)}
                            </p>
                            <p className="price-figure mt-2 text-sm text-theme-body">
                              {formatCurrency(line.price)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-end">
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.key)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-sm font-semibold text-theme-body transition hover:border-[#d9644c] hover:text-[#d9644c]"
                        >
                          <Trash2 className="h-4 w-4" />
                          {language === "te" ? "తొలగించండి" : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="section-shell h-fit px-7 py-8 lg:sticky lg:top-36">
                <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.orderSummary}</h2>

                <div className="mt-8 space-y-4 border-b border-[#d8e5d8] pb-6">
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
                  <div className="rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] px-5 py-4 text-sm leading-7 text-theme-body">
                    {t.shipping}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#edf5ee] px-5 py-4">
                  <span className="text-base font-semibold text-theme-heading">
                    {language === "te" ? "ఉప మొత్తం" : "Subtotal"}
                  </span>
                  <span className="price-figure text-2xl font-extrabold text-[#2f7a43]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    to="/checkout"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#2f7a43] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a]"
                    style={{ color: "#ffffff" }}
                  >
                    {t.continueToCheckout}
                  </Link>
                  <Link
                    to="/products"
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-6 py-3.5 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee]"
                  >
                    {t.continueShopping}
                  </Link>
                </div>
              </aside>
            </div>

            {recommendations.length > 0 ? (
              <div className="mt-14">
                <div className="max-w-4xl">
                  <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
                    {t.suggestionsEyebrow}
                  </span>
                  <h2 className="mt-5 font-heading text-4xl font-semibold text-theme-heading md:text-5xl">
                    {t.suggestionsTitle}
                  </h2>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
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
            ) : null}
          </>
        )}
      </section>
    </main>
  );
};

export default CartPage;
