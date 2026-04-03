import { useState } from "react";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";
import catSpecial from "@/assets/cat-special.jpg";
import { catSaltPickles, catTemperedPickles } from "@/lib/pickleImages";
import BilingualText from "@/components/BilingualText";

interface ProductItem {
  teName: string;
  enName: string;
  price: string;
}

interface ProductCategory {
  emoji: string;
  teTitle: string;
  enTitle: string;
  teSubtitle: string;
  enSubtitle: string;
  unit: string;
  image: string;
  items: ProductItem[];
}

const productCategories: ProductCategory[] = [
  {
    emoji: "🥭",
    teTitle: "ఉప్పు పచ్చళ్ళు",
    enTitle: "Uppu Pachallu",
    teSubtitle: "ఉప్పు పచ్చళ్ళు",
    enSubtitle: "Salt Pickles",
    unit: "1kg",
    image: catSaltPickles,
    items: [
      { teName: "చింతకాయ తొక్కు", enName: "Chintakaya Thokku", price: "₹550" },
      { teName: "ఉసిరి తొక్కు", enName: "Usiri Thokku", price: "₹550" },
      { teName: "గోంగూర ఉప్పు", enName: "Gongura (Salt)", price: "₹550" },
      { teName: "పండు మిర్చి గోంగూర", enName: "Pandu Mirchi Gongura", price: "₹550" },
      { teName: "పండు మిర్చి", enName: "Pandu Mirchi", price: "₹550" },
      { teName: "దబ్బకాయ", enName: "Dabbakaya", price: "₹550" },
      { teName: "నిమ్మకాయ", enName: "Nimakaya", price: "₹550" },
      { teName: "టమాటో", enName: "Tomato", price: "₹550" },
      { teName: "వెలగకాయ", enName: "Velakkaya", price: "₹600" },
    ],
  },
  {
    emoji: "🌶️",
    teTitle: "ఇంగువ పోపు పచ్చళ్ళు",
    enTitle: "Inguvapopu Pachallu",
    teSubtitle: "తాలింపు పచ్చళ్ళు",
    enSubtitle: "Tempered Pickles",
    unit: "1kg",
    image: catTemperedPickles,
    items: [
      { teName: "చింతకాయ", enName: "Chintakaya", price: "₹650" },
      { teName: "ఉసిరికాయ", enName: "Usirikaya", price: "₹650" },
      { teName: "నిమ్మకాయ", enName: "Nimakaya", price: "₹650" },
      { teName: "దబ్బకాయ", enName: "Dabbakaya", price: "₹650" },
      { teName: "టమాటో", enName: "Tomato", price: "₹650" },
      { teName: "వెలగకాయ", enName: "Velakkaya", price: "₹750" },
      { teName: "పులిహోర గోంగూర", enName: "Pulihora Gongura", price: "₹750" },
      { teName: "గోంగూర", enName: "Gongura", price: "₹650" },
      { teName: "పండు మిర్చి గోంగూర", enName: "Pandu Mirchi Gongura", price: "₹650" },
      { teName: "పండు మిర్చి చింతకాయ", enName: "Pandu Mirchi Chintakaya", price: "₹650" },
      { teName: "ఆవకాయ", enName: "Avakaya", price: "₹600" },
      { teName: "వెల్లుల్లి ఆవకాయ", enName: "Vellulli Avakaya", price: "₹700" },
      { teName: "బెల్లం ఆవకాయ", enName: "Bellam Avakaya", price: "₹700" },
      { teName: "ఎండు ఆవకాయ", enName: "Endu Avakaya", price: "₹700" },
      { teName: "ఎండు మెంతికాయ", enName: "Endu Menthikaya", price: "₹700" },
      { teName: "తీపి మెంతి ఆవకాయ", enName: "Theepi Methi Avakaya", price: "₹750" },
      { teName: "పెసర ఆవకాయ", enName: "Pesara Avakaya", price: "₹600" },
      { teName: "మెంతి ఆవకాయ", enName: "Methi Avakaya", price: "₹600" },
      { teName: "నువ్వుల ఆవకాయ", enName: "Nuvvula Avakaya", price: "₹700" },
      { teName: "పనసపొట్టు ఆవకాయ", enName: "Panasapottu Avakaya", price: "₹750" },
      { teName: "పచ్చి ఆవకాయ", enName: "Pacchi Avakaya", price: "₹850" },
      { teName: "దోస ఆవకాయ", enName: "Dosavakaya", price: "₹600" },
      { teName: "మాగాయ", enName: "Magaya", price: "₹650" },
      { teName: "వెలగకాయ నిల్వ", enName: "Velakkaya", price: "₹850" },
      { teName: "వంకాయ నిల్వ", enName: "Vankaya Nilava", price: "₹850" },
      { teName: "అల్లం", enName: "Allam", price: "₹650" },
      { teName: "మామిడి అల్లం", enName: "Mamidi Allam", price: "₹650" },
      { teName: "మామిడి అల్లం ఆవకాయ", enName: "Mamidi Allam Avakaya", price: "₹850" },
      { teName: "టమాటో", enName: "Tomato", price: "₹650" },
      { teName: "మునక్కాయ టమాటో", enName: "Munakkaya Tomato", price: "₹650" },
      { teName: "పచ్చిమిర్చి ఆవకాయ", enName: "Pachimirchi Avakaya", price: "₹600" },
      { teName: "మామిడి తురుము", enName: "Mamidi Turumu", price: "₹600" },
      { teName: "మామిడి ముక్కలు", enName: "Mamidi Mukkalu", price: "₹600" },
      { teName: "కాయ ఆవకాయ", enName: "Kaya Avakaya", price: "₹750" },
      { teName: "తీపి కాయ ఆవకాయ", enName: "Theepi Kaya Avakaya", price: "₹850" },
      { teName: "తీపి దబ్బకాయ", enName: "Theepi Dabbakaya", price: "₹650" },
      { teName: "తీపి మాగాయ", enName: "Theepi Magaya", price: "₹750" },
      { teName: "పులిహోర ఆవకాయ", enName: "Pulihora Avakaya", price: "₹750" },
      { teName: "బుడం దోస ఆవకాయ", enName: "Budam Dosa Avakaya", price: "₹850" },
    ],
  },
  {
    emoji: "🌿",
    teTitle: "పొడులు",
    enTitle: "Podulu",
    teSubtitle: "కారంపొడులు",
    enSubtitle: "Podi",
    unit: "1kg",
    image: categoryPowders,
    items: [
      { teName: "కంది పొడి", enName: "Kandi Podi", price: "₹750" },
      { teName: "నువ్వుల పొడి", enName: "Nuvvula Podi", price: "₹700" },
      { teName: "ధనియాల పొడి", enName: "Dhaniyala Podi", price: "₹500" },
      { teName: "పప్పుల పొడి", enName: "Pappula Podi", price: "₹600" },
      { teName: "కరివేపాకు కారం పొడి", enName: "Karivepaku Karam Podi", price: "₹650" },
      { teName: "అవిసె గింజల పొడి", enName: "Avisaginjala Podi", price: "₹650" },
      { teName: "కొబ్బరి పొడి", enName: "Kobbari Podi", price: "₹650" },
      { teName: "రసం పొడి", enName: "Rasam Podi", price: "₹550" },
      { teName: "సాంబార్ పొడి", enName: "Sambar Podi", price: "₹750" },
      { teName: "నల్ల కారం", enName: "Nalla Karam", price: "₹800" },
      { teName: "పుదీనా కారం పొడి", enName: "Pudina Karam Podi", price: "₹750" },
      { teName: "మునగాకు పొడి", enName: "Munagaku Podi", price: "₹2000" },
      { teName: "మునగాకు కారం పొడి", enName: "Munagaku Karam Podi", price: "₹650" },
      { teName: "నల్లేరు పొడి", enName: "Nalleru Podi", price: "₹900" },
    ],
  },
  {
    emoji: "🍘",
    teTitle: "వడియాలు & అప్పడాలు",
    enTitle: "Vadiyalu & Appadalu",
    teSubtitle: "ఎండబెట్టిన స్నాక్స్",
    enSubtitle: "Sun-dried Snacks",
    unit: "",
    image: categoryVadiyalu,
    items: [
      { teName: "సగ్గుబియ్యం వడియాలు (1kg)", enName: "Saggubiyyam Vadiyalu (1kg)", price: "₹650" },
      { teName: "పెసర అప్పడాలు", enName: "Pesara Appadalu", price: "₹750" },
      { teName: "మినప అప్పడాలు", enName: "Minapa Appadalu", price: "₹750" },
      { teName: "చల్లా మిర్చి", enName: "Challa Mirchi", price: "₹1050" },
      { teName: "గుమ్మడి వడియాలు", enName: "Gummadi Vadiyalu", price: "₹1150" },
      { teName: "మినపిండి వడియాలు", enName: "Minapindi Vadiyalu", price: "₹650" },
      { teName: "బియ్యపరవ్వ ఒడియాలు", enName: "Biyyaparavva Odiayalu", price: "₹650" },
      { teName: "గోరుచిక్కుడు ఒడియాలు", enName: "Goruchikkudu Odiayalu", price: "₹850" },
    ],
  },
  {
    emoji: "🧄",
    teTitle: "ప్రత్యేక పదార్థాలు",
    enTitle: "Special Items",
    teSubtitle: "అరుదైన & ప్రీమియం",
    enSubtitle: "Rare & Premium",
    unit: "",
    image: catSpecial,
    items: [
      { teName: "బుడం దోస ఒరుగు (1kg)", enName: "Budam Dosa Orugu (1kg)", price: "₹1250" },
      { teName: "పాల ఇంగువ (10g)", enName: "Paala Inguva (10g)", price: "₹200" },
      { teName: "చిట్టింట పొట్టు", enName: "Chittinta Pottu", price: "Available" },
    ],
  },
];

