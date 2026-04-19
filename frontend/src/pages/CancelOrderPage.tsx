import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock3, Loader2, ShieldAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Seo from "@/components/Seo";
import { cancelOrder } from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

type LocationState = {
  orderId?: string;
  phone?: string;
};

const CancelOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      <Seo
        title="SP Traditional Pickles | Cancel Order"
        description="Cancel your order within 6 hours of purchase."
        noIndex
      />

      <section className="border-b border-[#d8e5d8] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(255,249,233,0.98))]">
        <div className={`${pageWrap} py-10 sm:py-14`}>
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e7cf91] bg-white/90 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-[#8a651a] shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              Cancellation window
            </span>
            <h1 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.03em] text-theme-heading md:text-5xl">
              Cancel an order within 6 hours
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-theme-body md:text-base">
              Once 6 hours pass after purchase, the order is locked for packing and delivery. If your order is still eligible, enter the order ID and phone number used at checkout.
            </p>
          </div>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-6 py-10 lg:grid-cols-[1fr_0.9fr]`}>
        <article className="section-shell h-fit px-7 py-8 shadow-[0_18px_42px_rgba(34,73,47,0.08)]">
          <div className="flex items-center gap-3 text-[#8a651a]">
            <Clock3 className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Order cancellation</p>
          </div>

          {cancelledOrder ? (
            <div className="mt-6 rounded-[1.4rem] border border-[#bfe0c7] bg-[#f2fbf4] p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-[#1f7a4d]" />
                <div>
                  <h2 className="text-xl font-bold text-theme-heading">Order cancelled</h2>
                  <p className="mt-2 text-sm leading-7 text-theme-body">
                    Your request has been recorded. If the payment was captured, the refund process has been initiated and will be completed shortly.
                  </p>
                  <div className="mt-3 rounded-xl border border-[#e7cf91] bg-[#fff9eb] p-3 text-sm leading-7 text-theme-body">
                    For prepaid orders, Razorpay/payment charges may apply as per gateway policy. The remaining eligible amount is usually credited within 1 working day (bank timelines may vary).
                  </div>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <dt className="text-theme-body-soft">Order ID</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{cancelledOrder.id}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className="text-theme-body-soft">Status</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{cancelledOrder.status}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className="text-theme-body-soft">Payment status</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{cancelledOrder.paymentStatus ?? "pending"}</dd>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <dt className="text-theme-body-soft">Total</dt>
                  <dd className="mt-1 font-semibold text-theme-heading">{formatCurrency(Number(cancelledOrder.total ?? 0))}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-full bg-[#2f7a43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28683a]"
                >
                  Back to home
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="rounded-full border border-[#d8e5d8] bg-white px-5 py-3 text-sm font-semibold text-theme-body transition hover:bg-[#edf5ee]"
                >
                  Continue shopping
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
                <label htmlFor="cancel-order-id" className="block text-sm font-semibold text-theme-heading">
                  Order ID
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
                <label htmlFor="cancel-phone" className="block text-sm font-semibold text-theme-heading">
                  Phone number
                </label>
                <input
                  id="cancel-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="10-digit mobile number"
                  className="mt-2 w-full rounded-2xl border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43]"
                />
              </div>

              <div>
                <label htmlFor="cancel-reason" className="block text-sm font-semibold text-theme-heading">
                  Reason for cancellation
                </label>
                <textarea
                  id="cancel-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={4}
                  placeholder="Optional"
                  className="mt-2 w-full rounded-[1.2rem] border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43]"
                />
              </div>

              <div className="rounded-[1.4rem] border border-[#e7cf91] bg-[#fff9eb] p-4 text-sm leading-7 text-theme-body">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8a651a]" />
                  <p>
                    Orders can only be cancelled within 6 hours of purchase. Once the window expires, the order stays active for packing and dispatch.
                  </p>
                </div>
              </div>

              {cancelMutation.isError ? (
                <div className="rounded-[1.2rem] border border-[#f0c8bf] bg-[#fff0eb] p-4 text-sm text-[#b64d39]">
                  {cancelMutation.error instanceof Error ? cancelMutation.error.message : "Unable to cancel order."}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit || cancelMutation.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-[#8a651a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#735416] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                Cancel order
              </button>
            </form>
          )}
        </article>

        <aside className="section-shell h-fit px-7 py-8">
          <h2 className="font-heading text-2xl font-semibold text-theme-heading">What happens after cancel?</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-theme-body">
            <li className="rounded-2xl bg-[#f7fbf8] p-4">The order status becomes cancelled and remains available in your order records.</li>
            <li className="rounded-2xl bg-[#f7fbf8] p-4">If the payment was captured, a Razorpay refund is initiated from the order record.</li>
            <li className="rounded-2xl bg-[#f7fbf8] p-4">Razorpay/payment charges may apply as per gateway policy, and the remaining eligible amount is typically credited within 1 working day.</li>
            <li className="rounded-2xl bg-[#f7fbf8] p-4">Refund tracking is saved on the order so completion can be verified if needed.</li>
          </ul>
        </aside>
      </section>
    </main>
  );
};

export default CancelOrderPage;
