import {
  categoryMap,
  type Category,
  type CategoryKey,
  type PaymentMethodId,
  type Product,
  type ProductSize,
} from "@/content/storefront";

export type LanguageCode = "en" | "te";

const categoryTranslations: Record<
  CategoryKey,
  Pick<Category, "title" | "shortTitle" | "description" | "eyebrow">
> = {
  pickles: {
    title: "ఆంధ్ర ఇంటి పచ్చళ్లు",
    shortTitle: "పచ్చళ్లు",
    description: "మామిడి, గోంగూర, నిమ్మకాయ, టమాటా వంటి ఇంటి రుచులు ఉన్న చిన్న బ్యాచ్ పచ్చళ్లు.",
    eyebrow: "ఎక్కువగా కొనబడేవి",
  },
  powders: {
    title: "అన్నం, ఇడ్లీ, దోశ కోసం పొడులు",
    shortTitle: "పొడులు",
    description: "వేడి అన్నం, ఇడ్లీ, దోశలతో తినడానికి రుచికరమైన రెడీ పొడి మిశ్రణలు.",
    eyebrow: "రోజూ ఉపయోగించే పదార్థాలు",
  },
  fryums: {
    title: "వడియాలు, అప్పడాలు, కరకరల సైడ్లు",
    shortTitle: "వడియాలు",
    description: "సాధారణ భోజనానికి తక్షణం కరకరల ఆనందం ఇచ్చే సంప్రదాయ సైడ్ ఐటమ్స్.",
    eyebrow: "భోజనానికి కరకరల తోడు",
  },
  combos: {
    title: "ఫ్యామిలీ కాంబోలు మరియు గిఫ్ట్ ప్యాక్స్",
    shortTitle: "కాంబోలు",
    description: "ఫ్యామిలీ స్టార్టర్ బాక్సులు, బహుమతి ప్యాక్స్, కొత్తగా కొనేవారికి ఎంపిక చేసిన సెట్లు.",
    eyebrow: "అత్యంత విలువైన సెట్లు",
  },
};

const productTranslations: Record<
  string,
  {
    name: string;
    subtitle: string;
    description: string;
    tags: string[];
    deliveryNote: string;
    sizes?: Record<string, { label: string; serves: string }>;
  }
