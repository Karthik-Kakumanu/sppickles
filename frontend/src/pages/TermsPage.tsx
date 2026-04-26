import Seo from "@/components/Seo";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const termsCopy = {
  en: {
    title: "Terms & Conditions",
    description: "Terms and Conditions for SP Traditional Pickles purchases, deliveries, and payment processing.",
    updated: "Last updated: April 6, 2026",
    sections: [
      {
        title: "1. General",
        body: `This website is operated by ${brand.name}. By using this website and placing an order, you agree to these Terms & Conditions.`,
      },
      {
        title: "2. Products & availability",
        body: "All products are prepared in small batches. Product availability may change based on seasonal ingredients and production limits.",
      },
      {
        title: "3. Pricing & payments",
        body: "Prices are listed in INR and may be updated without prior notice. Payments are processed securely through supported payment methods, including Razorpay.",
      },
      {
        title: "4. Shipping & delivery",
        body: "Delivery timelines are estimates and may vary due to courier and location constraints. Customers must provide correct shipping details for successful delivery.",
      },
      {
        title: "5. Order acceptance",
        body: "We reserve the right to accept or decline any order in case of stock unavailability, pricing errors, or suspected fraudulent activity.",
      },
      {
        title: "6. Limitation of liability",
        body: `${brand.name} will not be liable for indirect or consequential losses arising from the use of this website or products beyond applicable consumer law obligations.`,
      },
    ],
    contactTitle: "7. Contact",
    contactLead: "For any concerns regarding these terms, contact us at",
  },
  te: {
    title: "నిబంధనలు మరియు షరతులు",
    description: "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ కొనుగోళ్లు, డెలివరీలు మరియు చెల్లింపులకు సంబంధించిన నిబంధనలు మరియు షరతులు.",
    updated: "చివరిసారిగా నవీకరించిన తేదీ: 6 ఏప్రిల్ 2026",
    sections: [
      {
        title: "1. సాధారణ వివరాలు",
        body: `ఈ వెబ్‌సైట్‌ను ${brand.name} నిర్వహిస్తుంది. ఈ వెబ్‌సైట్‌ను ఉపయోగించడం మరియు ఆర్డర్ చేయడం ద్వారా మీరు ఈ నిబంధనలు మరియు షరతులను అంగీకరిస్తారు.`,
      },
      {
        title: "2. ఉత్పత్తులు మరియు లభ్యత",
        body: "అన్ని ఉత్పత్తులు చిన్న బ్యాచ్‌లలో తయారవుతాయి. సీజనల్ పదార్థాలు మరియు తయారీ పరిమితుల ఆధారంగా ఉత్పత్తుల లభ్యత మారవచ్చు.",
      },
      {
        title: "3. ధరలు మరియు చెల్లింపులు",
        body: "ధరలు INRలో చూపబడతాయి మరియు ముందస్తు సమాచారం లేకుండానే మారవచ్చు. Razorpay సహా మద్దతు ఉన్న చెల్లింపు మార్గాల ద్వారా చెల్లింపులు సురక్షితంగా ప్రాసెస్ చేయబడతాయి.",
      },
      {
        title: "4. షిప్పింగ్ మరియు డెలివరీ",
        body: "డెలివరీ సమయాలు అంచనా మాత్రమే. కొరియర్ మరియు ప్రాంత పరిమితుల వల్ల మారవచ్చు. సరైన షిప్పింగ్ వివరాలు ఇవ్వడం కస్టమర్ బాధ్యత.",
      },
      {
        title: "5. ఆర్డర్ ఆమోదం",
        body: "స్టాక్ లేకపోవడం, ధరలో పొరపాటు లేదా అనుమానాస్పద లావాదేవీల సందర్భంలో ఏ ఆర్డర్‌నైనా అంగీకరించకుండా లేదా తిరస్కరించే హక్కు మాకు ఉంటుంది.",
      },
      {
        title: "6. బాధ్యత పరిమితి",
        body: `వర్తించే వినియోగదారుల చట్టాల పరిధిని మించి, ఈ వెబ్‌సైట్ లేదా ఉత్పత్తుల వినియోగం వల్ల కలిగే పరోక్ష లేదా అనుబంధ నష్టాలకు ${brand.name} బాధ్యత వహించదు.`,
      },
    ],
    contactTitle: "7. సంప్రదింపు",
    contactLead: "ఈ నిబంధనల గురించి ఏవైనా సందేహాలు ఉంటే మమ్మల్ని సంప్రదించండి:",
  },
} as const;

const TermsPage = () => {
  const { language } = useLanguage();
  const t = termsCopy[language];
  const isTelugu = language === "te";

  return (
    <main className="bg-[var(--color-bg-primary)] py-10 md:py-14">
      <Seo
        title={`${t.title} | SP Traditional Pickles`}
        description={t.description}
        canonicalPath="/terms"
        keywords={["terms and conditions", "SP Traditional Pickles terms", "Razorpay compliance"]}
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

export default TermsPage;
