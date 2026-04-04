import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import { resolvePickleImage } from "@/lib/pickleImages";

export type ProductCategory = "pickles" | "powders" | "fryums";
export type ProductSubcategory = "salt" | "asafoetida";
export type WeightOption = "250g" | "500g" | "1kg";

export type ProductRecord = {
  id: string;
  name: string;
  name_te?: string;
  nameTeluguguTelugu?: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  price_per_kg: number;
  image: string;
  description: string;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  isBrahminHeritage?: boolean;
  isGreenTouch?: boolean;
};

type CatalogSeed = {
  id: number;
  name: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  price: number;
};

const commonsFile = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const imageLibrary = {
  amla: commonsFile("Spicy Amla.JPG"),
  asafoetida: commonsFile("Asafoetida.jpg"),
  brinjal: commonsFile("Aubergine (33).jpg"),
  citron: commonsFile("Citron Fruit ( Narthangai) 01.jpg"),
  coconut: commonsFile("Fresh Coconut Flakes.JPG"),
  corianderSeeds: commonsFile("2017 0102 coriander seeds.jpg"),
  cucumber: commonsFile("Local Cucumber.jpg"),
  curryLeaves: commonsFile("Curry Leaves (5194454978).jpg"),
  cissus: commonsFile("Cissus quadrangularis (9859602333).jpg"),
  driedRedChilli: commonsFile("Sun dry red chilli.jpg"),
  dosa: commonsFile("Masala Dosa .jpg"),
  flaxSeed: commonsFile("Flax seed.jpg"),
  ginger: commonsFile("Fresh ginger rhizome 02.jpg"),
  gongura: commonsFile("GntGongura2.jpg"),
  greenChilli: commonsFile("Green chilli.jpg"),
  jackfruit: commonsFile("Artocarpus heterophyllus young jackfruit.JPG"),
  lemon: commonsFile("Lemon macro detail fruit.jpg"),
  mangoPickle: commonsFile("Pickled mango.jpg"),
  mint: commonsFile("Fresh Mint leaves.jpg"),
  moringa: commonsFile("Moringa leaf.jpg"),
  papad: commonsFile("Papad 02.jpg"),
  sabudanaPapad: commonsFile("Sabudana Papad.jpg"),
  sesame: commonsFile("Sesame seeds (5958966501).jpg"),
  splitChickpeas: commonsFile("Split Chickpeas.jpg"),
  splitPeas: commonsFile("Split peas (3145708237).jpg"),
  tamarind: commonsFile("Tamarind pods edible part.jpg"),
  tomato: commonsFile("Tomato basket.jpg"),
  vadiyalu: commonsFile("Vadiyalu.jpg"),
  woodApple: commonsFile("Wood apple.jpg"),
};

const bestSellerNames = new Set([
  "Chintakaya Thokku",
  "Gongura (Salt)",
  "Avakaya",
  "Lemon Pickle",
  "Kandi Podi",
  "Saggubiyyam Vadiyalu",
]);

