import { productCatalog } from "@/data/products";

type LanguageCode = "en" | "te";

type TranslatableProductName = {
  name: string;
  name_te?: string | null;
  nameTeluguguTelugu?: string | null;
};

const LATIN_PATTERN = /[A-Za-z]/;

const normalizeKey = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

const catalogNameTranslations = new Map(
  productCatalog
    .filter((product) => typeof product.name_te === "string" && product.name_te.trim().length > 0)
    .map((product) => [normalizeKey(product.name), product.name_te!.trim()] as const),
);

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
  "most buyed": "అత్యధికంగా కొనుగోలు చేసినది",
  recommended: "సిఫార్సు చేయబడింది",
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
  [/\bred\s+chilli\b/gi, "ఎర్ర మిరప"],
  [/\bgreen\s+chilli\b/gi, "పచ్చి మిరప"],
  [/\bsweet\s+magaya\b/gi, "తీపి మాగాయ"],
  [/\bsweet\s+dabbakaya\b/gi, "తీపి దబ్బకాయ"],
  [/\bsweet\s+methi\s+avakaya\b/gi, "తీపి మెంతి ఆవకాయ"],
  [/\bteepi\s+kaya\s+avakaya\b/gi, "తీపి కాయ ఆవకాయ"],
  [/\bjaggery\s+avakaya\b/gi, "బెల్లం ఆవకాయ"],
  [/\bdry\s+avakaya\b/gi, "ఎండు ఆవకాయ"],
  [/\bdry\s+menthikaya\b/gi, "ఎండు మెంతికాయ"],
  [/\bgarlic\s+avakaya\b/gi, "వెల్లుల్లి ఆవకాయ"],
  [/\bmango\s+ginger\s+avakaya\b/gi, "మామిడి అల్లం ఆవకాయ"],
  [/\bmango\s+ginger\s+pickle\b/gi, "మామిడి అల్లం పచ్చడి"],
  [/\bmamidi\s+turumu\s+pachadi\b/gi, "మామిడి తురుము పచ్చడి"],
  [/\bmamidi\s+mukkala\s+pachadi\b/gi, "మామిడి ముక్కల పచ్చడి"],
  [/\bbrinjal\s+nilva\s+pachadi\b/gi, "వంకాయ నిల్వ పచ్చడి"],
  [/\bkarivepaku\s+karam\s+podi\b/gi, "కరివేపాకు కారం పొడి"],
  [/\bmunagaku\s+karam\s+podi\b/gi, "మునగాకు కారం పొడి"],
  [/\bpudina\s+karam\s+podi\b/gi, "పుదీనా కారం పొడి"],
  [/\bbiyyapu\s+rava\s+vadiyalu\b/gi, "బియ్యపు రవ్వ వడియాలు"],
  [/\bgoruchikkudu\s+vadiyalu\b/gi, "గోరుచిక్కుడు వడియాలు"],
  [/\bsaggubiyyam\s+vadiyalu\b/gi, "సగ్గుబియ్యం వడియాలు"],
  [/\bminapa\s+appadalu\b/gi, "మినప అప్పడాలు"],
  [/\bpesara\s+appadalu\b/gi, "పెసర అప్పడాలు"],
  [/\bminapindi\s+vadiyalu\b/gi, "మినపిండి వడియాలు"],
  [/\bgummadi\s+vadiyalu\b/gi, "గుమ్మడి వడియాలు"],
  [/\bpulihora\s+gongura\b/gi, "పులిహోర గోంగూర"],
  [/\bpandumirchi\s+gongura\b/gi, "పండుమిర్చి గోంగూర"],
  [/\bpandumirchi\s+chintakaya\b/gi, "పండుమిర్చి చింతకాయ"],
  [/\bmunakkaya\s+tomato\b/gi, "మునక్కాయ టమాటో"],
  [/\bpandumirchi\s+pickle\b/gi, "పండుమిర్చి పచ్చడి"],
  [/\bdabbakaya\s+pickle\b/gi, "దబ్బకాయ పచ్చడి"],
  [/\blemon\s+pickle\b/gi, "నిమ్మకాయ పచ్చడి"],
  [/\btomato\s+pickle\b/gi, "టమాటో పచ్చడి"],
  [/\bvelakkaya\s+pickle\b/gi, "వెలక్కాయ పచ్చడి"],
  [/\bginger\s+pickle\b/gi, "అల్లం పచ్చడి"],
  [/\btomato\s+pachadi\b/gi, "టమాటో పచ్చడి"],
  [/\bcoconut\s+podi\b/gi, "కొబ్బరి పొడి"],
  [/\bkandi\s+podi\b/gi, "కంది పొడి"],
  [/\bnuvvula\s+podi\b/gi, "నువ్వుల పొడి"],
  [/\bdhaniyala\s+podi\b/gi, "ధనియాల పొడి"],
  [/\bpappula\s+podi\b/gi, "పప్పుల పొడి"],
  [/\bavise\s+ginjal\s+podi\b/gi, "అవిసె గింజల పొడి"],
  [/\brasam\s+podi\b/gi, "రసం పొడి"],
  [/\bsambar\s+podi\b/gi, "సాంబార్ పొడి"],
  [/\bnalleru\s+podi\b/gi, "నల్లేరు పొడి"],
  [/\bmunagaku\s+podi\b/gi, "మునగాకు పొడి"],
  [/\bnalla\s+karam\b/gi, "నల్ల కారం"],
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
  avise: "అవిసె",
  available: "అందుబాటులో",
  batch: "బ్యాచ్",
  best: "బెస్ట్",
  biyyapu: "బియ్యపు",
  brahmin: "బ్రాహ్మణ",
  brinjal: "వంకాయ",
  budam: "బుడం",
  buy: "కొనండి",
  buyed: "కొనబడిన",
  cash: "క్యాష్",
  challa: "చల్లా",
  chilli: "మిరప",
  chili: "మిరప",
  chintakaya: "చింతకాయ",
  chukkudu: "చిక్కుడు",
  coconut: "కొబ్బరి",
  code: "కోడ్",
  collection: "కలెక్షన్",
  combo: "కాంబో",
  coupon: "కూపన్",
  coupons: "కూపన్లు",
  crunch: "క్రంచ్",
  dabbakaya: "దబ్బకాయ",
  deal: "డీల్",
  delivery: "డెలివరీ",
  dhaniyala: "ధనియాల",
  discount: "తగ్గింపు",
  dosa: "దోస",
  dosavakaya: "దోసావకాయ",
  dry: "ఎండు",
  everyday: "రోజువారీ",
  family: "కుటుంబ",
  festival: "పండుగ",
  fresh: "పచ్చి",
  free: "ఉచిత",
  fried: "వేయించిన",
  fryum: "ఫ్రైయం",
  fryums: "ఫ్రైయమ్స్",
  garlic: "వెల్లుల్లి",
  ginjal: "గింజల",
  ginger: "అల్లం",
  gongura: "గోంగూర",
  goruchikkudu: "గోరుచిక్కుడు",
  green: "పచ్చి",
  gummadi: "గుమ్మడి",
  hing: "ఇంగువ",
  homemade: "ఇంటివంట",
  hot: "హాట్",
  idli: "ఇడ్లీ",
  instant: "తక్షణ",
  jaggery: "బెల్లం",
  kandi: "కంది",
  karam: "కారం",
  karivepaku: "కరివేపాకు",
  kaya: "కాయ",
  kitchen: "వంటగది",
  lemon: "నిమ్మకాయ",
  limited: "పరిమిత",
  magaya: "మాగాయ",
  mamidi: "మామిడి",
  mango: "మామిడి",
  masala: "మసాలా",
  meals: "భోజనాలు",
  menthikaya: "మెంతికాయ",
  methi: "మెంతి",
  millet: "మిల్లెట్",
  minapa: "మినప",
  minapindi: "మినపిండి",
  mirchi: "మిర్చి",
  most: "అత్యధికంగా",
  mukkala: "ముక్కల",
  munagaku: "మునగాకు",
  munakkaya: "మునక్కాయ",
  nalla: "నల్ల",
  nalleru: "నల్లేరు",
  new: "కొత్త",
  nilva: "నిల్వ",
  nuvvula: "నువ్వుల",
  offer: "ఆఫర్",
  offers: "ఆఫర్లు",
  oil: "నూనె",
  on: "ఆన్",
  order: "ఆర్డర్",
  orders: "ఆర్డర్లు",
  pachadi: "పచ్చడి",
  pachallu: "పచ్చళ్ళు",
  panasa: "పనస",
  pandumirchi: "పండుమిర్చి",
  pappula: "పప్పుల",
  pesara: "పెసర",
  phodi: "పొడి",
  pick: "ఎంపిక",
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
  pudina: "పుదీనా",
  pulihora: "పులిహోర",
  rasam: "రసం",
  rava: "రవ్వ",
  red: "ఎర్ర",
  recommended: "సిఫార్సు",
  rice: "అన్నం",
  saggubiyyam: "సగ్గుబియ్యం",
  sale: "సేల్",
  salt: "ఉప్పు",
  salted: "ఉప్పు",
  sambar: "సాంబార్",
  seasonal: "సీజనల్",
  seller: "సెల్లర్",
  special: "ప్రత్యేక",
  spicy: "కారం",
  summer: "వేసవి",
  sweet: "తీపి",
  tamarind: "చింతపండు",
  teepi: "తీపి",
  tempered: "తాలింపు",
  thokku: "తొక్కు",
  tomato: "టమాటో",
  traditional: "సాంప్రదాయ",
  turmeric: "పసుపు",
  turumu: "తురుము",
  usiri: "ఉసిరి",
  usirikaya: "ఉసిరికాయ",
  vadiyalu: "వడియాలు",
  velakkaya: "వెలక్కాయ",
  video: "వీడియో",
  with: "తో",
};

