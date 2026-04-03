import { motion } from "framer-motion";
import storyKitchen from "@/assets/story-kitchen.jpg";
import BilingualText from "@/components/BilingualText";

const storyParagraphs = [
  {
    te: "విజయవాడలోని ఓ ప్రశాంతమైన బ్రాహ్మణ ఇంటిలో పచ్చళ్ళు చేయడం వంట మాత్రమే కాదు, పవిత్రమైన ఆచారం. మా అమ్మమ్మ తెల్లవారుజామునే లేచి, తాజా మామిడికాయలు తీసుకువచ్చి, రాయి రోక్కలిపై మసాలాలు నూరి, ప్రేమతో కలిపేది.",
    en: "In the heart of Vijayawada, in a quiet Brahmin household, the art of pickle-making was never just cooking. It was a sacred ritual. Our grandmother would wake before dawn, hand-picking the freshest raw mangoes, grinding spices on a stone mortar, and mixing everything with the patience that only love can teach.",
  },
  {
    te: "2016 నుంచి ఈ సంప్రదాయాన్ని వ్యాపారంగా కాదు, ఓ హామీగా ముందుకు తీసుకువస్తున్నాం. మా వంటింటి నుంచి బయలుదేరే ప్రతి సీసా చేతిపనిగా, గానుగ నూనెలతో, ఎండబెట్టిన మసాలాలతో, ఎలాంటి ప్రిజర్వేటివ్స్ లేకుండా తయారవుతుంది.",
    en: "Since 2016, we have carried forward this tradition not as a business, but as a promise. Every jar that leaves our kitchen is made by hand with premium cold-pressed oils, sun-dried spices, and absolutely no preservatives or shortcuts.",
  },
  {
    te: "హైదరాబాద్ నుంచి అమెరికా వరకు మా పచ్చళ్ళు ఎన్నో ఇళ్లలోకి చేరాయి. కానీ మా వంటకం మాత్రం మారలేదు. ప్రేమతో చేసిన దానిలో మార్పు అవసరం ఉండదు కాబట్టి.",
    en: "Our pickles have reached families across India and abroad, from Hyderabad to the USA, but the recipe has never changed. Because when something is made with love, you do not fix what is not broken.",
  },
];

const StorySection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="story" className="py-16 md:py-24 bg-card">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="overflow-hidden rounded-2xl shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src={storyKitchen}
                alt="బ్రాహ్మణింటి వంటింట్లో సాంప్రదాయ పచ్చళ్ళు తయారీ | Traditional pickle making in a Brahmin household kitchen"
                loading="lazy"
                width={1200}
                height={800}
                className="w-full h-80 md:h-[28rem] object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <BilingualText
                as="p"
                te="మా కథ"
                en="Our Story"
                className="mb-3 text-chilli"
                teluguClassName="font-body text-sm"
                englishClassName="font-heading text-sm uppercase tracking-[0.25em]"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <BilingualText
                as="h2"
                te="తరతరాలుగా ప్రయాణించే రుచి"
                en="A Taste That Travels Through Generations"
                className="mb-6 text-foreground"
                teluguClassName="font-heading text-2xl md:text-3xl font-bold leading-snug"
                englishClassName="font-heading text-3xl md:text-4xl font-bold leading-snug"
              />
            </motion.div>

            <motion.div 
              className="space-y-4 text-muted-foreground"
              variants={containerVariants}
            >
              {storyParagraphs.map((paragraph) => (
                <motion.div key={paragraph.en} variants={itemVariants}>
                  <BilingualText
                    as="p"
                    te={paragraph.te}
                    en={paragraph.en}
                    teluguClassName="font-body text-base"
                    englishClassName="font-body leading-relaxed"
                  />
                </motion.div>
              ))}

              <motion.div 
                variants={itemVariants}
              >
                <BilingualText
                  as="p"
                  te='"మేము పచ్చళ్ళు మాత్రమే చేయము. జ్ఞాపకాలను ఒక్కో సీసాలో నిల్వ చేస్తాము."'
                  en='"We do not make pickles. We preserve memories, one jar at a time."'
                  className="border-l-4 border-chilli pl-4 text-foreground"
                  teluguClassName="font-heading italic text-base md:text-lg"
                  englishClassName="font-heading italic text-lg"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