const pickleNameTelugu: Record<string, string> = {
  "Chintakaya Thokku": "చింతకాయ తొక్కు",
  "Usiri Thokku": "ఉసిరి తొక్కు",
  "Gongura (Salt)": "ఉప్పు గోంగూర",
  "Gongura (Red Chilli)": "పండుమిర్చి గోంగూర",
  "Pandumirchi Pickle": "పండుమిర్చి",
  "Dabbakaya Pickle": "దబ్బకాయ",
  "Lemon Pickle": "నిమ్మకాయ",
  "Tomato Pickle": "టమోటా",
  "Velakkaya Pickle": "వేలక్కాయ",
  "Chintakaya (Hing)": "చింతకాయ",
  "Usirikaya (Hing)": "ఉసిరికాయ",
  "Lemon (Hing)": "నిమ్మకాయ",
  "Dabbakaya (Hing)": "డబ్బాకాయ",
  "Tomato (Hing)": "టమాట",
  "Velakkaya (Hing)": "వెలకాయ",
  "Pulihora Gongura": "పులిహోర గోంగూర",
  "Gongura (Hing)": "గోంగూర",
  "Pandumirchi Gongura": "పండుమిర్చి గోంగూర",
  "Pandumirchi Chintakaya": "పండుమిర్చి చింతకాయ",
  Avakaya: "ఆవకాయ",
  "Garlic Avakaya": "వెల్లులి ఆవకాయ",
  "Jaggery Avakaya": "బెల్లం ఆవకాయ",
  "Dry Avakaya": "ఎండు ఆవకాయ",
  "Dry Menthikaya": "ఎండు మెంతికాయ",
  "Sweet Methi Avakaya": "తీపి మెంతి ఆవకాయ",
  "Pesara Avakaya": "పెసర ఆవకాయ",
  "Methi Avakaya": "మెంతి ఆవకాయ",
  "Nuvvula Avakaya": "నువ్వు ఆవకాయ",
  "Panasa Avakaya": "పనసపోట్టు ఆవకాయ",
  "Fresh Avakaya": "పచ్చ ఆవకాయ",
  Dosavakaya: "దోసవకాయ",
  Magaya: "మాగాయ",
  "Velakkaya Special": "వేలక్కాయ",
  "Brinjal Nilva Pachadi": "వంకాయ నిల్వ పచ్చళ్ళు",
    "Brinjal Nilva Pachadi": "వంకాయ నిల్వ",
    "Ginger Pickle": "అల్లం",
    "Mango Ginger Pickle": "మామిడి అల్లం",
    "Mango Ginger Avakaya": "మామిడి అల్లం ఆవకాయ",
  "Tomato Pachadi": "టొమోటో",
  "Munakkaya Tomato": "మునక్కాయ టమోటా",
  "Green Chilli Avakaya": "పచ్చిమిరప ఆవకాయ",
  "Mamidi Turumu Pachadi": "మామిడి తురుము",
  "Mamidi Mukkala Pachadi": "మామిడి ముక్కలు",
  "Kaya Avakaya": "కాయ ఆవకాయ",
  "Teepi Kaya Avakaya": "తీపి కాయ ఆవకాయ",
  "Sweet Dabbakaya": "తీపి దబ్బకాయ",
  "Sweet Magaya": "తీపి మగయా",
  "Pulihora Avakaya": "పులిహోర ఆవకాయ",
  "Budam Dosa Avakaya": "బుడం దోస ఆవకాయ",
  "Kandi Podi": "కంది పొడి",
  "Nuvvula Podi": "నువ్వుల పొడి",
  "Dhaniyala Podi": "ధనియాల పొడి",
  "Pappula Podi": "పప్పుల పొడి",
  "Karivepaku Karam Podi": "కరివేపాకు కారం పొడి",
  "Avise Ginjal Podi": "అవిసె గింజల పొడి",
  "Coconut Podi": "కొబ్బరి పొడి",
  "Rasam Podi": "రసం పొడి",
  "Sambar Podi": "సాంబార్ పొడి",
  "Nalla Karam": "నల్ల కారం",
  "Pudina Karam Podi": "పుదీనా కారం పొడి",
  "Munagaku Podi": "మునగాకు పొడి",
  "Munagaku Karam Podi": "మునగాకు కారం పొడి",
  "Nalleru Podi": "నల్లేరు పొడి",
  "Saggubiyyam Vadiyalu": "సగ్గుబియ్యం వడియాలు",
  "Pesara Appadalu": "పెసర అప్పడాలు",
  "Minapa Appadalu": "మినప అప్పడాలు",
  "Challa Mirchi": "చల్లా మిర్చి",
  "Gummadi Vadiyalu": "గుమ్మడి వడియాలు",
  "Minapindi Vadiyalu": "మినపిండి వడియాలు",
  "Biyyam Paravva Vadiyalu": "బియ్యం పరవ్వ వడియాలు",
  "Goruchikkudu Vadiyalu": "గోరుచిక్కుడు వడియాలు",
};

