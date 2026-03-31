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
import heroMeal from "@/assets/hero-meal.jpg";
import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import pickleGongura from "@/assets/pickle-gongura.jpg";
import pickleLemon from "@/assets/pickle-lemon.jpg";
import catSaltPickles from "@/assets/cat-salt-pickles.jpg";
import catTemperedPickles from "@/assets/cat-tempered-pickles.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import catSpecial from "@/assets/cat-special.jpg";
import storyKitchen from "@/assets/story-kitchen.jpg";
import BilingualText from "@/components/BilingualText";

const promoItems = [
  {
    te: "మామిడికాయ సీజన్ స్పెషల్",
    en: "Season special mango pickles",
  },
  {
    te: "₹2999 పైగా ఆర్డర్లకు అదనపు డిస్కౌంట్",
    en: "Extra discount on orders above Rs.2999",
  },
  {
    te: "ఆంధ్రప్రదేశ్‌లో వేగవంతమైన డెలివరీ",
    en: "Fast delivery across Andhra Pradesh",
  },
  {
    te: "₹899 పైగా ఉచిత షిప్పింగ్",
    en: "Free shipping on orders above Rs.899",
  },
];

const categories = [
  { te: "ఆఫర్లు", en: "Offers" },
  { te: "ఉప్పు పచ్చళ్ళు", en: "Salt Pickles" },
  { te: "ఇంగువ పచ్చళ్ళు", en: "Tempered Pickles" },
  { te: "పొడులు", en: "Powders" },
  { te: "వడియాలు", en: "Vadiyalu" },
  { te: "ప్రత్యేక పదార్థాలు", en: "Special Items" },
];

const imageFilters = [
  {
    key: "all",
    te: "అన్నీ",
    en: "All",
    image: heroMeal,
  },
  {
    key: "pickles",
    te: "పచ్చళ్ళు",
    en: "Pickles",
    image: pickleAvakaya,
  },
  {
    key: "powders",
    te: "పొడులు",
    en: "Powders",
    image: categoryPowders,
  },
  {
    key: "fryums",
    te: "ఫ్రైమ్స్ & వడియాలు",
    en: "Fryums & Vadiyalu",
    image: categoryVadiyalu,
  },
  {
    key: "combos",
    te: "కాంబోలు",
    en: "Combos",
    image: catSpecial,
  },
];

const heroCards = [
  {
    teTitle: "ఇంటివంట రుచుల బాక్స్",
    enTitle: "Homemade Pickles",
    teSubtitle: "ఒకే చోట ఎక్కువగా కొనబడే పదార్థాలు",
    enSubtitle: "Traditional Andhra jars made fresh in small batches",
    image: pickleAvakaya,
    className: "md:col-span-2",
  },
  {
    teTitle: "తాజా మావడ్లు అందుబాటులో",
    enTitle: "Fresh Maavadu",
    teSubtitle: "సీజనల్ స్పెషల్ చిన్న మామిడికాయ పచ్చడి",
    enSubtitle: "Seasonal baby mango pickle prepared in a fresh batch",
    image: catSaltPickles,
    className: "",
  },
  {
    teTitle: "సూర్యశోషిత వడియాలు",
    enTitle: "Odiyalu & Appadalu",
    teSubtitle: "సాంప్రదాయంగా ఎండబెట్టిన కరకరలాడే వంటకాలు",
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
    teLineOne: "సంతోషమైన",
    enLineOne: "Happy",
    teLineTwo: "కస్టమర్లు",
    enLineTwo: "Customers",
  },
  {
    visual: "origin",
    teTitle: "విజయవాడలో",
    enTitle: "Made in",
    teLineOne: "తయారీ",
    enLineOne: "VIJAYAWADA",
    teLineTwo: "",
    enLineTwo: "",
  },
  {
    visual: "review",
    teTitle: "4.8",
    enTitle: "Review",
    teLineOne: "కస్టమర్",
    enLineOne: "4.8",
    teLineTwo: "రేటింగ్",
    enLineTwo: "Rating",
  },
  {
    visual: "shipping",
    teTitle: "భారతదేశం",
    enTitle: "Ships",
    teLineOne: "అంతటా",
    enLineOne: "Across",
    teLineTwo: "డెలివరీ",
    enLineTwo: "INDIA",
  },
];

const quickCategories = [
  { key: "pickles", te: "Pachallu", en: "Pickles" },
  { key: "powders", te: "Podulu", en: "Powders" },
  { key: "fryums", te: "Odiyalu / Appadalu", en: "Odiyalu / Appadalu" },
];

