import { motion } from "framer-motion";
import { CookingPot, Droplets, Leaf, ShieldCheck } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const trustFeatures = [
  {
    title: "100% Brahmin Traditional Cooking",
    subtitle: "Prepared using authentic methods",
    Icon: CookingPot,
  },
  {
    title: "No Onion • No Garlic",
    subtitle: "Pure satvik food",
    Icon: Leaf,
  },
  {
    title: "No Preservatives",
    subtitle: "Freshly made batches",
    Icon: ShieldCheck,
  },
  {
    title: "Made with Quality Ingredients",
    subtitle: "Premium groundnut oil",
    Icon: Droplets,
  },
];

const TrustStrip = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <SectionWrapper
      disableAnimation
      paddingClassName="py-20"
      className="relative overflow-hidden border-y border-[#eadfd5] bg-[linear-gradient(90deg,#fff8f2_0%,#f4f8f3_50%,#fff8f2_100%)]"
      containerClassName="w-full px-6 md:px-12 lg:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(49,91,69,0.08),transparent_22%)]" />

      <motion.div
        className="relative z-10 grid divide-y divide-[#ddd0c6] border-y border-[#ddd0c6] lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        {trustFeatures.map(({ title, subtitle, Icon }) => {
          return (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(66, 36, 13, 0.08)",
              }}
              className="group flex h-full flex-col items-center justify-center px-8 py-8 text-center transition-all duration-300 hover:bg-white/28"
            >
              <motion.span
                className="inline-flex h-18 w-18 items-center justify-center rounded-full bg-white/72 text-[#8b1e1e] shadow-sm backdrop-blur-sm"
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
              </motion.span>

              <h3 className="mt-5 max-w-[18ch] text-balance font-heading text-xl font-semibold leading-tight text-[#241612] xl:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-7 text-[#685448]">
                {subtitle}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
};

export default TrustStrip;