const catalogSeed: CatalogSeed[] = [
  { id: 1, name: "Chintakaya Thokku", category: "pickles", subcategory: "salt", price: 550 },
  { id: 2, name: "Usiri Thokku", category: "pickles", subcategory: "salt", price: 550 },
  { id: 3, name: "Gongura (Salt)", category: "pickles", subcategory: "salt", price: 550 },
  { id: 4, name: "Gongura (Red Chilli)", category: "pickles", subcategory: "salt", price: 550 },
  { id: 5, name: "Pandumirchi Pickle", category: "pickles", subcategory: "salt", price: 550 },
  { id: 6, name: "Dabbakaya Pickle", category: "pickles", subcategory: "salt", price: 550 },
  { id: 7, name: "Lemon Pickle", category: "pickles", subcategory: "salt", price: 550 },
  { id: 8, name: "Tomato Pickle", category: "pickles", subcategory: "salt", price: 550 },
  { id: 9, name: "Velakkaya Pickle", category: "pickles", subcategory: "salt", price: 600 },
  { id: 10, name: "Chintakaya (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 11, name: "Usirikaya (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 12, name: "Lemon (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 13, name: "Dabbakaya (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 14, name: "Tomato (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 15, name: "Velakkaya (Hing)", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 16, name: "Pulihora Gongura", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 17, name: "Gongura (Hing)", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 18, name: "Pandumirchi Gongura", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 19, name: "Pandumirchi Chintakaya", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 20, name: "Avakaya", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 21, name: "Garlic Avakaya", category: "pickles", subcategory: "asafoetida", price: 700 },
  { id: 22, name: "Jaggery Avakaya", category: "pickles", subcategory: "asafoetida", price: 700 },
  { id: 23, name: "Dry Avakaya", category: "pickles", subcategory: "asafoetida", price: 700 },
  { id: 24, name: "Dry Menthikaya", category: "pickles", subcategory: "asafoetida", price: 700 },
  { id: 25, name: "Sweet Methi Avakaya", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 26, name: "Pesara Avakaya", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 27, name: "Methi Avakaya", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 28, name: "Nuvvula Avakaya", category: "pickles", subcategory: "asafoetida", price: 700 },
  { id: 29, name: "Panasa Avakaya", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 30, name: "Fresh Avakaya", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 31, name: "Dosavakaya", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 32, name: "Magaya", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 33, name: "Velakkaya Special", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 34, name: "Brinjal Nilva Pachadi", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 35, name: "Ginger Pickle", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 36, name: "Mango Ginger Pickle", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 37, name: "Mango Ginger Avakaya", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 38, name: "Tomato Pachadi", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 39, name: "Munakkaya Tomato", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 40, name: "Green Chilli Avakaya", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 41, name: "Mamidi Turumu Pachadi", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 42, name: "Mamidi Mukkala Pachadi", category: "pickles", subcategory: "asafoetida", price: 600 },
  { id: 43, name: "Teepi Kaya Avakaya", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 44, name: "Sweet Methi Avakaya", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 45, name: "Sweet Dabbakaya", category: "pickles", subcategory: "asafoetida", price: 650 },
  { id: 46, name: "Sweet Magaya", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 47, name: "Pulihora Avakaya", category: "pickles", subcategory: "asafoetida", price: 750 },
  { id: 48, name: "Budam Dosa Avakaya", category: "pickles", subcategory: "asafoetida", price: 850 },
  { id: 49, name: "Kandi Podi", category: "powders", price: 750 },
  { id: 50, name: "Nuvvula Podi", category: "powders", price: 700 },
  { id: 51, name: "Dhaniyala Podi", category: "powders", price: 500 },
  { id: 52, name: "Pappula Podi", category: "powders", price: 600 },
  { id: 53, name: "Karivepaku Karam Podi", category: "powders", price: 650 },
  { id: 54, name: "Avise Ginjal Podi", category: "powders", price: 650 },
  { id: 55, name: "Coconut Podi", category: "powders", price: 650 },
  { id: 56, name: "Rasam Podi", category: "powders", price: 550 },
  { id: 57, name: "Sambar Podi", category: "powders", price: 750 },
  { id: 58, name: "Nalla Karam", category: "powders", price: 800 },
  { id: 59, name: "Pudina Karam Podi", category: "powders", price: 750 },
  { id: 60, name: "Munagaku Podi", category: "powders", price: 2000 },
  { id: 61, name: "Munagaku Karam Podi", category: "powders", price: 650 },
  { id: 62, name: "Nalleru Podi", category: "powders", price: 900 },
  { id: 63, name: "Saggubiyyam Vadiyalu", category: "fryums", price: 650 },
  { id: 64, name: "Pesara Appadalu", category: "fryums", price: 750 },
  { id: 65, name: "Minapa Appadalu", category: "fryums", price: 750 },
  { id: 66, name: "Challa Mirchi", category: "fryums", price: 1050 },
  { id: 67, name: "Gummadi Vadiyalu", category: "fryums", price: 1150 },
  { id: 68, name: "Minapindi Vadiyalu", category: "fryums", price: 650 },
  { id: 69, name: "Biyyam Paravva Vadiyalu", category: "fryums", price: 650 },
  { id: 70, name: "Goruchikkudu Vadiyalu", category: "fryums", price: 850 },
  { id: 71, name: "Kaya Avakaya", category: "pickles", subcategory: "asafoetida", price: 750 },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildProductDescription = (name: string, category: ProductCategory) => {
  const normalized = name.toLowerCase();

  if (category === "fryums") {
    if (normalized.includes("saggubiyyam")) {
      return "Sun-dried sago vadiyalu that fry up crisp, airy, and perfect beside hot rice meals.";
    }

    if (normalized.includes("appadalu")) {
      return "Traditional appadalu with a clean snap, generous crunch, and everyday lunch-table appeal.";
    }

    if (normalized.includes("challa mirchi")) {
      return "Sun-dried curd chillies with sharp heat, deep salt, and a bold Andhra meal-side bite.";
    }

    if (normalized.includes("gummadi")) {
      return "Pumpkin-based vadiyalu with light sweetness, deep sun-dried flavour, and a satisfying crunch.";
    }

    if (normalized.includes("minapindi")) {
      return "Urad-based vadiyalu prepared for a fuller bite, quick frying, and homemade crispness.";
    }

    if (normalized.includes("biyyam")) {
      return "Rice-based vadiyalu with delicate crunch and a light finish for everyday family meals.";
    }

    return "Regional vadiyalu with crisp texture, sun-dried depth, and a traditional Andhra side-dish feel.";
  }

  if (category === "powders") {
    if (normalized.includes("kandi")) {
      return "Roasted kandi podi with hearty lentil depth, best with hot rice, ghee, idli, and dosa.";
    }

    if (normalized.includes("nuvvula")) {
      return "Sesame-rich podi with roasted nuttiness, warm spice, and a comforting homemade finish.";
    }

    if (normalized.includes("dhaniyala")) {
      return "Coriander-led podi with warm aroma and balanced spice for daily South Indian meals.";
    }

    if (normalized.includes("pappula")) {
      return "Roasted gram podi with mellow nuttiness, easy mixability, and smooth meal-time flavour.";
    }

    if (normalized.includes("karivepaku")) {
      return "Curry leaf karam podi with aromatic freshness, roasted spice, and classic Andhra depth.";
    }

    if (normalized.includes("avise")) {
      return "Flaxseed podi with earthy richness, roasted warmth, and a nutrient-dense finish.";
    }

    if (normalized.includes("coconut")) {
      return "Coconut podi with mellow sweetness, soft roasted spice, and everyday comfort-food appeal.";
    }

    if (normalized.includes("rasam")) {
      return "House-ground rasam podi blended for peppery aroma, depth, and quick comfort cooking.";
    }

    if (normalized.includes("sambar")) {
      return "Fresh sambar podi with a layered spice profile built for fragrant, homestyle pots.";
    }

    if (normalized.includes("nalla karam")) {
      return "Dark roasted karam blend with bold chilli warmth and a deep, pantry-ready finish.";
    }

    if (normalized.includes("pudina")) {
      return "Mint-forward karam podi with a cooling lift, fresh herb aroma, and lively spice.";
    }

    if (normalized.includes("munagaku")) {
      return "Moringa-based podi with earthy depth and a premium, nutrient-rich homemade character.";
    }

    if (normalized.includes("nalleru")) {
      return "Traditional nalleru podi with earthy herb notes and a distinctive regional profile.";
    }

    return "Freshly ground podi prepared in small batches for hot rice, breakfast plates, and simple meals.";
  }

  if (normalized.includes("gongura")) {
    return "Classic gongura pickle with signature tang, Andhra chilli warmth, and bold homemade depth.";
  }

  if (normalized.includes("chintakaya")) {
    return "Tamarind-led pickle with rich sourness, slow-built spice, and a deep homestyle finish.";
  }

  if (normalized.includes("usiri")) {
    return "Usiri-based pickle with bright tang, balanced masala, and a clean traditional finish.";
  }

  if (normalized.includes("dabbakaya")) {
    return "Citron-style pickle with bright citrus bite, slow-cured masala, and lingering Andhra heat.";
  }

  if (normalized.includes("lemon")) {
    return "Lemon pickle with salty brightness, comforting spice, and everyday meal-friendly depth.";
  }

  if (normalized.includes("tomato")) {
    return "Tomato pickle cooked down for savoury richness, balanced chilli, and classic Andhra flavour.";
  }

  if (normalized.includes("velakkaya")) {
    return "Rare regional pickle with a bold tang, layered spice, and a memorable homemade finish.";
  }

  if (normalized.includes("brinjal")) {
    return "Brinjal pickle with soft texture, deep masala, and the warm comfort of a house special.";
  }

  if (normalized.includes("ginger")) {
    return "Ginger-led pickle with lively heat, sharp freshness, and a bright South Indian finish.";
  }

  if (normalized.includes("panasa")) {
    return "Young jackfruit avakaya with fibrous bite, rich masala, and a festive regional character.";
  }

  if (normalized.includes("dosavakaya")) {
    return "Dosakaya-style pickle with cooling crunch, bright tang, and a clean Andhra spice profile.";
  }

  if (normalized.includes("green chilli")) {
    return "Green chilli avakaya with punchy heat, mustard depth, and a bold table-side finish.";
  }

  if (normalized.includes("magaya")) {
    return "Traditional magaya with concentrated mango flavour, balanced oil, and a slow-cured finish.";
  }

  if (normalized.includes("sweet") || normalized.includes("jaggery")) {
    return "Sweet-heat pickle with jaggery balance, layered spice, and a richer Andhra-style finish.";
  }

  if (normalized.includes("methi")) {
    return "Fenugreek-led avakaya with nutty bitterness, rich masala, and bold homemade depth.";
  }

  if (normalized.includes("nuvvula")) {
    return "Sesame-style avakaya with roasted nuttiness, fuller body, and classic Andhra spice.";
  }

  if (normalized.includes("pandumirchi")) {
    return "Chilli-forward pickle with bold heat, deep masala, and a strong homemade Andhra profile.";
  }

  if (normalized.includes("pulihora")) {
    return "Pulihora-inspired pickle with tangy spice notes designed to shine with hot rice and ghee.";
  }

  if (normalized.includes("budam dosa")) {
    return "House special avakaya with a bold, comfort-food profile and a distinctly regional finish.";
  }

  if (normalized.includes("avakaya")) {
    return "Traditional avakaya with mango depth, mustard warmth, and the bold character Andhra homes expect.";
  }

  return "Traditional Andhra pickle prepared in a homemade style with bold spice and small-batch care.";
};

const localProductImage = (relativePath: string) =>
  new URL(`../../images/${relativePath}`, import.meta.url).href;

const uploadedProductImageByName: Record<string, string> = {
  "Chintakaya Thokku": localProductImage("pickles-uppu/chintakaya-thokku.jpg"),
  "Usiri Thokku": localProductImage("pickles-uppu/usiri-thokku.jpg"),
  "Gongura (Salt)": localProductImage("pickles-uppu/gongura.jpg"),
  "Gongura (Red Chilli)": localProductImage("pickles-uppu/gongura-pandumirchi.jpg"),
  "Pandumirchi Pickle": localProductImage("pickles-uppu/pandummirchi.jpg"),
  "Dabbakaya Pickle": localProductImage("pickles-uppu/dabbakaya.jpg"),
  "Lemon Pickle": localProductImage("pickles-uppu/lemon.jpg"),
  "Tomato Pickle": localProductImage("pickles-uppu/tomato.jpg"),
  "Velakkaya Pickle": localProductImage("pickles-uppu/velakkaya.JPG"),
  "Chintakaya (Hing)": localProductImage("pickles-tempered/chintakaya.jpg"),
  "Usirikaya (Hing)": localProductImage("pickles-tempered/usirikaya.jpg"),
  "Lemon (Hing)": localProductImage("pickles-tempered/lemon.jpg"),
  "Dabbakaya (Hing)": localProductImage("pickles-tempered/dabbakaya.jpg"),
  "Tomato (Hing)": localProductImage("pickles-tempered/tomato.jpg"),
  "Velakkaya (Hing)": localProductImage("pickles-tempered/velakkaya.jpg"),
  "Pulihora Gongura": localProductImage("pickles-tempered/pulihora-gongura.jpg"),
  "Gongura (Hing)": localProductImage("pickles-tempered/gongura.jpg"),
  "Pandumirchi Gongura": localProductImage("pickles-tempered/pandumirchi-gongura.jpg"),
  "Pandumirchi Chintakaya": localProductImage("pickles-tempered/pandumirchi-chintakaya.jpg"),
  Avakaya: localProductImage("pickles-tempered/avakaya.jpg"),
  "Garlic Avakaya": localProductImage("pickles-tempered/garlic-avakaya.jpg"),
  "Jaggery Avakaya": localProductImage("pickles-tempered/jaggery-avakaya.jpg"),
  "Dry Avakaya": localProductImage("pickles-tempered/dry-avakaya.jpg"),
  "Dry Menthikaya": localProductImage("pickles-tempered/dry-menthikaya.jpg"),
  "Sweet Methi Avakaya": localProductImage("pickles-tempered/sweet-methi-avakaya.jpg"),
  "Pesara Avakaya": localProductImage("pickles-tempered/pesara-avakaya.jpg"),
  "Methi Avakaya": localProductImage("pickles-tempered/methi-avakaya.jpg"),
  "Nuvvula Avakaya": localProductImage("pickles-tempered/nuvvula-avakaya.jpg"),
  "Panasa Avakaya": localProductImage("pickles-tempered/panasa-avakaya.jpg"),
  "Fresh Avakaya": localProductImage("pickles-tempered/fresh-avakaya.jpg"),
  Dosavakaya: localProductImage("pickles-tempered/dosavakaya.jpg"),
  Magaya: localProductImage("pickles-tempered/magaya.jpg"),
  "Velakkaya Special": localProductImage("pickles-tempered/velakkaya.jpg"),
  "Brinjal Nilva Pachadi": localProductImage("pickles-tempered/brinjal-nilva.jpg"),
  "Ginger Pickle": localProductImage("pickles-tempered/ginger.jpg"),
  "Mango Ginger Pickle": localProductImage("pickles-tempered/mango-ginger.jpg"),
  "Mango Ginger Avakaya": localProductImage("pickles-tempered/mango-ginger-avakaya.jpg"),
  "Tomato Pachadi": localProductImage("pickles-tempered/tomato.jpg"),
  "Munakkaya Tomato": localProductImage("pickles-tempered/munnakaya-tomato.jpg"),
  "Green Chilli Avakaya": localProductImage("pickles-tempered/imagesgreen-chilli-avakaya.jpg"),
  "Mamidi Turumu Pachadi": localProductImage("pickles-tempered/mamidi-turumu.jpg"),
  "Mamidi Mukkala Pachadi": localProductImage("pickles-tempered/mamidi-mukkala.jpg"),
  "Kaya Avakaya": localProductImage("pickles-tempered/avakaya.jpg"),
  "Teepi Kaya Avakaya": localProductImage("pickles-tempered/teepi-kaya-avakaya.jpg"),
  "Sweet Dabbakaya": localProductImage("pickles-tempered/sweet-dabbakaya.jpg"),
  "Sweet Magaya": localProductImage("pickles-tempered/sweet-magaya.jpg"),
  "Pulihora Avakaya": localProductImage("pickles-tempered/pulihora-avakaya.jpg"),
  "Budam Dosa Avakaya": localProductImage("pickles-tempered/buddam-dosa-avakaya.jpg"),
  "Kandi Podi": localProductImage("podulu/kandi.jpg"),
  "Nuvvula Podi": localProductImage("podulu/nuvvula.jpg"),
  "Dhaniyala Podi": localProductImage("podulu/dhaniyala.jpg"),
  "Pappula Podi": localProductImage("podulu/pappula.jpg"),
  "Karivepaku Karam Podi": localProductImage("podulu/karivepaku-karam.jpg"),
  "Avise Ginjal Podi": localProductImage("podulu/avise-ginjal.jpg"),
  "Coconut Podi": localProductImage("podulu/coconut.jpg"),
  "Rasam Podi": localProductImage("podulu/rasam.jpg"),
  "Sambar Podi": localProductImage("podulu/sambar.jpg"),
  "Nalla Karam": localProductImage("podulu/nalla-karam.jpg"),
  "Pudina Karam Podi": localProductImage("podulu/pudina-karam.jpg"),
  "Munagaku Podi": localProductImage("podulu/munagaku.jpg"),
  "Munagaku Karam Podi": localProductImage("podulu/munagaku-karam.jpg"),
  "Nalleru Podi": localProductImage("podulu/nalleru.jpg"),
  "Saggubiyyam Vadiyalu": localProductImage("fryums/saggubiyyam-vadiyalu.jpg"),
  "Pesara Appadalu": localProductImage("fryums/pesara-appadalu.jpg"),
  "Minapa Appadalu": localProductImage("fryums/minapa-appadalu.jpg"),
  "Challa Mirchi": localProductImage("fryums/challa-mirchi.jpg"),
  "Gummadi Vadiyalu": localProductImage("fryums/gummadi-vadiyalu.jpg"),
  "Minapindi Vadiyalu": localProductImage("fryums/minapindi-vadiyalu.jpg"),
  "Biyyam Paravva Vadiyalu": localProductImage("fryums/saggubiyyam-vadiyalu.jpg"),
  "Goruchikkudu Vadiyalu": localProductImage("fryums/goruchikkudu-vadiyalu.jpg"),
};

const resolveProductImage = (name: string, category: ProductCategory) => {
  const uploadedImage = uploadedProductImageByName[name];
  if (uploadedImage) {
    return uploadedImage;
  }

  const normalized = name.toLowerCase();

  if (category === "pickles") {
    if (normalized.includes("inguva")) {
      return imageLibrary.asafoetida;
    }

    if (normalized.includes("dosa")) {
      return imageLibrary.dosa;
    }
  }

  if (category === "fryums") {
    if (normalized.includes("saggubiyyam")) {
      return imageLibrary.sabudanaPapad;
    }

    if (normalized.includes("appadalu")) {
      return imageLibrary.papad;
    }

    if (normalized.includes("challa mirchi")) {
      return imageLibrary.driedRedChilli;
    }

    if (normalized.includes("vadiyalu")) {
      return imageLibrary.vadiyalu;
    }

    return categoryVadiyalu;
  }

  if (category === "powders") {
    if (normalized.includes("kandi")) {
      return imageLibrary.splitPeas;
    }

    if (normalized.includes("nuvvula")) {
      return imageLibrary.sesame;
    }

    if (normalized.includes("dhaniyala")) {
      return imageLibrary.corianderSeeds;
    }

    if (normalized.includes("pappula")) {
      return imageLibrary.splitChickpeas;
    }

    if (normalized.includes("karivepaku")) {
      return imageLibrary.curryLeaves;
    }

    if (normalized.includes("avise")) {
      return imageLibrary.flaxSeed;
    }

    if (normalized.includes("coconut")) {
      return imageLibrary.coconut;
    }

    if (normalized.includes("rasam") || normalized.includes("sambar")) {
      return imageLibrary.corianderSeeds;
    }

    if (normalized.includes("nalla karam")) {
      return imageLibrary.driedRedChilli;
    }

    if (normalized.includes("pudina")) {
      return imageLibrary.mint;
    }

    if (normalized.includes("munagaku")) {
      return imageLibrary.moringa;
    }

    if (normalized.includes("nalleru")) {
      return imageLibrary.cissus;
    }

    return categoryPowders;
  }

  if (category === "pickles") {
    return resolvePickleImage(name);
  }

  if (normalized.includes("gongura")) {
    return imageLibrary.gongura;
  }

  if (normalized.includes("chintakaya")) {
    return imageLibrary.tamarind;
  }

  if (normalized.includes("usiri")) {
    return imageLibrary.amla;
  }

  if (normalized.includes("dabbakaya")) {
    return imageLibrary.citron;
  }

  if (normalized.includes("lemon")) {
    return imageLibrary.lemon;
  }

  if (normalized.includes("tomato")) {
    return imageLibrary.tomato;
  }

  if (normalized.includes("velakkaya")) {
    return imageLibrary.woodApple;
  }

  if (normalized.includes("brinjal")) {
    return imageLibrary.brinjal;
  }

  if (normalized.includes("ginger")) {
    return imageLibrary.ginger;
  }

  if (normalized.includes("panasa")) {
    return imageLibrary.jackfruit;
  }

  if (normalized.includes("dosavakaya")) {
    return imageLibrary.cucumber;
  }

  if (normalized.includes("green chilli")) {
    return imageLibrary.greenChilli;
  }

  if (normalized.includes("pandumirchi")) {
    return imageLibrary.driedRedChilli;
  }

  return imageLibrary.mangoPickle;
};

export const productCatalog: ProductRecord[] = catalogSeed.map((product) => ({
  id: `product-${product.id}-${slugify(product.name)}`,
  name: product.name,
  name_te: pickleNameTelugu[product.name],
  category: product.category,
  subcategory: product.subcategory,
  price_per_kg: product.price,
  image: resolveProductImage(product.name, product.category),
  description: buildProductDescription(product.name, product.category),
  isAvailable: true,
  isBestSeller: bestSellerNames.has(product.name),
}));
