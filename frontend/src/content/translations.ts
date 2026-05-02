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
    announcement: {
      items: [
        "Pure vegetarian kitchen",
        "No onion options",
        "No garlic options",
        "No preservatives",
        "Handpicked ingredients",
        "Bulk orders for India, USA, and overseas",
      ],
    },
    layout: {
      storeTagline: "Brahmin-style homemade pickles from Vijayawada",
      centerPill: "Handpicked ingredients | Pure vegetarian | India and overseas support",
      nav: {
        "/": "Home",
        "/products": "Products",
        "/about": "About",
        "/contact": "Contact",
      },
      cart: "Cart",
      whatsapp: "WhatsApp",
      language: "Language",
      telugu: "తెలుగు",
      english: "English",
      contactNumber: "+91 79813 70664",
    },
    categories: {
      pickles: {
        label: "Pickles",
        description: "Traditional Andhra pickles with bold flavour, careful spice balance, and homemade depth.",
      },
      powders: {
        label: "Podulu",
        description: "Fresh podulu for hot rice, tiffins, and everyday comfort meals.",
      },
      fryums: {
        label: "Fryums",
        description: "Sun-dried fryums, appadalu, and crunchy meal-side favourites.",
      },
    } satisfies CategoryCopy,
    pickleStyles: {
      salt: "Salted",
      asafoetida: "Tempered",
    },
    featured: {
      bestSeller: "Best Seller",
    },
    products: {
      allProducts: "All Products",
      pickles: "Pickles",
      saltedPickles: "Salted Pickles",
      temperedPickles: "Tempered Pickles",
      powders: "Podulu",
      fryums: "Fryums",
      liveStock: "Live stock from the backend",
      noProductsTitle: "No products available in this view",
      noProductsDescription:
        "Try a different product filter or go back to the full catalogue to continue browsing.",
    },
    productCard: {
      weight: "Pack Size",
      quantity: "Quantity",
      price: "Price",
      addToCart: "Add to Cart",
      perKg: "kg",
      addedToCartTitle: "Added to cart",
      addedToCartDescription: (name: string, weight: string, quantity: number) =>
        `${name} added with ${weight} x ${quantity}.`,
      outOfStock: "Out of Stock",
    },
    cart: {
      title: "Cart",
      subtitle: "Review your order, adjust quantities, and continue to checkout.",
      clearCart: "Clear Cart",
      emptyTitle: "Your cart is waiting",
      emptyDescription:
        "Add pickles, podulu, and fryums to start your order and continue to checkout.",
      browseProducts: "Browse Products",
      summary: "Order Summary",
      subtotal: "Subtotal",
      continueToCheckout: "Continue to Checkout",
      remove: "Remove",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Share your delivery details and continue to the payment step.",
      name: "Name",
      phone: "Phone",
      address: "Address",
      city: "City",
      state: "State / Union Territory",
      country: "Country",
      pincode: "Pincode",
      namePlaceholder: "Customer name",
      phonePlaceholder: "10-digit mobile number",
      addressPlaceholder: "House number, street, area, and landmark",
      cityPlaceholder: "City or town",
      pincodePlaceholder: "6-digit pincode",
      selectState: "Select state / union territory",
      selectCountry: "Select country",
      placeOrder: "Continue to Payment",
      bulkOrderCta: "Chat on WhatsApp",
      bulkOrderNoticeTitle: "Bulk orders above 10 kg",
      bulkOrderNotice:
        "For orders above 10 kg, please contact us on WhatsApp to discuss the shipping price. We will share the final rate after reviewing your cart.",
      bulkOrderWhatsappLabel: "WhatsApp details",
      bulkOrderShipping: "Discuss on WhatsApp",
      bulkOrderTotal: "Final total on WhatsApp",
      orderSummary: "Order Summary",
      total: "Total",
      orderReference: "Order Reference",
      success: (orderId: string) => `${orderId} placed successfully.`,
      errors: {
        emptyCart: "Your cart is empty.",
        required: "Please fill in all required delivery details.",
        invalidState: "Please select your state / union territory.",
        invalidPhone: "Enter a valid 10-digit phone number.",
        invalidPincode: "Enter a valid 6-digit pincode.",
      },
    },
    footer: {
      quickLinks: "Quick Links",
      contact: "Contact",
      about: "About Us",
      aboutText: "A family-run Andhra food brand focused on premium presentation, careful packing, and traditional vegetarian flavours for India and overseas customers. Established in 2016, we bring authentic taste to your table.",
      businessHours: "Business Hours",
      weekdays: "Weekdays: 9:00 AM - 6:00 PM",
      saturday: "Saturday: 10:00 AM - 4:00 PM",
      sunday: "Sunday: Closed",
      shipping: "Shipping & Returns",
      shippingText: "Free shipping on orders above ₹500 across India. All products are carefully packed to ensure freshness. Returns accepted within 7 days.",
      newsletter: "Subscribe to Newsletter",
      newsletterDesc: "Get exclusive updates on new products, recipes, and special offers.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      followUs: "Follow Us",
      copyright: "© 2026 Sampradaya Pickles. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
    },
  },
  te: {
    announcement: {
      items: [
        "శుద్ధ శాకాహార వంటగది",
        "ఉల్లిపాయ లేని ఎంపికలు",
        "వెల్లుల్లి లేని ఎంపికలు",
        "ప్రిజర్వేటివ్‌లు లేవు",
        "ఎంచుకున్న పదార్థాలు మాత్రమే",
        "భారతదేశం, USA మరియు విదేశాలకు బల్క్ ఆర్డర్లు",
      ],
    },
    layout: {
      storeTagline: "విజయవాడలో తయారయ్యే బ్రాహ్మణ ఇంటివంట పచ్చళ్ళు",
      centerPill: "ఎంచుకున్న పదార్థాలు | శుద్ధ శాకాహారం | భారత్ మరియు విదేశీ డెలివరీ",
      nav: {
        "/": "హోమ్",
        "/products": "ఉత్పత్తులు",
        "/about": "మా గురించి",
        "/contact": "సంప్రదించండి",
      },
      cart: "కార్ట్",
      whatsapp: "వాట్సాప్",
      language: "భాష",
      telugu: "తెలుగు",
      english: "English",
      contactNumber: "+91 79813 70664",
    },
    categories: {
      pickles: {
        label: "పచ్చళ్ళు",
        description: "ఉప్పు, మిరప మరియు సూర్యకాంతుల ఆధారంపై చేసిన సరళమైన, తాజా తీక్షణమైన పచ్చళ్ళు - దుర్వ్యవస్థ లేనిది, సంప్రదాయ రుచి.",
      },
      powders: {
        label: "పొడులు",
        description: "సూర్యప్రకాశ సేకరించిన, రోస్టెడ్ మసాలలు మరియు తాజా మిరపలతో కలిపిన పొడులు - తక్షణ, కరకరలాడే, సుగంధ ఉన్న పొడులు.",
      },
      fryums: {
        label: "ఫ్రైయమ్స్",
        description: "బియ్యం మరియు దాలిదండ్రుల పిండి నుండి చేసిన కరకరలాడే ఫ్రీ చేసిన నుండు. హీరాగా తెలిసిన, తేలికైన, పండుగలు మరియు కుటుంబ భోజనాల కోసం సంప్రదాయ విధానంలో తయారు చేసిన.",
      },
    } satisfies CategoryCopy,
    pickleStyles: {
      salt: "ఉప్పు పచ్చళ్ళు",
      asafoetida: "తాలింపు పచ్చళ్ళు",
    },
    featured: {
      bestSeller: "ప్రియమైన ఎంపిక",
    },
    products: {
      allProducts: "అన్ని ఉత్పత్తులు",
      pickles: "పచ్చళ్ళు",
      saltedPickles: "ఉప్పు పచ్చళ్ళు",
      temperedPickles: "తాలింపు పచ్చళ్ళు",
      powders: "పొడులు",
      fryums: "ఫ్రైయమ్స్",
      liveStock: "లైవ్ స్టాక్ సమాచారం",
      noProductsTitle: "ఈ ఫిల్టర్‌లో ఉత్పత్తులు లేవు",
      noProductsDescription:
        "మరొక విభాగాన్ని ఎంచుకోండి లేదా పూర్తి కాటలాగ్‌కి తిరిగి వెళ్లి చూడండి.",
    },
    productCard: {
      weight: "ప్యాక్ పరిమాణం",
      quantity: "పరిమాణం",
      price: "ధర",
      addToCart: "కార్ట్‌లో చేర్చండి",
      perKg: "కేజీ",
      addedToCartTitle: "కార్ట్‌లో చేరింది",
      addedToCartDescription: (name: string, weight: string, quantity: number) =>
        `${name} ${weight} x ${quantity} కార్ట్‌లో చేర్చబడింది.`,
      outOfStock: "స్టాక్‌లో లేదు",
    },
    cart: {
      title: "కార్ట్",
      subtitle: "మీ ఆర్డర్‌ను పరిశీలించి, పరిమాణాలు మార్చి, చెక్‌అవుట్‌కి వెళ్లండి.",
      clearCart: "కార్ట్ ఖాళీ చేయండి",
      emptyTitle: "మీ కార్ట్ ఇంకా ఖాళీగా ఉంది",
      emptyDescription:
        "పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్‌ను ఎంపిక చేసి ఆర్డర్ ప్రారంభించండి.",
      browseProducts: "ఉత్పత్తులు చూడండి",
      summary: "ఆర్డర్ సారాంశం",
      subtotal: "ఉప మొత్తము",
      continueToCheckout: "చెక్‌అవుట్‌కి వెళ్లండి",
      remove: "తొలగించండి",
    },
    checkout: {
      title: "చెక్‌అవుట్",
      subtitle: "డెలివరీ వివరాలు ఇచ్చి చెల్లింపు దశకు వెళ్లండి.",
      name: "పేరు",
      phone: "ఫోన్",
      address: "చిరునామా",
      city: "నగరం",
      state: "రాష్ట్రం / కేంద్ర పాలిత ప్రాంతం",
      country: "దేశం",
      pincode: "పిన్ కోడ్",
      namePlaceholder: "కస్టమర్ పేరు",
      phonePlaceholder: "10 అంకెల మొబైల్ నంబర్",
      addressPlaceholder: "ఇంటి నంబర్, వీధి, ప్రాంతం, ల్యాండ్‌మార్క్",
      cityPlaceholder: "నగరం లేదా పట్టణం",
      pincodePlaceholder: "6 అంకెల పిన్ కోడ్",
      selectState: "రాష్ట్రం / కేంద్ర పాలిత ప్రాంతం ఎంచుకోండి",
      selectCountry: "దేశం ఎంచుకోండి",
      placeOrder: "చెల్లింపుకు కొనసాగండి",
      bulkOrderCta: "వాట్సాప్‌లో చాట్ చేయండి",
      bulkOrderNoticeTitle: "10 కిలోల పైబడి బల్క్ ఆర్డర్లు",
      bulkOrderNotice:
        "10 కిలోల పైబడి ఆర్డర్లకు షిప్పింగ్ ధరను చర్చించడానికి దయచేసి వాట్సాప్‌లో మమ్మల్ని సంప్రదించండి. మీ కార్ట్ చూసిన తర్వాత తుది ధరను తెలియజేస్తాం.",
      bulkOrderWhatsappLabel: "వాట్సాప్ వివరాలు",
      bulkOrderShipping: "వాట్సాప్‌లో చర్చించండి",
      bulkOrderTotal: "తుది మొత్తం వాట్సాప్‌లో",
      orderSummary: "ఆర్డర్ సారాంశం",
      total: "మొత్తం",
      orderReference: "ఆర్డర్ సూచన",
      success: (orderId: string) => `${orderId} విజయవంతంగా నమోదు అయింది.`,
      errors: {
        emptyCart: "మీ కార్ట్ ఖాళీగా ఉంది.",
        required: "అవసరమైన అన్ని వివరాలు నమోదు చేయండి.",
        invalidState: "దయచేసి మీ రాష్ట్రం / కేంద్ర పాలిత ప్రాంతాన్ని ఎంచుకోండి.",
        invalidPhone: "చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.",
        invalidPincode: "చెల్లుబాటు అయ్యే 6 అంకెల పిన్ కోడ్ నమోదు చేయండి.",
      },
    },
    footer: {
      quickLinks: "త్వరిత లింకులు",
      contact: "సంప్రదింపు",
      about: "ჩვენ గురించి",
      aboutText: "కుటుంబ ఆధారిత ఆంధ్ర ఆహార బ్రాండ్, ఇది ప్రీమియం ప్రదర్శన, జాగ్రత్తగా ప్యాకింగ్ మరియు ఆచారahmad శాకాహార రుచులపై దృష్టి సారిస్తుంది. 2016 లో స్థాపితమైన, మేము మీ టేబిల్‌కు ప్రామాణిక రుచిని తీసుకువస్తాము.",
      businessHours: "వ్యాపార సమయం",
      weekdays: "సోమవారం-శుక్రవారం: 9:00 AM - 6:00 PM",
      saturday: "శనివారం: 10:00 AM - 4:00 PM",
      sunday: "ఆదివారం: మూసివేసిన",
      shipping: "షిప్పింగ్ & రిటర్న్‌లు",
      shippingText: "₹500 కంటే ఎక్కువ ఆర్డర్‌లకు భారతదేశ అంతటా ఉచిత షిప్పింగ్. సమస్త ఉత్పత్తులు తాజాగా ఉండటానికి జాగ్రత్తగా ప్యాక్ చేయబడతాయి. 7 రోజుల్లో రిటర్న్ అవీకరణ కూడా ఉంది.",
      newsletter: "న్యూజిలెటర్‌కు సబ్‌స్క్రైబ్ చేయండి",
      newsletterDesc: "కొత్త ఉత్పత్తులు, రెసిపీలు మరియు ప్రత్యేక ఆఫర్‌ల గురించి ఎక్సక్లూసివ్ అపడేట్‌లను పొందండి.",
      emailPlaceholder: "మీ ఈమెయిల్ నమోదు చేయండి",
      subscribe: "సబ్‌స్క్రైబ్ చేయండి",
      followUs: "మమ్మల్ని అనుసరించండి",
      copyright: "© 2026 సంప్రదాయ పచ్చళ్ళు. అన్ని హక్కులు సంరక్షించబడ్డాయి.",
      privacy: "గోప్యతా విధానం",
      terms: "నిబంధనలు & షరతులు",
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
      "1kg": "1కేజీ",
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
