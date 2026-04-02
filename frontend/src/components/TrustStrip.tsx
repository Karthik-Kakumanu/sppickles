import { motion } from "framer-motion";
import { CookingPot, Droplets, Heart, Leaf, ShieldCheck } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const trustFeatures = [
  {
    title: "100% Brahmin Traditional Cooking",
    subtitle: "Prepared using authentic methods",
    Icon: CookingPot,
  },
  {
    title: "No Onion",
    subtitle: "Pure satvik recipes without onion",
    Icon: Leaf,
  },
  {
    title: "No Garlic Options",
    subtitle: "Satvik favourites are available alongside the wider range",
    Icon: Heart,
  },
  {
    title: "No Preservatives",
    subtitle: "Freshly made in small batches",
    Icon: ShieldCheck,
  },
  {
    title: "Premium Groundnut Oil",
    subtitle: "Clean richness in every batch",
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
      paddingClassName="py-14 md:py-16"
      className="relative overflow-hidden border-y border-[#d8e5d8] bg-[var(--color-bg-primary)]"
      containerClassName="w-full px-6 md:px-12 lg:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(226,185,59,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(47,122,67,0.06),transparent_24%)]" />

      <motion.div
        className="relative z-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        {trustFeatures.map(({ title, subtitle, Icon }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="theme-card group relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.8rem] border border-[#d8e5d8] border-l-4 border-l-[#2F7A43] px-6 py-7 text-center shadow-[0_20px_42px_rgba(30,79,46,0.08)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fdfcf8] hover:shadow-[0_28px_52px_rgba(30,79,46,0.12)]"
          >
            <div className="banana-leaf-bg absolute inset-0 opacity-[0.08]" />
            <motion.span
              className="relative inline-flex h-18 w-18 items-center justify-center rounded-full border border-[#d8e5d8] bg-[#EDF5EE] text-theme-heading"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
            </motion.span>

            <p className="relative mt-5 rounded-full border border-[#f0df97] bg-[#FFF3C9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#956D00]">
              Purity Sticker
            </p>
            <h3 className="relative mt-4 max-w-[16ch] text-balance font-heading text-xl font-semibold leading-tight text-theme-heading">
              {title}
            </h3>
            <p className="relative mt-3 text-sm font-medium leading-7 text-theme-body">
              {subtitle}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};

export default TrustStrip;
