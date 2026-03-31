import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Gift,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Truck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import catSaltPickles from "@/assets/cat-salt-pickles.jpg";
import catSpecial from "@/assets/cat-special.jpg";
import catTemperedPickles from "@/assets/cat-tempered-pickles.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import heroMeal from "@/assets/hero-meal.jpg";
import introVideo from "@/assets/intro-video.mp4";
import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import pickleGongura from "@/assets/pickle-gongura.jpg";
import pickleLemon from "@/assets/pickle-lemon.jpg";
import storyKitchen from "@/assets/story-kitchen.jpg";

export type CategoryKey = "pickles" | "powders" | "fryums" | "combos";
export type StoreFilter = CategoryKey | "all";
export type PaymentMethodId = "upi" | "cards" | "cod" | "bank";

export type ProductSize = {
  label: string;
  amount: number;
  serves: string;
};

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: CategoryKey;
  image: string;
  gallery: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  heatLevel: string;
  deliveryNote: string;
  featured?: boolean;
  limited?: boolean;
  sizes: ProductSize[];
};

export type Category = {
  key: CategoryKey;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  image: string;
  accentClassName: string;
};

export const storeName = "Sampradyani Pachachalu with Brahmin Taste";
export const storeTagline = "Brahmin Home Made Pickles";
export const whatsappNumber = "917981370664";
export const whatsappUrl = `https://wa.me/${whatsappNumber}`;
export const upiId = "akdelights@ibl";
export const supportEmail = "orders@andhrakitchendelights.in";
export const address =
  "Puchcha Pallavi, Kanakaraju Veedhi, near Maruti Vyayama Shala, Muthyalampadu, Vijayawada";
export const contactNumbers = ["+91 79813 70664", "0866 460 2255", "+91 73826 65848"];

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "Story", to: "/about" },
  { label: "Checkout", to: "/checkout" },
  { label: "Contact", to: "/contact" },
];

export const commerceStats = [
  { label: "Batches cooked fresh every week", value: "18+" },
  { label: "Repeat customers across India", value: "4.9k" },
  { label: "Dispatch window after checkout", value: "24 hrs" },
  { label: "Average rating from repeat buyers", value: "4.8/5" },
];

export const categories: Category[] = [
  {
    key: "pickles",
    title: "Heritage pickles and thokku jars",
    shortTitle: "Pickles",
    description:
      "Bold Andhra flavors with small-batch mango, gongura, lemon, tomato, and garlic favorites.",
    eyebrow: "Best-selling pantry jars",
    image: pickleAvakaya,
    accentClassName: "from-[#7a2419] to-[#c85a34]",
  },
  {
    key: "powders",
    title: "Rice podis and ready-to-mix blends",
    shortTitle: "Powders",
    description:
      "Comforting podi blends for hot rice, tiffins, and quick weekday meals with serious depth.",
    eyebrow: "Fast-moving kitchen staples",
    image: categoryPowders,
    accentClassName: "from-[#8a4d15] to-[#d48d2c]",
  },
  {
    key: "fryums",
    title: "Vadiyalu, appadalu, and crunchy sides",
    shortTitle: "Fryums",
    description:
      "Sun-dried and meal-ready accompaniments that make simple lunches feel complete and festive.",
    eyebrow: "For texture and comfort",
    image: categoryVadiyalu,
    accentClassName: "from-[#24533b] to-[#6ca36f]",
  },
  {
    key: "combos",
    title: "Gifting hampers and family combo packs",
    shortTitle: "Combos",
    description:
      "Curated boxes for first-time shoppers, family stocking, and client gifting that feels memorable.",
    eyebrow: "High-conversion bundles",
    image: catSpecial,
    accentClassName: "from-[#5e2a1c] to-[#b87044]",
  },
];