const categoryCards = [
  {
    filterKey: "pickles",
    pickleTypeKey: "salt",
    teTitle: "ఉప్పు పచ్చళ్ళు",
    enTitle: "Salt Pickles",
    teText: "చింతకాయ తొక్కు నుంచి వేలక్కాయ వరకు 1kg కి ₹550 నుంచి ప్రారంభం",
    enText: "Traditional salt pickles from Chintakaya Thokku to Velakkaya starting at Rs.550 per kg",
    image: catSaltPickles,
  },
  {
    teTitle: "ఇంగువ పోపు పచ్చళ్ళు",
    filterKey: "pickles",
    pickleTypeKey: "tempered",
    enTitle: "Tempered Pickles",
    teText: "ఆవకాయ, గోంగూర, మాగాయ, పులిహోర రకాలతో పెద్ద కలెక్షన్",
    enText: "Large collection of avakaya, gongura, magaya, and pulihora style pickles",
    image: catTemperedPickles,
  },
  {
    teTitle: "పొడులు, వడియాలు & అప్పడాలు",
    filterKey: "powders",
    enTitle: "Powders, Vadiyalu & Appadalu",
    teText: "కంది పొడి నుంచి సగ్గుబియ్యం వడియాలు, మినప అప్పడాలు వరకు",
    enText: "From kandi podi to saggubiyyam vadiyalu and minapa appadalu",
    image: categoryPowders,
  },
];

