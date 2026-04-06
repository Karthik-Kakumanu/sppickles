import Seo from "@/components/Seo";
import { brand } from "@/data/site";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const PrivacyPolicyPage = () => {
  const updatedDate = "April 6, 2026";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title="Privacy Policy | SP Traditional Pickles"
        description="Privacy Policy describing how SP Traditional Pickles collects, uses, and protects customer data."
        canonicalPath="/privacy"
        keywords={["privacy policy", "SP Traditional Pickles privacy", "Razorpay compliance"]}
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d8e5d8] bg-white p-6 shadow-[0_20px_45px_rgba(30,79,46,0.08)] sm:p-8 md:p-10">
          <h1 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-theme-body">Last updated: {updatedDate}</p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-theme-body sm:text-base">
            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">1. Information We Collect</h2>
              <p className="mt-2">
                We collect customer details such as name, phone number, email address, shipping address,
                and order details needed to process and deliver orders.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">2. How We Use Information</h2>
              <p className="mt-2">
                We use your data to process orders, coordinate delivery, provide customer support, and
                share order-related updates.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">3. Payment Information</h2>
              <p className="mt-2">
                Online payments are processed by secure third-party gateways such as Razorpay. We do not
                store full card or UPI credentials on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">4. Data Sharing</h2>
              <p className="mt-2">
                We share only necessary data with trusted service providers such as courier partners and
                payment processors to fulfill orders and payments.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">5. Data Security</h2>
              <p className="mt-2">
                We use reasonable safeguards to protect customer information against unauthorized access,
                disclosure, or misuse.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">6. Your Rights</h2>
              <p className="mt-2">
                You may contact us to request correction or deletion of your personal data, subject to
                legal and operational record-keeping requirements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">7. Contact</h2>
              <p className="mt-2">
                For privacy-related queries, contact
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

export default PrivacyPolicyPage;