export const products: Product[] = [
  {
    id: "royal-avakaya",
    name: "Royal Avakaya",
    subtitle: "Signature mango pickle",
    description:
      "The house favorite with mango chunks, mustard, roasted chilli, and a finish that stays bold till the last bite.",
    category: "pickles",
    image: pickleAvakaya,
    gallery: [pickleAvakaya, heroMeal, storyKitchen],
    tags: ["Best seller", "Hand mixed", "Gift worthy"],
    rating: 4.9,
    reviewCount: 238,
    heatLevel: "Medium hot",
    deliveryNote: "Ships in temperature-safe jars.",
    featured: true,
    sizes: [
      { label: "250g", amount: 189, serves: "2 to 3 meals" },
      { label: "500g", amount: 349, serves: "Family size" },
      { label: "1kg", amount: 649, serves: "Stock-up jar" },
    ],
  },
  {
    id: "gongura-garlic",
    name: "Gongura Garlic Pickle",
    subtitle: "Tangy and deeply Andhra",
    description:
      "Sharp gongura leaves, garlic, and sesame oil layered for people who want a brighter, punchier jar on the table.",
    category: "pickles",
    image: pickleGongura,
    gallery: [pickleGongura, heroMeal, catTemperedPickles],
    tags: ["Tangy", "Garlic rich", "Rice favorite"],
    rating: 4.8,
    reviewCount: 181,
    heatLevel: "High",
    deliveryNote: "Packed in leak-resistant sealed tubs.",
    featured: true,
    sizes: [
      { label: "250g", amount: 199, serves: "2 to 3 meals" },
      { label: "500g", amount: 369, serves: "Weekly essential" },
      { label: "1kg", amount: 699, serves: "Large family stock" },
    ],
  },
  {
    id: "lemon-chilli",
    name: "Lemon Chilli Pickle",
    subtitle: "Bright, salty, citrus finish",
    description:
      "A zesty jar that cuts through richer meals and works brilliantly with curd rice, dal rice, and lunch boxes.",
    category: "pickles",
    image: pickleLemon,
    gallery: [pickleLemon, storyKitchen, catSaltPickles],
    tags: ["Fresh citrus", "Lunchbox favorite", "Balanced"],
    rating: 4.7,
    reviewCount: 126,
    heatLevel: "Medium",
    deliveryNote: "Best within 90 days after opening.",
    sizes: [
      { label: "250g", amount: 175, serves: "Single user" },
      { label: "500g", amount: 329, serves: "Small family" },
      { label: "1kg", amount: 619, serves: "Value pack" },
    ],
  },
  {
    id: "tomato-thokku",
    name: "Tomato Thokku",
    subtitle: "Smooth, spoonable comfort",
    description:
      "Cooked down slowly for a jammy texture that pairs well with idli, dosa, curd rice, and chapati spreads.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, heroMeal, storyKitchen],
    tags: ["Kids friendly", "Versatile", "Smooth texture"],
    rating: 4.7,
    reviewCount: 92,
    heatLevel: "Mild",
    deliveryNote: "Refrigerate after opening for best flavor.",
    sizes: [
      { label: "250g", amount: 169, serves: "Trial pack" },
      { label: "500g", amount: 319, serves: "Family table" },
      { label: "1kg", amount: 589, serves: "Entertaining size" },
    ],
  },
  {
    id: "idli-karam-podi",
    name: "Idli Karam Podi",
    subtitle: "Breakfast table essential",
    description:
      "Roasted lentils, chilli, garlic, and seeds milled into a podi that wakes up soft idlis and hot dosas instantly.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Breakfast hero", "Roasted fresh", "Travel ready"],
    rating: 4.8,
    reviewCount: 147,
    heatLevel: "Medium hot",
    deliveryNote: "Packed in aroma-lock pouches.",
    featured: true,
    sizes: [
      { label: "200g", amount: 149, serves: "Starter size" },
      { label: "400g", amount: 279, serves: "Regular use" },
      { label: "800g", amount: 519, serves: "Family refill" },
    ],
  },
  {
    id: "kandi-podi",
    name: "Kandi Podi",
    subtitle: "Classic Andhra comfort blend",
    description:
      "Nutty, warm, and built for hot rice with ghee. A dependable pantry jar for homes that love simple meals done right.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, catSpecial],
    tags: ["Comfort staple", "High repeat", "Rice lover"],
    rating: 4.8,
    reviewCount: 109,
    heatLevel: "Mild",
    deliveryNote: "Smooth grind with low-moisture packing.",
    sizes: [
      { label: "200g", amount: 139, serves: "Starter size" },
      { label: "400g", amount: 259, serves: "Regular use" },
      { label: "800g", amount: 489, serves: "Value refill" },
    ],
  },
  {
    id: "karivepaku-podi",
    name: "Karivepaku Podi",
    subtitle: "Curry leaf and sesame blend",
    description:
      "Earthy curry leaf podi that feels both wholesome and restaurant-worthy when stirred into warm rice or millet bowls.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Aromatic", "Wholesome", "Daily use"],
    rating: 4.6,
    reviewCount: 74,
    heatLevel: "Mild",
    deliveryNote: "Best flavor within 45 days of opening.",
    limited: true,
    sizes: [
      { label: "200g", amount: 159, serves: "Starter size" },
      { label: "400g", amount: 299, serves: "Family table" },
      { label: "800g", amount: 569, serves: "Bulk saver" },
    ],
  },
  {
    id: "saggubiyyam-vadiyalu",
    name: "Saggubiyyam Vadiyalu",
    subtitle: "Sun-dried sabudana fryums",
    description:
      "Light, crisp, and festival-friendly fryums that deliver instant crunch beside dal, rasam, and rice bowls.",
    category: "fryums",
    image: categoryVadiyalu,
    gallery: [categoryVadiyalu, heroMeal, storyKitchen],
    tags: ["Festival ready", "Crispy", "Kids favorite"],
    rating: 4.8,
    reviewCount: 83,
    heatLevel: "No heat",
    deliveryNote: "Packed to protect shape in transit.",
    sizes: [
      { label: "250g", amount: 129, serves: "One week" },
      { label: "500g", amount: 239, serves: "Family size" },
      { label: "1kg", amount: 449, serves: "Party stock" },
    ],
  },
  {
    id: "minapa-appadalu",
    name: "Minapa Appadalu",
    subtitle: "Traditional urad papad",
    description:
      "Thin, savory appadalu that fry up fast and bring that restaurant-like snap to home lunches and festive thalis.",
    category: "fryums",
    image: categoryVadiyalu,
    gallery: [categoryVadiyalu, heroMeal, catSpecial],
    tags: ["Fast fry", "Table favorite", "Pairs with everything"],
    rating: 4.7,
    reviewCount: 66,
    heatLevel: "No heat",
    deliveryNote: "Store airtight for maximum crispness.",
    sizes: [
      { label: "250g", amount: 139, serves: "Starter" },
      { label: "500g", amount: 259, serves: "Family size" },
      { label: "1kg", amount: 489, serves: "Stock-up pack" },
    ],
  },
  {
    id: "family-starter-combo",
    name: "Family Starter Combo",
    subtitle: "Three jars plus breakfast podi",
    description:
      "A high-value introduction box with one mango pickle, one gongura jar, one lemon pickle, and idli karam podi.",
    category: "combos",
    image: catSpecial,
    gallery: [catSpecial, pickleAvakaya, pickleGongura],
    tags: ["Top gift", "Best value", "First-time shopper"],
    rating: 4.9,
    reviewCount: 154,
    heatLevel: "Mixed",
    deliveryNote: "Packed in a sturdy gifting box.",
    featured: true,
    sizes: [
      { label: "Combo box", amount: 899, serves: "4 products" },
      { label: "Double combo", amount: 1699, serves: "8 products" },
    ],
  },
  {
    id: "festive-gifting-hamper",
    name: "Festive Gifting Hamper",
    subtitle: "Client-friendly premium box",
    description:
      "Built for gifting with two curated pickles, one podi, one fryums pack, and a branded tasting note inside.",
    category: "combos",
    image: catSpecial,
    gallery: [catSpecial, storyKitchen, heroMeal],
    tags: ["Corporate gifting", "Premium box", "Seasonal"],
    rating: 4.8,
    reviewCount: 58,
    heatLevel: "Mixed",
    deliveryNote: "Bulk gifting slots available with prior notice.",
    limited: true,
    sizes: [
      { label: "Single hamper", amount: 1299, serves: "4 products" },
      { label: "Set of 5", amount: 5999, serves: "Team gifting" },
    ],
  },
  {
    id: "ready-to-mix-rice-pack",
    name: "Ready-to-Mix Rice Pack",
    subtitle: "Travel-friendly instant meal kit",
    description:
      "A quick meal saver with pulihora mix, podi, and accompaniments for clients who want gifting with daily utility.",
    category: "combos",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, categoryPowders, heroMeal],
    tags: ["Travel ready", "Quick lunch", "Modern favorite"],
    rating: 4.6,
    reviewCount: 41,
    heatLevel: "Medium",
    deliveryNote: "Ideal for apartment gifting and travel packing.",
    sizes: [
      { label: "Starter kit", amount: 499, serves: "2 to 3 days" },
      { label: "Family kit", amount: 949, serves: "One week" },
    ],
  },
  // Salt Pickles (ఉప్పు పచ్చళ్ళు) - ₹550/kg
  {
    id: "chintakaya-salt-pickle",
    name: "Chintakaya Salt Pickle",
    subtitle: "Tamarind pickle, traditional salt method",
    description:
      "Traditional tamarind pickle prepared using the Brahmin method with salt preservation, no artificial colors or preservatives.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, heroMeal, storyKitchen],
    tags: ["Traditional", "No preservatives", "Salt-cured"],
    rating: 4.7,
    reviewCount: 45,
    heatLevel: "Medium",
    deliveryNote: "Made using traditional Brahmin cooking methods.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "usiri-salt-pickle",
    name: "Usiri Salt Pickle",
    subtitle: "Hog plum preserve",
    description:
      "Tangy hog plum pickle with salt and traditional spices. A regional favorite prepared the authentic Brahmin way.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, storyKitchen, heroMeal],
    tags: ["Regional specialty", "Tangy", "Traditional"],
    rating: 4.6,
    reviewCount: 32,
    heatLevel: "High",
    deliveryNote: "Traditional salt preservation method.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "uppu-gongura-pickle",
    name: "Uppu Gongura Pickle",
    subtitle: "Sour leaf with salt cure",
    description:
      "Gongura leaves preserved with salt for a sharp, tangy flavor. Perfect with rice and curd rice.",
    category: "pickles",
    image: pickleGongura,
    gallery: [pickleGongura, catSaltPickles, heroMeal],
    tags: ["Tangy leaf", "Salt-cured", "Rice companion"],
    rating: 4.7,
    reviewCount: 38,
    heatLevel: "Medium high",
    deliveryNote: "Salt-preserved for authentic taste.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "pandumirc-gongura-pickle",
    name: "Pandumirc Gongura Pickle",
    subtitle: "Red chilli and sour leaves",
    description:
      "Green chilli combined with gongura leaves, salt-cured for a bold, fiery taste with tangy brightness.",
    category: "pickles",
    image: pickleGongura,
    gallery: [pickleGongura, heroMeal, catTemperedPickles],
    tags: ["Spicy", "Tangy", "Bold flavor"],
    rating: 4.6,
    reviewCount: 28,
    heatLevel: "Very hot",
    deliveryNote: "For chilli lovers seeking traditional Andhra heat.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "pandumirc-pickle",
    name: "Pandumirc (Green Chilli) Pickle",
    subtitle: "Pure green chilli salt preserve",
    description:
      "Whole green chillies preserved in salt. A staple for those who love heat with every spoonful.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Super hot", "Whole chilli", "Spice blend"],
    rating: 4.5,
    reviewCount: 22,
    heatLevel: "Extremely hot",
    deliveryNote: "Handle with care - very spicy.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "dabbakaya-salt-pickle",
    name: "Dabbakaya Salt Pickle",
    subtitle: "Bottle gourd preserve",
    description:
      "Bottle gourd with salt and spices. A lighter pickle option for those seeking something mild and versatile.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, storyKitchen, heroMeal],
    tags: ["Mild", "Versatile", "Light"],
    rating: 4.6,
    reviewCount: 35,
    heatLevel: "Mild",
    deliveryNote: "Pairs well with all rice preparations.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "nimmakaya-salt-pickle",
    name: "Nimmakaya Salt Pickle",
    subtitle: "Citrus lemon preserve",
    description:
      "Lemon preserved in salt with traditional spices. Bright, tangy, and perfect for curd rice.",
    category: "pickles",
    image: pickleLemon,
    gallery: [pickleLemon, catSaltPickles, heroMeal],
    tags: ["Citrus bright", "Tangy", "Rice favorite"],
    rating: 4.7,
    reviewCount: 42,
    heatLevel: "Medium",
    deliveryNote: "Adds brightness to any rice meal.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "tomato-salt-pickle",
    name: "Tomato Salt Pickle",
    subtitle: "Tangy tomato preserve",
    description:
      "Tomatoes with salt and red chilli. A unique addition to the range with savory depth.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, heroMeal, storyKitchen],
    tags: ["Savory", "Unique", "Rice companion"],
    rating: 4.6,
    reviewCount: 29,
    heatLevel: "Medium",
    deliveryNote: "Works with curd rice and simple meals.",
    sizes: [
      { label: "250g", amount: 137, serves: "Single user" },
      { label: "500g", amount: 275, serves: "Small family" },
      { label: "1kg", amount: 550, serves: "Value pack" },
    ],
  },
  {
    id: "velakaaya-salt-pickle",
    name: "Velakaaya Salt Pickle",
    subtitle: "Ivy gourd ferment",
    description:
      "Tender ivy gourds with salt and spices. A regional specialty with unique texture and taste.",
    category: "pickles",
    image: catSaltPickles,
    gallery: [catSaltPickles, storyKitchen, heroMeal],
    tags: ["Regional", "Unique texture", "Traditional"],
    rating: 4.5,
    reviewCount: 24,
    heatLevel: "Medium high",
    deliveryNote: "Traditional Andhra regional preparation.",
    sizes: [
      { label: "250g", amount: 150, serves: "Single user" },
      { label: "500g", amount: 300, serves: "Small family" },
      { label: "1kg", amount: 600, serves: "Value pack" },
    ],
  },
  // Ginger-Based Pickles (ఇంగువ పోపుతో తయారు చేసిన) - ₹650-850/kg
  {
    id: "chintakaya-ginger",
    name: "Chintakaya with Ginger Pickle",
    subtitle: "Tamarind meets warming ginger",
    description:
      "Tamarind pickle with fresh ginger processing. Warm spices meet sour depth for hot rice.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Ginger-processed", "Warming", "Hot rice essential"],
    rating: 4.8,
    reviewCount: 67,
    heatLevel: "Medium hot",
    deliveryNote: "Ginger brings anti-inflammatory warmth.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "usiri-ginger",
    name: "Usiri with Ginger Pickle",
    subtitle: "Hog plum with warming spice",
    description:
      "Hog plum pickle enhanced with ginger and traditional spices. Tanginess with warmth.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, storyKitchen, heroMeal],
    tags: ["Ginger-spiced", "Tangy warm", "Regional"],
    rating: 4.7,
    reviewCount: 54,
    heatLevel: "High",
    deliveryNote: "Slow-cooked with ginger paste.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "nimmakaya-ginger",
    name: "Nimmakaya with Ginger Pickle",
    subtitle: "Lemon and ginger harmony",
    description:
      "Fresh lemon pickle with ginger root and mustard oil. Bright, warm, and deeply satisfying.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, pickleLemon, heroMeal],
    tags: ["Citrus warm", "Ginger-bright", "Balanced"],
    rating: 4.8,
    reviewCount: 71,
    heatLevel: "Medium",
    deliveryNote: "Best with hot rice and ghee.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "dabbakaya-ginger",
    name: "Dabbakaya with Ginger Pickle",
    subtitle: "Bottle gourd meets warming spices",
    description:
      "Bottle gourd pickle infused with ginger and fenugreek. A mild yet satisfying warm base.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, storyKitchen, heroMeal],
    tags: ["Mild warm", "Ginger-spiced", "Digestive"],
    rating: 4.7,
    reviewCount: 48,
    heatLevel: "Mild",
    deliveryNote: "Warming and easy on digestion.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "tomato-ginger",
    name: "Tomato with Ginger Pickle",
    subtitle: "Ripe tomato with warming paste",
    description:
      "Slow-cooked tomatoes with ginger and chilli paste. A smooth, warming spread for rice and bread.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Ginger-paste", "Smooth", "Versatile"],
    rating: 4.7,
    reviewCount: 52,
    heatLevel: "Medium",
    deliveryNote: "Doubles as condiment and spread.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "velakaaya-ginger",
    name: "Velakaaya with Ginger Pickle",
    subtitle: "Ivy gourd with ginger warmth",
    description:
      "Ivy gourds cooked with ginger and traditional spices. A premium texture with warming finish.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, storyKitchen, heroMeal],
    tags: ["Ginger-warm", "Premium texture", "Regional"],
    rating: 4.8,
    reviewCount: 61,
    heatLevel: "Medium hot",
    deliveryNote: "Premium Brahmin family recipe.",
    sizes: [
      { label: "250g", amount: 188, serves: "Single user" },
      { label: "500g", amount: 375, serves: "Small family" },
      { label: "1kg", amount: 750, serves: "Value pack" },
    ],
  },
  {
    id: "pulihora-gongura-ginger",
    name: "Pulihora Gongura with Ginger",
    subtitle: "Mixed rice condiment concentrate",
    description:
      "Ready-made pulihora mix with tamarind, gongura, and ginger. Mix with rice for instant festive meal.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Ready-to-mix", "Festival ready", "Convenient"],
    rating: 4.8,
    reviewCount: 68,
    heatLevel: "Medium",
    deliveryNote: "Ideal for quick tamarind rice.",
    sizes: [
      { label: "250g", amount: 188, serves: "4-5 servings" },
      { label: "500g", amount: 375, serves: "Family meal" },
      { label: "1kg", amount: 750, serves: "Party size" },
    ],
  },
  {
    id: "gongura-ginger-pickle",
    name: "Gongura with Ginger Pickle",
    subtitle: "Sour leaves, warming paste",
    description:
      "Gongura leaves with ginger, mustard, and traditional Brahmin spices. Sharp and deeply aromatic.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, pickleGongura, heroMeal],
    tags: ["Ginger-warm", "Sharp tangy", "Aromatic"],
    rating: 4.7,
    reviewCount: 59,
    heatLevel: "High",
    deliveryNote: "Traditional family recipe.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "pandumirc-gongura-ginger",
    name: "Pandumirc Gongura with Ginger",
    subtitle: "Fiery chilli meets sour leaves",
    description:
      "Green chilli with gongura and ginger. A bold, hot-and-sour combination for serious flavor lovers.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, catTemperedPickles, heroMeal],
    tags: ["Fiery", "Sour-hot", "Bold"],
    rating: 4.6,
    reviewCount: 44,
    heatLevel: "Very hot",
    deliveryNote: "For extreme chilli enthusiasts.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "pandumirc-chintakaya-ginger",
    name: "Pandumirc Chintakaya with Ginger",
    subtitle: "Green chilli and tamarind",
    description:
      "Tamarind with green chilli and ginger. A unique sweet-sour-hot combination.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Sweet-sour", "Chilli twist", "Unique"],
    rating: 4.6,
    reviewCount: 41,
    heatLevel: "High",
    deliveryNote: "Complex layered flavors.",
    sizes: [
      { label: "250g", amount: 163, serves: "Single user" },
      { label: "500g", amount: 325, serves: "Small family" },
      { label: "1kg", amount: 650, serves: "Value pack" },
    ],
  },
  {
    id: "avakaya-ginger",
    name: "Avakaya with Ginger Pickle",
    subtitle: "Mango meet warming spices",
    description:
      "Mango chunks with ginger, sesame oil, and traditional spices. A premium warm mango preserve.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, pickleAvakaya, heroMeal],
    tags: ["Mango premium", "Ginger-warm", "Sesame oil"],
    rating: 4.8,
    reviewCount: 73,
    heatLevel: "Medium hot",
    deliveryNote: "Premium Brahmin family recipe.",
    sizes: [
      { label: "250g", amount: 213, serves: "Single user" },
      { label: "500g", amount: 425, serves: "Small family" },
      { label: "1kg", amount: 850, serves: "Value pack" },
    ],
  },
  {
    id: "sweet-chilli-avakaya-ginger",
    name: "Sweet Chilli with Avakaya Ginger",
    subtitle: "Mango, honey, and ginger fusion",
    description:
      "Mango with jaggery sweetness, green chilli, and ginger warmth. A balanced sweet-hot jar.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Sweet-hot", "Premium", "Kids-friendly"],
    rating: 4.7,
    reviewCount: 55,
    heatLevel: "Medium",
    deliveryNote: "Perfect for young palates.",
    sizes: [
      { label: "250g", amount: 213, serves: "Family treat" },
      { label: "500g", amount: 425, serves: "Party size" },
      { label: "1kg", amount: 850, serves: "Stock-up jar" },
    ],
  },
  // Powders (పొడులు) - ₹500-2000/kg
  {
    id: "kandi-traditional-podi",
    name: "Kandi Podi (Legume Blend)",
    subtitle: "Red lentil and chilli powder",
    description:
      "Roasted red lentils with chilli and sesame. The classic powder for hot rice with ghee.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Classic combo", "Roasted fresh", "Comfort meal"],
    rating: 4.8,
    reviewCount: 92,
    heatLevel: "Medium hot",
    deliveryNote: "Packed in aroma-lock pouches.",
    sizes: [
      { label: "200g", amount: 188, serves: "Starter size" },
      { label: "400g", amount: 375, serves: "Regular use" },
      { label: "800g", amount: 750, serves: "Family refill" },
    ],
  },
  {
    id: "nuvvula-podi",
    name: "Nuvvula Podi (Sesame Powder)",
    subtitle: "Pure sesame blend",
    description:
      "Sesame seeds roasted with mild spices. A nutty, warming powder for rice and broken rice meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Nutty", "Sesame rich", "Daily use"],
    rating: 4.7,
    reviewCount: 76,
    heatLevel: "Mild",
    deliveryNote: "Fresh roasted weekly.",
    sizes: [
      { label: "200g", amount: 175, serves: "Starter size" },
      { label: "400g", amount: 350, serves: "Regular use" },
      { label: "800g", amount: 700, serves: "Family refill" },
    ],
  },
  {
    id: "dhaniyala-podi",
    name: "Dhaniyala Podi (Coriander Powder)",
    subtitle: "Fragrant coriander blend",
    description:
      "Roasted coriander seeds with light spices. Fresh and aromatic for all rice preparations.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Aromatic", "Coriander-rich", "Versatile"],
    rating: 4.6,
    reviewCount: 64,
    heatLevel: "Mild",
    deliveryNote: "Aromatic blend stored in sealed tins.",
    sizes: [
      { label: "200g", amount: 125, serves: "Starter size" },
      { label: "400g", amount: 250, serves: "Regular use" },
      { label: "800g", amount: 500, serves: "Family refill" },
    ],
  },
  {
    id: "papula-podi",
    name: "Papula Podi (Lentil Powder)",
    subtitle: "Split pea blend",
    description:
      "Roasted split peas with chilli and sesame. A lighter powder option for everyday meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Light", "Daily meal", "Easy-to-digest"],
    rating: 4.6,
    reviewCount: 58,
    heatLevel: "Mild to medium",
    deliveryNote: "Roasted fresh in small batches.",
    sizes: [
      { label: "200g", amount: 150, serves: "Starter size" },
      { label: "400g", amount: 300, serves: "Regular use" },
      { label: "800g", amount: 600, serves: "Family refill" },
    ],
  },
  {
    id: "karivepaku-karam-podi",
    name: "Karivepaku Karam Podi (Curry Leaf Hot Powder)",
    subtitle: "Curry leaf and chilli blend",
    description:
      "Fresh curry leaves roasted with chilli and sesame. Aromatic and warming for rice meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Aromatic", "Curry-leaf rich", "Digestive"],
    rating: 4.7,
    reviewCount: 81,
    heatLevel: "Medium hot",
    deliveryNote: "Made with fresh curry leaves.",
    sizes: [
      { label: "200g", amount: 163, serves: "Starter size" },
      { label: "400g", amount: 325, serves: "Regular use" },
      { label: "800g", amount: 650, serves: "Family refill" },
    ],
  },
  {
    id: "avishaginjala-podi",
    name: "Avishaginjala Podi (Fenugreek Powder)",
    subtitle: "Fenugreek seed blend",
    description:
      "Roasted fenugreek with sesame and mild spices. Bitter-nutty flavor for rice and idli.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Fenugreek-rich", "Bitter-nutty", "Medicinal"],
    rating: 4.6,
    reviewCount: 52,
    heatLevel: "Mild",
    deliveryNote: "Traditional digestive blend.",
    sizes: [
      { label: "200g", amount: 163, serves: "Starter size" },
      { label: "400g", amount: 325, serves: "Regular use" },
      { label: "800g", amount: 650, serves: "Family refill" },
    ],
  },
  {
    id: "kobbari-podi",
    name: "Kobbari Podi (Coconut Powder)",
    subtitle: "Fresh coconut blend",
    description:
      "Grated coconut roasted with chilli and sesame. A fragrant powder for south Andhra meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Coconut-rich", "Fragrant", "Regional"],
    rating: 4.7,
    reviewCount: 68,
    heatLevel: "Mild to medium",
    deliveryNote: "Made with fresh grated coconut.",
    sizes: [
      { label: "200g", amount: 163, serves: "Starter size" },
      { label: "400g", amount: 325, serves: "Regular use" },
      { label: "800g", amount: 650, serves: "Family refill" },
    ],
  },
  {
    id: "rasam-podi",
    name: "Rasam Podi (Soup Base Powder)",
    subtitle: "Tamarind and spice blend",
    description:
      "A pre-mixed rasam powder with tamarind, pepper, cumin, and spices. Just add to water and tomatoes.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Rasam ready", "Spice blend", "Quick meal"],
    rating: 4.8,
    reviewCount: 89,
    heatLevel: "Mild to medium",
    deliveryNote: "All-in-one rasam base.",
    sizes: [
      { label: "200g", amount: 138, serves: "Starter size" },
      { label: "400g", amount: 275, serves: "Regular use" },
      { label: "800g", amount: 550, serves: "Family refill" },
    ],
  },
  {
    id: "sambara-podi",
    name: "Sambara Podi (Lentil Soup Powder)",
    subtitle: "Sambar spice blend",
    description:
      "Complete sambar powder with roasted lentils, spices, and dried red chilli. A south Indian essential.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Sambar base", "Spice authentic", "Daily essential"],
    rating: 4.8,
    reviewCount: 95,
    heatLevel: "Medium hot",
    deliveryNote: "Premium spice mix for sambar.",
    sizes: [
      { label: "200g", amount: 188, serves: "Starter size" },
      { label: "400g", amount: 375, serves: "Regular use" },
      { label: "800g", amount: 750, serves: "Family refill" },
    ],
  },
  {
    id: "nallakaram-podi",
    name: "Nallakaram Podi (Black Curry Powder)",
    subtitle: "Dark spice blend",
    description:
      "Roasted black seeds, curry leaves, and chilli. A darker, more intense powder for strong rice meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Dark blend", "Intense", "Premium"],
    rating: 4.7,
    reviewCount: 71,
    heatLevel: "High",
    deliveryNote: "Premium roasted black spice blend.",
    sizes: [
      { label: "200g", amount: 200, serves: "Starter size" },
      { label: "400g", amount: 400, serves: "Regular use" },
      { label: "800g", amount: 800, serves: "Family refill" },
    ],
  },
  {
    id: "pudina-karam-podi",
    name: "Pudina Karam Podi (Mint Hot Powder)",
    subtitle: "Fresh mint and chilli powder",
    description:
      "Dried mint leaves with chilli and sesame. A cooling mint paste powder for summer meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Mint-fresh", "Cooling", "Summer special"],
    rating: 4.7,
    reviewCount: 62,
    heatLevel: "Medium",
    deliveryNote: "Cooling blend for hot seasons.",
    sizes: [
      { label: "200g", amount: 188, serves: "Starter size" },
      { label: "400g", amount: 375, serves: "Regular use" },
      { label: "800g", amount: 750, serves: "Family refill" },
    ],
  },
  {
    id: "munagaku-podi-premium",
    name: "Munagaku Podi (Drumstick Leaf Powder)",
    subtitle: "Premium fresh drumstick leaves",
    description:
      "Fresh drumstick leaves ground with spices. A rare, nutrient-rich powder for health-conscious meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Premium", "Nutrient-rich", "Health powder"],
    rating: 4.8,
    reviewCount: 43,
    heatLevel: "Mild",
    deliveryNote: "Limited batch, premium nutrition.",
    limited: true,
    sizes: [
      { label: "200g", amount: 500, serves: "Starter size" },
      { label: "100g", amount: 250, serves: "Trial size" },
    ],
  },
  {
    id: "munagaku-karam-podi",
    name: "Munagaku Karam Podi (Drumstick Curry Powder)",
    subtitle: "Drumstick leaf and chilli",
    description:
      "Drumstick leaves roasted with chilli and spices. Earthy and warming for special meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, heroMeal, storyKitchen],
    tags: ["Drumstick-rich", "Earthy", "Special"],
    rating: 4.7,
    reviewCount: 48,
    heatLevel: "Medium hot",
    deliveryNote: "Traditional drumstick leaf preparation.",
    sizes: [
      { label: "200g", amount: 163, serves: "Starter size" },
      { label: "400g", amount: 325, serves: "Regular use" },
      { label: "800g", amount: 650, serves: "Family refill" },
    ],
  },
  {
    id: "nalleru-podi",
    name: "Nalleru Podi (Turmeric and Black Pepper Powder)",
    subtitle: "Golden turmeric blend",
    description:
      "Turmeric with black pepper, cumin, and sesame. A warming, medicinal powder for wellness meals.",
    category: "powders",
    image: categoryPowders,
    gallery: [categoryPowders, storyKitchen, heroMeal],
    tags: ["Turmeric-rich", "Medicinal", "Golden blend"],
    rating: 4.8,
    reviewCount: 85,
    heatLevel: "Mild",
    deliveryNote: "Traditional wellness powder.",
    sizes: [
      { label: "200g", amount: 225, serves: "Starter size" },
      { label: "400g", amount: 450, serves: "Regular use" },
      { label: "800g", amount: 900, serves: "Family refill" },
    ],
  },
  // Additional Avakaya Varieties
  {
    id: "sweet-avakaya-ginger",
    name: "Sweet Avakaya with Ginger",
    subtitle: "Mango with jaggery sweetness",
    description:
      "Mango chunks with jaggery, ginger, and traditional spices. A premium sweet-savory mango pickle.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, pickleAvakaya, heroMeal],
    tags: ["Sweet mango", "Premium", "Unique"],
    rating: 4.8,
    reviewCount: 63,
    heatLevel: "Medium",
    deliveryNote: "Premium Brahmin sweet mango preserve.",
    sizes: [
      { label: "250g", amount: 213, serves: "Family treat" },
      { label: "500g", amount: 425, serves: "Party size" },
      { label: "1kg", amount: 850, serves: "Stock-up jar" },
    ],
  },
  {
    id: "sweet-mentikaya-ginger",
    name: "Sweet Fenugreek Seed Avakaya with Ginger",
    subtitle: "Fenugreek and mango blend",
    description:
      "Mango with fenugreek seeds, jaggery, and ginger. A warming preserve with medicinal properties.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Fenugreek-blended", "Sweet warm", "Medicinal"],
    rating: 4.7,
    reviewCount: 51,
    heatLevel: "Medium",
    deliveryNote: "Traditional wellness recipe.",
    sizes: [
      { label: "250g", amount: 188, serves: "Family treat" },
      { label: "500g", amount: 375, serves: "Party size" },
      { label: "1kg", amount: 750, serves: "Stock-up jar" },
    ],
  },
  {
    id: "pineapple-avakaya",
    name: "Pineapple Avakaya",
    subtitle: "Tropical mango fusion",
    description:
      "Mango mixed with pineapple, ginger, and spices. A unique tropical-Andhra fusion pickle.",
    category: "pickles",
    image: catTemperedPickles,
    gallery: [catTemperedPickles, heroMeal, storyKitchen],
    tags: ["Tropical", "Unique fusion", "Premium"],
    rating: 4.6,
    reviewCount: 39,
    heatLevel: "Medium",
    deliveryNote: "Special fusion recipe.",
    sizes: [
      { label: "250g", amount: 175, serves: "Family treat" },
      { label: "500g", amount: 350, serves: "Party size" },
      { label: "1kg", amount: 700, serves: "Stock-up jar" },
    ],
  },
  // Fryums & Snacks
  {
    id: "chilli-vadiyalu",
    name: "Chilli Vadiyalu",
    subtitle: "Sun-dried spicy wafers",
    description:
      "Thin, crispy vadiyalu with whole chillies. Extra crunch and intense heat for chilli lovers.",
    category: "fryums",
    image: categoryVadiyalu,
    gallery: [categoryVadiyalu, heroMeal, storyKitchen],
    tags: ["Super crispy", "Spicy", "Chilli-heavy"],
    rating: 4.6,
    reviewCount: 74,
    heatLevel: "Very hot",
    deliveryNote: "Store airtight for maximum crispness.",
    sizes: [
      { label: "250g", amount: 263, serves: "Party appetizer" },
      { label: "500g", amount: 525, serves: "One week" },
      { label: "1kg", amount: 1050, serves: "Party stock" },
    ],
  },
  {
    id: "gummagudi-oyalu",
    name: "Gummagudi Oyalu (Fenugreek Fryums)",
    subtitle: "Fenugreek seed wafers",
    description:
      "Thin, crispy wafers with fenugreek seeds. Medicinal and crunchy for special meals.",
    category: "fryums",
    image: categoryVadiyalu,
    gallery: [categoryVadiyalu, storyKitchen, heroMeal],
    tags: ["Fenugreek-rich", "Medicinal", "Crispy"],
    rating: 4.7,
    reviewCount: 68,
    heatLevel: "No heat",
    deliveryNote: "Packed to protect shape in transit.",
    sizes: [
      { label: "250g", amount: 288, serves: "Party appetizer" },
      { label: "500g", amount: 575, serves: "One week" },
      { label: "1kg", amount: 1150, serves: "Party stock" },
    ],
  },
];


