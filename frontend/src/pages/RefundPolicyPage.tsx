import Seo from "@/components/Seo";
import { brand } from "@/data/site";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const RefundPolicyPage = () => {
  const updatedDate = "April 6, 2026";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title="Refund Policy | SP Traditional Pickles"
        description="Refund policy for SP Traditional Pickles. This store follows a strict no-refund policy."
        canonicalPath="/refund"
        keywords={["refund policy", "no refund", "SP Traditional Pickles refund"]}
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#f3d6d6] bg-white p-6 shadow-[0_20px_45px_rgba(118,35,35,0.08)] sm:p-8 md:p-10">
          <h1 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">
            Refund Policy
          </h1>
          <p className="mt-3 text-sm text-theme-body">Last updated: {updatedDate}</p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-theme-body sm:text-base">
            <section className="rounded-2xl border border-[#f0c9c9] bg-[#fff6f6] p-4 sm:p-5">
              <h2 className="font-heading text-xl font-semibold text-[#8a2d2d]">No Refund Policy</h2>
              <p className="mt-2 font-medium text-[#5d1f1f]">
                All purchases made on this website are final. We do not provide refunds once an order is
                placed and confirmed.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">1. Why Refunds Are Not Offered</h2>
              <p className="mt-2">
                Our products are perishable food items and are prepared in limited batches. For safety,
                quality, and hygiene reasons, refunds are not supported.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">2. Damaged or Wrong Items</h2>
              <p className="mt-2">
                If you receive a damaged package or incorrect item, contact us within 24 hours of
                delivery with photos and order details. We will review and provide a suitable resolution
                at our discretion.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">3. Contact</h2>
              <p className="mt-2">
                For order support, contact
                {" "}
                <a className="font-semibold text-[#2f7a43] hover:text-[#245f33]" href={`mailto:${brand.supportEmail}`}>
                  {brand.supportEmail}
                </a>
                {" "}
                or WhatsApp
                {" "}
                <a className="font-semibold text-[#2f7a43] hover:text-[#245f33]" href={brand.whatsappUrl} target="_blank" rel="noreferrer">
                  {brand.whatsappDisplay}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RefundPolicyPage;
