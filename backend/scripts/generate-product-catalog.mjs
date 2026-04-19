import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const sourcePath = path.join(repoRoot, "frontend/src/data/products.ts");
const outputPath = path.join(repoRoot, "backend/data/productCatalog.json");

const source = fs.readFileSync(sourcePath, "utf8");
const catalogMatch = source.match(/const catalogSeed: CatalogSeed\[\] = \[(.*?)\n\];/s);

if (!catalogMatch) {
  throw new Error("catalogSeed array not found");
}

const catalogBody = catalogMatch[1];
const itemPattern = /\{ id: (\d+), name: "([^"]+)", category: "([^"]+)"(?:, subcategory: "([^"]+)")?, price: (\d+) \}/g;
const items = [];
let itemMatch;

while ((itemMatch = itemPattern.exec(catalogBody)) !== null) {
  items.push({
    id: Number(itemMatch[1]),
    name: itemMatch[2],
    category: itemMatch[3],
    subcategory: itemMatch[4] || null,
    price: Number(itemMatch[5]),
  });
}

if (items.length === 0) {
  throw new Error("No catalog items were parsed");
}

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const commonsFile = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;

const imageLibrary = {
  amla: commonsFile("Spicy Amla.JPG"),
  brinjal: commonsFile("Aubergine (33).jpg"),
  citron: commonsFile("Citron Fruit ( Narthangai) 01.jpg"),
  coconut: commonsFile("Fresh Coconut Flakes.JPG"),
  corianderSeeds: commonsFile("2017 0102 coriander seeds.jpg"),
  curryLeaves: commonsFile("Curry Leaves (5194454978).jpg"),
  cissus: commonsFile("Cissus quadrangularis (9859602333).jpg"),
  driedRedChilli: commonsFile("Sun dry red chilli.jpg"),
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

const buildDescription = (name, category) => {
  const normalized = name.toLowerCase();

  if (category === "fryums") {
    if (normalized.includes("saggubiyyam")) return "Sun-dried sago vadiyalu that fry up crisp, airy, and perfect beside hot rice meals.";
    if (normalized.includes("appadalu")) return "Traditional appadalu with a clean snap, generous crunch, and everyday lunch-table appeal.";
    if (normalized.includes("challa mirchi")) return "Sun-dried curd chillies with sharp heat, deep salt, and a bold Andhra meal-side bite.";
    if (normalized.includes("gummadi")) return "Pumpkin-based vadiyalu with light sweetness, deep sun-dried flavour, and a satisfying crunch.";
    if (normalized.includes("minapindi")) return "Urad-based vadiyalu prepared for a fuller bite, quick frying, and homemade crispness.";
    if (normalized.includes("biyyam")) return "Rice-based vadiyalu with delicate crunch and a light finish for everyday family meals.";
    return "Traditional fryums prepared for crisp frying, meal pairing, and festive Andhra spreads.";
  }

  if (category === "powders") {
    if (normalized.includes("kandi")) return "A classic lentil podi with roasted depth and an earthy bite for hot rice and ghee.";
    if (normalized.includes("nuvvula")) return "Sesame-based podi with nutty aroma and a rich finish for everyday meals.";
    if (normalized.includes("dhaniyala")) return "Coriander podi made for balanced flavour, fresh aroma, and simple home cooking.";
    if (normalized.includes("pappula")) return "Roasted dal podi with smooth texture and a gentle protein-rich companion for rice.";
    if (normalized.includes("karivepaku")) return "Curry leaf podi with aromatic tempering notes and a traditional Andhra profile.";
    if (normalized.includes("avise")) return "Flax-seed podi with a nutty, rustic character and a wholesome everyday pairing.";
    if (normalized.includes("coconut")) return "Coconut podi with a soft, fragrant profile and a comforting plate-side flavour.";
    if (normalized.includes("rasam")) return "Rasam podi blended for tangy warmth, quick meals, and a familiar household taste.";
    if (normalized.includes("sambar")) return "Sambar podi with layered spice and a full-bodied aroma for dals and vegetables.";
    if (normalized.includes("nalla karam")) return "Black chilli podi with smoky heat and strong character for spicy meal pairing.";
    if (normalized.includes("pudina")) return "Mint podi with a fresh herb note and a cooling lift for simple rice meals.";
    if (normalized.includes("munagaku")) return "Drumstick leaf podi with earthy depth and a traditional home-food finish.";
    if (normalized.includes("nalleru")) return "A heritage-style podi with a distinct earthy profile and classic Andhra texture.";
    return "Freshly prepared podi for hot rice, idli, dosa, and everyday comfort meals.";
  }

  if (normalized.includes("avakaya")) return "A bold mango pickle prepared in the Andhra tradition with a deep, tangy spice profile.";
  if (normalized.includes("gongura")) return "Gongura pickle with a signature sour-green tang and a rich, traditional kitchen aroma.";
  if (normalized.includes("lemon")) return "Sharp lemon pickle with a clean citrus bite, salt balance, and classic Andhra heat.";
  if (normalized.includes("tomato")) return "Tomato pickle with soft tang, roasted spice depth, and a rich home-style finish.";
  if (normalized.includes("ginger")) return "Ginger pickle with warm spice, bright aroma, and a strong meal-side kick.";
  if (normalized.includes("usiri")) return "Amla pickle with bright sourness, gentle bitterness, and a traditional pantry feel.";
  if (normalized.includes("dabbakaya")) return "Citron pickle prepared for a deep tang, bold seasoning, and a long-lasting flavour.";
  if (normalized.includes("velakkaya")) return "Wood-apple pickle with an earthy sour profile and a hand-crafted traditional finish.";
  if (normalized.includes("pandumirchi")) return "Red chilli pickle with a fiery kick and a robust Andhra-style seasoning base.";
  if (normalized.includes("chintakaya")) return "Tamarind pickle with bold sour depth and a rich, mouth-watering tempering layer.";
  if (normalized.includes("mango ginger")) return "Mango ginger pickle with an aromatic blend of root spice and tangy freshness.";
  if (normalized.includes("panasa")) return "Jackfruit pickle with a distinctive seasonal flavour and a satisfying homemade character.";
  if (normalized.includes("brinjal")) return "Brinjal pickle with soft texture, roasted spice notes, and a strong traditional profile.";
  if (normalized.includes("green chilli")) return "Green chilli pickle with direct heat, bright salt balance, and a classic Andhra bite.";
  if (normalized.includes("mamidi")) return "Mango-based pickle with a bright tang and a rich, preserved fruit flavour.";
  if (normalized.includes("sweet")) return "A gently sweet pickle variant with a rounded flavour and a home-style finish.";
  return "Traditional pickle prepared in small batches with Andhra-style seasoning and care.";
};

const resolveImage = (name) => {
  const normalized = name.toLowerCase();

  if (normalized.includes("avakaya")) return imageLibrary.mangoPickle;
  if (normalized.includes("gongura")) return imageLibrary.gongura;
  if (normalized.includes("lemon")) return imageLibrary.lemon;
  if (normalized.includes("tomato")) return imageLibrary.tomato;
  if (normalized.includes("ginger")) return imageLibrary.ginger;
  if (normalized.includes("usiri")) return imageLibrary.amla;
  if (normalized.includes("dabbakaya")) return imageLibrary.citron;
  if (normalized.includes("velakkaya")) return imageLibrary.woodApple;
  if (normalized.includes("pandumirchi")) return imageLibrary.driedRedChilli;
  if (normalized.includes("chintakaya")) return imageLibrary.tamarind;
  if (normalized.includes("brinjal")) return imageLibrary.brinjal;
  if (normalized.includes("green chilli")) return imageLibrary.greenChilli;
  if (normalized.includes("jackfruit")) return imageLibrary.jackfruit;
  if (normalized.includes("kandi")) return imageLibrary.splitChickpeas;
  if (normalized.includes("nuvvula")) return imageLibrary.sesame;
  if (normalized.includes("dhaniyala")) return imageLibrary.corianderSeeds;
  if (normalized.includes("pappula")) return imageLibrary.splitPeas;
  if (normalized.includes("karivepaku")) return imageLibrary.curryLeaves;
  if (normalized.includes("avise")) return imageLibrary.flaxSeed;
  if (normalized.includes("coconut")) return imageLibrary.coconut;
  if (normalized.includes("rasam")) return imageLibrary.tomato;
  if (normalized.includes("sambar")) return imageLibrary.splitChickpeas;
  if (normalized.includes("nalla karam")) return imageLibrary.driedRedChilli;
  if (normalized.includes("pudina")) return imageLibrary.mint;
  if (normalized.includes("munagaku")) return imageLibrary.moringa;
  if (normalized.includes("nalleru")) return imageLibrary.cissus;
  if (normalized.includes("vadiyalu") || normalized.includes("appadalu") || normalized.includes("fryum") || normalized.includes("mirchi")) {
    return imageLibrary.vadiyalu;
  }

  return imageLibrary.papad;
};

const productCatalog = items.map((item) => ({
  id: `product-${item.id}-${slugify(item.name)}`,
  name: item.name,
  category: item.category,
  subcategory: item.subcategory,
  price_per_kg: item.price,
  image: resolveImage(item.name),
  description: buildDescription(item.name, item.category),
  isAvailable: true,
  isBestSeller: bestSellerNames.has(item.name),
  isBrahminHeritage: true,
  isGreenTouch: true,
}));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(productCatalog, null, 2));
console.log(`Wrote ${productCatalog.length} products to ${outputPath}`);