export const paymentMethods: Array<{
  id: PaymentMethodId;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "upi",
    title: "UPI",
    description: `Pay instantly to ${upiId} and share the reference with your order.`,
    icon: WalletCards,
  },
  {
    id: "cards",
    title: "Card / Netbanking",
    description: "Use secure payment on delivery confirmation for prepaid dispatches.",
    icon: CreditCard,
  },
  {
    id: "cod",
    title: "Cash on delivery",
    description: "Available for select pincodes on standard-size orders.",
    icon: Truck,
  },
  {
    id: "bank",
    title: "Bank transfer",
    description: "Useful for larger family orders and business gifting invoices.",
    icon: ShieldCheck,
  },
];

export const trustHighlights: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Freshly batched",
    description: "Recipes are cooked in small runs so jars feel recent and lively, not shelf-tired.",
    icon: PackageCheck,
  },
  {
    title: "Ingredient-first",
    description: "Cold-pressed oils, hand-sorted produce, and roasting done with kitchen-level care.",
    icon: Leaf,
  },
  {
    title: "Checkout clarity",
    description: "Pricing, delivery charges, payment methods, and order status are all visible before purchase.",
    icon: BadgeCheck,
  },
  {
    title: "Fast support",
    description: "Phone and WhatsApp help are built into the purchase flow when customers need confidence.",
    icon: Clock3,
  },
];

