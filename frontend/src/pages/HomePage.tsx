import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Globe2, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { brand, homeCategoryCards } from "@/data/site";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const pageWrap = "w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-[1920px] mx-auto";

const homeCopy = {
  en: {
    heroTitle: "Pure Veg Brahmin-Style Pickles, Podulu, and Fryums",
    heroDescription:
      "Sampradaya Pickles makes pure-veg Brahmin-style pickles, podis, and fryums that add clean flavour, homestyle comfort, and everyday meal support without feeling heavy.",
    heroDetails: [
      "Pure Veg Pickles: naturally matured jars that lift simple meals with balanced tang, spice, and appetite-friendly taste.",
      "Podis and Fryums: light, traditional side items that bring quick flavour, crunch, and a homestyle Brahmin feel to daily food.",
    ],
    heroMetrics: [
      { value: "4", label: "Signature categories" },
      { value: "100% Veg", label: "Brahmin-style kitchen" },
    ],
    primaryAction: "Explore Products",
    categoryEyebrow: "Collections",
    categoryTitle: "Salted pickles, tempered pickles, podulu, and fryums",
    categoryDescription:
      "The homepage now leads with the full product architecture so desktop visitors can immediately decide where to go next.",
    promiseEyebrow: "What stays in every batch",
    promiseTitle: "Pure vegetarian preparation, premium packing, and traditional care",
    promiseIntro:
      "From ingredient selection to dispatch, every batch follows a clean and traditional household process so taste, purity, and consistency stay intact.",
    promiseItems: [
      {
        title: "Pure vegetarian kitchen",
        body: "Every product is prepared in a vegetarian kitchen with careful attention to satvik and family-friendly preferences.",
      },
      {
        title: "No preservatives and no palm oil",
        body: "Products are prepared without preservatives and without palm oil so customers get a cleaner, homestyle option for regular meals.",
      },
      {
        title: "Handpicked ingredients and no leakage packing",
        body: "Each order is packed with leak-safe handling so jars and pouches stay fresh and secure in transit.",
      },
    ],
    processEyebrow: "How we prepare and support",
    processTitle: "How to enjoy each category at home",
    processParagraphs: [
      "Salted pickles pair best with hot rice, ghee rice, curd rice, and tiffins. Tempered pickles work beautifully for lunch plates with mudda pappu and plain rice.",
      "Podulu and fryums are ideal for quick meals, simple sides, and a little festive crunch.",
    ],
    processList: [
      "Uppu Pachchalu: mature salt pickle profile with balanced tang and spice for daily use.",
      "Inguva Talimpu: aromatic tempered style with hing-forward flavour for fuller lunch meals.",
      "Podulu and fryums: simple add-ons that bring flavour, crunch, and convenience.",
    ],
    favouritesEyebrow: "Customer pull",
    favouritesTitle: "Favourite orders and premium flavours",
    favouritesDescription:
      "A stronger favourites section helps customers continue scrolling and move deeper into the store instead of bouncing after the first fold.",
    reachEyebrow: "Delivery and enquiries",
    reachTitle: "India orders, USA enquiries, overseas shipping, and direct support",
    reachDescription:
      "Shipping rates are not displayed here. Instead, customers are told that delivery is supported across India and that USA or international orders can be handled after enquiry confirmation.",
    reachPoints: [
      "All India delivery support with secure packaging and careful handling.",
      "USA and overseas enquiries accepted after confirmation.",
    ],
    contactTitle: "Talk to the kitchen team directly",
    contactBody:
      "Phone, WhatsApp, email, and location details are kept visible so customers know there is a real team behind the brand.",
  },
  te: {
    heroTitle: "శుద్ధ శాకాహార బ్రాహ్మణ శైలిలో పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్",
    heroDescription:
      "సంప్రదాయ పికిల్స్‌లో శుద్ధ శాకాహార బ్రాహ్మణ శైలిలో తయారయ్యే పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్ మీ రోజువారీ భోజనానికి తేలికైన రుచి, ఇంటివంట అనుభూతి, మరియు ఉపయుక్తమైన భోజన సహాయాన్ని ఇస్తాయి.",
    heroDetails: [
      "శుద్ధ శాకాహార పచ్చళ్ళు: సహజంగా నానబెట్టిన జార్లు సాధారణ భోజనానికి సమతుల్యమైన పులుపు, కారం, మరియు ఆకలిని పెంచే రుచిని ఇస్తాయి.",
      "పొడులు మరియు ఫ్రైయమ్స్: తేలికైన సంప్రదాయ సైడ్ ఐటమ్స్ రోజువారీ భోజనానికి వెంటనే రుచి, క్రంచ్, మరియు బ్రాహ్మణ ఇంటివంట ఫీల్‌ను తీసుకొస్తాయి.",
    ],
    heroMetrics: [
      { value: "4", label: "ప్రధాన విభాగాలు" },
      { value: "100% Veg", label: "బ్రాహ్మణ శైలి వంటగది" },
    ],
    primaryAction: "ఉత్పత్తులు చూడండి",
    categoryEyebrow: "కలెక్షన్లు",
    categoryTitle: "ఉప్పు పచ్చళ్ళు, తాలింపు పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్",
    categoryDescription:
      "డెస్క్‌టాప్‌లో మొదటి చూపులోనే కస్టమర్ ఏ విభాగం చూడాలో నిర్ణయించుకునేలా పూర్తి ప్రోడక్ట్ నిర్మాణం ఇక్కడే చూపబడుతుంది.",
    promiseEyebrow: "ప్రతి బ్యాచ్‌లో ఉండేది ఇదే",
    promiseTitle: "శుద్ధ శాకాహార తయారీ, ప్రీమియం ప్యాకింగ్, సంప్రదాయ శ్రద్ధ",
    promiseIntro:
      "పదార్థాల ఎంపిక నుండి డిస్పాచ్ వరకు ప్రతి బ్యాచ్‌ను శుభ్రమైన, సంప్రదాయ ఇంటివంట ప్రక్రియతో నిర్వహించి రుచి, స్వచ్ఛత, మరియు స్థిరత్వాన్ని కాపాడుతాం.",
    promiseItems: [
      {
        title: "శుద్ధ శాకాహార వంటగది",
        body: "ప్రతి ఉత్పత్తి సాత్విక మరియు కుటుంబానికి అనువైన అభిరుచులను దృష్టిలో ఉంచుకుని శుద్ధ శాకాహార వంటగదిలో తయారవుతుంది.",
      },
      {
        title: "ప్రిజర్వేటివ్‌లు లేవు, పామ్ ఆయిల్ లేదు",
        body: "ప్రిజర్వేటివ్‌లు మరియు పామ్ ఆయిల్ లేకుండా తయారు చేయడం వల్ల రోజువారీ భోజనాలకు శుభ్రమైన, ఇంటివంట తరహా ఎంపిక లభిస్తుంది.",
      },
      {
        title: "ఎంచుకున్న పదార్థాలు, లీకేజీ లేని ప్యాకింగ్",
        body: "ప్రతి ఆర్డర్‌ను లీకేజీ-సేఫ్ విధానంలో ప్యాక్ చేసి జార్లు, పౌచ్‌లు ప్రయాణంలో తాజాగా మరియు సురక్షితంగా చేరేలా చూస్తాం.",
      },
    ],
    processEyebrow: "తయారీ మరియు సపోర్ట్",
    processTitle: "ప్రతి విభాగాన్ని ఎలా తింటారు",
    processParagraphs: [
      "ఉప్పు పచ్చళ్ళు వేడి అన్నం, నెయ్యి అన్నం, పెరుగు అన్నంతో చాలా బాగా సరిపోతాయి. ఇంగువ తాలింపు పచ్చళ్ళు ముద్దపప్పు-అన్నం వంటి మధ్యాహ్న భోజనంతో అద్భుతంగా రుచిస్తాయి.",
      "పొడులు వేడి అన్నం-నెయ్యితో తక్షణ భోజనానికి అనువైనవి. అప్పడాలు, వడియాలు రోజువారీ భోజనం మరియు పండుగ విందుకు క్రంచ్‌ను ఇస్తాయి.",
    ],
    processList: [
      "ఉప్పు పచ్చళ్ళు: రోజువారీ వాడకానికి తగిన సహజ ఉప్పు రుచి.",
      "ఇంగువ తాలింపు: ఇంగువ వాసనతో ఘనమైన మధ్యాహ్న భోజన రుచి.",
      "పొడులు: సాధారణ ఇంటి ఆహారానికి సులభమైన ప్రోటీన్-రిచ్ సహాయం.",
      "అప్పడాలు, వడియాలు: శుద్ధ శాకాహార ప్లేట్‌కి సంప్రదాయ క్రంచ్ జోడింపు.",
    ],
    favouritesEyebrow: "ఎక్కువగా ఆర్డర్ చేసే వాటి జాబితా",
    favouritesTitle: "కస్టమర్‌కి బాగా నచ్చిన రుచులు",
    favouritesDescription:
      "ఈ విభాగం వల్ల మొదటి స్క్రీన్‌ దగ్గరే ఆగిపోకుండా కస్టమర్ మరింత లోపలికి వెళ్తాడు.",
    reachEyebrow: "డెలివరీ మరియు సపోర్ట్",
    reachTitle: "భారతదేశం, USA, విదేశీ ఆర్డర్లు మరియు నేరుగా సంప్రదింపు",
    reachDescription:
      "షిప్పింగ్ ధరలు ఇక్కడ చూపించడం లేదు. దాని బదులు భారత్ అంతటా డెలివరీ, USA మరియు విదేశీ ఆర్డర్లకు enquiry ఆధారంగా సహాయం అందిస్తామని చెప్తాం.",
    reachPoints: [
      "భారతదేశం అంతటా సురక్షితమైన ప్యాకింగ్‌తో డెలివరీ సపోర్ట్.",
      "USA మరియు విదేశీ ఆర్డర్లకు enquiry తరువాత సహాయం.",
      "బల్క్ ఆర్డర్లకు ప్రత్యేకంగా నేరుగా మాట్లాడి ప్యాకింగ్, పంపిణీ ప్లాన్ చేయడం.",
    ],
    contactTitle: "కిచెన్ టీమ్‌తో నేరుగా మాట్లాడండి",
    contactBody:
      "ఫోన్, వాట్సాప్, ఈమెయిల్, లొకేషన్ అన్నీ స్పష్టంగా కనపడాలి. అప్పుడు కస్టమర్‌కు ఇది నిజమైన కుటుంబ బ్రాండ్ అని నమ్మకం వస్తుంది.",
  },
} as const;