> = {
  "royal-avakaya": {
    name: "రాయల్ ఆవకాయ",
    subtitle: "సిగ్నేచర్ మామిడి పచ్చడి",
    description: "మామిడి ముక్కలు, ఆవాలు, మిరపకారం కలిసిన బలమైన ఆంధ్ర రుచి.",
    tags: ["బెస్ట్ సెల్లర్", "చేతితో కలిపింది", "ఇంటి రుచి"],
    deliveryNote: "ఉష్ణోగ్రతకు సురక్షితమైన జార్లలో పంపిస్తాం.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "2 నుంచి 3 భోజనాలు" },
      "500g": { label: "500 గ్రా", serves: "కుటుంబ పరిమాణం" },
      "1kg": { label: "1 కిలో", serves: "స్టాక్ చేసుకునే జార్" },
    },
  },
  "gongura-garlic": {
    name: "గోంగూర వెల్లుల్లి పచ్చడి",
    subtitle: "పులుపు మరియు ఆంధ్ర స్టైల్",
    description: "గోంగూర ఆకులు, వెల్లుల్లి, నువ్వుల నూనెతో చేసిన పులుపు రుచిగల పచ్చడి.",
    tags: ["పులుపు రుచి", "వెల్లుల్లి ఎక్కువ", "అన్నానికి చక్కగా సరిపోతుంది"],
    deliveryNote: "లీక్ కాకుండా బిగుతుగా ప్యాక్ చేస్తాం.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "2 నుంచి 3 భోజనాలు" },
      "500g": { label: "500 గ్రా", serves: "వారానికి సరిపడే పరిమాణం" },
      "1kg": { label: "1 కిలో", serves: "పెద్ద కుటుంబానికి" },
    },
  },
  "lemon-chilli": {
    name: "నిమ్మకాయ మిర్చి పచ్చడి",
    subtitle: "ఉప్పు, పులుపు, కారపు రుచి",
    description: "పెరుగన్నం, పప్పన్నం, లంచ్‌బాక్స్ భోజనాలకు బాగా సరిపోయే తేలికపాటి పచ్చడి.",
    tags: ["తాజా సిట్రస్ రుచి", "లంచ్‌బాక్స్ ఫేవరెట్", "సమతుల్య రుచి"],
    deliveryNote: "తెరిచిన తరువాత 90 రోజుల లోపు వాడితే బాగుంటుంది.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "ఒక్కరికి సరిపడే పరిమాణం" },
      "500g": { label: "500 గ్రా", serves: "చిన్న కుటుంబానికి" },
      "1kg": { label: "1 కిలో", serves: "విలువ ప్యాక్" },
    },
  },
  "tomato-thokku": {
    name: "టమాటో తొక్కు",
    subtitle: "మృదువైన ఇంటి రుచి",
    description: "ఇడ్లీ, దోశ, చపాతీ, పెరుగన్నంతో తినడానికి మందపాటి టమాటో తొక్కు.",
    tags: ["పిల్లలకు ఇష్టం", "బహుముఖంగా ఉపయోగించవచ్చు", "మృదువైన టెక్స్చర్"],
    deliveryNote: "తెరిచిన తరువాత ఫ్రిజ్‌లో ఉంచితే మంచి రుచి ఉంటుంది.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "ట్రయల్ ప్యాక్" },
      "500g": { label: "500 గ్రా", serves: "కుటుంబ టేబుల్ కోసం" },
      "1kg": { label: "1 కిలో", serves: "పెద్ద పరిమాణం" },
    },
  },
  "idli-karam-podi": {
    name: "ఇడ్లీ కారం పొడి",
    subtitle: "బ్రేక్‌ఫాస్ట్‌కు బెస్ట్",
    description: "వేసిన పప్పులు, మిరప, వెల్లుల్లితో చేసిన ఇడ్లీ దోశల రుచిని పెంచే పొడి.",
    tags: ["బ్రేక్‌ఫాస్ట్ ఫేవరెట్", "తాజాగా వేసింది", "ప్రయాణానికి సౌకర్యం"],
    deliveryNote: "సువాసన నిల్వ ఉండే పౌచ్‌లలో ప్యాక్ చేస్తాం.",
    sizes: {
      "200g": { label: "200 గ్రా", serves: "స్టార్టర్ సైజ్" },
      "400g": { label: "400 గ్రా", serves: "సాధారణ ఉపయోగం" },
      "800g": { label: "800 గ్రా", serves: "కుటుంబ రీఫిల్" },
    },
  },
  "kandi-podi": {
    name: "కంది పొడి",
    subtitle: "సంప్రదాయ ఆంధ్ర పొడి",
    description: "నెయ్యి కలిపిన వేడి అన్నంతో తినడానికి ఎంతో ఇష్టపడే కంఫర్ట్ పొడి.",
    tags: ["కంఫర్ట్ స్టేపుల్", "మళ్లీ మళ్లీ కొనేది", "అన్నం ప్రేమికుల కోసం"],
    deliveryNote: "తక్కువ తేమతో మెత్తగా గ్రైండ్ చేసి ప్యాక్ చేస్తాం.",
    sizes: {
      "200g": { label: "200 గ్రా", serves: "స్టార్టర్ సైజ్" },
      "400g": { label: "400 గ్రా", serves: "సాధారణ ఉపయోగం" },
      "800g": { label: "800 గ్రా", serves: "విలువ రీఫిల్" },
    },
  },
  "karivepaku-podi": {
    name: "కరివేపాకు పొడి",
    subtitle: "కరివేపాకు మరియు నువ్వుల మిశ్రమం",
    description: "వేడి అన్నం లేదా మిల్లెట్‌తో తినడానికి మృదువైన సువాసన గల పొడి.",
    tags: ["సువాసనగలది", "ఆరోగ్యకరం", "రోజూ తినదగినది"],
    deliveryNote: "తెరిచిన తరువాత 45 రోజుల్లో ఉపయోగిస్తే మంచి రుచి ఉంటుంది.",
    sizes: {
      "200g": { label: "200 గ్రా", serves: "స్టార్టర్ సైజ్" },
      "400g": { label: "400 గ్రా", serves: "కుటుంబ వినియోగం" },
      "800g": { label: "800 గ్రా", serves: "బల్క్ సేవర్" },
    },
  },
  "saggubiyyam-vadiyalu": {
    name: "సగ్గుబియ్యం వడియాలు",
    subtitle: "సన్-డ్రైడ్ సబ్బకీ ఫ్రైమ్స్",
    description: "పప్పు, రసం, అన్నంతో తినడానికి తక్షణం కరకరల ఆనందం ఇచ్చే వడియాలు.",
    tags: ["పండుగలకు సరైనవి", "కరకరల", "పిల్లలకు ఇష్టం"],
    deliveryNote: "రూపం చెడకుండా జాగ్రత్తగా ప్యాక్ చేస్తాం.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "ఒక వారం" },
      "500g": { label: "500 గ్రా", serves: "కుటుంబ పరిమాణం" },
      "1kg": { label: "1 కిలో", serves: "పార్టీ స్టాక్" },
    },
  },
  "minapa-appadalu": {
    name: "మినప్పప్పు అప్పడాలు",
    subtitle: "సాంప్రదాయ ఉరడ్ పాపడ్",
    description: "వేగంగా వేయించగల, భోజనానికి అద్భుతమైన కరకరలతోడు ఇచ్చే అప్పడాలు.",
    tags: ["తక్షణం వేయించవచ్చు", "టేబుల్ ఫేవరెట్", "అన్నింటికీ సరిపోతుంది"],
    deliveryNote: "గాలి చొరబడని డబ్బాలో ఉంచితే మరింత కరకరలగా ఉంటాయి.",
    sizes: {
      "250g": { label: "250 గ్రా", serves: "స్టార్టర్" },
      "500g": { label: "500 గ్రా", serves: "కుటుంబ పరిమాణం" },
      "1kg": { label: "1 కిలో", serves: "స్టాక్ ప్యాక్" },
    },
  },
  "family-starter-combo": {
    name: "ఫ్యామిలీ స్టార్టర్ కాంబో",
    subtitle: "మూడు జార్లు మరియు ఒక పొడి",
    description: "మామిడి, గోంగూర, నిమ్మకాయ పచ్చళ్లు మరియు ఇడ్లీ కారం పొడి కలిగిన విలువైన కాంబో.",
    tags: ["టాప్ గిఫ్ట్", "బెస్ట్ విల్యూ", "మొదటిసారి కొనేవారికి"],
    deliveryNote: "గిఫ్టింగ్‌కు బలమైన బాక్స్‌లో పంపిస్తాం.",
    sizes: {
      "Combo box": { label: "కాంబో బాక్స్", serves: "4 ఉత్పత్తులు" },
      "Double combo": { label: "డబుల్ కాంబో", serves: "8 ఉత్పత్తులు" },
    },
  },
  "festive-gifting-hamper": {
    name: "పండుగ గిఫ్టింగ్ హ్యాంపర్",
    subtitle: "క్లయింట్లకు సరైన ప్రీమియం బాక్స్",
    description: "రెండు పచ్చళ్లు, ఒక పొడి, ఒక వడియాల ప్యాక్‌తో కూడిన ఆకర్షణీయమైన బహుమతి ప్యాక్.",
    tags: ["కార్పొరేట్ గిఫ్టింగ్", "ప్రీమియం బాక్స్", "సీజనల్"],
    deliveryNote: "బల్క్ గిఫ్టింగ్‌కు ముందస్తు సమాచారం ఇస్తే స్లాట్లు ఇస్తాం.",
    sizes: {
      "Single hamper": { label: "సింగిల్ హ్యాంపర్", serves: "4 ఉత్పత్తులు" },
      "Set of 5": { label: "5 హ్యాంపర్ల సెట్", serves: "టీమ్ గిఫ్టింగ్" },
    },
  },
  "ready-to-mix-rice-pack": {
    name: "రెడీ టు మిక్స్ రైస్ ప్యాక్",
    subtitle: "ప్రయాణానికి సులభమైన మీల్ కిట్",
    description: "పులిహోర మిక్స్, పొడి, తోడు పదార్థాలతో ప్రయాణం లేదా బహుమతికి సరైన కిట్.",
    tags: ["ట్రావెల్ రెడీ", "త్వరిత భోజనం", "మోడర్న్ ఫేవరెట్"],
    deliveryNote: "అపార్ట్‌మెంట్ గిఫ్టింగ్ మరియు ప్రయాణాలకు అనుకూలం.",
    sizes: {
      "Starter kit": { label: "స్టార్టర్ కిట్", serves: "2 నుంచి 3 రోజులు" },
      "Family kit": { label: "ఫ్యామిలీ కిట్", serves: "ఒక వారం" },
    },
  },
};

