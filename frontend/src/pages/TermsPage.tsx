import Seo from "@/components/Seo";
import { brand } from "@/data/site";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const TermsPage = () => {
  const updatedDate = "April 6, 2026";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title="Terms & Conditions | SP Traditional Pickles"
        description="Terms and Conditions for SP Traditional Pickles purchases, deliveries, and payment processing."
        canonicalPath="/terms"
        keywords={["terms and conditions", "SP Traditional Pickles terms", "Razorpay compliance"]}
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d8e5d8] bg-white p-6 shadow-[0_20px_45px_rgba(30,79,46,0.08)] sm:p-8 md:p-10">
          <h1 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-theme-body">Last updated: {updatedDate}</p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-theme-body sm:text-base">
            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">1. General</h2>
              <p className="mt-2">
                This website is operated by {brand.name}. By using this website and placing an order,
                you agree to these Terms & Conditions.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">2. Products & Availability</h2>
              <p className="mt-2">
                All products are prepared in small batches. Product availability may change based on
                seasonal ingredients and production limits.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">3. Pricing & Payments</h2>
              <p className="mt-2">
                Prices are listed in INR and may be updated without prior notice. Payments are processed
                securely through supported payment methods, including Razorpay.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">4. Shipping & Delivery</h2>
              <p className="mt-2">
                Delivery timelines are estimates and may vary due to courier and location constraints.
                Customers must provide correct shipping details for successful delivery.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">5. Order Acceptance</h2>
              <p className="mt-2">
                We reserve the right to accept or decline any order in case of stock unavailability,
                pricing errors, or suspected fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">6. Limitation of Liability</h2>
              <p className="mt-2">
                {brand.name} will not be liable for indirect or consequential losses arising from the use
                of this website or products beyond applicable consumer law obligations.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">7. Contact</h2>
              <p className="mt-2">
                For any concerns regarding these terms, contact us at
                {" "}
                <a className="font-semibold text-[#2f7a43] hover:text-[#245f33]" href={`mailto:${brand.supportEmail}`}>
                  {brand.supportEmail}
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

export default TermsPage;