/* ── Reusable eyebrow badge ── */
const Eyebrow = ({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "gold" }) =>
  variant === "gold" ? (
    <span className="inline-flex items-center rounded-full border border-[#ebd590]/60 bg-white/80 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#956d00] shadow-sm backdrop-blur-md">
      {children}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-[#edf5ee] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#2f7a43]">
      {children}
    </span>
  );

/* ── Reusable section heading ── */
const SectionHeading = ({
  children,
  className = "",
  isTelugu = false,
}: {
  children: React.ReactNode;
  className?: string;
  isTelugu?: boolean;
}) => (
  <h2
    className={`font-heading text-4xl font-bold tracking-[-0.02em] text-theme-heading md:text-5xl lg:text-[3.25rem] lg:leading-[1.08] ${
      isTelugu ? "font-telugu leading-[1.2]" : "leading-tight"
    } ${className}`}
  >
    {children}
  </h2>
);

const HomePage = () => {
  const { products, bestSellers } = useStore();
  const { language } = useLanguage();
  const t = homeCopy[language];
  const isTe = language === "te";

  const visibleHomeCategories = homeCategoryCards.slice(0, 4);

  const featuredProducts = useMemo(() => {
    const source = bestSellers.length > 0 ? bestSellers : products;
    const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
    const pickles = shuffle(source.filter((p) => p.category === "pickles")).slice(0, 5);
    const powders = shuffle(source.filter((p) => p.category === "powders")).slice(0, 5);
    const fryums = shuffle(source.filter((p) => p.category === "fryums")).slice(0, 5);
    const selected = [...pickles, ...powders, ...fryums];
    const selectedIds = new Set(selected.map((p) => p.id));
    const fallback = shuffle(source.filter((p) => !selectedIds.has(p.id))).slice(0, Math.max(0, 15 - selected.length));
    return shuffle([...selected, ...fallback]).slice(0, 15);
  }, [bestSellers, products]);

  const contactLinks = [
    { icon: WhatsAppLogo, text: brand.whatsappDisplay, href: brand.whatsappUrl, blank: true },
    ...brand.phoneNumbers.map((number) => ({
      icon: Phone,
      text: number,
      href: `tel:${number.replace(/[^+\d]/g, "")}`,
    })),
    { icon: Mail, text: brand.supportEmail, href: `mailto:${brand.supportEmail}` },
    { icon: MapPin, text: brand.address, href: brand.mapUrl, blank: true },
  ];

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="Sampradaya Traditional Pickles | Pure Veg Pickles, Podulu & Fryums"
        description="Sampradaya Traditional Pickles offers authentic homemade Andhra pickles, podulu, and fryums with direct order support."
        image={brand.logo}
      />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="border-b border-[#d8e5d8]/50 bg-gradient-to-b from-[#fffefa] to-[#f6faf5]">
        <div className={`${pageWrap} grid gap-10 pb-20 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-16`}>

          {/* Left: copy */}
          <div className="space-y-10">
            {/* Eyebrow + headline + description */}
            <div className="space-y-5">
              {/* Hero headline — tighter tracking, larger on XL */}
              <h1 className={`text-balance font-heading text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-theme-heading sm:text-5xl md:text-6xl xl:text-[4rem] ${isTe ? "font-telugu leading-[1.2]" : ""}`}>
                {t.heroTitle}
              </h1>

              <p className={`max-w-xl text-lg leading-relaxed text-theme-body/80 md:text-xl ${isTe ? "font-telugu" : ""}`}>
                {t.heroDescription}
              </p>
            </div>

            {/* Bullet details */}
            <ul className="space-y-4">
              {t.heroDetails.map((detail) => (
                <li key={detail} className="flex items-start gap-3.5">
                  {/* Premium pulsing dot */}
                  <span className="relative mt-[0.45rem] flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-south-green opacity-25" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-south-green" />
                  </span>
                  <p className={`text-base leading-relaxed text-theme-body md:text-[1.05rem] ${isTe ? "font-telugu" : ""}`}>
                    {detail}
                  </p>
                </li>
              ))}
            </ul>

            {/* Metric cards — glassmorphic, subtle glow on hover */}
            <div className="grid max-w-lg grid-cols-2 gap-4">
              {t.heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="group relative overflow-hidden rounded-2xl border border-[#dce8dc]/60 bg-white/60 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-[0_8px_24px_rgba(30,79,46,0.08)]"
                >
                  {/* Warm glow blob */}
                  <div className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rounded-full bg-[#f6c443]/15 blur-xl transition-all duration-500 group-hover:bg-[#f6c443]/30" />
                  <p className="text-[2rem] font-extrabold leading-none tracking-tight text-theme-heading">{metric.value}</p>
                  <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-theme-body/60 ${isTe ? "font-telugu" : ""}`}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <PrimaryButton
              to="/products"
              className="inline-flex w-full sm:w-auto px-8 py-4 text-[0.95rem] font-bold tracking-wide
                active:scale-[0.97] transition-all duration-200
                !border-[#c98b00] !bg-[#f6c443] !text-[#163221]
                shadow-[0_6px_20px_rgba(201,139,0,0.18)]
                hover:!bg-[#ebb125] hover:shadow-[0_10px_28px_rgba(201,139,0,0.28)]
                [&_svg]:text-[#163221]"
              icon={<ShoppingBag className="h-4.5 w-4.5" />}
            >
              {t.primaryAction}
            </PrimaryButton>
          </div>

          {/* Right: logo shell — only on lg+ */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-[2rem] border border-[#d8e5d8]/50 bg-white/70 p-4 shadow-[0_16px_56px_rgba(30,79,46,0.07)] backdrop-blur-xl">
              {/* Image area */}
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_20%,#fff9e6,#f0f6ef_50%,#e3efe4)]">
                <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-black/[0.04]" />
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-full object-contain p-8 drop-shadow-lg transition-transform duration-700 hover:scale-[1.04]"
                />
              </div>

              {/* Info panel */}
              <div className="mt-4 rounded-[1.25rem] border border-[#d8e5d8]/40 bg-[#f8faf6] p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#956d00]">
                  {isTe ? "బ్రాండ్ సంప్రదాయం" : "Brahmin-style preparation"}
                </p>
                <p className={`mt-2 text-sm leading-relaxed text-theme-body/80 ${isTe ? "font-telugu" : ""}`}>
                  {isTe
                    ? "శుద్ధ శాకాహార వంటగదిలో శుభ్రత, జాగ్రత్త తాలింపు, నాణ్యమైన పదార్థాలతో ప్రతి బ్యాచ్ తయారవుతుంది."
                    : "Each batch is prepared in a clean pure-veg kitchen with careful tempering and quality ingredients."}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {[
                    isTe ? "ఉప్పు, తాలింపు, పొడి, ఫ్రైయమ్స్ అన్ని శుద్ధ శాకాహార పద్ధతిలో" : "Salted pickles, tempered pickles, podulu, and fryums made the same way",
                    isTe ? "ఇంటి రుచిని ఉంచే చిన్న బ్యాచ్ తయారీ" : "Small-batch preparation that keeps the homestyle taste intact",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-[0.4rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-south-green/70" />
                      <p className={`text-sm text-theme-body/80 ${isTe ? "font-telugu" : ""}`}>{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORY CARDS
      ══════════════════════════════════════ */}
      <section className={`${pageWrap} py-10 md:py-14`}>
        {/* Section header */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Eyebrow variant="green">{t.categoryEyebrow}</Eyebrow>
          <SectionHeading isTelugu={isTe}>{t.categoryTitle}</SectionHeading>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {visibleHomeCategories.map((category) => (
            <Link
              key={category.key}
              to={category.to}
              className="group block overflow-hidden rounded-[1.75rem] border border-[#dce8dc]/60 bg-white
                shadow-[0_4px_16px_rgba(30,79,46,0.04)]
                transition-all duration-500
                hover:-translate-y-2
                hover:shadow-[0_20px_48px_rgba(30,79,46,0.1)]
                hover:border-[#b4ccb4]"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-[#f2f7f2]">
                <img
                  src={category.image}
                  alt={isTe ? category.labelTe : category.label}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/4.2] w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
              </div>

              {/* Text */}
              <div className="p-5">
                <h3 className={`font-heading text-lg font-bold leading-tight text-theme-heading ${isTe ? "font-telugu" : ""}`}>
                  {isTe ? category.labelTe : category.label}
                </h3>
                <p className={`mt-1.5 text-sm leading-relaxed text-theme-body/70 ${isTe ? "font-telugu" : ""}`}>
                  {isTe ? category.descriptionTe : category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROMISE / TRUST
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-[#d8e5d8]/40 bg-[radial-gradient(circle_at_14%_22%,rgba(247,220,147,0.14)_0%,rgba(247,220,147,0)_46%),radial-gradient(circle_at_88%_8%,rgba(35,122,71,0.07)_0%,rgba(35,122,71,0)_44%),linear-gradient(180deg,#fff9ed,#faf7f2)]">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#f0d288]/15 blur-[100px]" />
        <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-[#2e7f4c]/8 blur-[100px]" />

        <div className={`${pageWrap} relative grid gap-10 py-10 md:py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14`}>
          {/* Left copy */}
          <div className="max-w-lg space-y-6">
            <Eyebrow variant="gold">{t.promiseEyebrow}</Eyebrow>
            <SectionHeading isTelugu={isTe}>{t.promiseTitle}</SectionHeading>
            <p className={`text-lg leading-relaxed text-theme-body/80 md:text-xl ${isTe ? "font-telugu" : ""}`}>
              {t.promiseIntro}
            </p>
          </div>

          {/* Right cards */}
          <div className="space-y-4">
            {t.promiseItems.map((item, index) => (
              <div
                key={item.title}
                className="group flex items-start gap-5 rounded-2xl border border-[#e3dbc4]/40 bg-white/55 p-6 backdrop-blur-md
                  shadow-[0_4px_16px_rgba(48,44,33,0.03)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-white/85
                  hover:shadow-[0_16px_40px_rgba(48,44,33,0.07)]"
              >
                {/* Numbered badge */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#e7d195]/60 bg-gradient-to-br from-[#fff4d0] to-[#ffe8a1] text-sm font-black text-[#8a6410] shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {index + 1}
                </div>
                <div>
                  <h3 className={`font-bold text-theme-heading ${isTe ? "font-telugu text-base" : "text-[1.05rem]"}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed text-theme-body/75 ${isTe ? "font-telugu" : ""}`}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════ */}
      <section className="border-b border-[#d8e5d8]/40 bg-gradient-to-b from-[#fffefa] to-[#f7fbf7]">
        <div className={`${pageWrap} py-10 md:py-14`}>
          {/* Header */}
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <Eyebrow variant="gold">{t.favouritesEyebrow}</Eyebrow>
            <SectionHeading isTelugu={isTe}>{t.favouritesTitle}</SectionHeading>
          </div>

          {/* Product grid */}
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isAvailable={product.isAvailable}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESS / HOW TO ENJOY
      ══════════════════════════════════════ */}
      <section className={`${pageWrap} grid gap-10 py-10 md:py-14 lg:grid-cols-2 lg:items-center lg:gap-14`}>
        {/* Left */}
        <div className="max-w-xl space-y-6">
          <Eyebrow variant="green">{t.processEyebrow}</Eyebrow>
          <SectionHeading isTelugu={isTe}>{t.processTitle}</SectionHeading>
          <div className="space-y-5">
            {t.processParagraphs.map((para) => (
              <p key={para} className={`text-[1.05rem] leading-relaxed text-theme-body/80 ${isTe ? "font-telugu" : ""}`}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Right: numbered timeline */}
        <div className="rounded-[1.75rem] border border-[#dce8dc]/60 bg-white/50 p-6 backdrop-blur-xl sm:p-10">
          <div className="space-y-7">
            {t.processList.map((item, index) => (
              <div key={item} className="group flex gap-5">
                {/* Circle + connector */}
                <div className="relative flex flex-col items-center">
                  <div className="z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#e2b93b] bg-[#fff9e6] text-xs font-black text-[#c98b00] transition-all duration-300 group-hover:border-[#c98b00] group-hover:bg-[#e2b93b] group-hover:text-white">
                    {index + 1}
                  </div>
                  {index !== t.processList.length - 1 && (
                    <div className="absolute top-9 mt-1 h-full w-px bg-gradient-to-b from-[#e2b93b]/30 to-transparent" />
                  )}
                </div>
                <p className={`pt-1 text-[0.95rem] leading-relaxed text-theme-body transition-transform duration-300 group-hover:translate-x-0.5 ${isTe ? "font-telugu" : ""}`}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REACH + CONTACT
      ══════════════════════════════════════ */}
      <section className={`${pageWrap} grid gap-6 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:items-stretch`}>

        {/* Delivery info */}
        <div className="flex flex-col rounded-[1.75rem] border border-[#dce8dc]/60 bg-[#f8faf6] p-8 sm:p-10">
          <Eyebrow variant="green">{t.reachEyebrow}</Eyebrow>
          <SectionHeading className="mt-5 !text-3xl md:!text-4xl" isTelugu={isTe}>{t.reachTitle}</SectionHeading>
          <p className={`mt-4 text-base leading-relaxed text-theme-body/80 ${isTe ? "font-telugu" : ""}`}>
            {t.reachDescription}
          </p>

          <ul className="mt-8 space-y-4">
            {t.reachPoints.map((point) => (
              <li key={point} className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#fff3c9] text-[#956d00] shadow-sm">
                  <Globe2 className="h-4 w-4" />
                </div>
                <p className={`pt-1.5 text-sm font-medium leading-relaxed text-theme-heading ${isTe ? "font-telugu" : ""}`}>
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col rounded-[1.75rem] border border-[#dce8dc]/60 bg-white p-8 shadow-[0_8px_32px_rgba(30,79,46,0.05)] sm:p-10">
          <Eyebrow variant="gold">{t.contactTitle}</Eyebrow>
          <p className={`mt-5 text-base leading-relaxed text-theme-body/80 ${isTe ? "font-telugu" : ""}`}>
            {t.contactBody}
          </p>

          <div className="mt-8 flex flex-col gap-2">
            {contactLinks.map((contact, idx) => (
              <a
                key={idx}
                href={contact.href}
                target={contact.blank ? "_blank" : undefined}
                rel={contact.blank ? "noreferrer" : undefined}
                className="group flex items-center gap-4 rounded-xl border border-transparent p-3.5 transition-all duration-200 hover:border-[#dce8dc] hover:bg-[#f8faf6]"
              >
                {/* Icon circle */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#edf5ee] text-[#2f7a43] transition-colors duration-200 group-hover:bg-south-green group-hover:text-white">
                  <contact.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-theme-heading transition-colors duration-200 group-hover:text-south-green">
                  {contact.text}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;