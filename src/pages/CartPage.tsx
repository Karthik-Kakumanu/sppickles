import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ImageFrame } from "@/components/ImageFrame";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/pricing";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

const CartPage = () => {
  const {
    cart,
    cartCount,
    subtotal,
    updateCartLineQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  return (
    <main className="bg-[#fffaf4] py-20">
      <Seo
        title="SP Traditional Pickles | Cart"
        description="Review your cart and continue to checkout for SP Traditional Pickles."
      />

      <section className={pageWrap}>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b1e1e]">
              Cart
            </p>
            <h1 className="mt-4 font-heading text-5xl font-semibold text-[#241612] md:text-6xl">
              Review your order before checkout
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#685448]">
              Adjust quantity, keep the weight selection you want, and move to checkout for shipping
              calculation and final WhatsApp confirmation.
            </p>
          </div>

          {cart.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-3 text-sm font-semibold text-[#241612] shadow-sm transition hover:bg-[#fff2ef]"
            >
              Clear Cart
            </button>
          ) : null}
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[2rem] border border-[#eadfd5] bg-white px-8 py-16 text-center shadow-md">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#8b1e1e]" />
            <h2 className="mt-6 font-heading text-3xl font-semibold text-[#241612] md:text-4xl">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#685448]">
              Add pickles, powders, or snacks from the products page to start your order.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#8b1e1e] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#741616] sm:w-auto"
              >
                Browse Products
              </Link>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-3.5 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef] sm:w-auto"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              {cart.map((line) => (
                <article
                  key={line.key}
                  className="rounded-[2rem] border border-[#eadfd5] bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="grid gap-6 lg:grid-cols-[180px_1fr_auto]">
                    <ImageFrame
                      src={line.product.image}
                      alt={line.product.name}
                      ratio="square"
                      className="overflow-hidden rounded-2xl"
                    />

                    <div className="flex flex-col gap-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                          {line.product.category}
                        </p>
                        <h2 className="mt-3 font-heading text-3xl font-semibold text-[#241612]">
                          {line.product.name}
                        </h2>
                        {line.product.name_te ? (
                          <p className="mt-2 text-sm font-medium text-[#8b1e1e]">
                            {line.product.name_te}
                          </p>
                        ) : null}
                        <p className="mt-3 text-sm leading-7 text-[#685448]">
                          {line.weight} selected
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                            Quantity
                          </p>
                          <div className="mt-3 inline-flex w-fit items-center rounded-full border border-[#eadfd5] bg-[#fffaf6] shadow-sm">
                            <button
                              type="button"
                              onClick={() => updateCartLineQuantity(line.key, line.quantity - 1)}
                              className="px-4 py-2 text-[#685448] transition hover:text-[#8b1e1e]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm font-semibold text-[#241612]">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartLineQuantity(line.key, line.quantity + 1)}
                              className="px-4 py-2 text-[#685448] transition hover:text-[#8b1e1e]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                            Line Total
                          </p>
                          <p className="mt-3 text-3xl font-bold text-[#8b1e1e]">
                            {formatCurrency(line.totalPrice)}
                          </p>
                          <p className="mt-2 text-sm text-[#685448]">
                            {formatCurrency(line.price)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-end">
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.key)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-4 py-2 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef]"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md">
              <h2 className="font-heading text-3xl font-semibold text-[#241612]">Order Summary</h2>

              <div className="mt-8 space-y-4 border-b border-[#eadfd5] pb-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#685448]">
                    Items ({cartCount} {cartCount === 1 ? "unit" : "units"})
                  </span>
                  <span className="font-semibold text-[#241612]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#685448]">Shipping</span>
                  <span className="font-semibold text-[#241612]">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#fff8f3] px-5 py-4 text-sm leading-7 text-[#685448]">
                Shipping is calculated from your pincode at checkout.
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#fffaf6] px-5 py-4">
                <span className="text-base font-semibold text-[#241612]">Subtotal</span>
                <span className="text-2xl font-bold text-[#8b1e1e]">{formatCurrency(subtotal)}</span>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#8b1e1e] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#741616]"
                >
                  Continue to Checkout
                </Link>
                <Link
                  to="/products"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-3.5 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef]"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default CartPage;