export const testimonials = [
  {
    quote:
      "The new site finally feels like a real food store. The product cards, cart flow, and payment details make the brand look ready for premium clients.",
    name: "Sruthi M.",
    meta: "Vijayawada repeat customer",
  },
  {
    quote:
      "We ordered gifting hampers for a family event and the checkout made it easy to compare quantities, delivery timing, and payment options in one place.",
    name: "Madhav K.",
    meta: "Hyderabad event order",
  },
  {
    quote:
      "The card design is strong enough that I could trust the products immediately. The site now sells, not just showcases.",
    name: "Aparna R.",
    meta: "First-time online buyer",
  },
];

export const fulfillmentSteps = [
  {
    title: "Browse with confidence",
    description: "Filter by category, compare pack sizes, and add items straight into a persistent cart.",
  },
  {
    title: "Choose payment and slot",
    description: "Checkout captures address, phone, delivery note, payment mode, and dispatch preference.",
  },
  {
    title: "Receive order updates",
    description: "Placed orders are saved locally with a clean confirmation state and WhatsApp-ready summary.",
  },
];

export const faqItems = [
  {
    question: "How soon do orders ship?",
    answer: "Most prepaid orders move within 24 hours. Large gifting or bulk packs may need an extra day.",
  },
  {
    question: "Do you support gifting and business orders?",
    answer: "Yes. Family combo boxes and festive hampers are built for gifting, and bank transfer works for bigger invoices.",
  },
  {
    question: "Can I order on WhatsApp instead?",
    answer: "Yes. Every checkout can open a prefilled WhatsApp summary if the customer wants direct confirmation.",
  },
];

export const storeMedia = {
  heroMeal,
  storyKitchen,
  introVideo,
};

export const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => priceFormatter.format(value);

export const categoryMap = Object.fromEntries(
  categories.map((category) => [category.key, category]),
) as Record<CategoryKey, Category>;

export const getProductById = (productId: string) =>
  products.find((product) => product.id === productId);

export const getDefaultSize = (product: Product) => product.sizes[0];

export const buildWhatsAppText = (lines: string[]) =>
  `${whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
