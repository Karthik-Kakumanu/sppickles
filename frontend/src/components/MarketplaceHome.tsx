import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Clock3,
  Heart,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import catSpecial from "@/assets/cat-special.jpg";
import storyKitchen from "@/assets/story-kitchen.jpg";
import BilingualText from "@/components/BilingualText";
import {
  catSaltPickles,
  catTemperedPickles,
  pickleAvakaya,
  pickleGongura,
  pickleLemon,
} from "@/lib/pickleImages";

const promoItems = [
  {
    te: "శుద్ధ శాకాహార వంటగది",
    en: "Pure vegetarian kitchen",
  },
  {
    te: "ఉల్లిపాయ లేని ఎంపికలు",
    en: "No onion options",
  },
  {
    te: "వెల్లుల్లి లేని ఎంపికలు",
    en: "No garlic options",
  },
  {
    te: "ప్రిజర్వేటివ్‌లు లేవు",
    en: "No preservatives",
  },
  {
    te: "ఎంచుకున్న పదార్థాలు మాత్రమే",
    en: "Handpicked ingredients",
  },
  {
    te: "భారతదేశం, USA మరియు విదేశాలకు బల్క్ ఆర్డర్లు",
    en: "Bulk orders for India, USA, and overseas",
  },
];

const categories = [
  { te: "à°†à°«à°°à±à°²à±", en: "Offers" },
  { te: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±", en: "Salt Pickles" },
  { te: "à°‡à°‚à°—à±à°µ à°ªà°šà±à°šà°³à±à°³à±", en: "Tempered Pickles" },
  { te: "à°ªà±Šà°¡à±à°²à±", en: "Podi" },
  { te: "à°µà°¡à°¿à°¯à°¾à°²à±", en: "Vadiyalu" },
  { te: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°¦à°¾à°°à±à°¥à°¾à°²à±", en: "Special Items" },
];

const imageFilters = [
  {
    key: "all",
    te: "à°…à°¨à±à°¨à±€",
    en: "All",
    image: catSpecial,
  },
  {
    key: "pickles",
    te: "à°ªà°šà±à°šà°³à±à°³à±",
    en: "Pickles",
    image: pickleAvakaya,
  },
  {
    key: "powders",
    te: "à°ªà±Šà°¡à±à°²à±",
    en: "Podi",
    image: categoryPowders,
  },
  {
    key: "fryums",
    te: "à°«à±à°°à±ˆà°®à±à°¸à± & à°µà°¡à°¿à°¯à°¾à°²à±",
    en: "Fryums & Vadiyalu",
    image: categoryVadiyalu,
  },
  {
    key: "combos",
    te: "à°•à°¾à°‚à°¬à±‹à°²à±",
    en: "Combos",
    image: catSpecial,
  },
];

const heroCards = [
  {
    teTitle: "à°‡à°‚à°Ÿà°¿à°µà°‚à°Ÿ à°°à±à°šà±à°² à°¬à°¾à°•à±à°¸à±",
    enTitle: "Homemade Pickles",
    teSubtitle: "à°’à°•à±‡ à°šà±‹à°Ÿ à°Žà°•à±à°•à±à°µà°—à°¾ à°•à±Šà°¨à°¬à°¡à±‡ à°ªà°¦à°¾à°°à±à°¥à°¾à°²à±",
    enSubtitle: "Traditional Andhra jars made fresh in small batches",
    image: pickleAvakaya,
    className: "md:col-span-2",
  },
  {
    teTitle: "à°¤à°¾à°œà°¾ à°®à°¾à°µà°¡à±à°²à± à°…à°‚à°¦à±à°¬à°¾à°Ÿà±à°²à±‹",
    enTitle: "Fresh Maavadu",
    teSubtitle: "à°¸à±€à°œà°¨à°²à± à°¸à±à°ªà±†à°·à°²à± à°šà°¿à°¨à±à°¨ à°®à°¾à°®à°¿à°¡à°¿à°•à°¾à°¯ à°ªà°šà±à°šà°¡à°¿",
    enSubtitle: "Seasonal baby mango pickle prepared in a fresh batch",
    image: catSaltPickles,
    className: "",
  },
  {
    teTitle: "à°¸à±‚à°°à±à°¯à°¶à±‹à°·à°¿à°¤ à°µà°¡à°¿à°¯à°¾à°²à±",
    enTitle: "Odiyalu & Appadalu",
    teSubtitle: "à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯à°‚à°—à°¾ à°Žà°‚à°¡à°¬à±†à°Ÿà±à°Ÿà°¿à°¨ à°•à°°à°•à°°à°²à°¾à°¡à±‡ à°µà°‚à°Ÿà°•à°¾à°²à±",
    enSubtitle: "Traditional sun-dried favourites for every Andhra meal",
    image: categoryVadiyalu,
    className: "",
  },
];

const trustCards = [
  {
    visual: "customers",
    teTitle: "50,000+",
    enTitle: "50,000+",
    teLineOne: "à°¸à°‚à°¤à±‹à°·à°®à±ˆà°¨",
    enLineOne: "Happy",
    teLineTwo: "à°•à°¸à±à°Ÿà°®à°°à±à°²à±",
    enLineTwo: "Customers",
  },
  {
    visual: "origin",
    teTitle: "à°µà°¿à°œà°¯à°µà°¾à°¡à°²à±‹",
    enTitle: "Made in",
    teLineOne: "à°¤à°¯à°¾à°°à±€",
    enLineOne: "VIJAYAWADA",
    teLineTwo: "",
    enLineTwo: "",
  },
  {
    visual: "review",
    teTitle: "4.8",
    enTitle: "Review",
    teLineOne: "à°•à°¸à±à°Ÿà°®à°°à±",
    enLineOne: "4.8",
    teLineTwo: "à°°à±‡à°Ÿà°¿à°‚à°—à±",
    enLineTwo: "Rating",
  },
  {
    visual: "shipping",
    teTitle: "à°­à°¾à°°à°¤à°¦à±‡à°¶à°‚",
    enTitle: "Ships",
    teLineOne: "à°…à°‚à°¤à°Ÿà°¾",
    enLineOne: "Across",
    teLineTwo: "à°¡à±†à°²à°¿à°µà°°à±€",
    enLineTwo: "INDIA",
  },
];

const quickCategories = [
  { key: "pickles", te: "Pachallu", en: "Pickles" },
  { key: "powders", te: "Podulu", en: "Podi" },
  { key: "fryums", te: "Odiyalu / Appadalu", en: "Odiyalu / Appadalu" },
];

const categoryCards = [
  {
    filterKey: "pickles",
    pickleTypeKey: "salt",
    teTitle: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
    enTitle: "Salt Pickles",
    teText: "à°šà°¿à°‚à°¤à°•à°¾à°¯ à°¤à±Šà°•à±à°•à± à°¨à±à°‚à°šà°¿ à°µà±‡à°²à°•à±à°•à°¾à°¯ à°µà°°à°•à± 1kg à°•à°¿ â‚¹550 à°¨à±à°‚à°šà°¿ à°ªà±à°°à°¾à°°à°‚à°­à°‚",
    enText: "Traditional salt pickles from Chintakaya Thokku to Velakkaya starting at Rs.550 per kg",
    image: catSaltPickles,
  },
  {
    teTitle: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
    filterKey: "pickles",
    pickleTypeKey: "tempered",
    enTitle: "Tempered Pickles",
    teText: "à°†à°µà°•à°¾à°¯, à°—à±‹à°‚à°—à±‚à°°, à°®à°¾à°—à°¾à°¯, à°ªà±à°²à°¿à°¹à±‹à°° à°°à°•à°¾à°²à°¤à±‹ à°ªà±†à°¦à±à°¦ à°•à°²à±†à°•à±à°·à°¨à±",
    enText: "Large collection of avakaya, gongura, magaya, and pulihora style pickles",
    image: catTemperedPickles,
  },
  {
    teTitle: "à°ªà±Šà°¡à±à°²à±, à°µà°¡à°¿à°¯à°¾à°²à± & à°…à°ªà±à°ªà°¡à°¾à°²à±",
    filterKey: "powders",
    enTitle: "Podi, Vadiyalu & Appadalu",
    teText: "à°•à°‚à°¦à°¿ à°ªà±Šà°¡à°¿ à°¨à±à°‚à°šà°¿ à°¸à°—à±à°—à±à°¬à°¿à°¯à±à°¯à°‚ à°µà°¡à°¿à°¯à°¾à°²à±, à°®à°¿à°¨à°ª à°…à°ªà±à°ªà°¡à°¾à°²à± à°µà°°à°•à±",
    enText: "From kandi podi to saggubiyyam vadiyalu and minapa appadalu",
    image: categoryPowders,
  },
];

const productCards = [
  {
    category: "pickles",
    teTitle: "à°šà°¿à°‚à°¤à°•à°¾à°¯ à°¤à±Šà°•à±à°•à±",
    enTitle: "Chintakaya Thokku",
    teText: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à°²à±‹ à°¬à±à°°à°¾à°¹à±à°®à°£ à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ à°°à±à°šà°¿",
    enText: "Traditional salt pickle made in Brahmin homestyle",
    price: "â‚¹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "à°‰à°¸à°¿à°°à°¿ à°¤à±Šà°•à±à°•à±",
    enTitle: "Usiri Thokku",
    teText: "à°¸à°¹à°œ à°ªà°¦à°¾à°°à±à°¥à°¾à°²à°¤à±‹ à°šà±‡à°¸à°¿à°¨ à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°¡à°¿",
    enText: "Gooseberry salt pickle made with quality ingredients",
    price: "â‚¹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "à°‰à°ªà±à°ªà± à°—à±‹à°‚à°—à±‚à°°",
    enTitle: "Uppu Gongura",
    teText: "à°ªà±à°²à±à°²à°Ÿà°¿ à°°à±à°šà°¿à°¤à±‹ à°µà±‡à°¡à°¿ à°…à°¨à±à°¨à°¾à°¨à°¿à°•à°¿ à°¬à°¾à°—à°¾ à°¸à°°à°¿à°ªà±‹à°¤à±à°‚à°¦à°¿",
    enText: "Tangy salt gongura that pairs well with hot rice",
    price: "â‚¹550 / 1kg",
    image: pickleGongura,
  },
  {
    category: "pickles",
    teTitle: "à°ªà°‚à°¡à±à°®à°¿à°°à±à°šà°¿ à°—à±‹à°‚à°—à±‚à°°",
    enTitle: "Pandu Mirchi Gongura",
    teText: "à°®à°¸à°¾à°²à°¾ à°˜à°¾à°Ÿà± à°°à±à°šà°¿à°¤à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°•à°®à±ˆà°¨ à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°¡à°¿",
    enText: "Spicy salt pickle with red chilli and gongura",
    price: "â‚¹550 / 1kg",
    image: pickleGongura,
  },
  {
    category: "pickles",
    teTitle: "à°¨à°¿à°®à±à°®à°•à°¾à°¯",
    enTitle: "Nimakaya",
    teText: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à°²à±‹ à°Žà°ªà±à°ªà±à°¡à±‚ à°•à±Šà°¨à°¬à°¡à±‡ à°•à±à°²à°¾à°¸à°¿à°•à± à°°à°•à°‚",
    enText: "Classic lemon salt pickle loved in every home",
    price: "â‚¹550 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "à°Ÿà°®à±‹à°Ÿà°¾",
    enTitle: "Tomato",
    teText: "à°¤à°¾à°œà°¾ à°Ÿà°®à±‹à°Ÿà°¾à°¤à±‹ à°šà±‡à°¸à°¿à°¨ à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°¡à°¿",
    enText: "Fresh tomato salt pickle",
    price: "â‚¹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "à°µà±‡à°²à°•à±à°•à°¾à°¯",
    enTitle: "Velakkaya",
    teText: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à°²à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°• à°°à±à°šà°¿",
    enText: "Special salt pickle variety",
    price: "â‚¹600 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "à°šà°¿à°‚à°¤à°•à°¾à°¯",
    enTitle: "Chintakaya",
    teText: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà±à°¤à±‹ à°¤à°¯à°¾à°°à± à°šà±‡à°¸à°¿à°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°šà±à°šà°¡à°¿",
    enText: "Tempered tamarind pickle with hing seasoning",
    price: "â‚¹650 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°‰à°¸à°¿à°°à°¿à°•à°¾à°¯",
    enTitle: "Usirikaya",
    teText: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°°à±à°šà°¿à°¤à±‹ à°¤à°¯à°¾à°°à±à°šà±‡à°¸à°¿à°¨ à°ªà°šà±à°šà°¡à°¿",
    enText: "Tempered gooseberry pickle",
    price: "â‚¹650 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "à°†à°µà°•à°¾à°¯",
    enTitle: "Avakaya",
    teText: "à°¬à±à°°à°¾à°¹à±à°®à°£ à°®à°¹à°¿à°³à°² à°šà±‡à°¤ à°¤à°¯à°¾à°°à± à°šà±‡à°¸à°¿à°¨ à°…à°¸à°²à±ˆà°¨ à°†à°‚à°§à±à°° à°†à°µà°•à°¾à°¯",
    enText: "Authentic Andhra avakaya made by Brahmin women",
    price: "â‚¹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°µà±†à°²à±à°²à±à°²à°¿ à°†à°µà°•à°¾à°¯",
    enTitle: "Vellulli Avakaya",
    teText: "à°µà±†à°²à±à°²à±à°²à°¿ à°°à±à°šà°¿à°¤à±‹ à°˜à°¾à°Ÿà± à°†à°µà°•à°¾à°¯",
    enText: "Garlic avakaya with bold flavour",
    price: "â‚¹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¬à±†à°²à±à°²à°‚ à°†à°µà°•à°¾à°¯",
    enTitle: "Bellam Avakaya",
    teText: "à°¤à±€à°ªà°¿ à°®à°°à°¿à°¯à± à°˜à°¾à°Ÿà± à°•à°²à°¿à°¸à°¿à°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°†à°µà°•à°¾à°¯",
    enText: "Jaggery avakaya with sweet-spicy balance",
    price: "â‚¹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°Žà°‚à°¡à± à°†à°µà°•à°¾à°¯",
    enTitle: "Endu Avakaya",
    teText: "à°Žà°‚à°¡à°¬à±†à°Ÿà±à°Ÿà°¿à°¨ à°®à°¾à°®à°¿à°¡à°¿ à°°à±à°šà°¿à°¤à±‹",
    enText: "Dried-style avakaya with deeper flavour",
    price: "â‚¹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¤à±€à°ªà°¿ à°®à±†à°‚à°¤à°¿ à°†à°µà°•à°¾à°¯",
    enTitle: "Theepi Methi Avakaya",
    teText: "à°®à±†à°‚à°¤à°¿ à°®à°°à°¿à°¯à± à°¤à±€à°ªà°¿ à°•à°²à°¿à°¸à°¿à°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°°à°•à°‚",
    enText: "Sweet methi avakaya special",
    price: "â‚¹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°ªà±†à°¸à°° à°†à°µà°•à°¾à°¯",
    enTitle: "Pesara Avakaya",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°•à°®à±ˆà°¨ à°®à°¿à°¶à±à°°à°®à°‚à°¤à±‹ à°¤à°¯à°¾à°°à±€",
    enText: "Special avakaya variety with pesara touch",
    price: "â‚¹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¨à±à°µà±à°µà± à°†à°µà°•à°¾à°¯",
    enTitle: "Nuvvu Avakaya",
    teText: "à°¨à±à°µà±à°µà±à°² à°°à±à°šà°¿à°¤à±‹ à°†à°µà°•à°¾à°¯",
    enText: "Sesame-style avakaya",
    price: "â‚¹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°ªà°¨à°¸à°ªà±‹à°Ÿà±à°Ÿà± à°†à°µà°•à°¾à°¯",
    enTitle: "Panasapottu Avakaya",
    teText: "à°…à°°à±à°¦à±ˆà°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°à°Ÿà°®à±",
    enText: "Rare speciality avakaya variety",
    price: "â‚¹750 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "à°ªà°šà±à°š à°†à°µà°•à°¾à°¯",
    enTitle: "Paccha Avakaya",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà±à°°à±€à°®à°¿à°¯à°‚ à°°à°•à°‚",
    enText: "Premium fresh avakaya variety",
    price: "â‚¹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¦à±‹à°¸à°µà°•à°¾à°¯",
    enTitle: "Dosavakaya",
    teText: "à°°à±‹à°œà±à°µà°¾à°°à±€ à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°¬à°¾à°—à°¾ à°¸à°°à°¿à°ªà±‹à°¤à±à°‚à°¦à°¿",
    enText: "Everyday favourite dosavakaya pickle",
    price: "â‚¹600 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "à°®à°¾à°—à°¾à°¯",
    enTitle: "Magaya",
    teText: "à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯ à°®à°¾à°®à°¿à°¡à°¿à°•à°¾à°¯ à°ªà°šà±à°šà°¡à°¿",
    enText: "Traditional magaya mango pickle",
    price: "â‚¹650 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°µà°‚à°•à°¾à°¯ à°¨à°¿à°²à±à°µ à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Vankaya Nilava Pachadi",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°¨à°¿à°²à±à°µ à°°à°•à°‚",
    enText: "Brinjal preserve pickle",
    price: "â‚¹850 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "à°…à°²à±à°²à°‚ à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Allam Pachadi",
    teText: "à°…à°²à±à°²à°‚ à°°à±à°šà°¿à°¤à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°•à°®à±ˆà°¨ à°ªà°šà±à°šà°¡à°¿",
    enText: "Homestyle ginger pachadi",
    price: "â‚¹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "à°®à°¾à°®à°¿à°¡à°¿ à°…à°²à±à°²à°‚ à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Mamidi Allam Pachadi",
    teText: "à°®à°¾à°®à°¿à°¡à°¿ à°…à°²à±à°²à°‚ à°•à°²à°¿à°¸à°¿à°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°šà±à°šà°¡à°¿",
    enText: "Mango ginger pachadi",
    price: "â‚¹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "à°®à°¾à°®à°¿à°¡à°¿ à°…à°²à±à°²à°‚ à°†à°µà°•à°¾à°¯",
    enTitle: "Mamidi Allam Avakaya",
    teText: "à°ªà±à°°à±€à°®à°¿à°¯à°‚ à°°à±‡à°‚à°œà± à°ªà±à°°à°¤à±à°¯à±‡à°• à°†à°µà°•à°¾à°¯",
    enText: "Premium mango ginger avakaya",
    price: "â‚¹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°Ÿà±Šà°®à±‹à°Ÿà±‹ à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Tomato Pachadi",
    teText: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà±à°¤à±‹ à°Ÿà±Šà°®à±‹à°Ÿà±‹ à°ªà°šà±à°šà°¡à°¿",
    enText: "Tempered tomato pachadi",
    price: "â‚¹650 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "à°®à±à°¨à°•à±à°•à°¾à°¯ à°Ÿà°®à±‹à°Ÿà°¾",
    enTitle: "Munakkaya Tomato",
    teText: "à°®à±à°¨à°•à±à°•à°¾à°¯-à°Ÿà°®à±‹à°Ÿà°¾ à°ªà±à°°à°¤à±à°¯à±‡à°• à°®à°¿à°•à±à°¸à±",
    enText: "Drumstick tomato pickle special",
    price: "â‚¹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "à°ªà°šà±à°šà°¿à°®à°¿à°°à°ª à°†à°µà°•à°¾à°¯",
    enTitle: "Pachimirapa Avakaya",
    teText: "à°ªà°šà±à°šà°¿à°®à°¿à°°à°ª à°˜à°¾à°Ÿà± à°°à±à°šà°¿à°¤à±‹",
    enText: "Green chilli avakaya",
    price: "â‚¹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°®à°¾à°®à°¿à°¡à°¿ à°¤à±à°°à±à°®à± à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Mamidi Turumu Pachadi",
    teText: "à°¤à±à°°à°¿à°®à°¿à°¨ à°®à°¾à°®à°¿à°¡à°¿à°¤à±‹ à°šà±‡à°¸à°¿à°¨ à°ªà°šà±à°šà°¡à°¿",
    enText: "Grated mango pachadi",
    price: "â‚¹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°®à°¾à°®à°¿à°¡à°¿ à°®à±à°•à±à°•à°² à°ªà°šà±à°šà°¡à°¿",
    enTitle: "Mamidi Mukkala Pachadi",
    teText: "à°®à°¾à°®à°¿à°¡à°¿ à°®à±à°•à±à°•à°²à°¤à±‹ à°šà±‡à°¸à°¿à°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°°à°•à°‚",
    enText: "Mango pieces pachadi",
    price: "â‚¹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°•à°¾à°¯ à°†à°µà°•à°¾à°¯",
    enTitle: "Kaya Avakaya",
    teText: "à°¸à°¾à°‚à°ªà±à°°à°¦à°¾à°¯ à°ªà°¦à±à°¦à°¤à°¿à°²à±‹ à°šà±‡à°¸à°¿à°¨ à°°à°•à°‚",
    enText: "Traditional kaya avakaya",
    price: "â‚¹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¤à±€à°ªà°¿ à°•à°¾à°¯ à°†à°µà°•à°¾à°¯",
    enTitle: "Theepi Kaya Avakaya",
    teText: "à°¤à±€à°ªà°¿ à°°à±à°šà°¿à°¤à±‹ à°ªà±à°°à±€à°®à°¿à°¯à°‚ à°°à°•à°‚",
    enText: "Sweet kaya avakaya premium",
    price: "â‚¹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¤à±€à°ªà°¿ à°¦à°¬à±à°¬à°•à°¾à°¯",
    enTitle: "Theepi Dabbakaya",
    teText: "à°¤à±€à°ªà°¿ à°¸à°¿à°Ÿà±à°°à°¸à± à°°à±à°šà°¿à°¤à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°šà±à°šà°¡à°¿",
    enText: "Sweet citron pickle",
    price: "â‚¹650 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "à°¤à±€à°ªà°¿ à°®à°—à°¯à°¾",
    enTitle: "Theepi Magaya",
    teText: "à°¤à±€à°ªà°¿-à°ªà±à°²à±à°ªà± à°•à°²à°¿à°¸à°¿à°¨ à°®à°¾à°—à°¾à°¯",
    enText: "Sweet magaya pickle",
    price: "â‚¹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°ªà±à°²à°¿à°¹à±‹à°° à°†à°µà°•à°¾à°¯",
    enTitle: "Pulihora Avakaya",
    teText: "à°ªà±à°²à°¿à°¹à±‹à°° à°°à±à°šà°¿à°¨à°¿ à°—à±à°°à±à°¤à± à°šà±‡à°¸à±‡ à°†à°µà°•à°¾à°¯",
    enText: "Pulihora style avakaya",
    price: "â‚¹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "à°¬à±à°¡à°‚ à°¦à±‹à°¸ à°†à°µà°•à°¾à°¯",
    enTitle: "Budam Dosa Avakaya",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°à°Ÿà°®à±, à°¡à°¿à°®à°¾à°‚à°¡à± à°‰à°¨à±à°¨ à°°à°•à°‚",
    enText: "Special budam dosa avakaya",
    price: "â‚¹850 / 1kg",
    image: catSpecial,
  },
  {
    category: "powders",
    teTitle: "à°•à°‚à°¦à°¿ à°ªà±Šà°¡à°¿",
    enTitle: "Kandi Podi",
    teText: "à°¨à±†à°¯à±à°¯à°¿ à°…à°¨à±à°¨à°‚à°¤à±‹ à°¤à°¿à°¨à°¡à°¾à°¨à°¿à°•à°¿ à°¬à±†à°¸à±à°Ÿà± à°¸à±†à°²à±à°²à°°à±",
    enText: "Best-selling kandi podi for rice and ghee",
    price: "â‚¹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°¨à±à°µà±à°µà±à°² à°ªà±Šà°¡à°¿",
    enTitle: "Nuvvula Podi",
    teText: "à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ à°¨à±à°µà±à°µà±à°² à°°à±à°šà°¿à°¤à±‹",
    enText: "Traditional sesame spice powder",
    price: "â‚¹700 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°§à°¨à°¿à°¯à°¾à°² à°ªà±Šà°¡à°¿",
    enTitle: "Dhaniyala Podi",
    teText: "à°°à±‹à°œà±à°µà°¾à°°à±€ à°µà°‚à°Ÿà°²à°•à± à°¸à°°à°¿à°ªà±‹à°¯à±‡ à°ªà±Šà°¡à°¿",
    enText: "Everyday coriander spice powder",
    price: "â‚¹500 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°ªà°ªà±à°ªà±à°² à°ªà±Šà°¡à°¿",
    enTitle: "Pappula Podi",
    teText: "à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°°à±à°šà°¿à°¨à°¿ à°ªà±†à°‚à°šà±‡ à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ à°ªà±Šà°¡à°¿",
    enText: "Traditional lentil powder for full meals",
    price: "â‚¹600 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°•à°°à°¿à°µà±‡à°ªà°¾à°•à± à°•à°¾à°°à°ªà±à°ªà±Šà°¡à°¿",
    enTitle: "Karivepaku Karam Podi",
    teText: "à°•à°°à°¿à°µà±‡à°ªà°¾à°•à± à°¸à±à°µà°¾à°¸à°¨à°¤à±‹",
    enText: "Curry leaf karam podi",
    price: "â‚¹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°…à°µà°¿à°¶à°—à°¿à°‚à°œà°² à°ªà±Šà°¡à°¿",
    enTitle: "Avisaginjala Podi",
    teText: "à°¨à°¾à°£à±à°¯à°®à±ˆà°¨ à°ªà°¦à°¾à°°à±à°¥à°¾à°²à°¤à±‹ à°¤à°¯à°¾à°°à±€",
    enText: "Flaxseed podi made with quality ingredients",
    price: "â‚¹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°•à±Šà°¬à±à°¬à°°à°¿ à°ªà±Šà°¡à°¿",
    enTitle: "Kobbari Podi",
    teText: "à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°¸à±ˆà°¡à±â€Œà°—à°¾ à°¸à°°à±ˆà°¨ à°°à±à°šà°¿",
    enText: "Coconut podi for everyday meals",
    price: "â‚¹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°°à°¸à°‚ à°ªà±Šà°¡à°¿",
    enTitle: "Rasam Podi",
    teText: "à°‡à°‚à°Ÿà°¿à°µà°‚à°Ÿ à°°à°¸à°‚ à°•à±‹à°¸à°‚",
    enText: "Rasam powder for homestyle cooking",
    price: "â‚¹550 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°¸à°¾à°‚à°¬à°¾à°°à± à°ªà±Šà°¡à°¿",
    enTitle: "Sambaru Podi",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°¸à°¾à°‚à°¬à°¾à°°à± à°°à±à°šà°¿ à°•à±‹à°¸à°‚",
    enText: "Traditional sambar powder",
    price: "â‚¹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°¨à°²à±à°²à°•à°¾à°°à°‚",
    enTitle: "Nalla Karam",
    teText: "à°˜à°¾à°Ÿà± à°°à±à°šà°¿à°¨à°¿ à°‡à°·à±à°Ÿà°ªà°¡à±‡à°µà°¾à°°à°¿à°•à°¿",
    enText: "Nalla karam for bold spice lovers",
    price: "â‚¹800 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°ªà±à°¦à±€à°¨à°¾ à°•à°¾à°°à°ªà±Šà°¡à°¿",
    enTitle: "Pudina Karam Podi",
    teText: "à°ªà±à°¦à±€à°¨à°¾ à°¸à±à°µà°¾à°¸à°¨à°¤à±‹ à°¸à±à°ªà±ˆà°¸à±€ à°ªà±Šà°¡à°¿",
    enText: "Mint spice powder",
    price: "â‚¹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°®à±à°¨à°—à°¾à°•à± à°ªà±Šà°¡à°¿",
    enTitle: "Munagaku Podi",
    teText: "à°ªà±à°°à±€à°®à°¿à°¯à°‚ à°•à±‡à°Ÿà°—à°¿à°°à±€ à°ªà±Šà°¡à°¿",
    enText: "Premium moringa leaf powder",
    price: "â‚¹2000 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°®à±à°¨à°—à°¾à°•à± à°•à°¾à°°à°ªà±Šà°¡à°¿",
    enTitle: "Munagaku Karam Podi",
    teText: "à°®à±à°¨à°—à°¾à°•à± à°•à°¾à°°à°‚à°¤à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°• à°°à±à°šà°¿",
    enText: "Moringa karam podi",
    price: "â‚¹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "à°¨à°²à±à°²à±‡à°°à± à°ªà±Šà°¡à°¿",
    enTitle: "Nalleru Podi",
    teText: "à°…à°°à±à°¦à±ˆà°¨ à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà±Šà°¡à°¿",
    enText: "Special nalleru podi",
    price: "â‚¹900 / 1kg",
    image: categoryPowders,
  },
  {
    category: "fryums",
    teTitle: "à°¸à°—à±à°—à±à°¬à°¿à°¯à±à°¯à°‚ à°µà°¡à°¿à°¯à°¾à°²à±",
    enTitle: "Saggubiyyam Vadiyalu",
    teText: "à°¸à±‚à°°à±à°¯à°¶à±‹à°·à°¿à°¤ à°•à°°à°•à°°à°²à°¾à°¡à±‡ à°µà°¡à°¿à°¯à°¾à°²à±",
    enText: "Sun-dried tapioca fryums",
    price: "â‚¹650 / 1kg",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°ªà±†à°¸à°° à°…à°ªà±à°ªà°¡à°¾à°²à±",
    enTitle: "Pesara Appadalu",
    teText: "à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°•à±à°²à°¾à°¸à°¿à°•à± à°…à°ªà±à°ªà°¡à°¾à°²à±",
    enText: "Classic green gram appadalu",
    price: "â‚¹750",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°®à°¿à°¨à°ª à°…à°ªà±à°ªà°¡à°¾à°²à±",
    enTitle: "Minapa Appadalu",
    teText: "à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ à°‰à°°à°¦à± à°…à°ªà±à°ªà°¡à°¾à°²à±",
    enText: "Traditional urad appadalu",
    price: "â‚¹750",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°šà°²à±à°² à°®à°¿à°°à±à°šà°¿",
    enTitle: "Challa Mirchi",
    teText: "à°•à°¾à°°à°‚ à°°à±à°šà°¿à°¤à±‹ à°ªà±à°°à°¤à±à°¯à±‡à°• à°à°Ÿà°®à±",
    enText: "Spicy sun-dried chilli special",
    price: "â‚¹1050",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°—à±à°®à±à°®à°¡à°¿ à°’à°¡à°¿à°¯à°²à±",
    enTitle: "Gummadi Odiyalu",
    teText: "à°ªà±à°°à±€à°®à°¿à°¯à°‚ à°µà°¡à°¿à°¯à°¾à°² à°•à±‡à°Ÿà°—à°¿à°°à±€",
    enText: "Premium pumpkin odiyalu",
    price: "â‚¹1150",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°®à°¿à°¨à°ªà°¿à°‚à°¡à°¿ à°’à°¡à°¿à°¯à°²à±",
    enTitle: "Minapindi Odiyalu",
    teText: "à°‡à°‚à°Ÿà°¿à°µà°‚à°Ÿ à°¶à±ˆà°²à°¿à°²à±‹ à°¤à°¯à°¾à°°à±€",
    enText: "Homestyle urad flour odiyalu",
    price: "â‚¹650",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°¬à°¿à°¯à±à°¯à°ªà°¾à°°à°µà±à°µ à°’à°¡à°¿à°¯à°²à±",
    enTitle: "Biyyaparavva Odiyalu",
    teText: "à°°à±‹à°œà±à°µà°¾à°°à±€ à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°¸à°°à±ˆà°¨à°µà°¿",
    enText: "Rice crisps for daily meals",
    price: "â‚¹650",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "à°—à±‹à°°à±à°šà°¿à°•à±à°•à±à°¡à± à°“à°¡à°¿à°¯à°¾à°²à±",
    enTitle: "Goruchikkudu Odiyalu",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°µà°¡à°¿à°¯à°¾à°² à°°à°•à°‚",
    enText: "Cluster beans odiyalu special",
    price: "â‚¹850",
    image: categoryVadiyalu,
  },
  {
    category: "combos",
    teTitle: "à°¬à±à°¡à°‚à°¦à±‹à°¸ à°’à°°à±à°—à±",
    enTitle: "Budandosa Orugu",
    teText: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°à°Ÿà°®à±, 1 à°•à±‡à°œà±€ à°ªà±à°¯à°¾à°•à±",
    enText: "Special item available in 1 kg pack",
    price: "â‚¹1250 / 1kg",
    image: catSpecial,
  },
  {
    category: "combos",
    teTitle: "à°ªà°¾à°² à°‡à°‚à°—à±à°µ",
    enTitle: "Paala Inguva",
    teText: "10 à°—à±à°°à°¾à°®à±à°² à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°¦à°¾à°°à±à°¥à°‚",
    enText: "Special paala inguva, 10 gram pack",
    price: "â‚¹200 / 10g",
    image: catSpecial,
  },
  {
    category: "combos",
    teTitle: "à°šà°¿à°Ÿà±à°Ÿà°¿à°‚à°Ÿà°ªà±Šà°Ÿà±à°Ÿà±",
    enTitle: "Chittintapottu",
    teText: "à°®à°¾ à°¦à°—à±à°—à°° à°ªà±à°°à°¤à±à°¯à±‡à°•à°‚à°—à°¾ à°²à°­à°¿à°‚à°šà±à°¨à±",
    enText: "Also available as a special item",
    price: "Available",
    image: catSpecial,
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    te: "à°•à°²à°°à±à°¸à±, à°ªà±à°°à°¿à°œà°°à±à°µà±‡à°Ÿà°¿à°µà±à°¸à± à°²à±‡à°µà±",
    en: "No colours, no preservatives",
  },
  {
    icon: Clock3,
    te: "à°¬à±à°°à°¾à°¹à±à°®à°£ à°¸à°‚à°ªà±à°°à°¦à°¾à°¯ à°ªà°¦à±à°¦à°¤à°¿à°²à±‹ à°¤à°¯à°¾à°°à±€",
    en: "Prepared by Brahmin women in the traditional Brahmin method",
  },
  {
    icon: BadgePercent,
    te: "AS à°¬à±à°°à°¾à°‚à°¡à± à°ªà°ªà±à°ªà±à°¨à±‚à°¨à±†à°¤à±‹ à°®à°¾à°¤à±à°°à°®à±‡ à°¤à°¯à°¾à°°à±€",
    en: "Made only with AS brand groundnut oil",
  },
];

const whatsappUrl =
  "https://wa.me/917981370664?text=Hi%2C%20I%20would%20like%20to%20order%20pickles";

const saltPickleTitles = new Set([
  "Chintakaya Thokku",
  "Usiri Thokku",
  "Uppu Gongura",
  "Pandu Mirchi Gongura",
  "Pandu Mirchi",
  "Dabbakaya",
  "Nimakaya",
  "Tomato",
  "Velakkaya",
]);

const pickleTypeCards = [
  {
    key: "all",
    teTitle: "à°…à°¨à±à°¨à°¿ à°ªà°šà±à°šà°³à±à°³à±",
    enTitle: "All Pickles",
    teText: "à°‰à°ªà±à°ªà±, à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà±, à°ªà±à°²à°¿à°¹à±‹à°° à°®à°°à°¿à°¯à± à°ªà±à°°à°¤à±à°¯à±‡à°• à°°à°•à°¾à°²à°¨à±à°¨à±€ à°’à°•à±‡à°šà±‹à°Ÿ",
    enText: "See every pickle in one place",
    image: pickleAvakaya,
  },
  {
    key: "salt",
    teTitle: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
    enTitle: "Salt Pickles",
    teText: "à°ªà°¾à°¤à°•à°¾à°²à°‚ à°°à±à°šà°¿, à°ªà±à°°à°¤à°¿à°°à±‹à°œà±‚ à°…à°¨à±à°¨à°‚à°²à±‹ à°¤à°¿à°¨à±‡à°‚à°¦à±à°•à± à°¸à°°à±ˆà°¨ à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
    enText: "Classic salt-cured favourites for everyday meals",
    image: catSaltPickles,
  },
  {
    key: "tempered",
    teTitle: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
    enTitle: "Tempered Pickles",
    teText: "à°†à°µà°•à°¾à°¯, à°®à°¾à°—à°¾à°¯, à°ªà±à°²à°¿à°¹à±‹à°° à°®à°°à°¿à°¯à± à°ªà±à°°à°¤à±à°¯à±‡à°• à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°°à°•à°¾à°² à°ªà°šà±à°šà°³à±à°³à±",
    enText: "Avakaya, magaya, pulihora and specialty tempered jars",
    image: catTemperedPickles,
  },
];

const getPickleType = (title: string) => (saltPickleTitles.has(title) ? "salt" : "tempered");

const parseOneKgPrice = (price: string) => {
  const match = price.match(/â‚¹?\s*(\d+)\s*\/\s*1kg/i);
  return match ? Number(match[1]) : null;
};

const getWeightOptions = (price: string) => {
  const oneKgPrice = parseOneKgPrice(price);

  if (!oneKgPrice) {
    return [];
  }

  return [
    { label: "250g", amount: Math.round(oneKgPrice / 4) },
    { label: "500g", amount: Math.round(oneKgPrice / 2) },
    { label: "1kg", amount: oneKgPrice },
  ];
};

const formatPrice = (amount: number) => `â‚¹${amount}`;

const buildWhatsAppOrderUrl = (productName: string, sizeLabel?: string) =>
  `https://wa.me/917981370664?text=${encodeURIComponent(
    `Hi, I would like to order ${productName}${sizeLabel ? ` - ${sizeLabel}` : ""}`,
  )}`;

const TrustVisual = ({ type }: { type: string }) => {
  if (type === "customers") {
    return (
      <div className="relative h-24 w-24">
        <div className="absolute left-3 top-3 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute left-6 top-1 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute left-4 top-5 h-5 w-5 rotate-45 bg-rose-500" />

        <div className="absolute right-3 top-4 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute right-6 top-2 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute right-4 top-6 h-5 w-5 rotate-45 bg-rose-500" />

        <div className="absolute left-[34px] top-0 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute left-[46px] top-0 h-5 w-5 rounded-full bg-rose-500" />
        <div className="absolute left-[40px] top-6 h-5 w-5 rotate-45 bg-rose-500" />

        <div className="absolute bottom-5 left-2 h-8 w-8 rounded-full bg-[#214634]" />
        <div className="absolute bottom-0 left-0 h-10 w-12 rounded-t-[20px] bg-[#214634]" />

        <div className="absolute bottom-7 left-8 h-10 w-10 rounded-full bg-[#1A3A2A]" />
        <div className="absolute bottom-0 left-6 h-14 w-16 rounded-t-[28px] bg-[#1A3A2A]" />

        <div className="absolute bottom-5 right-2 h-8 w-8 rounded-full bg-[#214634]" />
        <div className="absolute bottom-0 right-0 h-10 w-12 rounded-t-[20px] bg-[#214634]" />
      </div>
    );
  }

  if (type === "origin") {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-[32px] bg-[#2E5C3E] shadow-inner ring-1 ring-[#3D7A52]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,197,24,0.18),transparent_35%),linear-gradient(135deg,#214634,#1A3A2A)]" />
        <div className="absolute inset-3 rounded-[24px] border border-dashed border-[#3D7A52]" />
        <div className="absolute left-5 top-6 h-9 w-12 rounded-[60%_40%_55%_45%] bg-[#9fd18b] opacity-90" />
        <div className="absolute right-4 bottom-5 h-7 w-9 rounded-[40%_60%_50%_50%] bg-[#9fd18b] opacity-80" />
        <div className="absolute left-[42px] top-[26px] h-12 w-9 rounded-full bg-[#1d4ed8] shadow-[0_0_0_4px_rgba(255,255,255,0.65)]" />
        <div className="absolute left-[50px] top-[34px] h-4 w-4 -translate-x-1/2 rounded-full bg-[#F5C518]" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1A3A2A] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-theme-body shadow-sm">
          Vijayawada
        </div>
      </div>
    );
  }

  if (type === "review") {
    return (
      <div className="relative h-24 w-24">
        <div className="absolute inset-x-1 top-1 rounded-[24px] border-[3px] border-[#3D7A52] bg-[#1A3A2A] p-2">
          <div className="flex justify-center gap-1 text-amber-400 text-sm">
            <span>â˜…</span>
            <span>â˜…</span>
            <span>â˜…</span>
            <span>â˜…</span>
            <span>â˜…</span>
          </div>
        </div>
        <div className="absolute bottom-2 left-8 h-12 w-8 rounded-t-[18px] rounded-b-[8px] bg-sky-900" />
        <div className="absolute bottom-8 left-12 h-6 w-10 rounded-r-[12px] rounded-tl-[10px] bg-sky-900" />
      </div>
    );
  }

  return (
    <div className="relative h-24 w-24 rounded-full bg-sky-100">
      <div className="absolute inset-3 rounded-full border-2 border-dashed border-sky-500" />
      <div className="absolute left-5 top-4 h-2.5 w-2.5 rounded-full bg-sky-600" />
      <div className="absolute right-5 top-6 h-2.5 w-2.5 rounded-full bg-sky-600" />
      <div className="absolute left-8 bottom-7 h-2.5 w-2.5 rounded-full bg-sky-600" />
      <div className="absolute right-7 bottom-5 h-2.5 w-2.5 rounded-full bg-sky-600" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-700" />
    </div>
  );
};

type MarketplaceHomeProps = {
  initialFilter?: string;
  autoScrollToProducts?: boolean;
  compact?: boolean;
};

const MarketplaceHome = ({
  initialFilter = "all",
  autoScrollToProducts = false,
  compact = false,
}: MarketplaceHomeProps) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [selectedPickleType, setSelectedPickleType] = useState("all");

  useEffect(() => {
    setSelectedFilter(initialFilter);
    setSelectedPickleType("all");
  }, [initialFilter]);

  useEffect(() => {
    if (!autoScrollToProducts) {
      return;
    }

    const scrollToProducts = () => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    const timeoutId = window.setTimeout(scrollToProducts, 150);

    return () => window.clearTimeout(timeoutId);
  }, [autoScrollToProducts]);

  const filteredProducts = productCards.filter((product) => {
    if (selectedFilter !== "all" && product.category !== selectedFilter) {
      return false;
    }

    if (selectedFilter === "pickles" && selectedPickleType !== "all") {
      return getPickleType(product.enTitle) === selectedPickleType;
    }

    return true;
  });

  const categoryMeta = {
    pickles: {
      te: "à°ªà°šà±à°šà°³à±à°³à±",
      en: "Pickles",
    },
    powders: {
      te: "à°ªà±Šà°¡à±à°²à±",
      en: "Podi",
    },
    fryums: {
      te: "à°µà°¡à°¿à°¯à°¾à°²à± & à°…à°ªà±à°ªà°¡à°¾à°²à±",
      en: "Vadiyalu & Appadalu",
    },
    combos: {
      te: "à°ªà±à°°à°¤à±à°¯à±‡à°• à°ªà°¦à°¾à°°à±à°¥à°¾à°²à±",
      en: "Special Items",
    },
  } as const;

  const groupedProducts =
    selectedFilter === "all"
      ? (Object.keys(categoryMeta) as Array<keyof typeof categoryMeta>)
          .map((categoryKey) => ({
            key: categoryKey,
            teTitle: categoryMeta[categoryKey].te,
            enTitle: categoryMeta[categoryKey].en,
            products: filteredProducts.filter((product) => product.category === categoryKey),
          }))
          .filter((section) => section.products.length > 0)
      : selectedFilter === "pickles" && selectedPickleType === "all"
        ? [
            {
              key: "salt",
              teTitle: "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
              enTitle: "Salt Pickles",
              products: filteredProducts.filter((product) => getPickleType(product.enTitle) === "salt"),
            },
            {
              key: "tempered",
              teTitle: "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°ªà°šà±à°šà°³à±à°³à±",
              enTitle: "Tempered Pickles",
              products: filteredProducts.filter((product) => getPickleType(product.enTitle) === "tempered"),
            },
          ].filter((section) => section.products.length > 0)
        : [
            {
              key: `${selectedFilter}-${selectedPickleType}`,
              teTitle:
                selectedFilter === "pickles" && selectedPickleType === "salt"
                  ? "à°‰à°ªà±à°ªà± à°ªà°šà±à°šà°³à±à°³à±"
                  : selectedFilter === "pickles" && selectedPickleType === "tempered"
                    ? "à°‡à°‚à°—à±à°µ à°ªà±‹à°ªà± à°ªà°šà±à°šà°³à±à°³à±"
                    : categoryMeta[selectedFilter as keyof typeof categoryMeta]?.te ?? "à°ªà°¦à°¾à°°à±à°¥à°¾à°²à±",
              enTitle:
                selectedFilter === "pickles" && selectedPickleType === "salt"
                  ? "Salt Pickles"
                  : selectedFilter === "pickles" && selectedPickleType === "tempered"
                    ? "Tempered Pickles"
                    : categoryMeta[selectedFilter as keyof typeof categoryMeta]?.en ?? "Items",
              products: filteredProducts,
            },
          ];

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePrimaryFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setSelectedPickleType("all");
    scrollToProducts();
  };

  const handlePickleTypeChange = (pickleTypeKey: string) => {
    setSelectedFilter("pickles");
    setSelectedPickleType(pickleTypeKey);
    scrollToProducts();
  };

  return (
    <div className={compact ? "bg-transparent" : "bg-[#1A3A2A]"}>
      {!compact && (
      <div className="bg-accent text-accent-foreground">
        <div className="border-b border-emerald-900/20 bg-gradient-to-r from-[#f6f0d6] via-[#f0e8c5] to-[#e8dfb9] px-4 py-3 text-center">
          <BilingualText
            as="p"
            te="మా ప్రీమియం వంటగది నాణ్యత హామీలు"
            en="Our Premium Kitchen Quality Promises"
            teluguClassName="text-base font-bold tracking-wide text-[#1e5a34]"
            englishClassName="text-base font-semibold tracking-[0.08em] text-[#1e5a34]"
          />
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track gap-10 px-4 py-4">
            {[...promoItems, ...promoItems].map((item, index) => (
              <div
                key={`${item.en}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#2f7a3a]" aria-hidden="true" />
                <BilingualText
                  as="p"
                  te={item.te}
                  en={item.en}
                  teluguClassName="text-base font-bold text-[#1f4f2e]"
                  englishClassName="text-lg font-semibold text-[#1f4f2e]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {!compact && (
      <div className="border-b border-border/60 bg-[#2E5C3E] shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chilli text-ivory shadow-md">
                <span className="font-heading text-2xl font-bold">AK</span>
              </div>
              <div>
                <BilingualText
                  as="p"
                  te="à°†à°‚à°§à±à°° à°•à°¿à°šà±†à°¨à± à°¡à°¿à°²à±ˆà°Ÿà±à°¸à±"
                  en="AK Sampradayini Pickles"
                  teluguClassName="font-heading text-lg font-bold text-chilli"
                  englishClassName="font-heading text-2xl font-bold text-chilli"
                />
                <BilingualText
                  as="p"
                  te="à°‡à°‚à°Ÿà°¿à°µà°‚à°Ÿ à°ªà°šà±à°šà°³à±à°³à±, à°ªà±Šà°¡à±à°²à±, à°µà°¡à°¿à°¯à°¾à°²à±"
                  en="Traditional pickles, podulu, and odiyalu"
                  teluguClassName="text-xs text-muted-foreground"
                  englishClassName="text-sm text-muted-foreground"
                />
              </div>
            </div>

            <div className="hidden">
              <div className="flex flex-1 items-center rounded-2xl border border-[#3D7A52] bg-[#1A3A2A] px-4 py-3 shadow-inner">
                <Search className="mr-3 h-5 w-5 text-muted-foreground" />
                <BilingualText
                  as="span"
                  te="à°ªà°šà±à°šà°³à±à°³à±, à°ªà±Šà°¡à±à°²à±, à°µà°¡à°¿à°¯à°¾à°²à± à°µà±†à°¤à°•à°‚à°¡à°¿"
                  en="Search pickles, podis, and vadiyalu"
                  className="text-muted-foreground"
                  teluguClassName="text-sm"
                  englishClassName="text-base"
                />
              </div>

              <div className="hidden items-center gap-6 lg:flex">
                <div className="flex items-center gap-2 text-foreground">
                  <Heart className="h-6 w-6 text-chilli" />
                  <BilingualText
                    as="span"
                    te="à°µà°¿à°·à±â€Œà°²à°¿à°¸à±à°Ÿà±"
                    en="Wishlist"
                    teluguClassName="text-xs"
                    englishClassName="text-sm"
                  />
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-accent-foreground shadow-sm transition hover:brightness-110"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <BilingualText
                    as="span"
                    te="à°‡à°ªà±à°ªà±à°¡à±‡ à°†à°°à±à°¡à°°à±"
                    en="Order Now"
                    teluguClassName="text-xs"
                    englishClassName="text-sm font-semibold"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3 lg:max-w-3xl">
            <div className="rounded-2xl border border-[#3D7A52] bg-[#1A3A2A] px-4 py-3 text-right shadow-sm">
              <BilingualText
                as="p"
                te="Ã Â°ÂµÃ Â°Â¿Ã Â°Å“Ã Â°Â¯Ã Â°ÂµÃ Â°Â¾Ã Â°Â¡ Ã Â°Â¨Ã Â±ÂÃ Â°â€šÃ Â°Å¡Ã Â°Â¿ Ã Â°â€¡Ã Â°â€šÃ Â°Å¸Ã Â°Â¿Ã Â°ÂµÃ Â°â€šÃ Â°Å¸ Ã Â°Â°Ã Â±ÂÃ Â°Å¡Ã Â±ÂÃ Â°Â²Ã Â±Â"
                en="Homemade taste from Vijayawada"
                teluguClassName="text-xs font-medium text-foreground"
                englishClassName="text-sm font-medium text-foreground"
              />
              <BilingualText
                as="p"
                te="Ã Â°â€¢Ã Â°Â²Ã Â°Â°Ã Â±ÂÃ Â°Â¸Ã Â±Â, Ã Â°ÂªÃ Â±ÂÃ Â°Â°Ã Â°Â¿Ã Â°Å“Ã Â°Â°Ã Â±ÂÃ Â°ÂµÃ Â±â€¡Ã Â°Å¸Ã Â°Â¿Ã Â°ÂµÃ Â±ÂÃ Â°Â¸Ã Â±Â Ã Â°Â²Ã Â±â€¡Ã Â°ÂµÃ Â±Â"
                en="No colours or preservatives"
                className="mt-1 text-muted-foreground"
                teluguClassName="text-xs"
                englishClassName="text-sm"
              />
            </div>
            <a
              href="tel:+917981370664"
              className="inline-flex items-center gap-2 rounded-full border border-[#3D7A52] bg-[#1A3A2A] px-4 py-3 text-foreground shadow-sm transition hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4 text-chilli" />
              <BilingualText
                as="span"
                te="Ã Â°â€¢Ã Â°Â¾Ã Â°Â²Ã Â±Â Ã Â°Å¡Ã Â±â€¡Ã Â°Â¯Ã Â°â€šÃ Â°Â¡Ã Â°Â¿"
                en="Call"
                teluguClassName="text-xs font-medium"
                englishClassName="text-sm font-semibold"
              />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-accent-foreground shadow-sm transition hover:brightness-110"
            >
              <ShoppingCart className="h-5 w-5" />
              <BilingualText
                as="span"
                te="Ã Â°â€¡Ã Â°ÂªÃ Â±ÂÃ Â°ÂªÃ Â±ÂÃ Â°Â¡Ã Â±â€¡ Ã Â°â€ Ã Â°Â°Ã Â±ÂÃ Â°Â¡Ã Â°Â°Ã Â±Â"
                en="Order on WhatsApp"
                teluguClassName="text-xs"
                englishClassName="text-sm font-semibold"
              />
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 overflow-x-auto pb-1">
            {quickCategories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => {
                  if (category.key === "pickles") {
                    handlePrimaryFilterChange("pickles");
                    return;
                  }

                  if (category.key === "powders") {
                    handlePrimaryFilterChange("powders");
                    return;
                  }

                  handlePrimaryFilterChange("fryums");
                }}
                className={`rounded-full border px-4 py-2 text-left transition ${
                  (category.key === "pickles" && selectedFilter === "pickles") ||
                  (category.key === "powders" && selectedFilter === "powders") ||
                  (category.key === "fryums" && selectedFilter === "fryums")
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-[#3D7A52] bg-[#2E5C3E] hover:border-accent hover:bg-[#214634]"
                }`}
              >
                <BilingualText
                  as="span"
                  te={category.te}
                  en={category.en}
                  teluguClassName="text-xs text-foreground"
                  englishClassName="text-sm text-foreground"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      <div className={`mx-auto max-w-[1600px] px-4 ${compact ? "py-0" : "py-6"}`}>
        {!compact && (
        <div className="grid gap-4 lg:grid-cols-4">
          {heroCards.map((card) => (
            <div
              key={card.enTitle}
              className={`group relative overflow-hidden rounded-[28px] bg-[#2E5C3E] shadow-md ${card.className}`}
            >
              <img
                src={card.image}
                alt={card.enTitle}
                className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-105 md:h-[360px]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <BilingualText
                  as="h2"
                  te={card.teTitle}
                  en={card.enTitle}
                  teluguClassName="font-heading text-xl font-bold"
                  englishClassName="font-heading text-4xl font-bold drop-shadow-sm"
                />
                <BilingualText
                  as="p"
                  te={card.teSubtitle}
                  en={card.enSubtitle}
                  className="mt-2 max-w-md"
                  teluguClassName="text-sm"
                  englishClassName="text-base"
                />
              </div>
            </div>
            ))}
          </div>
        )}

        {!compact && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trustCards.map((card) => (
            <div
              key={card.enTitle + card.enLineOne}
              className="flex min-h-[180px] items-center gap-5 rounded-[26px] bg-[#2E5C3E] px-6 py-5 shadow-sm ring-1 ring-[#3D7A52]"
            >
              <div className="flex shrink-0 items-center justify-center rounded-3xl bg-[#1A3A2A] p-4">
                <TrustVisual type={card.visual} />
              </div>
              <div className="h-16 w-px bg-border/80" />
              <div className="space-y-1">
                <BilingualText
                  as="p"
                  te={card.teTitle}
                  en={card.enTitle}
                  teluguClassName="font-heading text-2xl font-bold text-foreground"
                  englishClassName="font-heading text-[2rem] font-bold leading-none text-foreground"
                />
                <BilingualText
                  as="p"
                  te={card.teLineOne}
                  en={card.enLineOne}
                  teluguClassName="text-lg text-foreground"
                  englishClassName="text-xl text-foreground"
                />
                {(card.teLineTwo || card.enLineTwo) && (
                  <BilingualText
                    as="p"
                    te={card.teLineTwo}
                    en={card.enLineTwo}
                    teluguClassName="text-lg text-foreground"
                    englishClassName="text-xl text-foreground"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        <section className="hidden">
          <div className="mb-4">
            <BilingualText
              as="p"
              te="à°‡à°®à±‡à°œà± à°«à°¿à°²à±à°Ÿà°°à±à°²à±"
              en="Image Filters"
              teluguClassName="text-sm font-semibold text-chilli"
              englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-chilli"
            />
            <BilingualText
              as="h3"
              te="à°®à±€à°•à± à°•à°¾à°µà°¾à°²à±à°¸à°¿à°¨ à°µà°¿à°­à°¾à°—à°¾à°¨à±à°¨à°¿ à°Žà°‚à°šà±à°•à±‹à°‚à°¡à°¿"
              en="Choose the category you want"
              teluguClassName="font-heading text-2xl font-bold text-foreground"
              englishClassName="font-heading text-4xl font-bold text-foreground"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3">
            {imageFilters.map((filter) => {
              const isActive = selectedFilter === filter.key;

              return (
                <button
                  key={filter.key}
                  type="button"
                    onClick={() => handlePrimaryFilterChange(filter.key)}
                  className={`group relative min-w-[210px] overflow-hidden rounded-[28px] text-left shadow-sm transition ${
                    isActive
                      ? "ring-4 ring-accent/40"
                      : "ring-1 ring-border/60 hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  <img
                    src={filter.image}
                    alt={filter.en}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-ivory">
                    <BilingualText
                      as="div"
                      te={filter.te}
                      en={filter.en}
                      teluguClassName="font-heading text-sm font-semibold"
                      englishClassName="font-heading text-2xl font-bold"
                    />
                    <div className="rounded-full bg-[#1A3A2A] p-2 text-accent shadow-sm">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="hidden">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <BilingualText
                as="p"
                te="à°®à°¾ à°µà°¿à°­à°¾à°—à°¾à°²à±"
                en="Shop by Category"
                teluguClassName="text-sm font-semibold text-accent"
                englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
              />
              <BilingualText
                as="h3"
                te="à°®à±€ à°­à±‹à°œà°¨à°¾à°¨à°¿à°•à°¿ à°¸à°°à°¿à°ªà±‹à°¯à±‡ à°µà°‚à°Ÿà°•à°¾à°²à±"
                en="Collections for every Andhra meal"
                teluguClassName="font-heading text-2xl font-bold text-foreground"
                englishClassName="font-heading text-4xl font-bold text-foreground"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {categoryCards.map((card) => (
              <button
                key={card.enTitle}
                type="button"
                onClick={() =>
                  card.pickleTypeKey
                    ? handlePickleTypeChange(card.pickleTypeKey)
                    : handlePrimaryFilterChange(card.filterKey)
                }
                className={`overflow-hidden rounded-[30px] bg-[#2E5C3E] text-left shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-md ${
                  (card.filterKey === "pickles" &&
                    selectedFilter === "pickles" &&
                    selectedPickleType === (card.pickleTypeKey ?? "all")) ||
                  (card.filterKey !== "pickles" && selectedFilter === card.filterKey)
                    ? "ring-2 ring-accent"
                    : "ring-border/60"
                }`}
              >
                <img src={card.image} alt={card.enTitle} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <BilingualText
                    as="h4"
                    te={card.teTitle}
                    en={card.enTitle}
                    teluguClassName="font-heading text-xl font-bold text-foreground"
                    englishClassName="font-heading text-3xl font-bold text-foreground"
                  />
                  <BilingualText
                    as="p"
                    te={card.teText}
                    en={card.enText}
                    className="mt-3 text-muted-foreground"
                    teluguClassName="text-sm"
                    englishClassName="text-base"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="products" className={compact ? "mt-0" : "mt-10"}>
          <div className="hidden self-start overflow-hidden rounded-[26px] bg-[#21553a] text-ivory shadow-md md:rounded-[34px]">
            <div className="p-5 md:p-8">
              <BilingualText
                as="p"
                te="à°¹à±‹à°®à±â€Œà°®à±‡à°¡à± à°¸à±à°ªà±†à°·à°²à±"
                en="Homemade Special"
                teluguClassName="text-xs font-semibold text-turmeric md:text-sm"
                englishClassName="text-xs font-semibold uppercase tracking-[0.16em] text-turmeric md:text-sm md:tracking-[0.2em]"
              />
              <BilingualText
                as="h3"
                te="à°ªà±à°°à°¤à°¿ à°¸à±€à°¸à°¾à°²à±‹ à°¬à±à°°à°¾à°¹à±à°®à°£ à°¸à°‚à°ªà±à°°à°¦à°¾à°¯à°‚"
                en="Brahmin tradition in every jar"
                className="mt-2 md:mt-3"
                teluguClassName="font-heading text-xl font-bold md:text-2xl"
                englishClassName="font-heading text-[2rem] font-bold leading-tight md:text-4xl"
              />
              <BilingualText
                as="p"
                te="à°¬à±à°°à°¾à°¹à±à°®à°£ à°®à°¹à°¿à°³à°²à°¤à±‹ à°¤à°¯à°¾à°°à±à°šà±‡à°¯à°¬à°¡à°¿à°¨ à°ªà°šà±à°šà°³à±à°³à±, à°ªà±Šà°¡à±à°²à±, à°…à°ªà±à°ªà°¡à°¾à°²à±, à°’à°¡à°¿à°¯à°¾à°²à± à°…à°¨à±à°¨à°¿ à°•à±à°µà°¾à°²à°¿à°Ÿà±€ à°ªà°¦à°¾à°°à±à°¥à°¾à°²à°¤à±‹ à°šà±‡à°¸à±à°¤à°¾à°®à±."
                en="All our pickles, podi, appadalu, and odiyalu are prepared by Brahmin women with quality ingredients, without colours or preservatives."
                className="mt-3 text-ivory/85 md:mt-4"
                teluguClassName="text-sm leading-6 md:text-base md:leading-7"
                englishClassName="text-base leading-7 md:text-lg md:leading-8"
              />

              <div className="mt-5 space-y-2.5 md:mt-6 md:space-y-3">
                {highlights.map((highlight) => (
                  <div key={highlight.en} className="flex items-center gap-2.5 rounded-xl bg-[#1A3A2A] p-3 md:gap-3 md:rounded-2xl">
                    <highlight.icon className="h-4 w-4 shrink-0 text-turmeric md:h-5 md:w-5" />
                    <BilingualText
                      as="span"
                      te={highlight.te}
                      en={highlight.en}
                      teluguClassName="text-xs md:text-sm"
                      englishClassName="text-sm md:text-base"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[20px] bg-[#1A3A2A] p-4 md:mt-6 md:rounded-[26px] md:p-5">
                <BilingualText
                  as="h4"
                  te="à°¸à°‚à°ªà±à°°à°¦à°¿à°‚à°šà°‚à°¡à°¿"
                  en="Contact Details"
                  teluguClassName="font-heading text-lg font-bold text-ivory md:text-xl"
                  englishClassName="font-heading text-xl font-bold text-ivory md:text-2xl"
                />
                <div className="mt-3 space-y-1.5 text-ivory/90 md:mt-4 md:space-y-2">
                  <p className="text-sm font-medium md:text-base">7981370664</p>
                  <p className="text-sm font-medium md:text-base">08664602255</p>
                  <p className="text-sm font-medium md:text-base">7382665848</p>
                </div>
                <BilingualText
                  as="p"
                  te="à°ªà±à°šà±à°šà°¾ à°ªà°²à±à°²à°µà°¿, à°•à°¨à°•à°°à°¾à°œà± à°µà±€à°§à°¿, à°®à°¾à°°à±à°¤à°¿ à°µà±à°¯à°¾à°¯à°¾à°®à°¶à°¾à°², à°®à±à°¤à±à°¯à°¾à°²à°‚à°ªà°¾à°¡à±, à°µà°¿à°œà°¯à°µà°¾à°¡"
                  en="Puchcha Pallavi, Kanakaraju Veedhi, Maruti Vyayama Shala, Muthyalampadu, Vijayawada"
                  className="mt-3 text-ivory/85 md:mt-4"
                  teluguClassName="text-sm leading-6 md:text-base md:leading-7"
                  englishClassName="text-sm leading-6 md:text-base md:leading-7"
                />
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center rounded-full bg-turmeric px-5 py-2.5 text-sm font-semibold text-warm-brown transition hover:brightness-105 md:mt-7 md:px-6 md:py-3"
              >
                <BilingualText
                  as="span"
                  te="à°µà°¾à°Ÿà±à°¸à°¾à°ªà±â€Œà°²à±‹ à°•à±Šà°¨à°‚à°¡à°¿"
                  en="Buy on WhatsApp"
                  teluguClassName="text-sm"
                  englishClassName="text-sm font-semibold"
              />
            </a>

              <div className="mt-5 rounded-2xl bg-[#1A3A2A] p-3.5 text-sm md:mt-6 md:p-4">
                <BilingualText
                  as="p"
                  te="à°…à°¨à±à°¨à°¿ à°ªà±à°°à°¦à±‡à°¶à°¾à°²à°•à±, à°µà°¿à°¦à±‡à°¶à°¾à°²à°•à± à°•à±‚à°¡à°¾ à°•à±Šà°°à°¿à°¯à°°à± à°¸à±Œà°•à°°à±à°¯à°‚ à°•à°²à°¦à±. à°šà°¾à°°à±à°œà±€à°²à± à°…à°¦à°¨à°‚."
                  en="Courier facility is available to all places, including overseas. Charges are extra."
                  teluguClassName="text-xs md:text-sm"
                  englishClassName="text-xs md:text-sm"
                />
              </div>
            </div>
            <img src={storyKitchen} alt="Homemade preparation" className="h-40 w-full object-cover md:h-72" />
          </div>

          <div>
            {selectedFilter === "pickles" && (
              <div className="mb-6">
                <BilingualText
                  as="p"
                  te="Ã Â°ÂªÃ Â°Å¡Ã Â±ÂÃ Â°Å¡Ã Â°Â³Ã Â±ÂÃ Â°Â³ Ã Â°Â°Ã Â°â€¢Ã Â°Â¾Ã Â°Â²Ã Â±Â"
                  en="Pickle Types"
                  teluguClassName="text-sm font-semibold text-accent"
                  englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
                />
                <BilingualText
                  as="h3"
                  te="Ã Â°Â®Ã Â±ÂÃ Â°â€šÃ Â°Â¦Ã Â±Â Ã Â°Â°Ã Â°â€¢Ã Â°â€š Ã Â°Å½Ã Â°â€šÃ Â°Å¡Ã Â±ÂÃ Â°â€¢Ã Â±â€¹Ã Â°â€šÃ Â°Â¡Ã Â°Â¿, Ã Â°Â¤Ã Â°Â°Ã Â±ÂÃ Â°ÂµÃ Â°Â¾Ã Â°Â¤ Ã Â°ÂªÃ Â°Å¡Ã Â±ÂÃ Â°Å¡Ã Â°Â³Ã Â±ÂÃ Â°Â³ Ã Â°Â²Ã Â°Â¿Ã Â°Â¸Ã Â±ÂÃ Â°Å¸Ã Â±Â Ã Â°Å¡Ã Â±â€šÃ Â°Â¡Ã Â°â€šÃ Â°Â¡Ã Â°Â¿"
                  en="Choose a pickle type, then see the matching list"
                  teluguClassName="font-heading text-2xl font-bold text-foreground"
                  englishClassName="font-heading text-4xl font-bold text-foreground"
                />
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {pickleTypeCards.filter((card) => card.key !== "all").map((card) => {
                    const isActive = selectedPickleType === card.key;

                    return (
                      <button
                        key={card.key}
                        type="button"
                        onClick={() => handlePickleTypeChange(card.key)}
                        className={`overflow-hidden rounded-[28px] bg-[#2E5C3E] text-left shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-md ${
                          isActive ? "ring-2 ring-chilli" : "ring-border/60"
                        }`}
                      >
                        <img src={card.image} alt={card.enTitle} className="h-44 w-full object-cover" />
                        <div className="p-5">
                          <BilingualText
                            as="h4"
                            te={card.teTitle}
                            en={card.enTitle}
                            teluguClassName="font-heading text-lg font-bold text-foreground"
                            englishClassName="font-heading text-2xl font-bold text-foreground"
                          />
                          <BilingualText
                            as="p"
                            te={card.teText}
                            en={card.enText}
                            className="mt-2 text-muted-foreground"
                            teluguClassName="text-sm"
                            englishClassName="text-sm"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <BilingualText
                  as="p"
                  te="à°ªà°¾à°ªà±à°²à°°à± à°à°Ÿà°®à±à°¸à±"
                  en="Popular Items"
                  teluguClassName="text-sm font-semibold text-chilli"
                  englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-chilli"
                />
                <BilingualText
                  as="h3"
                  te="à°‡à°ªà±à°ªà±à°¡à± à°Žà°•à±à°•à±à°µà°—à°¾ à°†à°°à±à°¡à°°à± à°…à°µà±à°¤à±à°¨à±à°¨à°µà°¿"
                  en={
                    selectedFilter === "pickles" && selectedPickleType === "salt"
                      ? "Salt pickles list"
                      : selectedFilter === "pickles" && selectedPickleType === "tempered"
                        ? "Tempered pickles list"
                        : selectedFilter === "pickles"
                          ? "All pickles list"
                          : "Best sellers right now"
                  }
                  teluguClassName="font-heading text-2xl font-bold text-foreground"
                  englishClassName="font-heading text-4xl font-bold text-foreground"
                />
              </div>
            </div>

            <div className="space-y-8">
              {groupedProducts.map((section) => (
                <section key={section.key} className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                    <BilingualText
                      as="h4"
                      te={section.teTitle}
                      en={section.enTitle}
                      teluguClassName="font-heading text-xl font-bold text-foreground"
                      englishClassName="font-heading text-2xl font-bold text-foreground"
                    />
                    <span className="rounded-full bg-[#1A3A2A] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      {section.products.length} items
                    </span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {section.products.map((product) => (
                <article
                  key={product.enTitle}
                  className="overflow-hidden rounded-[28px] bg-[#2E5C3E] shadow-sm ring-1 ring-[#3D7A52] transition hover:-translate-y-1 hover:shadow-md"
                >
                  <img
                    src={product.image}
                    alt={product.enTitle}
                    className="h-52 w-full object-cover"
                  />
                  <div className="p-6">
                    <BilingualText
                      as="h4"
                      te={product.teTitle}
                      en={product.enTitle}
                      teluguClassName="font-heading text-[1.45rem] font-bold leading-snug text-foreground"
                      englishClassName="font-heading text-[1.9rem] font-bold leading-tight text-foreground"
                    />
                    <BilingualText
                      as="p"
                      te={product.teText}
                      en={product.enText}
                      className="mt-3 min-h-[84px] text-muted-foreground"
                      teluguClassName="text-base leading-7"
                      englishClassName="text-base leading-7"
                    />
                    {getWeightOptions(product.price).length > 0 && (
                      <div className="mt-5 grid grid-cols-3 gap-2.5">
                        {getWeightOptions(product.price).map((option) => (
                          <a
                            key={option.label}
                            href={buildWhatsAppOrderUrl(product.enTitle, option.label)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-[#1A3A2A] px-2.5 py-3 text-center ring-1 ring-[#3D7A52] transition hover:bg-[#214634]"
                          >
                            <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                              {option.label}
                            </span>
                            <span className="mt-1 block text-xl font-bold leading-none text-accent">
                              {formatPrice(option.amount)}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="mt-5">
                      <a
                        href={buildWhatsAppOrderUrl(
                          product.enTitle,
                          getWeightOptions(product.price).length > 0 ? "1kg" : undefined,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-chilli px-5 py-3 text-base font-semibold text-ivory transition hover:brightness-110"
                      >
                        <BilingualText
                          as="span"
                          te="à°†à°°à±à°¡à°°à±"
                          en="Add to Order"
                          teluguClassName="text-sm"
                          englishClassName="text-base"
                        />
                      </a>
                    </div>
                  </div>
                </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="rounded-[28px] bg-[#2E5C3E] p-10 text-center shadow-sm ring-1 ring-[#3D7A52]">
                <BilingualText
                  as="p"
                  te="à°ˆ à°µà°¿à°­à°¾à°—à°¾à°¨à°¿à°•à°¿ à°¸à°‚à°¬à°‚à°§à°¿à°‚à°šà°¿à°¨ à°à°Ÿà°®à±à°¸à± à°¤à±à°µà°°à°²à±‹ à°šà±‡à°°à±à°¸à±à°¤à°¾à°®à±"
                  en="More items for this category will be added soon"
                  teluguClassName="text-base text-muted-foreground"
                  englishClassName="text-base text-muted-foreground"
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border/60 bg-[#2E5C3E] p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1600px] gap-3">
          <a
            href="tel:+917981370664"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#3D7A52] bg-[#1A3A2A] px-4 py-3 text-sm font-semibold text-foreground"
          >
            <Phone className="h-4 w-4 text-chilli" />
            Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-[1.2] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#20BA5A]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHome;

