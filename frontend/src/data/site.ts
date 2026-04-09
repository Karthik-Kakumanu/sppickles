import heroMeal from "@/assets/hero-meal.jpg";
import storyKitchen from "@/assets/story-kitchen.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import spPicklesLogo from "@/assets/sp-pickles-logo.png";
import {
  catSaltPickles,
  catTemperedPickles,
  pickleAvakaya,
} from "@/lib/pickleImages";
import {
  productCatalog,
  type ProductCategory,
  type ProductRecord,
  type WeightOption,
} from "@/data/products";

export type { ProductCategory, ProductRecord, WeightOption } from "@/data/products";

export type StoreFilter =
  | "all"
  | ProductCategory
  | "salted-pickles"
  | "tempered-pickles";

export type OrderStatus = "pending" | "processing" | "delivered";

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
  city: string;
  state: string;
  country: string;
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
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string;
  paymentTime?: string;
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

const mapQuery =
  "23-30-24, opp sri sai residency, kanakaraju street, satyanarayana puram, Vijayawada -11";

export const brand = {
  name: "Sampradaya Pickles",
  logo: spPicklesLogo,
  tagline: "Handpicked tradition from Vijayawada",
  subtitle:
    "Pure vegetarian homemade pickles, podulu, and fryums prepared in a Brahmin-style kitchen.",
  teluguSubtitle:
    "విజయవాడలో బ్రాహ్మణ ఇంటివంట పద్ధతిలో తయారయ్యే శుద్ధ శాకాహార పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్.",
  whatsappNumber: "7981370664",
  whatsappDisplay: "7981370664",
  whatsappUrl: "https://wa.me/917981370664",
  phoneNumbers: ["+91 79813 70664", "08664602255", "7382665848"],
  address: mapQuery,
  supportEmail: "jalasutram.pragathi.b@gmail.com",
  mapQuery,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`,
  usps: [
    "Pure Vegetarian",
    "No Onion Options",
    "No Garlic Options",
    "No Preservatives",
    "Handpicked Ingredients",
  ],
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed",
  },
  socialMedia: {
    instagram: "https://instagram.com/sppickles",
    facebook: "https://facebook.com/sppickles",
    youtube: "https://youtube.com/@sppickles",
  },
  currencySymbol: "₹",
  yearEstablished: 2016,
};

export const navigation = [
  { to: "/" },
  { to: "/products" },
  { to: "/about" },
  { to: "/contact" },
] as const;

export const categoryContent: Array<{
  key: ProductCategory;
  label: string;
  description: string;
  image: string;
}> = [
  {
    key: "pickles",
    label: "Pickles",
    description:
      "Traditional Andhra pickles with bold spice, handmade balance, and premium presentation.",
    image: pickleAvakaya,
  },
  {
    key: "powders",
    label: "Podulu",
    description:
      "Fresh podulu prepared for hot rice, breakfast plates, and everyday Andhra comfort food.",
    image: categoryPowders,
  },
  {
    key: "fryums",
    label: "Fryums",
    description:
      "Sun-dried vadiyalu, appadalu, and crunchy accompaniments prepared for family meals.",
    image: categoryVadiyalu,
  },
];

export const homeCategoryCards = [
  {
    key: "salted-pickles",
    label: "Salted Pickles",
    labelTe: "ఉప్పు పచ్చళ్ళు",
    description:
      "Simple, pure salt and chilli-based pickles with fresh tanginess. No added spices—just clean, traditional flavor.",
    descriptionTe:
      "సరళమైన ఉప్పు మరియు మిరప ఆధారిత పచ్చళ్ళు. అదనపు మసాలా లేకుండా శుభ్రమైన, సంప్రదాయ రుచి.",
    image: catSaltPickles,
    to: "/products/pickles/salted",
  },
  {
    key: "tempered-pickles",
    label: "Tempered Pickles",
    labelTe: "తాలింపు పచ్చళ్ళు",
    description:
      "Deep-fried and slow-cooked pickles with roasted spices and complex tempering. Each jar is prepared to deliver richer masala layers.",
    descriptionTe:
      "రోస్టెడ్ మసాలాలు మరియు నెమ్మదిగా చేసిన తాలింపుతో తయారయ్యే పచ్చళ్ళు. ప్రతి జార్‌లో లోతైన మసాలా రుచి పొరలు ఉంటాయి.",
    image: catTemperedPickles,
    to: "/products/pickles/tempered",
  },
  {
    key: "powders",
    label: "Podulu",
    labelTe: "పొడులు",
    description:
      "Sun-dried powder accompaniments blended with roasted spices and fresh chillies. Crispy, instant, and aromatic for any meal.",
    descriptionTe:
      "సూర్యప్రకాశ సేకరించిన, రోస్టెడ్ మసాలలు మరియు తాజా మిరపలతో కలిపిన పొడులు - తక్షణ, కరకరలాడే, సుగంధ ఉన్న పొడులు.",
    image: categoryPowders,
    to: "/products/podulu",
  },
  {
    key: "fryums",
    label: "Fryums",
    labelTe: "అప్పడాలు / వడియాలు",
    description:
      "Deep-fried crispy snacks made from rice and lentil flours. Crunchy, light, and traditionally made for festivals and family meals.",
    descriptionTe:
      "బియ్యం మరియు దాలిదండ్రుల పిండి నుండి చేసిన కరకరలాడే ఫ్రీ చేసిన నుండు. హీరాగా తెలిసిన, తేలికైన, పండుగలు మరియు కుటుంబ భోజనాల కోసం సంప్రదాయ విధానంలో తయారు చేసిన.",
    image: categoryVadiyalu,
    to: "/products/fryums",
  },
] as const;

export const testimonials = [
  {
    name: "Lakshmi R.",
    review:
      "The taste feels homemade and consistent. The avakaya and gongura are exactly what our family expects.",
  },
  {
    name: "Srinivas K.",
    review:
      "Clear ordering, careful packing, and dependable flavour across both pickles and podulu.",
  },
  {
    name: "Madhavi P.",
    review:
      "It feels like pantry food from home, not generic mass-produced products.",
  },
];

export const faqItems = [
  {
    question: "Do you use preservatives?",
    answer:
      "No. SP Traditional Pickles focuses on homemade preparation with no preservatives.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Add products to cart, complete checkout, and continue to the payment step or WhatsApp support.",
  },
  {
    question: "Do you deliver outside India?",
    answer:
      "Yes. India-wide shipping is supported directly and international or USA orders are handled after enquiry confirmation.",
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
    title: "Choose the category",
    description:
      "Start with salted pickles, tempered pickles, podulu, or fryums based on what you need.",
  },
  {
    title: "Share the delivery details",
    description:
      "Checkout collects the full address, state, city, and pincode before moving to payment.",
  },
  {
    title: "Confirm and receive",
    description:
      "Orders are packed carefully and shared with the team for preparation, dispatch, and tracking.",
  },
];

export const trustStripItems = brand.usps;

export const weightOptions: Array<{ label: WeightOption; multiplier: number }> = [
  { label: "250g", multiplier: 0.25 },
  { label: "500g", multiplier: 0.5 },
  { label: "1kg", multiplier: 1 },
];
