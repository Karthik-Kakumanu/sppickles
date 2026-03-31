import type { ProductCategory, WeightOption } from "@/data/site";

export type AppLanguage = "en" | "te";

type CategoryCopy = Record<
  ProductCategory,
  {
    label: string;
    description: string;
  }
>;

type WeightLabelCopy = Record<WeightOption, string>;

export const content = {
  en: {
    layout: {
      storeTagline: "Premium Homemade Store",
      nav: {
        "/": "Home",
        "/products": "Products",
        "/about": "About",
        "/contact": "Contact",
      },
      cart: "Cart",
      whatsapp: "WhatsApp",
      floatingWhatsapp: "WhatsApp",
      language: "Language",
      loading: "Loading Sampradyani Pachachalu with Brahmin Taste...",
      introLine: "Traditional flavours, premium presentation.",
    },
    home: {
      heroEyebrow: "Premium South Indian Craft",
      heroTitle: "Authentic Homemade Andhra Pickles",
      heroSubtitle: "Prepared using traditional methods with no preservatives.",
      orderNow: "Order Now",
      viewProducts: "Explore Products",
      trustBadges: ["Homemade", "No Preservatives", "Premium Ingredients"],
      heroCardEyebrow: "House Signature",
      heroCardTitle: "Small-batch flavour, elevated presentation",
      floatingCardEyebrow: "Traditional pick",
      promiseEyebrow: "Pure pantry promise",
      promiseLines: [
        { label: "No preservatives", value: "100%" },
        { label: "Traditional recipes", value: "House-made" },
        { label: "Small batch care", value: "Daily" },
      ],
      categoriesEyebrow: "Curated category",
      featuredEyebrow: "Featured Collection",
      featuredTitle: "Signature jars and table favourites",
      featuredSubtitle:
        "A refined showcase of the products customers notice first, presented with warmth, depth, and a cleaner premium feel.",
      storyEyebrow: "Rooted in Tradition",
      storyTitle: "Every jar should feel familiar, premium, and trustworthy",
      storyBody:
        "Sampradyani Pachachalu with Brahmin Taste blends Andhra home-style preparation with a calmer, elevated brand experience. The goal is simple: help customers feel the warmth of tradition without overwhelming them.",
      storyPoints: [
        "Built around familiar Andhra recipes that feel warm, rooted, and trustworthy.",
        "Prepared with premium ingredients and a cleaner ordering journey for everyday customers.",
        "Designed to feel traditional, calm, and memorable from the first screen.",
      ],
      processEyebrow: "Crafted with care",
      processTitle: "From ingredients to packing, trust is built step by step",
      processSteps: [
        {
          title: "Handpicked Ingredients",
          description:
            "Fresh produce, balanced spices, and carefully selected oils set the base for every batch.",
        },
        {
          title: "Traditional Preparation",
          description:
            "Recipes follow familiar Andhra methods that keep flavour bold and textures satisfying.",
        },
        {
          title: "Slow Fermentation",
          description:
            "Time and patience bring depth to the masala, aroma, and overall character of each jar.",
        },
        {
          title: "Packed with Care",
          description:
            "Every order is packed thoughtfully so the product feels premium from the first touch.",
        },
      ],
      ctaEyebrow: "Make the first impression count",
      ctaTitle:
        "Premium jars, clear ordering, and authentic Andhra flavour in one destination",
      ctaBody:
        "Customers should feel trust from the first glance and confidence when they are ready to order.",
      ctaPrimary: "Order on WhatsApp",
      ctaSecondary: "Explore catalog",
      categoriesEyebrow: "Categories",
      categoriesTitle: "Three focused categories, one clean shopping flow",
      categoriesSubtitle: "The product range is intentionally simple so customers can move from browsing to ordering without friction.",
      bestSellersEyebrow: "Best Sellers",
      bestSellersTitle: "Premium favourites ready to order",
      bestSellersSubtitle: "A small featured selection keeps the landing page focused while still highlighting the products customers look for first.",
    },
    categories: {
      pickles: {
        label: "Pickles",
        description: "Traditional Andhra pickles with bold flavour and homemade depth.",
      },
      powders: {
        label: "Powders",
        description: "Fresh podis for hot rice, idli, dosa, and simple comfort meals.",
      },
      snacks: {
        label: "Snacks",
        description: "Crisp accompaniments, fryums, and ready-to-serve family favourites.",
      },
    } satisfies CategoryCopy,
    featured: {
      bestSeller: "Best Seller",
      traditional: "Traditional",
      startingAt: "Starting at",
      perKg: "per kg",
      explore: "Explore",
      whatsapp: "WhatsApp",
      previous: "Scroll featured products left",
      next: "Scroll featured products right",
    },
    benefits: {
      noOnion: "No Onion",
      noOnionDesc: "Pure and simple flavour without onion",
      noGarlic: "No Garlic",
      noGarlicDesc: "Traditional recipes, no garlic added",
      noPreservatives: "No Preservatives",
      noPreservativesDesc: "Naturally fresh, nothing artificial",
      homemade: "Homemade",
      homemadeDesc: "Prepared with care in small batches",
      noPalmOil: "No Palm Oil",
      noPalmOilDesc: "Hygenically made with quality oils",
      freeShipping: "Free Shipping",
      freeShippingDesc: "Orders above ₹1000",
      securePackage: "Secure Package",
      securePackageDesc: "Professionally packed for freshness",
      securePayments: "Secure Payments",
      securePaymentsDesc: "Safest payment options available",
    },
    products: {
      allProducts: "All Products",
      pageSubtitle:
        "Cleanly organized products with live pricing by weight, quantity controls, and cart-ready actions.",
      noProductsTitle: "No products available",
      noProductsDescription:
        "This category is currently empty. Please switch to another section or check back soon.",
    },
    productCard: {
      weight: "Weight",
      quantity: "Quantity",
      price: "Price",
      addToCart: "Add to Cart",
      perKg: "per kg",
      addedToCartTitle: "Added to cart",
      addedToCartDescription: (name: string, weight: string, quantity: number) =>
        `${name} added with ${weight} x ${quantity}.`,
      outOfStock: "Out of Stock",
    },
    cart: {
      title: "Cart",
      subtitle: "Review selected products, update quantities, and continue to checkout.",
      clearCart: "Clear Cart",
      emptyTitle: "Your cart is empty",
      emptyDescription:
        "Explore the products page and add your favourite pickles, powders, and snacks.",
      browseProducts: "Browse Products",
      summary: "Summary",
      subtotal: "Subtotal",
      continueToCheckout: "Continue to Checkout",
      remove: "Remove",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Fill in your details to place the order.",
      name: "Name",
      phone: "Phone",
      email: "Email",
      address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      pincode: "Pincode",
      namePlaceholder: "Customer name",
      phonePlaceholder: "10-digit mobile number",
      emailPlaceholder: "your@email.com",
      addressPlaceholder: "Full delivery address",
      cityPlaceholder: "City name",
      pincodePlaceholder: "6-digit pincode",
      selectState: "Select state",
      selectCountry: "Select country",
      placeOrder: "Place Order",
      orderSummary: "Order Summary",
      total: "Total",
      orderReference: "Order Reference",
      success: (orderId: string) => `${orderId} placed successfully.`,
      errors: {
        emptyCart: "Your cart is empty.",
        required: "All fields are required.",
        invalidPhone: "Enter a valid 10-digit phone number.",
        invalidPincode: "Enter a valid 6-digit pincode for India orders.",
      },
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact",
      admin: "Admin",
    },
    about: {
      title: "About Sampradyani Pachachalu with Brahmin Taste",
      description:
        "Learn more about Sampradyani Pachachalu with Brahmin Taste and our authentic homemade Andhra products.",
      bodyOne:
        "Sampradyani Pachachalu with Brahmin Taste is rooted in South Indian tradition, bringing together authentic Andhra recipes, careful small-batch preparation, and premium ingredient selection.",
      bodyTwo:
        "The brand experience is designed to feel premium yet simple, so customers can browse, order, and trust the products with clarity.",
    },
    contact: {
      title: "Contact Sampradyani Pachachalu with Brahmin Taste",
      description:
        "Reach out for direct orders, gifting enquiries, or help with product selection.",
      whatsapp: "WhatsApp",
      whatsappLink: "Message us now",
      phones: "Phones",
      email: "Email",
      address: "Address",
    },
  },
  te: {
    layout: {
      storeTagline: "ప్రీమియం హోమ్‌మేడ్ స్టోర్",
      nav: {
        "/": "హోమ్",
        "/products": "ఉత్పత్తులు",
        "/about": "గురించి",
        "/contact": "సంప్రదించండి",
      },
      cart: "కార్ట్",
      whatsapp: "వాట్సాప్",
      floatingWhatsapp: "వాట్సాప్",
      language: "భాష",
      loading: "Sampradyani Pachachalu లోడ్ అవుతోంది...",
      introLine: "సాంప్రదాయ రుచులు, ప్రీమియం ప్రదర్శన.",
    },
    home: {
      heroEyebrow: "ప్రీమియం దక్షిణ భారత కళ",
      heroTitle: "సాంప్రదాయ ఆంధ్ర హోమ్‌మేడ్ పచ్చళ్ళు",
      heroSubtitle: "ప్రిజర్వేటివ్స్ లేకుండా సంప్రదాయ పద్ధతిలో తయారు చేసిన రుచులు.",
      orderNow: "ఆర్డర్ చేయండి",
      viewProducts: "ఉత్పత్తులు చూడండి",
      trustBadges: ["హోమ్‌మేడ్", "ప్రిజర్వేటివ్స్ లేవు", "ప్రీమియం పదార్థాలు"],
      heroCardEyebrow: "హౌస్ సిగ్నేచర్",
      heroCardTitle: "స్మాల్-బ్యాచ్ రుచి, ఎలివేటెడ్ ప్రెజెంటేషన్",
      floatingCardEyebrow: "సాంప్రదాయ ఎంపిక",
      promiseEyebrow: "ప్యూర్ పాంట్రీ ప్రామిస్",
      promiseLines: [
        { label: "ప్రిజర్వేటివ్స్ లేవు", value: "100%" },
        { label: "సాంప్రదాయ రెసిపీలు", value: "హౌస్‌మేడ్" },
        { label: "స్మాల్ బ్యాచ్ కేర్", value: "ప్రతిరోజు" },
      ],
      categoriesEyebrow: "ఎంచుకున్న విభాగం",
      featuredEyebrow: "ప్రత్యేక కలెక్షన్",
      featuredTitle: "సిగ్నేచర్ జార్లు మరియు భోజనానికి సరైన ఎంపికలు",
      featuredSubtitle:
        "కస్టమర్లకు మొదట కనిపించే ప్రత్యేక ఉత్పత్తులను మరింత శ్రద్ధగా, శుభ్రంగా, ప్రీమియంగా చూపించే విభాగం.",
      storyEyebrow: "సంప్రదాయంలో వేర్లు",
      storyTitle: "ప్రతి జార్ కూడా పరిచయమైనదిగా, ప్రీమియంగా, నమ్మదగినదిగా అనిపించాలి",
      storyBody:
        "Sampradyani Pachachalu ఆంధ్ర ఇంటి రుచులను ప్రశాంతమైన, మెరుగైన బ్రాండ్ అనుభవంతో కలుపుతుంది. మొదటి చూపులోనే సంప్రదాయం యొక్క ఆప్యాయతను కస్టమర్లు అనుభవించాలి.",
      storyPoints: [
        "ఇంటి వంట రుచిని గుర్తు చేసే ఆంధ్ర సంప్రదాయ రెసిపీలపై ఆధారపడిన తయారీ.",
        "ప్రీమియం పదార్థాలు మరియు కస్టమర్‌కు సులభంగా అర్థమయ్యే ఆర్డర్ అనుభవం.",
        "మొదటి స్క్రీన్ నుంచే సంప్రదాయం, ప్రశాంతత, నమ్మకం అనిపించే డిజైన్.",
      ],
      processEyebrow: "శ్రద్ధతో తయారీ",
      processTitle: "పదార్థాల నుండి ప్యాకింగ్ వరకు విశ్వాసం ప్రతి దశలో నిర్మించబడుతుంది",
      processSteps: [
        {
          title: "ఎంచుకున్న పదార్థాలు",
          description:
            "తాజా పదార్థాలు, సమతుల్యమైన మసాలాలు, జాగ్రత్తగా ఎంచుకున్న నూనెలతో ప్రతి బ్యాచ్ మొదలవుతుంది.",
        },
        {
          title: "సాంప్రదాయ తయారీ",
          description:
            "తెలిసిన ఆంధ్ర పద్ధతులను అనుసరించడం వల్ల రుచి గాఢంగా, టెక్స్చర్ సంతృప్తికరంగా ఉంటుంది.",
        },
        {
          title: "నెమ్మదైన ఫెర్మెంటేషన్",
          description:
            "సమయం, ఓర్పు వల్ల మసాలా, వాసన, మొత్తం రుచి మరింత లోతుగా అభివృద్ధి చెందుతుంది.",
        },
        {
          title: "శ్రద్ధతో ప్యాకింగ్",
          description:
            "ప్రతి ఆర్డర్ ప్రీమియం అనుభూతి ఇవ్వడానికి జాగ్రత్తగా ప్యాక్ చేయబడుతుంది.",
        },
      ],
      ctaEyebrow: "మొదటి చూపు నుంచే ప్రభావం",
      ctaTitle: "ప్రీమియం జార్లు, సులభమైన ఆర్డరింగ్, అసలైన ఆంధ్ర రుచి ఒకే చోట",
      ctaBody:
        "మొదటి చూపులోనే కస్టమర్లకు నమ్మకం కలగాలి, ఆర్డర్ చేసే సమయానికి విశ్వాసం మరింత పెరగాలి.",
      ctaPrimary: "వాట్సాప్‌లో ఆర్డర్ చేయండి",
      ctaSecondary: "క్యాటలాగ్ చూడండి",
      categoriesEyebrow: "ఎంచుకున్న విభాగాలు",
      categoriesTitle: "మూడు ఎంపిక, ఒక సులభమైన కొనుగోలు ప్రవాహం",
      categoriesSubtitle: "ఉత్పత్తుల పరిధి ఉద్దేశపూర్వకంగా సరళమైనదిగా ఉంది కాబట్టి కస్టమర్లు ఏ సమస్య లేకుండా ఓ టూ ఆర్డర్‌కు వెళ్లాలి.",
      bestSellersEyebrow: "ఎక్కువ కొనుగోలైనవి",
      bestSellersTitle: "ప్రీమియం ఎంపికలు ఆర్డర్‌కు సిద్ధమైనవి",
      bestSellersSubtitle: "ఒక చిన్న ప్రత్యేక ఎంపిక హోమ్‌పేజీని నిర్దిష్టమైనదిగా ఉంచింది, కస్టమర్లు సరిగా చూస్తున్న ఉత్పత్తులను హైలైట్ చేస్తుంది.",
    },
    categories: {
      pickles: {
        label: "పచ్చళ్ళు",
        description: "ఆంధ్ర ఇంటి రుచిని గుర్తు చేసే గాఢమైన, సంప్రదాయ పచ్చళ్ళు.",
      },
      powders: {
        label: "పొడులు",
        description: "వేడి అన్నం, ఇడ్లీ, దోశలకు సరిపోయే తాజా పొడులు.",
      },
      snacks: {
        label: "స్నాక్స్",
        description: "వడియాలు, అప్పడాలు, కుటుంబానికి సరిపోయే ప్రత్యేక ఎంపికలు.",
      },
    } satisfies CategoryCopy,
    featured: {
      bestSeller: "బెస్ట్ సెల్లర్",
      traditional: "సాంప్రదాయ",
      startingAt: "ప్రారంభ ధర",
      perKg: "కేజీకి",
      explore: "చూడండి",
      whatsapp: "వాట్సాప్",
      previous: "ప్రత్యేక ఉత్పత్తులను ఎడమ వైపు స్క్రోల్ చేయండి",
      next: "ప్రత్యేక ఉత్పత్తులను కుడి వైపు స్క్రోల్ చేయండి",
    },
    benefits: {
      noOnion: "ఉల్లిపాయ లేదు",
      noOnionDesc: "ఉల్లిపాయ లేకుండా స్వచ్ఛ రుచి",
      noGarlic: "వెల్లుల్లి లేదు",
      noGarlicDesc: "సాంప్రదాయ రెసిపీలు, వెల్లుల్లి లేదు",
      noPreservatives: "సంరక్షకాలు లేవు",
      noPreservativesDesc: "సహజంగా తాజా, కృత్రిమం లేదు",
      homemade: "హోమ్‌మేడ్",
      homemadeDesc: "శ్రద్ధతో చిన్న పరిమాణంలో తయారీ",
      noPalmOil: "పామ్ నూనె లేదు",
      noPalmOilDesc: "గుణమైన నూనెలతో పరిశుద్ధంగా తయారీ",
      freeShipping: "ఉచిత డెలివరీ",
      freeShippingDesc: "₹1000 కంటే ఎక్కువ ఆర్డర్‌ల కోసం",
      securePackage: "సురక్షితమైన ప్యాకేజీ",
      securePackageDesc: "తాజాతను నిలబెట్టుకోవడానికి వృత్తిపరంగా ప్యాక్ చేసిన",
      securePayments: "సురక్షితమైన చెల్లింపులు",
      securePaymentsDesc: "అందుబాటులో సব్బుపాటు సురక్షితమైన ఎంపికలు",
    },
    products: {
      allProducts: "అన్ని ఉత్పత్తులు",
      pageSubtitle:
        "బరువు ఆధారంగా లైవ్ ధరలు, పరిమాణ నియంత్రణ, కార్ట్‌కు సిద్ధమైన చర్యలతో శుభ్రంగా అమర్చిన ఉత్పత్తులు.",
      noProductsTitle: "ఉత్పత్తులు లేవు",
      noProductsDescription:
        "ఈ విభాగంలో ప్రస్తుతం ఉత్పత్తులు లేవు. దయచేసి మరో విభాగాన్ని చూడండి లేదా తర్వాత మళ్లీ చూడండి.",
    },
    productCard: {
      weight: "బరువు",
      quantity: "పరిమాణం",
      price: "ధర",
      addToCart: "కార్ట్‌లో చేర్చండి",
      perKg: "కేజీకి",
      addedToCartTitle: "కార్ట్‌లో చేర్చబడింది",
      addedToCartDescription: (name: string, weight: string, quantity: number) =>
        `${name} ${weight} x ${quantity} కార్ట్‌లో చేర్చబడింది.`,
      outOfStock: "స్టాక్‌లో లేదు",
    },
    cart: {
      title: "కార్ట్",
      subtitle: "ఎంచుకున్న ఉత్పత్తులను పరిశీలించి, పరిమాణాన్ని సవరించి, చెకౌట్‌కు వెళ్లండి.",
      clearCart: "కార్ట్ ఖాళీ చేయండి",
      emptyTitle: "మీ కార్ట్ ఖాళీగా ఉంది",
      emptyDescription:
        "ఉత్పత్తుల పేజీని చూసి మీకు నచ్చిన పచ్చళ్ళు, పొడులు, స్నాక్స్‌ను చేర్చండి.",
      browseProducts: "ఉత్పత్తులు చూడండి",
      summary: "సారాంశం",
      subtotal: "ఉప మొత్తం",
      continueToCheckout: "చెకౌట్‌కు వెళ్లండి",
      remove: "తొలగించండి",
    },
    checkout: {
      title: "చెకౌట్",
      subtitle: "మీ వివరాలు నమోదు చేసి ఆర్డర్ చేయండి.",
      name: "పేరు",
      phone: "ఫోన్",
      email: "ఈమెయిల్",
      address: "చిరునామా",
      city: "నగరం",
      state: "రాష్ట్రం",
      country: "దేశం",
      pincode: "పిన్‌కోడ్",
      namePlaceholder: "కస్టమర్ పేరు",
      phonePlaceholder: "10 అంకెల మొబైల్ నంబర్",
      emailPlaceholder: "మీ@ఈమెయిల్.కామ్",
      addressPlaceholder: "పూర్తి డెలివరీ చిరునామా",
      cityPlaceholder: "నగరం పేరు",
      pincodePlaceholder: "6 అంకెల పిన్‌కోడ్",
      selectState: "రాష్ట్రం ఎంచుకోండి",
      selectCountry: "దేశం ఎంచుకోండి",
      placeOrder: "ఆర్డర్ చేయండి",
      orderSummary: "ఆర్డర్ సారాంశం",
      total: "మొత్తం",
      orderReference: "ఆర్డర్ సూచన",
      success: (orderId: string) => `${orderId} విజయవంతంగా నమోదు అయింది.`,
      errors: {
        emptyCart: "మీ కార్ట్ ఖాళీగా ఉంది.",
        required: "అన్ని ఫీల్డ్‌లు తప్పనిసరి.",
        invalidPhone: "చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.",
        invalidPincode: "భారత ఆర్డర్‌ల కోసం చెల్లుబాటు అయ్యే 6 అంకెల పిన్‌కోడ్ నమోదు చేయండి.",
      },
    },
    footer: {
      quickLinks: "త్వరిత లింకులు",
      contact: "సంప్రదింపు",
      admin: "అడ్మిన్",
    },
    about: {
      title: "Sampradyani Pachachalu గురించి",
      description: "Sampradyani Pachachalu మరియు మా అసలైన ఆంధ్ర హోమ్‌మేడ్ ఉత్పత్తుల గురించి తెలుసుకోండి.",
      bodyOne:
        "Sampradyani Pachachalu దక్షిణ భారత సంప్రదాయాల మీద నిలబడిన బ్రాండ్. అసలైన ఆంధ్ర రెసిపీలు, చిన్న పరిమాణంలో జాగ్రత్తగా తయారీ, ప్రీమియం పదార్థాల ఎంపిక మా ప్రత్యేకత.",
      bodyTwo:
        "కస్టమర్లు సులభంగా చూడగలిగే, ఆర్డర్ చేయగలిగే, నమ్మకంగా అనుభవించగలిగేలా బ్రాండ్ అనుభవాన్ని సరళంగా, ప్రీమియంగా రూపొందించాం.",
    },
    contact: {
      title: "Sampradyani Pachachalu సంప్రదించండి",
      description: "నేరుగా ఆర్డర్ చేయడానికి, గిఫ్టింగ్ వివరాలకు, లేదా సరైన ఉత్పత్తి ఎంపికకు మమ్మల్ని సంప్రదించండి.",
      whatsapp: "వాట్సాప్",
      whatsappLink: "ఇప్పుడే మెసేజ్ చేయండి",
      phones: "ఫోన్ నంబర్లు",
      email: "ఈమెయిల్",
      address: "చిరునామా",
    },
  },
} as const;

export const getCategoryCopy = (language: AppLanguage, category: ProductCategory) =>
  content[language].categories[category];

export const getWeightLabel = (language: AppLanguage, weight: WeightOption): string => {
  const labels: Record<AppLanguage, WeightLabelCopy> = {
    en: {
      "250g": "250g",
      "500g": "500g",
      "1kg": "1kg",
    },
    te: {
      "250g": "250గ్రా",
      "500g": "500గ్రా",
      "1kg": "1 కేజీ",
    },
  };

  return labels[language][weight];
};

export const buildSingleProductWhatsappText = (language: AppLanguage, productName: string) =>
  language === "te"
    ? `నాకు ${productName} ఆర్డర్ చేయాలి`
    : `Hi, I want to order ${productName}`;

export const buildGenericWhatsappText = (language: AppLanguage) =>
  language === "te" ? "నాకు ఆర్డర్ చేయాలి" : "Hi, I want to place an order";
