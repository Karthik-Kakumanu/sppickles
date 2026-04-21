type LanguageCode = "en" | "te";

type TranslatableProductName = {
  name: string;
  name_te?: string | null;
  nameTeluguguTelugu?: string | null;
};

const TELUGU_PATTERN = /[\u0c00-\u0c7f]/;

const exactTranslations: Record<string, string> = {
  "best seller": "బెస్ట్ సెల్లర్",
  "new arrival": "కొత్త రాక",
  "limited offer": "పరిమిత ఆఫర్",
  "special offer": "ప్రత్యేక ఆఫర్",
  "summer sale": "వేసవి ఆఫర్",
  "festival offer": "పండుగ ఆఫర్",
  "free delivery": "ఉచిత డెలివరీ",
  "hot deal": "హాట్ డీల్",
  "premium collection": "ప్రీమియం కలెక్షన్",
};

const phraseTranslations: Array<[RegExp, string]> = [
  [/\bbest\s+seller\b/gi, "బెస్ట్ సెల్లర్"],
  [/\bnew\s+arrival\b/gi, "కొత్త రాక"],
  [/\blimited\s+offer\b/gi, "పరిమిత ఆఫర్"],
  [/\bspecial\s+offer\b/gi, "ప్రత్యేక ఆఫర్"],
  [/\bsummer\s+sale\b/gi, "వేసవి ఆఫర్"],
  [/\bfestival\s+offer\b/gi, "పండుగ ఆఫర్"],
  [/\bfree\s+delivery\b/gi, "ఉచిత డెలివరీ"],
  [/\bhot\s+deal\b/gi, "హాట్ డీల్"],
  [/\bcash\s+on\s+delivery\b/gi, "క్యాష్ ఆన్ డెలివరీ"],
  [/\bflat\s+(\d+)\s*%\s*off\b/gi, "ఫ్లాట్ $1% తగ్గింపు"],
];

const wordTranslations: Record<string, string> = {
  ad: "ప్రకటన",
  ads: "ప్రకటనలు",
  all: "అన్ని",
  and: "మరియు",
  andra: "ఆంధ్ర",
  andhra: "ఆంధ్ర",
  appadam: "అప్పడం",
  appadalu: "అప్పడాలు",
  asafoetida: "ఇంగువ",
  avakaya: "ఆవకాయ",
  available: "అందుబాటులో",
  batch: "బ్యాచ్",
  brahmin: "బ్రాహ్మణ",
  buy: "కొనండి",
  chilli: "మిరప",
  chili: "మిరప",
  chintakaya: "చింతకాయ",
  code: "కోడ్",
  collection: "కలెక్షన్",
  combo: "కాంబో",
  coupon: "కూపన్",
  coupons: "కూపన్లు",
  crunch: "క్రంచ్",
  deal: "డీల్",
  delivery: "డెలివరీ",
  discount: "తగ్గింపు",
  dosa: "దోశ",
  everyday: "రోజువారీ",
  family: "కుటుంబం",
  festival: "పండుగ",
  fresh: "తాజా",
  fried: "వేయించిన",
  fryum: "ఫ్రైయం",
  fryums: "ఫ్రైయంస్",
  garlic: "వెల్లుల్లి",
  ghee: "నెయ్యి",
  ginger: "అల్లం",
  gongura: "గోంగూర",
  green: "గ్రీన్",
  homemade: "ఇంటివంట",
  hot: "వేడి",
  idli: "ఇడ్లీ",
  instant: "తక్షణం",
  karam: "కారం",
  kitchen: "వంటగది",
  lemon: "నిమ్మకాయ",
  limited: "పరిమిత",
  mango: "మామిడి",
  masala: "మసాలా",
  meals: "భోజనాలు",
  millet: "మిల్లెట్",
  new: "కొత్త",
  offer: "ఆఫర్",
  offers: "ఆఫర్లు",
  oil: "నూనె",
  on: "పై",
  order: "ఆర్డర్",
  orders: "ఆర్డర్లు",
  pachadi: "పచ్చడి",
  pachallu: "పచ్చళ్ళు",
  pickle: "పచ్చడి",
  pickles: "పచ్చళ్ళు",
  podi: "పొడి",
  podulu: "పొడులు",
  powder: "పొడి",
  powders: "పొడులు",
  premium: "ప్రీమియం",
  product: "ఉత్పత్తి",
  products: "ఉత్పత్తులు",
  promo: "ప్రోమో",
  promotion: "ప్రచారం",
  rice: "అన్నం",
  sale: "సేల్",
  salt: "ఉప్పు",
  salted: "ఉప్పు",
  seasonal: "సీజనల్",
  seller: "సెల్లర్",
  special: "ప్రత్యేక",
  spicy: "కారం",
  summer: "వేసవి",
  tamarind: "చింతపండు",
  tempered: "తాలింపు",
  thokku: "తొక్కు",
  tomato: "టమాటా",
  traditional: "సంప్రదాయ",
  turmeric: "పసుపు",
  usiri: "ఉసిరి",
  vadiyalu: "వడియాలు",
  video: "వీడియో",
  with: "తో",
};

const replaceKnownPhrases = (text: string) =>
  phraseTranslations.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);

export const translateDynamicText = (value: unknown, language: LanguageCode) => {
  const text = String(value ?? "").trim();

  if (!text || language !== "te" || TELUGU_PATTERN.test(text)) {
    return text;
  }

  const exact = exactTranslations[text.toLowerCase()];
  if (exact) {
    return exact;
  }

  return replaceKnownPhrases(text).replace(/[A-Za-z]+(?:'[A-Za-z]+)?/g, (word) => {
    const translated = wordTranslations[word.toLowerCase()];
    return translated ?? word;
  });
};

export const getDynamicProductName = (product: TranslatableProductName, language: LanguageCode) => {
  if (language !== "te") {
    return product.name;
  }

  return product.name_te || product.nameTeluguguTelugu || translateDynamicText(product.name, language);
};
