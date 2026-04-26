import Seo from "@/components/Seo";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const privacyCopy = {
  en: {
    title: "Privacy Policy",
    description: "Privacy Policy describing how SP Traditional Pickles collects, uses, and protects customer data.",
    updated: "Last updated: April 6, 2026",
    sections: [
      {
        title: "1. Information we collect",
        body: "We collect customer details such as name, phone number, email address, shipping address, and order details needed to process and deliver orders.",
      },
      {
        title: "2. How we use information",
        body: "We use your data to process orders, coordinate delivery, provide customer support, and share order-related updates.",
      },
      {
        title: "3. Payment information",
        body: "Online payments are processed by secure third-party gateways such as Razorpay. We do not store full card or UPI credentials on our servers.",
      },
      {
        title: "4. Data sharing",
        body: "We share only necessary data with trusted service providers such as courier partners and payment processors to fulfill orders and payments.",
      },
      {
        title: "5. Data security",
        body: "We use reasonable safeguards to protect customer information against unauthorized access, disclosure, or misuse.",
      },
      {
        title: "6. Your rights",
        body: "You may contact us to request correction or deletion of your personal data, subject to legal and operational record-keeping requirements.",
      },
    ],
    contactTitle: "7. Contact",
    contactLead: "For privacy-related queries, contact",
  },
  te: {
    title: "గోప్యత విధానం",
    description: "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ కస్టమర్ సమాచారాన్ని ఎలా సేకరిస్తుంది, ఉపయోగిస్తుంది, రక్షిస్తుంది అనే వివరాలు.",
    updated: "చివరిసారిగా నవీకరించిన తేదీ: 6 ఏప్రిల్ 2026",
    sections: [
      {
        title: "1. మేము సేకరించే సమాచారం",
        body: "ఆర్డర్‌ను ప్రాసెస్ చేసి పంపించడానికి అవసరమైన పేరు, ఫోన్ నంబర్, ఈమెయిల్, షిప్పింగ్ చిరునామా మరియు ఆర్డర్ వివరాలను సేకరిస్తాము.",
      },
      {
        title: "2. సమాచారాన్ని ఎలా ఉపయోగిస్తాము",
        body: "మీ సమాచారాన్ని ఆర్డర్ ప్రాసెసింగ్, డెలివరీ సమన్వయం, కస్టమర్ సహాయం మరియు ఆర్డర్‌కు సంబంధించిన అప్‌డేట్‌ల కోసం ఉపయోగిస్తాము.",
      },
      {
        title: "3. చెల్లింపు సమాచారం",
        body: "ఆన్‌లైన్ చెల్లింపులు Razorpay వంటి సురక్షిత మూడవ పక్ష గేట్‌వేల ద్వారా ప్రాసెస్ చేయబడతాయి. పూర్తి కార్డ్ లేదా UPI వివరాలను మా సర్వర్లలో నిల్వ చేయము.",
      },
      {
        title: "4. డేటా పంచుకోవడం",
        body: "ఆర్డర్ పూర్తి చేయడానికి అవసరమైన సమాచారం మాత్రమే విశ్వసనీయ కొరియర్ భాగస్వాములు మరియు చెల్లింపు ప్రాసెసర్లతో పంచుకుంటాము.",
      },
      {
        title: "5. డేటా భద్రత",
        body: "అనధికార ప్రవేశం, దుర్వినియోగం లేదా లీక్‌ల నుండి కస్టమర్ సమాచారాన్ని రక్షించడానికి తగిన భద్రతా చర్యలు తీసుకుంటాము.",
      },
      {
        title: "6. మీ హక్కులు",
        body: "చట్టపరమైన మరియు ఆపరేషన్ రికార్డు అవసరాలకు లోబడి, మీ వ్యక్తిగత సమాచారాన్ని సరిదిద్దడం లేదా తొలగించడం కోసం మమ్మల్ని సంప్రదించవచ్చు.",
      },
    ],
    contactTitle: "7. సంప్రదింపు",
    contactLead: "గోప్యతకు సంబంధించిన ప్రశ్నల కోసం",
  },
} as const;

const PrivacyPolicyPage = () => {
  const { language } = useLanguage();
  const t = privacyCopy[language];
  const isTelugu = language === "te";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title={`${t.title} | SP Traditional Pickles`}
        description={t.description}
        canonicalPath="/privacy"
        keywords={["privacy policy", "SP Traditional Pickles privacy", "Razorpay compliance"]}
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#d8e5d8] bg-white p-6 shadow-[0_20px_45px_rgba(30,79,46,0.08)] sm:p-8 md:p-10">
          <h1 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">{t.title}</h1>
          <p className={`mt-3 text-sm text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.updated}</p>

          <div className={`mt-8 space-y-6 text-sm leading-7 text-theme-body sm:text-base ${isTelugu ? "font-telugu" : ""}`}>
            {t.sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-heading text-xl font-semibold text-theme-heading">{section.title}</h2>
                <p className="mt-2">{section.body}</p>
              </section>
            ))}

            <section>
              <h2 className="font-heading text-xl font-semibold text-theme-heading">{t.contactTitle}</h2>
              <p className="mt-2">
                {t.contactLead}{" "}
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
