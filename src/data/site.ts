import heroMeal from "@/assets/hero-meal.jpg";
import introVideo from "@/assets/intro-video.mp4";
import storyKitchen from "@/assets/story-kitchen.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import {
  productCatalog,
  type ProductCategory,
  type ProductRecord,
  type WeightOption,
} from "@/data/products";

export type { ProductCategory, ProductRecord, WeightOption } from "@/data/products";

export type StoreFilter = ProductCategory | "all";
export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export type CartLine = {
  productId: string;
  name: string;
  category: ProductCategory;
  image: string;
  price: number;
  weight: WeightOption;
  quantity: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  pincode?: string;
};

export type OrderRecord = {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    weight: WeightOption;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  customer: OrderCustomer;
  subtotal: number;
  shipping?: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  whatsappUrl: string;
};

export const defaultProducts: ProductRecord[] = productCatalog.map((product) => ({
  ...product,
  nameTeluguguTelugu: product.name_te,
  isBrahminHeritage: product.isBrahminHeritage ?? true,
  isGreenTouch: product.isGreenTouch ?? true,
  isAvailable: product.isAvailable ?? true,
}));

export const products = defaultProducts;

export const brand = {
  name: "SP Traditional Pickles",
  tagline: "Pure Taste. Traditional Roots.",
  subtitle: "Authentic Brahmin-style homemade pickles with no preservatives",
  teluguSubtitle: "సాంప్రదాయ బ్రాహ్మణ పద్ధతిలో తయారు చేసిన స్వచ్ఛమైన పచ్చళ్ళు",
  whatsappNumber: "917981370664",
  whatsappUrl: "https://wa.me/917981370664",
  phoneNumbers: ["+91 79813 70664", "+91 73826 65848"],
  address:
    "Puchcha Pallavi, Kanakaraju Veedhi, Muthyalampadu, Vijayawada, Andhra Pradesh",
  supportEmail: "orders@sppickles.in",
  usps: ["No Onion", "No Garlic", "No Preservatives", "Homemade"],
};

export const navigation = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const categoryContent: Array<{
  key: ProductCategory;
  label: string;
  description: string;
  image: string;
}> = [
  {
    key: "pickles",
    label: "Pickles",
    description: "Traditional Andhra pickles with bold spice, clean ingredients, and homemade depth.",
    image: pickleAvakaya,
  },
  {
    key: "powders",
    label: "Powders",
    description: "Fresh podis that bring comfort, aroma, and everyday South Indian flavour to the table.",
    image: categoryPowders,
  },
  {
    key: "snacks",
    label: "Snacks",
    description: "Crisp fryums and tea-time favourites prepared for family meals and gifting.",
    image: categoryVadiyalu,
  },
];

export const testimonials = [
  {
    name: "Lakshmi R.",
    review: "The taste feels truly homemade. The avakaya and gongura are exactly what we wanted.",
  },
  {
    name: "Srinivas K.",
    review: "Clean packaging, clear ordering, and very consistent flavour across the pickles and podis.",
  },
  {
    name: "Madhavi P.",
    review: "We loved that the products feel traditional without tasting heavy or overly commercial.",
  },
];

export const faqItems = [
  {
    question: "Do you use preservatives?",
    answer: "No. SP Traditional Pickles focuses on homemade preparation with no preservatives.",
  },
  {
    question: "How do I place an order?",
    answer: "Add products to cart, complete checkout, and confirm the order on WhatsApp.",
  },
  {
    question: "Do you deliver across India?",
    answer: "Yes. We support All India delivery and shipping is calculated from the pincode.",
  },
];

export const heroSlides = [
  {
    id: "hero",
    eyebrow: "SP Traditional Pickles",
    title: brand.name,
    description: brand.subtitle,
    image: heroMeal,
  },
];

export const trustBadges = brand.usps;

export const processSteps = [
  {
    title: "Select Product",
    description: "Browse the static catalog and choose your favourite pickles, powders, or snacks.",
  },
  {
    title: "Choose Weight",
    description: "Pick 250g, 500g, or 1kg and adjust quantity based on your household needs.",
  },
  {
    title: "Confirm Order",
    description: "Complete checkout and continue on WhatsApp for a direct, familiar order flow.",
  },
];

export const trustStripItems = brand.usps;

export const siteMedia = {
  heroMeal,
  storyKitchen,
  introVideo,
};

export const weightOptions: Array<{ label: WeightOption; multiplier: number }> = [
  { label: "250g", multiplier: 0.25 },
  { label: "500g", multiplier: 0.5 },
  { label: "1kg", multiplier: 1 },
];