const consonantMap: Record<string, string> = {
  chh: "ఛ",
  kh: "ఖ",
  gh: "ఘ",
  ch: "చ",
  jh: "ఝ",
  th: "థ",
  dh: "ధ",
  ph: "ఫ",
  bh: "భ",
  sh: "శ",
  ng: "ంగ",
  ny: "ఞ",
  k: "క",
  g: "గ",
  c: "క",
  j: "జ",
  t: "ట",
  d: "డ",
  n: "న",
  p: "ప",
  b: "బ",
  m: "మ",
  y: "య",
  r: "ర",
  l: "ల",
  v: "వ",
  w: "వ",
  s: "స",
  h: "హ",
  f: "ఫ",
  z: "జ",
  x: "క్స్",
  q: "క్",
};

const vowelMap: Record<string, string> = {
  aa: "ఆ",
  ai: "ఐ",
  au: "ఔ",
  ee: "ఈ",
  ii: "ఈ",
  oo: "ఊ",
  uu: "ఊ",
  a: "అ",
  e: "ఎ",
  i: "ఇ",
  o: "ఒ",
  u: "ఉ",
};

const vowelSignMap: Record<string, string> = {
  aa: "ా",
  ai: "ై",
  au: "ౌ",
  ee: "ీ",
  ii: "ీ",
  oo: "ూ",
  uu: "ూ",
  a: "",
  e: "ె",
  i: "ి",
  o: "ొ",
  u: "ు",
};

