import { motion } from "framer-motion";
import BilingualText from "@/components/BilingualText";
import { pickleAvakaya, pickleGongura, pickleLemon } from "@/lib/pickleImages";

const featuredProducts = [
  {
    teName: "ఆవకాయ",
    enName: "Avakaya",
    teSubtitle: "మామిడికాయ",
    enSubtitle: "Mango Pickle",
    image: pickleAvakaya,
    teTagline: "ఆంధ్ర పచ్చళ్ళ రాజు, ఘాటు రుచి మరచిపోలేనిది",
    enTagline: "The king of Andhra pickles, bold, spicy, unforgettable",
    teEmotional: "వేడి అన్నం, నెయ్యితో అద్భుతం",
    enEmotional: "Perfect with hot rice and ghee",
  },
  {
    teName: "గోంగూర",
    enName: "Gongura",
    teSubtitle: "గోంగూర",
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
    teSubtitle: "నిమ్మకాయ",
    enSubtitle: "Lemon Pickle",
    image: pickleLemon,
    teTagline: "పసుపు, ఆవాలతో నానబెట్టిన నిమ్మకాయల రుచి",
    enTagline: "Sun-ripened lemons with turmeric and mustard",
    teEmotional: "ప్రతి అమ్మమ్మ ఇంటి రహస్య రుచే ఇది",
    enEmotional: "Every grandmother's secret recipe",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="relative overflow-hidden bg-[#1A3A2A] py-24 md:py-32">
      <div className="absolute inset-0 banana-leaf-bg opacity-10" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-turmeric/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-chilli/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <BilingualText
            as="p"
            te="ప్రత్యేక పచ్చళ్ళు"
            en="Signature Pickles"
            className="mb-3 text-theme-heading"
            teluguClassName="font-body text-sm font-medium"
            englishClassName="font-heading text-xs font-semibold uppercase tracking-widest"
          />
          <BilingualText
            as="h2"
            te="ఎక్కువగా ఇష్టపడే రుచులు"
            en="Our Most Loved Flavours"
            className="mb-6 text-theme-heading"
            teluguClassName="font-heading text-3xl font-bold leading-tight md:text-4xl"
            englishClassName="font-heading text-4xl font-bold leading-tight md:text-5xl"
          />
          <BilingualText
            as="p"
            te="మా వంటింటి నుంచి మీ పళ్లెం వరకు"
            en="Hand-crafted heritage, one jar at a time"
            className="mx-auto max-w-2xl text-theme-body leading-relaxed-lg"
            teluguClassName="font-body text-base"
            englishClassName="font-body text-lg"
          />
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-3 md:gap-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.1 }}
        >
          {featuredProducts.map((product) => (
            <motion.article
              key={product.enName}
              className="theme-card group flex h-full flex-col overflow-hidden rounded-3xl border border-[#3D7A52] shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="relative h-80 flex-shrink-0 overflow-hidden md:h-96">
                <motion.img
                  src={product.image}
                  alt={`${product.teName} / ${product.enName}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <motion.div
                  className="absolute right-4 top-4 rounded-full border border-[#3D7A52] bg-[#1A3A2A] px-4 py-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <p className="text-xs font-semibold tracking-wide text-theme-heading">Signature</p>
                </motion.div>
                <BilingualText
                  as="p"
                  te={`"${product.teTagline}"`}
                  en={`"${product.enTagline}"`}
                  className="absolute bottom-4 left-4 right-4 text-theme-contrast drop-shadow-lg line-clamp-2"
                  teluguClassName="font-body text-xs font-medium leading-snug"
                  englishClassName="font-heading text-sm font-semibold italic leading-snug"
                />
              </div>

              <div className="flex flex-grow flex-col gap-4 p-6 md:p-7">
                <div>
                  <BilingualText
                    as="h3"
                    te={product.teName}
                    en={product.enName}
                    className="mb-1 text-theme-contrast"
                    teluguClassName="font-heading text-2xl font-bold"
                    englishClassName="font-heading text-2xl font-bold"
                  />
                  <BilingualText
                    as="p"
                    te={product.teSubtitle}
                    en={product.enSubtitle}
                    className="font-medium text-theme-body"
                    teluguClassName="font-body text-sm"
                    englishClassName="font-body text-sm"
                  />
                </div>

                <div className="border-l-[3px] border-[#F5C518]/50 pl-4 py-2">
                  <BilingualText
                    as="p"
                    te={product.teEmotional}
                    en={product.enEmotional}
                    className="italic text-theme-body leading-relaxed-lg"
                    teluguClassName="font-body text-sm"
                    englishClassName="font-body text-sm"
                  />
                </div>

                <div className="mt-auto pt-4">
                  <button className="btn-primary w-full rounded-xl py-2.5 text-sm font-semibold">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