const paymentMethodTranslations: Record<
  PaymentMethodId,
  { title: string; description: string }
> = {
  upi: {
    title: "యూపీఐ",
    description: "యూపీఐ ద్వారా వెంటనే చెల్లించి ఆర్డర్ రిఫరెన్స్‌ను షేర్ చేయండి.",
  },
  cards: {
    title: "కార్డ్ / నెట్ బ్యాంకింగ్",
    description: "సురక్షిత చెల్లింపు కోసం కార్డ్ లేదా నెట్ బ్యాంకింగ్ ఉపయోగించండి.",
  },
  cod: {
    title: "డెలివరీ సమయంలో నగదు",
    description: "కొన్ని పిన్‌కోడ్‌లలో క్యాష్ ఆన్ డెలివరీ అందుబాటులో ఉంటుంది.",
  },
  bank: {
    title: "బ్యాంక్ ట్రాన్స్‌ఫర్",
    description: "పెద్ద కుటుంబ ఆర్డర్లు మరియు వ్యాపార గిఫ్టింగ్ కోసం అనుకూలం.",
  },
};

const navTranslations: Record<string, string> = {
  "/": "హోమ్",
  "/products": "షాప్",
  "/about": "మన కథ",
  "/checkout": "చెల్లింపు",
  "/contact": "సంప్రదించండి",
};

