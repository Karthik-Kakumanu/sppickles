import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import SectionWrapper from "@/components/SectionWrapper";

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  teluguSubtitle?: string;
  video?: string;
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
  video,
}: HeroProps) => {
  const getHighlightClasses = (highlight: string) => {
    const normalizedHighlight = highlight.toLowerCase();

    if (normalizedHighlight.includes("onion") || normalizedHighlight.includes("garlic")) {
      return "border border-[#d8e5d8] bg-[#EDF5EE] text-[#2F7A43]";
    }

    if (normalizedHighlight.includes("preservative") || normalizedHighlight.includes("home")) {
      return "border border-[#f0df97] bg-[#FFF3C9] text-[#956D00]";
    }

    return "border border-[#d8e5d8] bg-white text-theme-body";
  };

  return (
    <SectionWrapper
      disableAnimation
      paddingClassName="py-0"
      className="relative overflow-hidden border-b border-[#d8e5d8] bg-[var(--color-bg-primary)]"
      containerClassName="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20"
      contentClassName="relative flex min-h-screen flex-col items-center justify-center gap-12 pt-16 sm:pt-20 lg:min-h-[calc(100vh-5.25rem)] lg:flex-row lg:gap-16 lg:pt-10 xl:gap-20"
    >
      <div className="absolute inset-0 opacity-100">
        <div className="hero-ambient absolute inset-0" />
        <div className="banana-leaf-bg absolute inset-0 opacity-[0.05]" />
      </div>
      <div className="pointer-events-none absolute left-[-10%] top-[10%] h-60 w-60 rounded-full bg-[#EDF5EE] blur-3xl" />
      <div className="pointer-events-none absolute right-[6%] top-[16%] h-52 w-52 rounded-full bg-[#FFF3C9] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[6%] left-[35%] h-44 w-44 rounded-full bg-[#edf5ee] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[40rem] text-center sm:text-center lg:text-left"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center rounded-full border border-[#e6d79a] bg-[#FFF3C9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#956D00] shadow-[0_12px_26px_rgba(226,185,59,0.14)]"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          className="mt-6 text-balance font-heading text-[3.15rem] font-bold leading-[0.95] tracking-[-0.05em] text-theme-heading sm:text-[4.15rem] lg:text-[5rem] xl:text-[5.75rem]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.14 }}
          className="mt-7 max-w-2xl text-base leading-8 text-theme-body sm:text-lg sm:leading-9 lg:text-[1.15rem]"
        >
          {subtitle}
        </motion.p>

        {teluguSubtitle ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-4 max-w-2xl font-telugu text-[1.02rem] font-medium leading-[1.95] text-theme-body sm:text-[1.15rem]"
          >
            {teluguSubtitle}
          </motion.p>
        ) : null}

        {highlights.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(30,79,46,0.06)] ${getHighlightClasses(highlight)}`}
              >
                {highlight}
              </span>
            ))}
          </motion.div>
        ) : null}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.3,
              },
            },
          }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 110 }}
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
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 110 }}
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.12 }}
        className="relative z-10 flex w-full max-w-sm items-center justify-center sm:max-w-xl md:max-w-2xl lg:ml-auto lg:max-w-[40rem] xl:max-w-[45rem]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-full rounded-[2rem] border border-[#d8e5d8] bg-white p-3 shadow-[0_28px_70px_rgba(30,79,46,0.12)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.55rem] bg-[#f4f8f4]">
            <div className="pointer-events-none absolute inset-0 banana-leaf-bg opacity-[0.08]" />
            {video ? (
              <video
                src={video}
                poster={image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                title={imageAlt}
                className="relative z-10 h-full w-full object-cover"
              />
            ) : (
              <img
                src={image}
                alt={imageAlt}
                loading="eager"
                className="relative z-10 h-full w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(30,79,46,0.08)_100%)]" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#d8e5d8]" />
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
};

export default Hero;