const vowelUnits = ["aa", "ai", "au", "ee", "ii", "oo", "uu", "a", "e", "i", "o", "u"] as const;
const consonantUnits = ["chh", "kh", "gh", "ch", "jh", "th", "dh", "ph", "bh", "sh", "ng", "ny"] as const;

const readUnit = (value: string, index: number, units: readonly string[]) =>
  units.find((unit) => value.startsWith(unit, index));

const transliterateWordToTelugu = (word: string) => {
  const lower = word.toLowerCase();
  let index = 0;
  let output = "";

  while (index < lower.length) {
    const vowelUnit = readUnit(lower, index, vowelUnits);
    if (vowelUnit) {
      output += vowelMap[vowelUnit];
      index += vowelUnit.length;
      continue;
    }

    const consonants: string[] = [];

    while (index < lower.length) {
      const compound = readUnit(lower, index, consonantUnits);
      const single = consonantMap[lower[index]];
      const nextUnit = compound ?? (single ? lower[index] : undefined);

      if (!nextUnit) {
        break;
      }

      consonants.push(consonantMap[nextUnit]);
      index += nextUnit.length;

      const lookaheadVowel = readUnit(lower, index, vowelUnits);
      if (lookaheadVowel) {
        break;
      }
    }

    if (consonants.length === 0) {
      output += word[index];
      index += 1;
      continue;
    }

    const trailingVowel = readUnit(lower, index, vowelUnits) ?? "a";

    output += consonants[0];
    for (let consonantIndex = 1; consonantIndex < consonants.length; consonantIndex += 1) {
      output += `్${consonants[consonantIndex]}`;
    }
    output += vowelSignMap[trailingVowel];

    if (trailingVowel !== "a" || readUnit(lower, index, vowelUnits)) {
      index += trailingVowel.length;
    }
  }

  return output;
};

const replaceKnownPhrases = (text: string) =>
  phraseTranslations.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);

const translateLatinToken = (token: string) => {
  const normalized = normalizeKey(token);

  const catalogMatch = catalogNameTranslations.get(normalized);
  if (catalogMatch) {
    return catalogMatch;
  }

  const exact = exactTranslations[normalized];
  if (exact) {
    return exact;
  }

  const directWordMatch = wordTranslations[normalized];
  if (directWordMatch) {
    return directWordMatch;
  }

  if (/[a-z][A-Z]/.test(token)) {
    const splitTokens = token.split(/(?=[A-Z])/).map((part) => translateLatinToken(part));
    return splitTokens.join("");
  }

  return transliterateWordToTelugu(token);
};

export const translateDynamicText = (value: unknown, language: LanguageCode) => {
  const text = String(value ?? "").trim();

  if (!text || language !== "te") {
    return text;
  }

  const catalogMatch = catalogNameTranslations.get(normalizeKey(text));
  if (catalogMatch) {
    return catalogMatch;
  }

  const exact = exactTranslations[normalizeKey(text)];
  if (exact) {
    return exact;
  }

  if (!LATIN_PATTERN.test(text)) {
    return text;
  }

  const phraseExpanded = replaceKnownPhrases(text);

  return phraseExpanded.replace(/[A-Za-z]+(?:'[A-Za-z]+)?/g, (token) => translateLatinToken(token));
};

export const getDynamicProductName = (product: TranslatableProductName, language: LanguageCode) => {
  if (language !== "te") {
    return product.name;
  }

  const directTeluguName = product.name_te || product.nameTeluguguTelugu;
  if (directTeluguName && directTeluguName.trim().length > 0) {
    return translateDynamicText(directTeluguName, language);
  }

  return translateDynamicText(product.name, language);
};