const productCards = [
  {
    category: "pickles",
    teTitle: "చింతకాయ తొక్కు",
    enTitle: "Chintakaya Thokku",
    teText: "ఉప్పు పచ్చళ్ళలో బ్రాహ్మణ సంప్రదాయ రుచి",
    enText: "Traditional salt pickle made in Brahmin homestyle",
    price: "₹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "ఉసిరి తొక్కు",
    enTitle: "Usiri Thokku",
    teText: "సహజ పదార్థాలతో చేసిన ఉప్పు పచ్చడి",
    enText: "Gooseberry salt pickle made with quality ingredients",
    price: "₹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "ఉప్పు గోంగూర",
    enTitle: "Uppu Gongura",
    teText: "పుల్లటి రుచితో వేడి అన్నానికి బాగా సరిపోతుంది",
    enText: "Tangy salt gongura that pairs well with hot rice",
    price: "₹550 / 1kg",
    image: pickleGongura,
  },
  {
    category: "pickles",
    teTitle: "పండుమిర్చి గోంగూర",
    enTitle: "Pandu Mirchi Gongura",
    teText: "మసాలా ఘాటు రుచితో ప్రత్యేకమైన ఉప్పు పచ్చడి",
    enText: "Spicy salt pickle with red chilli and gongura",
    price: "₹550 / 1kg",
    image: pickleGongura,
  },
  {
    category: "pickles",
    teTitle: "నిమ్మకాయ",
    enTitle: "Nimakaya",
    teText: "ఉప్పు పచ్చళ్ళలో ఎప్పుడూ కొనబడే క్లాసిక్ రకం",
    enText: "Classic lemon salt pickle loved in every home",
    price: "₹550 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "టమోటా",
    enTitle: "Tomato",
    teText: "తాజా టమోటాతో చేసిన ఉప్పు పచ్చడి",
    enText: "Fresh tomato salt pickle",
    price: "₹550 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "వేలక్కాయ",
    enTitle: "Velakkaya",
    teText: "ఉప్పు పచ్చళ్ళలో ప్రత్యేక రుచి",
    enText: "Special salt pickle variety",
    price: "₹600 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "చింతకాయ",
    enTitle: "Chintakaya",
    teText: "ఇంగువ పోపుతో తయారు చేసిన ప్రత్యేక పచ్చడి",
    enText: "Tempered tamarind pickle with hing seasoning",
    price: "₹650 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "ఉసిరికాయ",
    enTitle: "Usirikaya",
    teText: "ఇంగువ పోపు రుచితో తయారుచేసిన పచ్చడి",
    enText: "Tempered gooseberry pickle",
    price: "₹650 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "ఆవకాయ",
    enTitle: "Avakaya",
    teText: "బ్రాహ్మణ మహిళల చేత తయారు చేసిన అసలైన ఆంధ్ర ఆవకాయ",
    enText: "Authentic Andhra avakaya made by Brahmin women",
    price: "₹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "వెల్లులి ఆవకాయ",
    enTitle: "Vellulli Avakaya",
    teText: "వెల్లులి రుచితో ఘాటు ఆవకాయ",
    enText: "Garlic avakaya with bold flavour",
    price: "₹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "బెల్లం ఆవకాయ",
    enTitle: "Bellam Avakaya",
    teText: "తీపి మరియు ఘాటు కలిసిన ప్రత్యేక ఆవకాయ",
    enText: "Jaggery avakaya with sweet-spicy balance",
    price: "₹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "ఎండు ఆవకాయ",
    enTitle: "Endu Avakaya",
    teText: "ఎండబెట్టిన మామిడి రుచితో",
    enText: "Dried-style avakaya with deeper flavour",
    price: "₹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "తీపి మెంతి ఆవకాయ",
    enTitle: "Theepi Methi Avakaya",
    teText: "మెంతి మరియు తీపి కలిసిన ప్రత్యేక రకం",
    enText: "Sweet methi avakaya special",
    price: "₹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "పెసర ఆవకాయ",
    enTitle: "Pesara Avakaya",
    teText: "ప్రత్యేకమైన మిశ్రమంతో తయారీ",
    enText: "Special avakaya variety with pesara touch",
    price: "₹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "నువ్వు ఆవకాయ",
    enTitle: "Nuvvu Avakaya",
    teText: "నువ్వుల రుచితో ఆవకాయ",
    enText: "Sesame-style avakaya",
    price: "₹700 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "పనసపోట్టు ఆవకాయ",
    enTitle: "Panasapottu Avakaya",
    teText: "అరుదైన ప్రత్యేక ఐటమ్",
    enText: "Rare speciality avakaya variety",
    price: "₹750 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "పచ్చ ఆవకాయ",
    enTitle: "Paccha Avakaya",
    teText: "ప్రత్యేక ప్రీమియం రకం",
    enText: "Premium fresh avakaya variety",
    price: "₹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "దోసవకాయ",
    enTitle: "Dosavakaya",
    teText: "రోజువారీ భోజనానికి బాగా సరిపోతుంది",
    enText: "Everyday favourite dosavakaya pickle",
    price: "₹600 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "మాగాయ",
    enTitle: "Magaya",
    teText: "సాంప్రదాయ మామిడికాయ పచ్చడి",
    enText: "Traditional magaya mango pickle",
    price: "₹650 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "వంకాయ నిల్వ పచ్చడి",
    enTitle: "Vankaya Nilava Pachadi",
    teText: "ప్రత్యేక నిల్వ రకం",
    enText: "Brinjal preserve pickle",
    price: "₹850 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "అల్లం పచ్చడి",
    enTitle: "Allam Pachadi",
    teText: "అల్లం రుచితో ప్రత్యేకమైన పచ్చడి",
    enText: "Homestyle ginger pachadi",
    price: "₹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "మామిడి అల్లం పచ్చడి",
    enTitle: "Mamidi Allam Pachadi",
    teText: "మామిడి అల్లం కలిసిన ప్రత్యేక పచ్చడి",
    enText: "Mango ginger pachadi",
    price: "₹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "మామిడి అల్లం ఆవకాయ",
    enTitle: "Mamidi Allam Avakaya",
    teText: "ప్రీమియం రేంజ్ ప్రత్యేక ఆవకాయ",
    enText: "Premium mango ginger avakaya",
    price: "₹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "టొమోటో పచ్చడి",
    enTitle: "Tomato Pachadi",
    teText: "ఇంగువ పోపుతో టొమోటో పచ్చడి",
    enText: "Tempered tomato pachadi",
    price: "₹650 / 1kg",
    image: catSaltPickles,
  },
  {
    category: "pickles",
    teTitle: "మునక్కాయ టమోటా",
    enTitle: "Munakkaya Tomato",
    teText: "మునక్కాయ-టమోటా ప్రత్యేక మిక్స్",
    enText: "Drumstick tomato pickle special",
    price: "₹650 / 1kg",
    image: catSpecial,
  },
  {
    category: "pickles",
    teTitle: "పచ్చిమిరప ఆవకాయ",
    enTitle: "Pachimirapa Avakaya",
    teText: "పచ్చిమిరప ఘాటు రుచితో",
    enText: "Green chilli avakaya",
    price: "₹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "మామిడి తురుము పచ్చడి",
    enTitle: "Mamidi Turumu Pachadi",
    teText: "తురిమిన మామిడితో చేసిన పచ్చడి",
    enText: "Grated mango pachadi",
    price: "₹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "మామిడి ముక్కల పచ్చడి",
    enTitle: "Mamidi Mukkala Pachadi",
    teText: "మామిడి ముక్కలతో చేసిన ప్రత్యేక రకం",
    enText: "Mango pieces pachadi",
    price: "₹600 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "కాయ ఆవకాయ",
    enTitle: "Kaya Avakaya",
    teText: "సాంప్రదాయ పద్దతిలో చేసిన రకం",
    enText: "Traditional kaya avakaya",
    price: "₹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "తీపి కాయ ఆవకాయ",
    enTitle: "Theepi Kaya Avakaya",
    teText: "తీపి రుచితో ప్రీమియం రకం",
    enText: "Sweet kaya avakaya premium",
    price: "₹850 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "తీపి దబ్బకాయ",
    enTitle: "Theepi Dabbakaya",
    teText: "తీపి సిట్రస్ రుచితో ప్రత్యేక పచ్చడి",
    enText: "Sweet citron pickle",
    price: "₹650 / 1kg",
    image: pickleLemon,
  },
  {
    category: "pickles",
    teTitle: "తీపి మగయా",
    enTitle: "Theepi Magaya",
    teText: "తీపి-పులుపు కలిసిన మాగాయ",
    enText: "Sweet magaya pickle",
    price: "₹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "పులిహోర ఆవకాయ",
    enTitle: "Pulihora Avakaya",
    teText: "పులిహోర రుచిని గుర్తు చేసే ఆవకాయ",
    enText: "Pulihora style avakaya",
    price: "₹750 / 1kg",
    image: pickleAvakaya,
  },
  {
    category: "pickles",
    teTitle: "బుడం దోస ఆవకాయ",
    enTitle: "Budam Dosa Avakaya",
    teText: "ప్రత్యేక ఐటమ్, డిమాండ్ ఉన్న రకం",
    enText: "Special budam dosa avakaya",
    price: "₹850 / 1kg",
    image: catSpecial,
  },
  {
    category: "powders",
    teTitle: "కంది పొడి",
    enTitle: "Kandi Podi",
    teText: "నెయ్యి అన్నంతో తినడానికి బెస్ట్ సెల్లర్",
    enText: "Best-selling kandi podi for rice and ghee",
    price: "₹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "నువ్వుల పొడి",
    enTitle: "Nuvvula Podi",
    teText: "సంప్రదాయ నువ్వుల రుచితో",
    enText: "Traditional sesame spice powder",
    price: "₹700 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "ధనియాల పొడి",
    enTitle: "Dhaniyala Podi",
    teText: "రోజువారీ వంటలకు సరిపోయే పొడి",
    enText: "Everyday coriander spice powder",
    price: "₹500 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "పప్పుల పొడి",
    enTitle: "Pappula Podi",
    teText: "భోజనానికి రుచిని పెంచే సంప్రదాయ పొడి",
    enText: "Traditional lentil powder for full meals",
    price: "₹600 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "కరివేపాకు కారప్పొడి",
    enTitle: "Karivepaku Karam Podi",
    teText: "కరివేపాకు సువాసనతో",
    enText: "Curry leaf karam podi",
    price: "₹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "అవిశగింజల పొడి",
    enTitle: "Avisaginjala Podi",
    teText: "నాణ్యమైన పదార్థాలతో తయారీ",
    enText: "Flaxseed podi made with quality ingredients",
    price: "₹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "కొబ్బరి పొడి",
    enTitle: "Kobbari Podi",
    teText: "భోజనానికి సైడ్‌గా సరైన రుచి",
    enText: "Coconut podi for everyday meals",
    price: "₹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "రసం పొడి",
    enTitle: "Rasam Podi",
    teText: "ఇంటివంట రసం కోసం",
    enText: "Rasam powder for homestyle cooking",
    price: "₹550 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "సాంబారు పొడి",
    enTitle: "Sambaru Podi",
    teText: "ప్రత్యేక సాంబారు రుచి కోసం",
    enText: "Traditional sambar powder",
    price: "₹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "నల్లకారం",
    enTitle: "Nalla Karam",
    teText: "ఘాటు రుచిని ఇష్టపడేవారికి",
    enText: "Nalla karam for bold spice lovers",
    price: "₹800 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "పుదీనా కారపొడి",
    enTitle: "Pudina Karam Podi",
    teText: "పుదీనా సువాసనతో స్పైసీ పొడి",
    enText: "Mint spice powder",
    price: "₹750 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "మునగాకు పొడి",
    enTitle: "Munagaku Podi",
    teText: "ప్రీమియం కేటగిరీ పొడి",
    enText: "Premium moringa leaf powder",
    price: "₹2000 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "మునగాకు కారపొడి",
    enTitle: "Munagaku Karam Podi",
    teText: "మునగాకు కారంతో ప్రత్యేక రుచి",
    enText: "Moringa karam podi",
    price: "₹650 / 1kg",
    image: categoryPowders,
  },
  {
    category: "powders",
    teTitle: "నల్లేరు పొడి",
    enTitle: "Nalleru Podi",
    teText: "అరుదైన ప్రత్యేక పొడి",
    enText: "Special nalleru podi",
    price: "₹900 / 1kg",
    image: categoryPowders,
  },
  {
    category: "fryums",
    teTitle: "సగ్గుబియ్యం వడియాలు",
    enTitle: "Saggubiyyam Vadiyalu",
    teText: "సూర్యశోషిత కరకరలాడే వడియాలు",
    enText: "Sun-dried tapioca fryums",
    price: "₹650 / 1kg",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "పెసర అప్పడాలు",
    enTitle: "Pesara Appadalu",
    teText: "భోజనానికి క్లాసిక్ అప్పడాలు",
    enText: "Classic green gram appadalu",
    price: "₹750",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "మినప అప్పడాలు",
    enTitle: "Minapa Appadalu",
    teText: "సంప్రదాయ ఉరద్ అప్పడాలు",
    enText: "Traditional urad appadalu",
    price: "₹750",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "చల్ల మిర్చి",
    enTitle: "Challa Mirchi",
    teText: "కారం రుచితో ప్రత్యేక ఐటమ్",
    enText: "Spicy sun-dried chilli special",
    price: "₹1050",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "గుమ్మడి ఒడియలు",
    enTitle: "Gummadi Odiyalu",
    teText: "ప్రీమియం వడియాల కేటగిరీ",
    enText: "Premium pumpkin odiyalu",
    price: "₹1150",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "మినపిండి ఒడియలు",
    enTitle: "Minapindi Odiyalu",
    teText: "ఇంటివంట శైలిలో తయారీ",
    enText: "Homestyle urad flour odiyalu",
    price: "₹650",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "బియ్యపారవ్వ ఒడియలు",
    enTitle: "Biyyaparavva Odiyalu",
    teText: "రోజువారీ భోజనానికి సరైనవి",
    enText: "Rice crisps for daily meals",
    price: "₹650",
    image: categoryVadiyalu,
  },
  {
    category: "fryums",
    teTitle: "గోరుచిక్కుడు ఓడియాలు",
    enTitle: "Goruchikkudu Odiyalu",
    teText: "ప్రత్యేక వడియాల రకం",
    enText: "Cluster beans odiyalu special",
    price: "₹850",
    image: categoryVadiyalu,
  },
  {
    category: "combos",
    teTitle: "బుడందోస ఒరుగు",
    enTitle: "Budandosa Orugu",
    teText: "ప్రత్యేక ఐటమ్, 1 కేజీ ప్యాక్",
    enText: "Special item available in 1 kg pack",
    price: "₹1250 / 1kg",
    image: catSpecial,
  },
  {
    category: "combos",
    teTitle: "పాల ఇంగువ",
    enTitle: "Paala Inguva",
    teText: "10 గ్రాముల ప్రత్యేక పదార్థం",
    enText: "Special paala inguva, 10 gram pack",
    price: "₹200 / 10g",
    image: catSpecial,
  },
  {
    category: "combos",
    teTitle: "చిట్టింటపొట్టు",
    enTitle: "Chittintapottu",
    teText: "మా దగ్గర ప్రత్యేకంగా లభించును",
    enText: "Also available as a special item",
    price: "Available",
    image: catSpecial,
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    te: "కలర్స్, ప్రిజర్వేటివ్స్ లేవు",
    en: "No colours, no preservatives",
  },
  {
    icon: Clock3,
    te: "బ్రాహ్మణ సంప్రదాయ పద్దతిలో తయారీ",
    en: "Prepared by Brahmin women in the traditional Brahmin method",
  },
  {
    icon: BadgePercent,
    te: "AS బ్రాండ్ పప్పునూనెతో మాత్రమే తయారీ",
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
    teTitle: "అన్ని పచ్చళ్ళు",
    enTitle: "All Pickles",
    teText: "ఉప్పు, ఇంగువ పోపు, పులిహోర మరియు ప్రత్యేక రకాలన్నీ ఒకేచోట",
    enText: "See every pickle in one place",
    image: pickleAvakaya,
  },
  {
    key: "salt",
    teTitle: "ఉప్పు పచ్చళ్ళు",
    enTitle: "Salt Pickles",
    teText: "పాతకాలం రుచి, ప్రతిరోజూ అన్నంలో తినేందుకు సరైన ఉప్పు పచ్చళ్ళు",
    enText: "Classic salt-cured favourites for everyday meals",
    image: catSaltPickles,
  },
  {
    key: "tempered",
    teTitle: "ఇంగువ పోపు పచ్చళ్ళు",
    enTitle: "Tempered Pickles",
    teText: "ఆవకాయ, మాగాయ, పులిహోర మరియు ప్రత్యేక ఇంగువ పోపు రకాల పచ్చళ్ళు",
    enText: "Avakaya, magaya, pulihora and specialty tempered jars",
    image: catTemperedPickles,
  },
];

