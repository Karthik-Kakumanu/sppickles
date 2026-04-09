import { HeartHandshake, Leaf, PackageCheck, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { brand } from "@/data/site";
import storyKitchen from "@/assets/story-kitchen.jpg";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const aboutCopy = {
  en: {
    eyebrow: "About the brand",
    title: "A fuller story for customers who want to know the people, the process, and the promise",
    intro:
      "The about page is no longer a short placeholder. It now gives the store a stronger sense of depth, helping customers understand what kind of kitchen, ingredients, and values stand behind the order flow.",
    sections: [
      {
        title: "Rooted in a household food culture",
        body:
          "SP Traditional Pickles is positioned around the feeling of pantry food made with discipline, familiarity, and home-style care. The intention is not to feel like a large anonymous ecommerce brand. It is to feel like a trusted Andhra kitchen that has learned how to present itself well online.",
      },
      {
        title: "Prepared with traditional attention",
        body:
          "The product story focuses on handmade preparation, handpicked ingredients, vegetarian discipline, and flavours that feel familiar to customers who grew up with Brahmin-style or satvik kitchen traditions.",
      },
      {
        title: "Built for repeat trust",
        body:
          "The website explains the process, the categories, the contact details, and the support style clearly because trust is not built only by photos. It is built when customers feel the brand is careful, transparent, and reachable.",
      },
    ],
    commitments: [
      "Pure vegetarian preparation with household discipline.",
      "No onion and no garlic options where the product line allows it.",
      "No preservatives and no palm oil claims presented clearly.",
      "Secure packing with a focus on leakage control and cleaner delivery handling.",
    ],
    operationsTitle: "How the store presents its work",
    operationsBody:
      "The website now speaks about preparation, packing, direct support, India delivery, USA enquiries, and overseas conversations in a more mature way. This makes the brand feel ready for both household buyers and larger family or gifting orders.",
    valuesTitle: "Why this detail matters",
    valuesBody:
      "When customers read an about page, they are usually deciding whether the brand feels trustworthy enough to spend money with. More detail here increases confidence before they reach the cart and payment stages.",
  },
  te: {
    eyebrow: "బ్రాండ్ గురించి",
    title: "మనుషులు, ప్రక్రియ, నమ్మకం అన్నీ తెలిసేలా మరింత వివరమైన గురించి పేజీ",
    intro:
      "ఈ గురించి పేజీ ఇప్పుడు చిన్న ప్లేస్‌హోల్డర్ కాదు. బ్రాండ్ వెనుక ఉన్న వంటగది, పదార్థాలు, విలువలు అన్నీ కస్టమర్‌కు స్పష్టంగా తెలిసేలా రూపొందించబడింది.",
    sections: [
      {
        title: "ఇంటి ఆహార సంస్కృతిలోనే మా మూలాలు",
        body:
          "SP Traditional Pickles అనేది ఇంటి పాంట్రీలో ఉండే ఆహారం లాంటి అనుభూతిని ఇవ్వాలి అనే ఆలోచనతో రూపొందించబడింది. ఇది పెద్ద గుర్తు తెలియని ఈకామర్స్ బ్రాండ్‌లా కాకుండా, ఆంధ్రా ఇంటివంట వంటగది ఆన్‌లైన్‌కి వచ్చినట్లుగా అనిపించాలి.",
      },
      {
        title: "సంప్రదాయమైన శ్రద్ధతో తయారీ",
        body:
          "మా ఉత్పత్తి కథలో చేతిపని, ఎంచుకున్న పదార్థాలు, శాకాహార నియమాలు, బ్రాహ్మణ/సాత్విక వంటగది సంప్రదాయాలను గుర్తు చేసే రుచులపై దృష్టి ఉంటుంది.",
      },
      {
        title: "మళ్ళీ మళ్ళీ కొనాలనిపించే నమ్మకం",
        body:
          "ఫోటోలు మాత్రమే కాదు, ప్రక్రియ, కేటగిరీలు, కాంటాక్ట్ వివరాలు, సపోర్ట్ తీరు అన్నీ స్పష్టంగా చూపించినప్పుడు మాత్రమే కస్టమర్‌కు బ్రాండ్ మీద విశ్వాసం పెరుగుతుంది.",
      },
    ],
    commitments: [
      "ఇంటి నియమాలతో శుద్ధ శాకాహార తయారీ.",
      "అవకాశమున్న చోట ఉల్లిపాయ, వెల్లుల్లి లేని ఎంపికలు.",
      "ప్రిజర్వేటివ్‌లు లేవు, పామ్ ఆయిల్ లేదు అనే విషయాలను స్పష్టంగా చెప్తాం.",
      "లీకేజీ తగ్గేలా సురక్షితమైన ప్యాకింగ్‌పై ఎక్కువ శ్రద్ధ.",
    ],
    operationsTitle: "మా పని వెబ్‌సైట్‌లో ఎలా కనిపిస్తుంది",
    operationsBody:
      "తయారీ, ప్యాకింగ్, డైరెక్ట్ సపోర్ట్, భారత్ డెలివరీ, USA enquiry, విదేశీ ఆర్డర్లు అన్నీ ఇప్పుడు మరింత మెచ్యూర్‌గా వెబ్‌సైట్‌లో చూపబడతాయి. దీంతో ఇంటి ఆర్డర్లకే కాదు, పెద్ద కుటుంబ లేదా గిఫ్టింగ్ ఆర్డర్లకూ బ్రాండ్ సిద్ధంగా ఉందని తెలుస్తుంది.",
    valuesTitle: "ఈ వివరాలు ఎందుకు ముఖ్యము",
    valuesBody:
      "కస్టమర్ గురించి పేజీ చదివితే, అతడు ప్రధానంగా బ్రాండ్ నిజంగా నమ్మదగినదేనా అని నిర్ణయించుకుంటున్నాడు. అందుకే ఈ పేజీలో ఎక్కువ వివరణ ఉండటం కార్ట్, చెల్లింపు దశలకు ముందే నమ్మకాన్ని పెంచుతుంది.",
  },
} as const;

const valueCards = [
  {
    title: "Traditional roots",
    titleTe: "సంప్రదాయ మూలాలు",
    icon: Leaf,
  },
  {
    title: "Clear promises",
    titleTe: "స్పష్టమైన హామీలు",
    icon: Sparkles,
  },
  {
    title: "Homemade care",
    titleTe: "ఇంటివంట శ్రద్ధ",
    icon: HeartHandshake,
  },
  {
    title: "Secure packing",
    titleTe: "సురక్షితమైన ప్యాకింగ్",
    icon: PackageCheck,
  },
] as const;

const AboutPage = () => {
  const { language } = useLanguage();
  const t = aboutCopy[language];

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | About"
        description="Learn more about SP Traditional Pickles and the way the brand prepares and presents its products."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center`}>
          <div>
            <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
              {t.eyebrow}
            </span>
            <h1 className="mt-5 font-heading text-4xl font-semibold text-theme-heading md:text-5xl xl:text-6xl">
              {t.title}
            </h1>
            <p
              className={`mt-5 max-w-3xl text-base leading-8 text-theme-body md:text-lg ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.intro}
            </p>
          </div>

          <div className="section-shell overflow-hidden p-3">
            <img
              src={storyKitchen}
              alt={brand.name}
              loading="lazy"
              decoding="async"
              className="h-[420px] w-full rounded-[1.7rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className={`${pageWrap} py-14`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-8">
            {t.sections.map((section) => (
              <div key={section.title} className="border-b border-[#d8e5d8] pb-8 last:border-b-0 last:pb-0">
                <h2 className={`text-2xl font-semibold text-theme-heading md:text-3xl ${language === "te" ? "font-telugu" : ""}`}>
                  {section.title}
                </h2>
                <p
                  className={`mt-4 text-base leading-8 text-theme-body ${
                    language === "te" ? "font-telugu" : ""
                  }`}
                >
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="section-shell px-7 py-8">
              <h2 className="font-heading text-3xl font-semibold text-theme-heading">
                {t.operationsTitle}
              </h2>
              <p
                className={`mt-4 text-base leading-8 text-theme-body ${
                  language === "te" ? "font-telugu" : ""
                }`}
              >
                {t.operationsBody}
              </p>
            </div>

            <div className="section-shell px-7 py-8">
              <h2 className="font-heading text-3xl font-semibold text-theme-heading">
                {t.valuesTitle}
              </h2>
              <p
                className={`mt-4 text-base leading-8 text-theme-body ${
                  language === "te" ? "font-telugu" : ""
                }`}
              >
                {t.valuesBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d8e5d8] bg-[linear-gradient(180deg,#fff9ed_0%,#faf7f2_100%)]">
        <div className={`${pageWrap} py-14`}>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {valueCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="premium-panel px-6 py-7">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf5ee] text-[#2f7a43]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className={`mt-4 text-lg font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                    {language === "te" ? card.titleTe : card.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${pageWrap} py-14`}>
        <div className="section-shell px-7 py-8">
          <h2 className="font-heading text-3xl font-semibold text-theme-heading md:text-4xl">
            {language === "te" ? "మా బ్రాండ్ హామీలు" : "The commitments we keep visible"}
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {t.commitments.map((commitment) => (
              <div key={commitment} className="flex items-start gap-3 border-b border-[#d8e5d8] pb-5 last:border-b-0 lg:last:border-b lg:last:pb-5">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#e2b93b]" />
                <p
                  className={`text-base leading-8 text-theme-body ${
                    language === "te" ? "font-telugu" : ""
                  }`}
                >
                  {commitment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
