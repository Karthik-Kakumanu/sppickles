import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { LAYOUT } from "@/lib/layout";
import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  disableAnimation?: boolean;
  paddingClassName?: string;
};

const SectionWrapper = ({
  children,
  className,
  contentClassName,
  containerClassName,
  disableAnimation = false,
  paddingClassName = LAYOUT.sectionPadding,
}: SectionWrapperProps) => {
  const resolvedContainerClassName =
    containerClassName ?? `${LAYOUT.container} ${LAYOUT.containerPadding}`;

  if (disableAnimation) {
    return (
      <section className={cn("w-full", paddingClassName, className)}>
        <div className={cn(resolvedContainerClassName, contentClassName)}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 32, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut", type: "tween" }}
      className={cn("w-full", paddingClassName, className)}
    >
      <motion.div
        className={cn(resolvedContainerClassName, contentClassName)}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};

export default SectionWrapper;
