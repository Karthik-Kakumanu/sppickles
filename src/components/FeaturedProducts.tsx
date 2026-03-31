import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import pickleGongura from "@/assets/pickle-gongura.jpg";
import pickleLemon from "@/assets/pickle-lemon.jpg";
import { motion } from "framer-motion";
import BilingualText from "@/components/BilingualText";

const featuredProducts = [
  {
    teName: "ఆవకాయ",
    enName: "Avakaya",
    teSubtitle: "మామిడికాయ పచ్చడి",
    enSubtitle: "Mango Pickle",
    image: pickleAvakaya,
    teTagline: "ఆంధ్ర పచ్చళ్ల రాజు, ఘాటు రుచి మరిచిపోలేనిది",
    enTagline: "The king of Andhra pickles, bold, spicy, unforgettable",
    teEmotional: "వేడి అన్నం, నెయ్యితో అద్భుతం",
    enEmotional: "Perfect with hot rice & ghee",
  },
  {
    teName: "గోంగూర",
    enName: "Gongura",
    teSubtitle: "గోంగూర పచ్చడి",
    enSubtitle: "Sorrel Leaf Pickle",
    image: pickleGongura,
    teTagline: "పుల్లటి రుచి, మసాలా వాసన, సంప్రదాయపు ముద్ర",
    enTagline: "Tangy, aromatic, and deeply traditional",
    teEmotional: "ఇంటి జ్ఞాపకాలు తెచ్చే రుచి",
    enEmotional: "A taste that takes you home",
  },
  {
    teName: "నిమ్మకాయ",
    enName: "Nimmakaya",
    teSubtitle: "నిమ్మకాయ పచ్చడి",
    enSubtitle: "Lemon Pickle",
    image: pickleLemon,
    teTagline: "పసుపు, ఆవాలతో నానబెట్టిన నిమ్మకాయల రుచి",
    enTagline: "Sun-ripened lemons with turmeric and mustard",
    teEmotional: "ప్రతి అమ్మమ్మ ఇంటి రహస్య రుచే ఇది",
    enEmotional: "Every grandmother's secret recipe",
  },
];

const FeaturedProducts = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background/50 to-background" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-turmeric/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-chilli/5 rounded-full blur-3xl" />

      <div className="relative container max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <BilingualText
            as="p"
            te="ప్రత్యేక పచ్చళ్ళు"
            en="Signature Pickles"
            className="mb-3 text-chilli"
            teluguClassName="font-body text-sm font-medium"
            englishClassName="font-heading text-xs tracking-widest uppercase font-semibold"
          />
          <BilingualText
            as="h2"
            te="ఎక్కువగా ఇష్టపడే రుచులు"
            en="Our Most Loved Flavours"
            className="mb-6 text-foreground"
            teluguClassName="font-heading text-3xl md:text-4xl font-bold leading-tight"
            englishClassName="font-heading text-4xl md:text-5xl font-bold leading-tight"
          />
          <BilingualText
            as="p"
            te="మా వంటింటి నుంచి మీ పళ్లెం వరకు"
            en="Hand-crafted heritage, one jar at a time"
            className="max-w-2xl mx-auto text-muted-foreground leading-relaxed-lg"
            teluguClassName="font-body text-base"
            englishClassName="font-body text-lg"
          />
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.enName} 
              className="group"
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Container */}
              <div className="h-full flex flex-col rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border border-border/40">
                
                {/* Image Section */}
                <div className="relative overflow-hidden h-80 md:h-96 flex-shrink-0">
                  <motion.img
                    src={product.image}
                    alt={`${product.teName} / ${product.enName}`}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/70 via-warm-brown/20 to-transparent" />
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-chilli/40 via-transparent to-transparent" 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                  
                  {/* Floating Tag */}
                  <motion.div 
                    className="absolute top-4 right-4 glass px-4 py-2 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <p className="text-ivory text-xs font-semibold tracking-wide">⭐ Signature</p>
                  </motion.div>

                  {/* Tagline Over Image */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                  >
                    <BilingualText
                      as="p"
                      te={`"${product.teTagline}"`}
                      en={`"${product.enTagline}"`}
                      className="absolute bottom-4 left-4 right-4 text-ivory/95 drop-shadow-lg line-clamp-2"
                      teluguClassName="font-body text-xs leading-snug font-medium"
                      englishClassName="font-heading text-sm leading-snug font-semibold italic"
                    />
                  </motion.div>
                </div>

                {/* Content Section */}
                <motion.div 
                  className="p-6 md:p-7 flex flex-col gap-4 flex-grow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  {/* Name */}
                  <div>
                    <BilingualText
                      as="h3"
                      te={product.teName}
                      en={product.enName}
                      className="text-foreground mb-1"
                      teluguClassName="font-heading text-2xl font-bold"
                      englishClassName="font-heading text-2xl font-bold"
                    />
                    <BilingualText
                      as="p"
                      te={product.teSubtitle}
                      en={product.enSubtitle}
                      className="text-chilli font-medium"
                      teluguClassName="font-body text-sm"
                      englishClassName="font-body text-sm"
                    />
                  </div>

                  {/* Emotional Statement */}
                  <div className="border-l-3 border-turmeric/40 pl-4 py-2">
                    <BilingualText
                      as="p"
                      te={product.teEmotional}
                      en={product.enEmotional}
                      className="text-muted-foreground italic leading-relaxed-lg"
                      teluguClassName="font-body text-sm"
                      englishClassName="font-body text-sm"
                    />
                  </div>

                  {/* CTA Button */}
                  <motion.div 
                    className="mt-auto pt-4"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <motion.button 
                      className="w-full btn-primary py-2.5 text-sm font-semibold rounded-xl"
                      whileHover={{ scale: 1.02, backgroundColor: "#8B0000" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More →
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
                  
                  {/* Floating Tag */}
                  <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full">
                    <p className="text-ivory text-xs font-semibold tracking-wide">⭐ Signature</p>
                  </div>

                  {/* Tagline Over Image */}
                  <BilingualText
                    as="p"
                    te={`"${product.teTagline}"`}
                    en={`"${product.enTagline}"`}
                    className="absolute bottom-4 left-4 right-4 text-ivory/95 drop-shadow-lg line-clamp-2"
                    teluguClassName="font-body text-xs leading-snug font-medium"
                    englishClassName="font-heading text-sm leading-snug font-semibold italic"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-7 flex flex-col gap-4 flex-grow">
                  {/* Name */}
                  <div>
                    <BilingualText
                      as="h3"
                      te={product.teName}
                      en={product.enName}
                      className="text-foreground mb-1"
                      teluguClassName="font-heading text-2xl font-bold"
                      englishClassName="font-heading text-2xl font-bold"
                    />
                    <BilingualText
                      as="p"
                      te={product.teSubtitle}
                      en={product.enSubtitle}
                      className="text-chilli font-medium"
                      teluguClassName="font-body text-sm"
                      englishClassName="font-body text-sm"
                    />
                  </div>

                  {/* Emotional Statement */}
                  <div className="border-l-3 border-turmeric/40 pl-4 py-2">
                    <BilingualText
                      as="p"
                      te={product.teEmotional}
                      en={product.enEmotional}
                      className="text-muted-foreground italic leading-relaxed-lg"
                      teluguClassName="font-body text-sm"
                      englishClassName="font-body text-sm"
                    />
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-4">
                    <button className="w-full btn-primary py-2.5 text-sm font-semibold rounded-xl">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
