import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  titleClassName,
  subtitleClassName,
}: SectionTitleProps) => {
  const isCentered = align === "center";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
      className={cn(
        "space-y-6",
        isCentered ? "mx-auto max-w-4xl text-center" : "max-w-4xl",
        className,
      )}
    >
      {eyebrow ? (
        <motion.p 
          variants={itemVariants}
          className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8b1e1e]"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2
        variants={itemVariants}
        className={cn(
          "text-balance font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#241612] sm:text-5xl lg:text-[3.35rem]",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={itemVariants}
          className={cn(
            "max-w-4xl text-base leading-8 text-[#685448] sm:text-lg",
            isCentered && "mx-auto",
            subtitleClassName,
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}
    </motion.div>
  );
};

export default SectionTitle;
