import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import SectionWrapper from "@/components/SectionWrapper";

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  teluguSubtitle?: string;
  highlights?: string[];
  primaryAction: {
    label: string;
    href?: string;
    to?: string;
  };
  secondaryAction: {
    label: string;
    href?: string;
    to?: string;
  };
  image: string;
  imageAlt: string;
};

const Hero = ({
  eyebrow,
  highlights = [],
  image,
  imageAlt,
  primaryAction,
  secondaryAction,
  subtitle,
  teluguSubtitle,
  title,
}: HeroProps) => {
  return (
    <SectionWrapper
      disableAnimation
      paddingClassName="py-0"
      className="relative min-h-[calc(100vh-5rem)] overflow-hidden border-b border-[#eadfd5] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7ef_58%,#f8eee5_100%)]"
      containerClassName="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20"
      contentClassName="relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20 lg:py-24 xl:gap-28"
    >
      <div className="absolute inset-0 opacity-90">
        <div className="hero-ambient absolute inset-0" />
        <div className="banana-leaf-bg absolute inset-0 opacity-60" />
        <div className="grain-overlay absolute inset-0 opacity-35" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative z-10 max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8b1e1e]"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="mt-6 text-balance font-heading text-6xl font-bold leading-[0.9] tracking-[-0.05em] text-[#241612] sm:text-7xl lg:text-[5.9rem] xl:text-[6.5rem]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="mt-8 max-w-2xl text-lg leading-8 text-[#685448] sm:text-xl sm:leading-9"
        >
          {subtitle}
        </motion.p>

        {teluguSubtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#8b1e1e] sm:text-lg"
          >
            {teluguSubtitle}
          </motion.p>
        ) : null}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.35,
              },
            },
          }}
          className="mt-14 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="w-full sm:w-auto"
          >
            <PrimaryButton
              href={primaryAction.href}
              to={primaryAction.to}
              target={primaryAction.href ? "_blank" : undefined}
              rel={primaryAction.href ? "noreferrer" : undefined}
              icon={<MessageCircle className="h-4 w-4" />}
              className="w-full px-8 py-4 text-base"
              pulse
            >
              {primaryAction.label}
            </PrimaryButton>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="w-full sm:w-auto"
          >
            <PrimaryButton
              href={secondaryAction.href}
              to={secondaryAction.to}
              target={secondaryAction.href ? "_blank" : undefined}
              rel={secondaryAction.href ? "noreferrer" : undefined}
              variant="secondary"
              className="w-full px-8 py-4 text-base"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {secondaryAction.label}
            </PrimaryButton>
          </motion.div>
        </motion.div>

        {highlights.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-[#54463d]">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-[#eadfd5] bg-white/85 px-4 py-2 shadow-sm backdrop-blur-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        className="relative z-10 lg:pl-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-[2.6rem] border border-white/70 bg-white/55 p-4 shadow-[0_28px_80px_rgba(66,36,13,0.14)] backdrop-blur-lg transition-all duration-500 hover:shadow-[0_36px_96px_rgba(66,36,13,0.18)]"
        >
          <div className="relative overflow-hidden rounded-[2.15rem]">
            <img
              src={image}
              alt={imageAlt}
              loading="eager"
              className="h-[430px] w-full object-cover sm:h-[540px] lg:h-[620px] xl:h-[680px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,22,18,0.08)_0%,rgba(36,22,18,0.24)_100%)]" />
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 flex flex-wrap gap-3 sm:bottom-8 sm:left-8">
            <span className="rounded-full border border-white/25 bg-[#8b1e1e]/92 px-4 py-2 text-sm font-semibold text-white shadow-md backdrop-blur-sm">
              Homemade
            </span>
            <span className="rounded-full border border-white/40 bg-white/92 px-4 py-2 text-sm font-semibold text-[#241612] shadow-md backdrop-blur-sm">
              Brahmin Style
            </span>
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
};

export default Hero;
