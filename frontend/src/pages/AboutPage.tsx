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
      "No onion and no garlic options wherever the recipe allows.",
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
    eyebrow: "బ్రాండ్ గురించి",
    title: "సాత్విక రుచి, బ్రాహ్మణ సంప్రదాయం, ఇంటి శ్రద్ధతో నిలిచిన మా కథ",
    sections: [
      {
        title: "బ్రాహ్మణ ఇంటి వంట సంప్రదాయమే మా మూలం",
        body:
          "SP Traditional Pickles అంటే ఆంధ్ర బ్రాహ్మణ ఇంటి వంటగదిలో ఉండే శుభ్రత, శ్రద్ధ, రుచి గుర్తుకు వచ్చేలా ఉండాలి అనే భావనతో ప్రారంభమైనది. మా పచ్చళ్ళు, పొడులు, వడియాలు ఫ్యాక్టరీ తయారీలా కాకుండా ఇంట్లో ప్రేమగా చేసిన రుచిని గుర్తు చేయాలి అనేదే మా ఉద్దేశ్యం.",
      },
      {
        title: "సాంప్రదాయ పద్ధతిలో సాత్విక తయారీ",
        body:
          "మేము శుద్ధ శాకాహార విధానాన్ని పాటిస్తూ, ఎన్నుకున్న పదార్థాలతో చిన్న చిన్న బ్యాచ్‌లలో తయారీ చేస్తాము. బ్రాహ్మణ శైలిలో ఉండే మితమైన మసాలా, సమతుల్యమైన రుచి, ఇంటి వంటలో ఉండే ఆత్మీయత మా ప్రతి ఉత్పత్తిలో కనిపించాలి అనేది మా ప్రయత్నం.",
      },
      {
        title: "మళ్లీ మళ్లీ కొనాలనిపించే నమ్మకం",
        body:
          "రుచి మాత్రమే కాదు, ఆ రుచి వెనుక ఉన్న మనుషులు, వారి నిబద్ధత, వారి శ్రద్ధ కూడా ముఖ్యం. అందుకే మా తయారీ విధానం, ప్యాకింగ్, కస్టమర్‌తో మాట్లాడే తీరు అన్నీ నిజాయితీగా, దగ్గరదనంతో ఉండేలా చూసుకుంటాము.",
      },
    ],
    commitments: [
      "బ్రాహ్మణ ఇంటి వంటశైలిని గుర్తు చేసే శుద్ధ శాకాహార తయారీ.",
      "సాధ్యమైన చోట ఉల్లి, వెల్లుల్లి లేకుండా ఉండే ఎంపికలు.",
      "అతి ప్రాసెసింగ్ కాకుండా ఇంటి రుచిని కాపాడే విధానం.",
      "శుభ్రంగా, బాగా మూసివేసిన ప్యాకింగ్‌తో సురక్షిత డెలివరీపై శ్రద్ధ.",
    ],
    operationsTitle: "మా పని చేసే విధానం",
    operationsBody:
      "పదార్థాల ఎంపిక నుంచి ప్రతి బ్యాచ్ తయారీ వరకు, ఆ తర్వాత ప్యాకింగ్ చేసి కస్టమర్‌కు చేరే దాకా మేము ఇంటి వంటలో ఉండే శ్రద్ధను పాటిస్తాము. ఆర్డర్ తీసుకునే విధానమూ, కస్టమర్‌తో మాట్లాడే తీరుగానీ సూటిగా, ఆప్యాయంగా ఉంటాయి.",
    valuesTitle: "కుటుంబాలు మాతో ఎందుకు కలిసిపోతాయి",
    valuesBody:
      "మా దగ్గర రుచి మాత్రమే కాదు, దాని వెనుక ఉన్న సంప్రదాయం కూడా ముఖ్యం. సాత్వికత, శుభ్రత, కుటుంబానికి పెట్టే బాధ్యత ఇవన్నీ కలిసినప్పుడు మాత్రమే ఆహారం మనసుకు నచ్చుతుంది. అదే అనుభూతిని ప్రతి ఆర్డర్‌లో ఇవ్వాలనుకుంటాము.",
    promiseTitle: "మా బ్రాండ్ హామీలు",
    badge: "సాత్విక సంప్రదాయం. ఇంటి వంట శ్రద్ధ. నమ్మకంగా చేరే రుచి.",
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
    titleTe: "ఇంటి వంట శ్రద్ధ",
    icon: HeartHandshake,
  },
  {
    title: "Secure packing",
    titleTe: "సురక్షిత ప్యాకింగ్",
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
