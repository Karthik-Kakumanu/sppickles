import { HeartHandshake, Leaf, PackageCheck, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { brand } from "@/data/site";
import aboutImage from "../../images/about.jpg";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const aboutCopy = {
  en: {
    eyebrow: "About the brand",
    title: "A Brahmin-style kitchen story built on satvik taste, care, and trust",
    sections: [
      {
        title: "Rooted in Brahmin household food culture",
        body:
          "SP Traditional Pickles carries the feeling of an Andhra Brahmin home kitchen where food is prepared with cleanliness, discipline, and affection. Our pickles, podis, and fryums are meant to bring back the taste of food made at home, not the feel of factory-made products.",
      },
      {
        title: "Prepared in a satvik, traditional way",
        body:
          "We focus on pure vegetarian preparation, carefully chosen ingredients, and small-batch work that stays close to traditional Brahmin-style cooking. Every recipe is made to feel balanced, homely, and familiar at the dining table.",
      },
      {
        title: "Made to earn family trust",
        body:
          "Taste matters, but so do the people and values behind it. That is why we speak clearly about our preparation style, packing care, and direct customer support. Trust is built when food feels honest, dependable, and close to home.",
      },
    ],
    commitments: [
      "Pure vegetarian preparation in the spirit of a Brahmin home kitchen.",
      "No onion or garlic is used in our brand's preparation.",
      "Traditional taste handled with care, not rushed factory-style processing.",
      "Clean packing with attention to freshness, neatness, and safe delivery.",
    ],
    operationsTitle: "How we prepare and serve",
    operationsBody:
      "From selecting ingredients to making each batch and packing every order, our work follows a simple promise: food should feel worthy of a family kitchen. We guide customers directly, keep communication personal, and make ordering feel warm and straightforward.",
    valuesTitle: "Why families connect with us",
    valuesBody:
      "People choose this brand not only for spice and flavour, but for the satvik care behind it. When the preparation feels sincere and the taste feels familiar, customers are happy to bring it back to their meals again and again.",
    promiseTitle: "The commitments we keep visible",
    badge: "Satvik tradition. Homemade care. Brahmin-style taste you can trust.",
  },
  te: {
    eyebrow: "మా గురించి",
    title: "బ్రాహ్మణ సంప్రదాయ పద్ధతిలో తయారయ్యే పచ్చళ్ళు, పొడులు, ఫ్రైమ్స్",
    sections: [
      {
        title: "సంప్రదాయ రుచికి మా అంకితభావం",
        body:
          "బ్రాహ్మణ సంప్రదాయ పద్ధతిలో, బ్రాహ్మణ మహిళల చేత ప్రేమతో తయారు చేసిన పచ్చళ్ళు, పొడులు, ఫ్రైమ్స్ మీకు అందిస్తున్నాము. మా ప్రతి ఉత్పత్తిలో ఇంటి వంట రుచి, సంప్రదాయ శైలి, ఆప్యాయత స్పష్టంగా కనిపించేలా ప్రత్యేక శ్రద్ధ తీసుకుంటాము.",
      },
      {
        title: "నాణ్యమైన పదార్థాలతో పరిశుభ్రమైన తయారీ",
        body:
          "మా ఉత్పత్తులు సహజమైన మరియు నాణ్యమైన పదార్థాలతో, ఎలాంటి కలర్స్ లేదా ప్రిజర్వేటివ్స్ లేకుండా పరిశుభ్రంగా తయారు చేయబడతాయి. బ్రాహ్మణ సంప్రదాయ పద్ధతిని పాటిస్తూ, శుద్ధ శాకాహార విధానంలో ప్రతి వంటకం జాగ్రత్తగా సిద్ధం చేస్తాము.",
      },
      {
        title: "రోజువారీ భోజనానికి ఇంటి వంట రుచి",
        body:
          "సంప్రదాయ పద్ధతిలో తయారుచేయబడుతున్న శాకాహార పచ్చళ్ళు, పొడులు, ఫ్రైమ్స్ మీ రోజువారీ భోజనానికి రుచిని మరింత పెంచుతాయి. బ్రాహ్మణ సంప్రదాయ రుచులతో తయారైన మా ఉత్పత్తులు ఇంటి వంటల మాదిరి మధురమైన రుచిని మీ భోజనానికి అందిస్తాయి.",
      },
    ],
    commitments: [
      "సంప్రదాయ రుచి",
      "పరిశుభ్రతకు ప్రాధాన్యం",
      "నాణ్యమైన పదార్థాలు",
      "ఇంటి వంట రుచి",
    ],
    operationsTitle: "మా తయారీ విధానం",
    operationsBody:
      "బ్రాహ్మణ సంప్రదాయ పద్ధతిలో తయారు చేసే ప్రతి పచ్చడి, పొడి, ఫ్రైమ్‌లో రుచి మాత్రమే కాకుండా శ్రద్ధ, పరిశుభ్రత, నాణ్యత కూడా కలిసేలా మేము చూసుకుంటాము. పదార్థాల ఎంపిక నుంచి తయారీ వరకు ప్రతి దశలో ఇంటి వంటకు ఉండే శుభ్రతను మరియు జాగ్రత్తను పాటిస్తాము.",
    valuesTitle: "మా ఉత్పత్తుల ప్రత్యేకత",
    valuesBody:
      "మా ప్రత్యేకత సంప్రదాయ రుచిని అలాగే నిలబెట్టుకోవడంలో ఉంది. కలర్స్, ప్రిజర్వేటివ్స్ లేకుండా, నాణ్యమైన పదార్థాలతో తయారయ్యే మా ఉత్పత్తులు కుటుంబం మొత్తం ఇష్టపడే ఇంటి వంట రుచిని గుర్తు చేస్తాయి.",
    promiseTitle: "మా ప్రత్యేకతలు",
    badge: "బ్రాహ్మణ సంప్రదాయ రుచి. నాణ్యమైన పదార్థాలు. ఇంటి వంట మధుర రుచి.",
  },
} as const;

const valueCards = [
  {
    title: "Traditional roots",
    titleTe: "సంప్రదాయ రుచి",
    icon: Leaf,
  },
  {
    title: "Clear promises",
    titleTe: "పరిశుభ్రతకు ప్రాధాన్యం",
    icon: Sparkles,
  },
  {
    title: "Homemade care",
    titleTe: "నాణ్యమైన పదార్థాలు",
    icon: HeartHandshake,
  },
  {
    title: "Secure packing",
    titleTe: "ఇంటి వంట రుచి",
    icon: PackageCheck,
  },
] as const;

const highlightPhrase = (text: string, language: "en" | "te") => {
  if (language !== "en") {
    return text;
  }

  const phrase = "Brahmin-style";
  const parts = text.split(phrase);

  if (parts.length === 1) {
    return text;
  }

  return parts.flatMap((part, index) => [
    part,
    index < parts.length - 1 ? (
      <span
        key={`${phrase}-${index}`}
        className="mx-1 inline-flex rounded-full border border-[#f1d67b] bg-[linear-gradient(180deg,#fff5cf_0%,#ffe39b_100%)] px-2.5 py-1 align-middle text-sm font-semibold tracking-[0.01em] text-[#7a5700] shadow-[0_8px_18px_rgba(226,185,59,0.2)] sm:text-base"
      >
        {phrase}
      </span>
    ) : null,
  ]);
};

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
            <div className="mt-5 inline-flex max-w-2xl items-center rounded-[1.5rem] border border-[#e8ddb6] bg-[linear-gradient(135deg,rgba(255,243,201,0.95),rgba(255,255,255,0.94))] px-5 py-3 shadow-[0_18px_36px_rgba(226,185,59,0.12)]">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.18em] text-[#8a690b] sm:text-[0.95rem] ${
                  language === "te" ? "font-telugu" : ""
                }`}
              >
                {t.badge}
              </p>
            </div>
          </div>

          <div className="section-shell overflow-hidden p-4 sm:p-5">
            <div className="relative mx-auto max-w-[32rem]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(226,185,59,0.22),transparent_42%),linear-gradient(180deg,rgba(245,250,244,0.88),rgba(255,249,237,0.92))]" />
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,#f8f4ec_0%,#f5efe1_100%)] p-3 shadow-[0_24px_50px_rgba(54,89,49,0.14)]">
                <img
                  src={aboutImage}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full rounded-[1.45rem] object-cover object-center shadow-[0_16px_40px_rgba(33,58,39,0.12)]"
                />
              </div>
            </div>
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
                  className={`mt-4 text-balance text-base leading-8 text-theme-body md:text-[1.05rem] md:leading-9 ${
                    language === "te" ? "font-telugu" : ""
                  }`}
                >
                  {highlightPhrase(section.body, language)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="section-shell px-7 py-8">
              <h2 className={`font-heading text-3xl font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                {t.operationsTitle}
              </h2>
              <p
                className={`mt-4 text-balance text-base leading-8 text-theme-body md:text-[1.05rem] md:leading-9 ${
                  language === "te" ? "font-telugu" : ""
                }`}
              >
                {t.operationsBody}
              </p>
            </div>

            <div className="section-shell px-7 py-8">
              <h2 className={`font-heading text-3xl font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                {t.valuesTitle}
              </h2>
              <p
                className={`mt-4 text-balance text-base leading-8 text-theme-body md:text-[1.05rem] md:leading-9 ${
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
          <h2 className={`font-heading text-3xl font-semibold text-theme-heading md:text-4xl ${language === "te" ? "font-telugu" : ""}`}>
            {t.promiseTitle}
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
