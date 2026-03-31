import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import pickleGongura from "@/assets/pickle-gongura.jpg";
import pickleLemon from "@/assets/pickle-lemon.jpg";
import catSaltPickles from "@/assets/cat-salt-pickles.jpg";

export type ProductCategory = "pickles" | "powders" | "snacks";
export type WeightOption = "250g" | "500g" | "1kg";

export type ProductRecord = {
  id: string;
  name: string;
  name_te?: string;
  nameTeluguguTelugu?: string;
  category: ProductCategory;
  price_per_kg: number;
  image: string;
  description: string;
  isAvailable?: boolean;
  isBestSeller?: boolean;
  isBrahminHeritage?: boolean;
  isGreenTouch?: boolean;
};

export const productCatalog: ProductRecord[] = [
  {
    id: "mango-avakaya",
    name: "Mango Avakaya",
    name_te: "మామిడి ఆవకాయ",
    category: "pickles",
    price_per_kg: 600,
    image: pickleAvakaya,
    description: "Classic Andhra mango pickle with bold chilli, mustard, and traditional Brahmin-style balance.",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "gongura-pickle",
    name: "Gongura Pickle",
    name_te: "గోంగూర పచ్చడి",
    category: "pickles",
    price_per_kg: 550,
    image: pickleGongura,
    description: "Tangy gongura leaves prepared in a clean homemade style with deep Andhra flavour.",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "lemon-pickle",
    name: "Lemon Pickle",
    name_te: "నిమ్మకాయ పచ్చడి",
    category: "pickles",
    price_per_kg: 550,
    image: pickleLemon,
    description: "Bright, salty, and comforting lemon pickle made for hot rice and simple meals.",
    isAvailable: true,
  },
  {
    id: "tomato-pickle",
    name: "Tomato Pickle",
    name_te: "టమాట పచ్చడి",
    category: "pickles",
    price_per_kg: 500,
    image: catSaltPickles,
    description: "Slow-cooked tomato pickle with a rich masala finish and familiar homemade depth.",
    isAvailable: true,
  },
  {
    id: "usiri-pickle",
    name: "Usiri Pickle",
    name_te: "ఉసిరి పచ్చడి",
    category: "pickles",
    price_per_kg: 580,
    image: catSaltPickles,
    description: "Amla-based pickle with a sharp, clean flavour profile and traditional spice balance.",
    isAvailable: true,
  },
  {
    id: "kandipodi",
    name: "Kandipodi",
    name_te: "కందిపొడి",
    category: "powders",
    price_per_kg: 750,
    image: categoryPowders,
    description: "Roasted toor dal podi that pairs beautifully with ghee, idli, dosa, and hot rice.",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "nuvvula-podi",
    name: "Nuvvula Podi",
    name_te: "నువ్వుల పొడి",
    category: "powders",
    price_per_kg: 700,
    image: categoryPowders,
    description: "Nutty sesame podi with a smooth roasted finish and everyday comfort-food appeal.",
    isAvailable: true,
  },
  {
    id: "karivepaku-podi",
    name: "Karivepaku Podi",
    name_te: "కరివేపాకు పొడి",
    category: "powders",
    price_per_kg: 680,
    image: categoryPowders,
    description: "Aromatic curry leaf powder prepared for quick, flavourful South Indian meals.",
    isAvailable: true,
  },
  {
    id: "palli-podi",
    name: "Palli Podi",
    name_te: "పల్లి పొడి",
    category: "powders",
    price_per_kg: 720,
    image: categoryPowders,
    description: "Peanut podi with a rich roasted body and balanced spice for breakfast and lunch plates.",
    isAvailable: true,
  },
  {
    id: "saggubiyyam-vadiyalu",
    name: "Saggubiyyam Vadiyalu",
    name_te: "సగ్గుబియ్యం వడియాలు",
    category: "snacks",
    price_per_kg: 650,
    image: categoryVadiyalu,
    description: "Light sago fryums that crisp up beautifully and complete a traditional meal.",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "minapa-appadalu",
    name: "Minapa Appadalu",
    name_te: "మినప అప్పడాలు",
    category: "snacks",
    price_per_kg: 700,
    image: categoryVadiyalu,
    description: "Crisp urad papads with a familiar homemade texture and satisfying crunch.",
    isAvailable: true,
  },
  {
    id: "janthikalu",
    name: "Janthikalu",
    name_te: "జంతికలు",
    category: "snacks",
    price_per_kg: 480,
    image: categoryVadiyalu,
    description: "Traditional crunchy snack for tea-time and gifting, made with a simple clean recipe.",
    isAvailable: true,
  },
];
