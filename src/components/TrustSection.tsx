import { Shield, Heart, Leaf } from "lucide-react";
import BilingualText from "@/components/BilingualText";

const trustItems = [
  {
    icon: Shield,
    teTitle: "ప్రిజర్వేటివ్స్ లేవు",
    enTitle: "No Preservatives",
    teDescription: "100% సహజ పదార్థాలు, అమ్మమ్మ చేసేదిలాగే",
    enDescription: "100% natural ingredients, just like your grandmother used",
  },
  {
    icon: Heart,
    teTitle: "బ్రాహ్మణ మహిళల చేతిపని",
    enTitle: "Handmade by Brahmin Women",
    teDescription: "విజయవాడ కుటుంబ వంటకాలతో ప్రేమగా తయారు చేస్తాం",
    enDescription: "Crafted with love using age-old family recipes from Vijayawada",
  },
  {
    icon: Leaf,
    teTitle: "ఉత్తమమైన పదార్థాలు",
    enTitle: "Premium Quality Ingredients",
    teDescription: "ఎంచుకున్న మసాలాలు, గానుగ నూనెలు, తాజా పదార్థాలు",
    enDescription: "Hand-picked spices, cold-pressed oils, and the freshest produce",
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden mandala-bg">
      {/* Decorative Elements */}
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-turmeric/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-chilli/8 rounded-full blur-3xl" />

      <div className="relative container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <BilingualText
            as="p"
            te="మా హామీ"
            en="Our Promise"
            className="mb-3 text-chilli font-semibold"
            teluguClassName="font-body text-sm"
            englishClassName="font-heading text-xs tracking-widest uppercase"
          />
          <BilingualText
            as="h2"
            te="ఎందుకు కుటుంబాలు మమ్మల్ని నమ్ముతాయి"
            en="Why Families Trust Us"
            className="mb-6 text-foreground"
            teluguClassName="font-heading text-3xl md:text-4xl font-bold leading-tight"
            englishClassName="font-heading text-4xl md:text-5xl font-bold leading-tight"
          />
          <BilingualText
            as="p"
            te="ప్రతి ఆర్డర్‌కి తాజాగానే తయారు చేసే అసలైన ఆంధ్ర రుచి"
            en="Authentic Andhra taste, prepared fresh and with integrity"
            className="max-w-2xl mx-auto text-muted-foreground leading-relaxed-lg"
            teluguClassName="font-body text-base"
            englishClassName="font-body text-lg"
          />
        </div>

        {/* Trust Items Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, idx) => (
            <div
              key={item.enTitle}
              className="animate-fade-in group"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-border/60 shadow-md hover:shadow-xl transition-smooth-lg overflow-hidden">
                
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-turmeric/5 to-chilli/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-700" />

                <div className="relative">
                  {/* Icon Container */}
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-chilli/15 to-turmeric/15 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-10 h-10 text-chilli group-hover:text-turmeric transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <BilingualText
                    as="h3"
                    te={item.teTitle}
                    en={item.enTitle}
                    className="mb-3 text-foreground"
                    teluguClassName="font-heading text-lg font-bold"
                    englishClassName="font-heading text-xl font-bold"
                  />
                  <BilingualText
                    as="p"
                    te={item.teDescription}
                    en={item.enDescription}
                    className="text-muted-foreground leading-relaxed-lg"
                    teluguClassName="font-body text-sm"
                    englishClassName="font-body text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <p className="text-muted-foreground mb-6 leading-relaxed-lg">
            <span className="text-chilli font-semibold">📞 Ready to experience authentic Andhra flavor? </span>
            Connect with us today for bulk orders or retail packages.
          </p>
          <button className="btn-primary px-8 py-3 text-base">
            Get in Touch →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
