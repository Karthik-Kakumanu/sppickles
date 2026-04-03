import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  HandPlatter,
  MapPinned,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import heroMeal from "@/assets/hero-meal.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import catSpecial from "@/assets/cat-special.jpg";
import storyKitchen from "@/assets/story-kitchen.jpg";
import { pickleAvakaya, pickleGongura, pickleLemon } from "@/lib/pickleImages";

export const whatsappNumber = "7981370664";
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello, I would like to place an order with Sampradyani Pachachalu with Brahmin Taste.",
)}`;

export const contactNumbers = ["7981370664", "08664602255", "7382665848"];
export const address =
  "23-30-24, opp sri sai residency, kanakaraju street, satyanarayana puram, Vijayawada -11";

export const navItems = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Our Story", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export const categoryCards = [
  {
    title: "Andhra Pickles",
    description: "Signature avakaya, gongura, lemon, and seasonal jars made in small batches.",
    image: pickleAvakaya,
    to: "/products/pickles",
  },
  {
    title: "Homemade Podi",
    description: "Podi blends for rice, tiffins, and everyday cooking with the warmth of home kitchens.",
    image: categoryPowders,
    to: "/products/powders",
  },
  {
    title: "Vadiyalu & Fryums",
    description: "Sun-dried accompaniments that bring crunch to simple meals and festive spreads.",
    image: categoryVadiyalu,
    to: "/products/fryums",
  },
  {
    title: "Special Packs",
    description: "Curated specials and gifting-friendly selections for families who want variety.",
    image: catSpecial,
    to: "/products/combos",
  },
];

export const featuredProducts = [
  {
    title: "Avakaya",
    description: "Our best-known mango pickle with a bold chilli-mustard finish.",
    image: pickleAvakaya,
  },
  {
    title: "Gongura Pickle",
    description: "Tangy and deeply Andhra, built to pair beautifully with hot rice and ghee.",
    image: pickleGongura,
  },
  {
    title: "Lemon Pickle",
    description: "Bright, sharp, and comforting, with the kind of balance people reorder for.",
    image: pickleLemon,
  },
];

export const whyChooseUs: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Small-batch cooking",
    description: "We keep the process close to the kitchen so flavour and texture stay personal.",
    icon: UtensilsCrossed,
  },
  {
    title: "Traditional methods",
    description: "Recipes follow familiar Andhra preparation styles instead of factory shortcuts.",
    icon: HandPlatter,
  },
  {
    title: "Pan-India delivery",
    description: "Orders are packed securely and sent across India with WhatsApp-first support.",
    icon: Truck,
  },
];

export const processSteps = [
  {
    title: "Choose your page",
    description: "Browse by pickles, podi, fryums, or special packs instead of one long page.",
    icon: ShoppingBag,
  },
  {
    title: "Message us on WhatsApp",
    description: "Tell us the item, pack size, and city. We guide you through availability and shipping.",
    icon: BadgeCheck,
  },
  {
    title: "Receive it fresh",
    description: "We prepare, pack, and dispatch from Vijayawada with careful handling in mind.",
    icon: MapPinned,
  },
];

export const pageArt = {
  heroMeal,
  storyKitchen,
};