export const getNavLabel = (to: string, fallback: string, language: LanguageCode) =>
  language === "te" ? navTranslations[to] ?? fallback : fallback;

export const getCategoryContent = (
  category: Category,
  language: LanguageCode,
): Category => {
  if (language === "en") {
    return category;
  }

  return {
    ...category,
    ...categoryTranslations[category.key],
  };
};

export const getCategoryByKey = (key: CategoryKey, language: LanguageCode) =>
  getCategoryContent(categoryMap[key], language);

export const getProductContent = (product: Product, language: LanguageCode): Product => {
  if (language === "en") {
    return product;
  }

  const translation = productTranslations[product.id];

  if (!translation) {
    return product;
  }

  return {
    ...product,
    name: translation.name,
    subtitle: translation.subtitle,
    description: translation.description,
    tags: translation.tags,
    deliveryNote: translation.deliveryNote,
    sizes: product.sizes.map((size) => ({
      ...size,
      label: translation.sizes?.[size.label]?.label ?? size.label,
      serves: translation.sizes?.[size.label]?.serves ?? size.serves,
    })),
  };
};

export const getLocalizedSize = (
  product: Product,
  originalSizeLabel: string,
  language: LanguageCode,
): ProductSize => {
  const localizedProduct = getProductContent(product, language);
  const sizeIndex = product.sizes.findIndex((size) => size.label === originalSizeLabel);

  if (sizeIndex >= 0) {
    return localizedProduct.sizes[sizeIndex];
  }

  return localizedProduct.sizes[0];
};

export const getPaymentMethodContent = (
  methodId: PaymentMethodId,
  fallbackTitle: string,
  fallbackDescription: string,
  language: LanguageCode,
) => {
  if (language === "en") {
    return { title: fallbackTitle, description: fallbackDescription };
  }

  return paymentMethodTranslations[methodId] ?? {
    title: fallbackTitle,
    description: fallbackDescription,
  };
};
