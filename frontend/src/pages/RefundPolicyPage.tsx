import Seo from "@/components/Seo";
import { brand } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const refundCopy = {
  en: {
    title: "Refund Policy",
    description:
      "Refund policy for SP Traditional Pickles for website orders cancelled within the allowed time window.",
    updated: "Last updated: April 29, 2026",
    alertTitle: "Refunds for website orders",
    alertBody:
      "Refunds are issued only for orders placed through this website and cancelled within 6 hours of the order being placed.",
    sections: [
      {
        title: "1. Refund eligibility",
        body:
          "If an order placed on this website is cancelled within 6 hours from the time of purchase, it becomes eligible for refund processing. After 6 hours, the order may move into preparation, packing, or dispatch and will not be treated as eligible under this refund policy.",
      },
      {
        title: "2. Refund destination",
        body:
          "The refund amount will be sent back to the same bank account, card, UPI, or original payment source used while making the payment. We do not manually redirect refunds to a different account.",
      },
      {
        title: "3. Razorpay processing time",
        body:
          "Once the refund is initiated through Razorpay, it may take about 1 to 3 working days for the amount to reflect back in the original payment source, depending on banking timelines and payment method processing.",
      },
      {
        title: "4. Razorpay charges and commission",
        body:
          "Razorpay may issue the refund after deducting applicable commission or gateway charges, or it may process the full amount depending on its payment and settlement rules. Any such deduction, if applied by Razorpay, is outside our direct control.",
      },
    ],
    contactTitle: "5. Contact",
    contactLead: "For refund or cancellation support, contact",
    whatsappJoiner: "or WhatsApp",
  },
  te: {
    title: "రిఫండ్ విధానం",
    description:
      "ఈ వెబ్‌సైట్‌లో పెట్టిన ఆర్డర్‌ను అనుమతించిన గడువులో రద్దు చేసినప్పుడు వర్తించే రిఫండ్ విధానం.",
    updated: "చివరిసారిగా నవీకరించిన తేదీ: 29 ఏప్రిల్ 2026",
    alertTitle: "వెబ్‌సైట్ ఆర్డర్‌లకు మాత్రమే రిఫండ్",
    alertBody:
      "ఈ వెబ్‌సైట్ ద్వారా చేసిన ఆర్డర్‌ను ఆర్డర్ పెట్టిన 6 గంటలలోపు రద్దు చేస్తే మాత్రమే రిఫండ్ ఇవ్వబడుతుంది.",
    sections: [
      {
        title: "1. రిఫండ్‌కు అర్హత",
        body:
          "ఈ వెబ్‌సైట్‌లో పెట్టిన ఆర్డర్‌ను కొనుగోలు చేసిన సమయం నుంచి 6 గంటలలోపు రద్దు చేస్తే, అది రిఫండ్ ప్రాసెస్‌కు అర్హంగా పరిగణించబడుతుంది. 6 గంటలు దాటిన తర్వాత ఆర్డర్ తయారీ, ప్యాకింగ్, లేదా పంపిణీ దశలోకి వెళ్లే అవకాశం ఉండడంతో, అలాంటి ఆర్డర్‌కు ఈ విధానం ప్రకారం రిఫండ్ వర్తించదు.",
      },
      {
        title: "2. రిఫండ్ వెళ్లే ఖాతా",
        body:
          "రిఫండ్ మొత్తం చెల్లింపు చేసిన అదే బ్యాంక్ ఖాతా, కార్డ్, UPI, లేదా అసలు చెల్లింపు మార్గానికే తిరిగి పంపబడుతుంది. వేరే ఖాతాకు మాన్యువల్‌గా రిఫండ్ మార్చి పంపించడం చేయము.",
      },
      {
        title: "3. Razorpay ప్రాసెసింగ్ సమయం",
        body:
          "Razorpay ద్వారా రిఫండ్ ప్రారంభించిన తర్వాత, బ్యాంక్ మరియు చెల్లింపు విధానం ప్రకారం ఆ మొత్తం అసలు చెల్లింపు మార్గంలో కనిపించడానికి సాధారణంగా 1 నుంచి 3 పని దినాలు పట్టవచ్చు.",
      },
      {
        title: "4. Razorpay కమిషన్ లేదా ఛార్జీలు",
        body:
          "Razorpay తన నియమాల ప్రకారం కమిషన్ లేదా పేమెంట్ గేట్‌వే ఛార్జీలను తగ్గించి రిఫండ్ చేయవచ్చు, లేదా పూర్తి మొత్తాన్ని కూడా రిఫండ్ చేయవచ్చు. అలాంటి తగ్గింపులు ఉంటే అవి Razorpay విధానాల ప్రకారమే ఉంటాయి; అవి మా ప్రత్యక్ష నియంత్రణలో ఉండవు.",
      },
    ],
    contactTitle: "5. సంప్రదింపు",
    contactLead: "రిఫండ్ లేదా రద్దు సహాయం కోసం",
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
        keywords={["refund policy", "website refund", "Razorpay refund", "SP Traditional Pickles refund"]}
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