const FullProductsSection = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <section id="products" className="py-16 md:py-24 mandala-bg">
      <div className="container max-w-5xl mx-auto px-6">
        <BilingualText
          as="p"
          te="మా పూర్తి జాబితా"
          en="Our Full Menu"
          className="mb-3 text-center text-chilli"
          teluguClassName="font-body text-sm"
          englishClassName="font-heading text-sm uppercase tracking-[0.25em]"
        />
        <BilingualText
          as="h2"
          te="సాంప్రదాయ వంటల రుచులు"
          en="Traditional Delicacies"
          className="mb-3 text-center text-foreground"
          teluguClassName="font-heading text-2xl md:text-3xl font-bold"
          englishClassName="font-heading text-3xl md:text-4xl font-bold"
        />
        <BilingualText
          as="p"
          te='"ప్రిజర్వేటివ్స్ లేవు. షార్ట్‌కట్స్ లేవు. అసలైన ఆంధ్ర రుచి మాత్రమే."'
          en='"No preservatives. No shortcuts. Just authentic Andhra taste."'
          className="mb-14 max-w-md mx-auto text-center text-muted-foreground"
          teluguClassName="font-body text-sm italic"
          englishClassName="font-body italic"
        />

        <div className="space-y-6">
          {productCategories.map((category, catIndex) => {
            const isExpanded = expandedCategory === catIndex;
            const displayItems = isExpanded ? category.items : category.items.slice(0, 6);
            const hasMore = category.items.length > 6;

            return (
              <div
                key={category.enTitle}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/60 overflow-hidden shadow-sm"
              >
                <div className="flex flex-col sm:flex-row border-b border-border/40">
                  <div className="sm:w-32 md:w-40 shrink-0">
                    <img
                      src={category.image}
                      alt={`${category.teTitle} | ${category.enTitle}`}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="w-full h-32 sm:h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 px-6 py-5 md:px-8 md:py-6 bg-gradient-to-r from-card to-muted/30 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.emoji}</span>
                      <div>
                        <BilingualText
                          as="h3"
                          te={category.teTitle}
                          en={category.enTitle}
                          className="text-foreground"
                          teluguClassName="font-heading text-lg md:text-xl font-bold"
                          englishClassName="font-heading text-xl md:text-2xl font-bold"
                        />
                        <p className="font-body text-sm text-muted-foreground">
                          <span lang="te" className="block font-telugu">{category.teSubtitle}</span>
                          <span className="block">{category.enSubtitle}</span>
                          {category.unit && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                              ప్రతి {category.unit} / per {category.unit}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="font-body text-xs text-muted-foreground">
                      {category.items.length} ఐటమ్స్ / items
                    </span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayItems.map((item, idx) => (
                      <div
                        key={`${item.enName}-${idx}`}
                        className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-background/60 hover:bg-background transition-colors border border-transparent hover:border-border/40 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-chilli shrink-0" />
                          <BilingualText
                            as="span"
                            te={item.teName}
                            en={item.enName}
                            className="min-w-0 text-foreground"
                            teluguClassName="font-body text-xs truncate"
                            englishClassName="font-body text-sm truncate"
                          />
                        </div>
                        <span className="font-heading text-sm font-semibold text-chilli whitespace-nowrap">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="text-center mt-4 pt-3 border-t border-border/30">
                      <button
                        onClick={() => toggleCategory(catIndex)}
                        className="font-body text-sm text-primary hover:text-chilli transition-colors underline underline-offset-4 decoration-dotted"
                      >
                        {isExpanded
                          ? "తక్కువ చూపించు / Show less"
                          : `మొత్తం ${category.items.length} ఐటమ్స్ చూడండి / View all ${category.items.length} items →`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <BilingualText
            as="p"
            te='"మా వంటింటి నుంచి మీ పళ్లెం వరకు, ప్రతి సీసా ప్రేమతో తయారవుతుంది"'
            en='"From our kitchen to your plate, every jar is made with love"'
            className="text-muted-foreground"
            teluguClassName="font-body text-sm italic"
            englishClassName="font-body text-sm italic"
          />
        </div>
      </div>
    </section>
  );
};

export default FullProductsSection;