const getPickleType = (title: string) => (saltPickleTitles.has(title) ? "salt" : "tempered");

const parseOneKgPrice = (price: string) => {
  const match = price.match(/₹?\s*(\d+)\s*\/\s*1kg/i);
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

const formatPrice = (amount: number) => `₹${amount}`;

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

        <div className="absolute bottom-5 left-2 h-8 w-8 rounded-full bg-slate-800" />
        <div className="absolute bottom-0 left-0 h-10 w-12 rounded-t-[20px] bg-slate-800" />

        <div className="absolute bottom-7 left-8 h-10 w-10 rounded-full bg-slate-900" />
        <div className="absolute bottom-0 left-6 h-14 w-16 rounded-t-[28px] bg-slate-900" />

        <div className="absolute bottom-5 right-2 h-8 w-8 rounded-full bg-slate-800" />
        <div className="absolute bottom-0 right-0 h-10 w-12 rounded-t-[20px] bg-slate-800" />
      </div>
    );
  }

  if (type === "origin") {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-[32px] bg-[#e7f1ff] shadow-inner ring-1 ring-sky-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_35%),linear-gradient(135deg,#d8ecff,#f2f8ff)]" />
        <div className="absolute inset-3 rounded-[24px] border border-dashed border-sky-300" />
        <div className="absolute left-5 top-6 h-9 w-12 rounded-[60%_40%_55%_45%] bg-[#9fd18b] opacity-90" />
        <div className="absolute right-4 bottom-5 h-7 w-9 rounded-[40%_60%_50%_50%] bg-[#9fd18b] opacity-80" />
        <div className="absolute left-[42px] top-[26px] h-12 w-9 rounded-full bg-[#1d4ed8] shadow-[0_0_0_4px_rgba(255,255,255,0.65)]" />
        <div className="absolute left-[50px] top-[34px] h-4 w-4 -translate-x-1/2 rounded-full bg-white" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-800 shadow-sm">
          Vijayawada
        </div>
      </div>
    );
  }

  if (type === "review") {
    return (
      <div className="relative h-24 w-24">
        <div className="absolute inset-x-1 top-1 rounded-[24px] border-[3px] border-sky-900 bg-white p-2">
          <div className="flex justify-center gap-1 text-amber-400 text-sm">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
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
      te: "పచ్చళ్ళు",
      en: "Pickles",
    },
    powders: {
      te: "పొడులు",
      en: "Powders",
    },
    fryums: {
      te: "వడియాలు & అప్పడాలు",
      en: "Vadiyalu & Appadalu",
    },
    combos: {
      te: "ప్రత్యేక పదార్థాలు",
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
              teTitle: "ఉప్పు పచ్చళ్ళు",
              enTitle: "Salt Pickles",
              products: filteredProducts.filter((product) => getPickleType(product.enTitle) === "salt"),
            },
            {
              key: "tempered",
              teTitle: "ఇంగువ పోపు పచ్చళ్ళు",
              enTitle: "Tempered Pickles",
              products: filteredProducts.filter((product) => getPickleType(product.enTitle) === "tempered"),
            },
          ].filter((section) => section.products.length > 0)
        : [
            {
              key: `${selectedFilter}-${selectedPickleType}`,
              teTitle:
                selectedFilter === "pickles" && selectedPickleType === "salt"
                  ? "ఉప్పు పచ్చళ్ళు"
                  : selectedFilter === "pickles" && selectedPickleType === "tempered"
                    ? "ఇంగువ పోపు పచ్చళ్ళు"
                    : categoryMeta[selectedFilter as keyof typeof categoryMeta]?.te ?? "పదార్థాలు",
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
    <div className={compact ? "bg-transparent" : "bg-[#f6f3ea]"}>
      {!compact && (
      <div className="bg-accent text-accent-foreground">
        <div className="overflow-hidden">
          <div className="marquee-track gap-8 px-4 py-3">
            {[...promoItems, ...promoItems].map((item, index) => (
              <div
                key={`${item.en}-${index}`}
                className="flex items-center gap-8 whitespace-nowrap"
              >
                <BilingualText
                  as="p"
                  te={item.te}
                  en={item.en}
                  teluguClassName="text-xs font-semibold"
                  englishClassName="text-sm font-semibold"
                />
                <span className="text-turmeric/80">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {!compact && (
      <div className="border-b border-border/60 bg-white/95 shadow-sm">
        <div className="mx-auto max-w-[1600px] px-4 py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chilli text-ivory shadow-md">
                <span className="font-heading text-2xl font-bold">AK</span>
              </div>
              <div>
                <BilingualText
                  as="p"
                  te="ఆంధ్ర కిచెన్ డిలైట్స్"
                  en="AK Sampradayini Pickles"
                  teluguClassName="font-heading text-lg font-bold text-chilli"
                  englishClassName="font-heading text-2xl font-bold text-chilli"
                />
                <BilingualText
                  as="p"
                  te="ఇంటివంట పచ్చళ్ళు, పొడులు, వడియాలు"
                  en="Traditional pickles, podulu, and odiyalu"
                  teluguClassName="text-xs text-muted-foreground"
                  englishClassName="text-sm text-muted-foreground"
                />
              </div>
            </div>

            <div className="hidden">
              <div className="flex flex-1 items-center rounded-2xl border border-border bg-[#f7f7f4] px-4 py-3 shadow-inner">
                <Search className="mr-3 h-5 w-5 text-muted-foreground" />
                <BilingualText
                  as="span"
                  te="పచ్చళ్ళు, పొడులు, వడియాలు వెతకండి"
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
                    te="విష్‌లిస్ట్"
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
                    te="ఇప్పుడే ఆర్డర్"
                    en="Order Now"
                    teluguClassName="text-xs"
                    englishClassName="text-sm font-semibold"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3 lg:max-w-3xl">
            <div className="rounded-2xl border border-border/70 bg-[#f7f5ef] px-4 py-3 text-right shadow-sm">
              <BilingualText
                as="p"
                te="à°µà°¿à°œà°¯à°µà°¾à°¡ à°¨à±à°‚à°šà°¿ à°‡à°‚à°Ÿà°¿à°µà°‚à°Ÿ à°°à±à°šà±à°²à±"
                en="Homemade taste from Vijayawada"
                teluguClassName="text-xs font-medium text-foreground"
                englishClassName="text-sm font-medium text-foreground"
              />
              <BilingualText
                as="p"
                te="à°•à°²à°°à±à°¸à±, à°ªà±à°°à°¿à°œà°°à±à°µà±‡à°Ÿà°¿à°µà±à°¸à± à°²à±‡à°µà±"
                en="No colours or preservatives"
                className="mt-1 text-muted-foreground"
                teluguClassName="text-xs"
                englishClassName="text-sm"
              />
            </div>
            <a
              href="tel:+917981370664"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-3 text-foreground shadow-sm transition hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4 text-chilli" />
              <BilingualText
                as="span"
                te="à°•à°¾à°²à± à°šà±‡à°¯à°‚à°¡à°¿"
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
                te="à°‡à°ªà±à°ªà±à°¡à±‡ à°†à°°à±à°¡à°°à±"
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
                    : "border-border bg-[#f7f5ef] hover:border-accent hover:bg-accent/5"
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
              className={`group relative overflow-hidden rounded-[28px] bg-[#d9d0be] shadow-md ${card.className}`}
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
              className="flex min-h-[180px] items-center gap-5 rounded-[26px] bg-white px-6 py-5 shadow-sm ring-1 ring-border/60"
            >
              <div className="flex shrink-0 items-center justify-center rounded-3xl bg-slate-50 p-4">
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
              te="ఇమేజ్ ఫిల్టర్లు"
              en="Image Filters"
              teluguClassName="text-sm font-semibold text-chilli"
              englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-chilli"
            />
            <BilingualText
              as="h3"
              te="మీకు కావాల్సిన విభాగాన్ని ఎంచుకోండి"
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
                    <div className="rounded-full bg-white/90 p-2 text-accent shadow-sm">
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
                te="మా విభాగాలు"
                en="Shop by Category"
                teluguClassName="text-sm font-semibold text-accent"
                englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
              />
              <BilingualText
                as="h3"
                te="మీ భోజనానికి సరిపోయే వంటకాలు"
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
                className={`overflow-hidden rounded-[30px] bg-white text-left shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-md ${
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
                te="హోమ్‌మేడ్ స్పెషల్"
                en="Homemade Special"
                teluguClassName="text-xs font-semibold text-turmeric md:text-sm"
                englishClassName="text-xs font-semibold uppercase tracking-[0.16em] text-turmeric md:text-sm md:tracking-[0.2em]"
              />
              <BilingualText
                as="h3"
                te="ప్రతి సీసాలో బ్రాహ్మణ సంప్రదాయం"
                en="Brahmin tradition in every jar"
                className="mt-2 md:mt-3"
                teluguClassName="font-heading text-xl font-bold md:text-2xl"
                englishClassName="font-heading text-[2rem] font-bold leading-tight md:text-4xl"
              />
              <BilingualText
                as="p"
                te="బ్రాహ్మణ మహిళలతో తయారుచేయబడిన పచ్చళ్ళు, పొడులు, అప్పడాలు, ఒడియాలు అన్ని క్వాలిటీ పదార్థాలతో చేస్తాము."
                en="All our pickles, powders, appadalu, and odiyalu are prepared by Brahmin women with quality ingredients, without colours or preservatives."
                className="mt-3 text-ivory/85 md:mt-4"
                teluguClassName="text-sm leading-6 md:text-base md:leading-7"
                englishClassName="text-base leading-7 md:text-lg md:leading-8"
              />

              <div className="mt-5 space-y-2.5 md:mt-6 md:space-y-3">
                {highlights.map((highlight) => (
                  <div key={highlight.en} className="flex items-center gap-2.5 rounded-xl bg-white/10 p-3 md:gap-3 md:rounded-2xl">
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

              <div className="mt-5 rounded-[20px] bg-white/10 p-4 md:mt-6 md:rounded-[26px] md:p-5">
                <BilingualText
                  as="h4"
                  te="సంప్రదించండి"
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
                  te="పుచ్చా పల్లవి, కనకరాజు వీధి, మారుతి వ్యాయామశాల, ముత్యాలంపాడు, విజయవాడ"
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
                  te="వాట్సాప్‌లో కొనండి"
                  en="Buy on WhatsApp"
                  teluguClassName="text-sm"
                  englishClassName="text-sm font-semibold"
              />
            </a>

              <div className="mt-5 rounded-2xl bg-white/10 p-3.5 text-sm md:mt-6 md:p-4">
                <BilingualText
                  as="p"
                  te="అన్ని ప్రదేశాలకు, విదేశాలకు కూడా కొరియర్ సౌకర్యం కలదు. చార్జీలు అదనం."
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
                  te="à°ªà°šà±à°šà°³à±à°³ à°°à°•à°¾à°²à±"
                  en="Pickle Types"
                  teluguClassName="text-sm font-semibold text-accent"
                  englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
                />
                <BilingualText
                  as="h3"
                  te="à°®à±à°‚à°¦à± à°°à°•à°‚ à°Žà°‚à°šà±à°•à±‹à°‚à°¡à°¿, à°¤à°°à±à°µà°¾à°¤ à°ªà°šà±à°šà°³à±à°³ à°²à°¿à°¸à±à°Ÿà± à°šà±‚à°¡à°‚à°¡à°¿"
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
                        className={`overflow-hidden rounded-[28px] bg-white text-left shadow-sm ring-1 transition hover:-translate-y-1 hover:shadow-md ${
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
                  te="పాపులర్ ఐటమ్స్"
                  en="Popular Items"
                  teluguClassName="text-sm font-semibold text-chilli"
                  englishClassName="text-sm font-semibold uppercase tracking-[0.2em] text-chilli"
                />
                <BilingualText
                  as="h3"
                  te="ఇప్పుడు ఎక్కువగా ఆర్డర్ అవుతున్నవి"
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
                    <span className="rounded-full bg-[#efe8da] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      {section.products.length} items
                    </span>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {section.products.map((product) => (
                <article
                  key={product.enTitle}
                  className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-border/60 transition hover:-translate-y-1 hover:shadow-md"
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
                            className="rounded-xl bg-[#f8f4ea] px-2.5 py-3 text-center ring-1 ring-border transition hover:bg-accent/10"
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
                          te="ఆర్డర్"
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
              <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-border/60">
                <BilingualText
                  as="p"
                  te="ఈ విభాగానికి సంబంధించిన ఐటమ్స్ త్వరలో చేరుస్తాము"
                  en="More items for this category will be added soon"
                  teluguClassName="text-base text-muted-foreground"
                  englishClassName="text-base text-muted-foreground"
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border/60 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[1600px] gap-3">
          <a
            href="tel:+917981370664"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-[#f7f5ef] px-4 py-3 text-sm font-semibold text-foreground"
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
