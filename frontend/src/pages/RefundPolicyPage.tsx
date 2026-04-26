import Seo from "@/components/Seo";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const refundCopy = {
  en: {
    title: "Refund Policy",
    description: "Refund policy for SP Traditional Pickles. This store follows a strict no-refund policy.",
    updated: "Last updated: April 6, 2026",
    alertTitle: "No Refund Policy",
    alertBody:
      "All purchases made on this website are final. We do not provide refunds once an order is placed and confirmed.",
    sections: [
      {
        title: "1. Why refunds are not offered",
        body: "Our products are perishable food items and are prepared in limited batches. For safety, quality, and hygiene reasons, refunds are not supported.",
      },
      {
        title: "2. Damaged or wrong items",
        body: "If you receive a damaged package or incorrect item, contact us within 24 hours of delivery with photos and order details. We will review and provide a suitable resolution at our discretion.",
      },
    ],
    contactTitle: "3. Contact",
    contactLead: "For order support, contact",
    whatsappJoiner: "or WhatsApp",
  },
  te: {
    title: "రిఫండ్ విధానం",
    description: "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ రిఫండ్ విధానం. ఈ స్టోర్ కఠినమైన నో-రిఫండ్ విధానాన్ని అనుసరిస్తుంది.",
    updated: "చివరిసారిగా నవీకరించిన తేదీ: 6 ఏప్రిల్ 2026",
    alertTitle: "రిఫండ్ లేదు",
    alertBody:
      "ఈ వెబ్‌సైట్‌లో చేసిన అన్ని కొనుగోళ్లు తుది నిర్ణయంగా పరిగణించబడతాయి. ఒకసారి ఆర్డర్ పెట్టి నిర్ధారించిన తర్వాత రిఫండ్ ఇవ్వబడదు.",
    sections: [
      {
        title: "1. రిఫండ్ ఎందుకు ఇవ్వము",
        body: "మా ఉత్పత్తులు త్వరగా ఉపయోగించాల్సిన ఆహార పదార్థాలు మరియు పరిమిత బ్యాచ్‌లలో తయారవుతాయి. భద్రత, నాణ్యత, పరిశుభ్రత కారణాల వల్ల రిఫండ్ అందించము.",
      },
      {
        title: "2. దెబ్బతిన్న లేదా తప్పు ఉత్పత్తులు",
        body: "మీకు దెబ్బతిన్న ప్యాకెట్ లేదా తప్పు ఉత్పత్తి అందితే, 24 గంటలలోపు ఫోటోలు మరియు ఆర్డర్ వివరాలతో మమ్మల్ని సంప్రదించండి. పరిశీలించి తగిన పరిష్కారం అందిస్తాము.",
      },
    ],
    contactTitle: "3. సంప్రదింపు",
    contactLead: "ఆర్డర్ సహాయం కోసం",
    whatsappJoiner: "లేదా వాట్సాప్",
  },
} as const;

const RefundPolicyPage = () => {
  const { language } = useLanguage();
  const t = refundCopy[language];
  const isTelugu = language === "te";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title={`${t.title} | SP Traditional Pickles`}
        description={t.description}
        canonicalPath="/refund"
        keywords={["refund policy", "no refund", "SP Traditional Pickles refund"]}
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#f3d6d6] bg-white p-6 shadow-[0_20px_45px_rgba(118,35,35,0.08)] sm:p-8 md:p-10">
          <h1 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">{t.title}</h1>
          <p className={`mt-3 text-sm text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{t.updated}</p>

          <div className={`mt-8 space-y-6 text-sm leading-7 text-theme-body sm:text-base ${isTelugu ? "font-telugu" : ""}`}>
            <section className="rounded-2xl border border-[#f0c9c9] bg-[#fff6f6] p-4 sm:p-5">
              <h2 className="font-heading text-xl font-semibold text-[#8a2d2d]">{t.alertTitle}</h2>
              <p className="mt-2 font-medium text-[#5d1f1f]">{t.alertBody}</p>
            </section>

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
                </a>{" "}
                {t.whatsappJoiner}{" "}
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
