import { type ElementType, createElement } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { cn } from "@/lib/utils";

interface BilingualTextProps {
  as?: ElementType;
  te: string;
  en: string;
  className?: string;
  teluguClassName?: string;
  englishClassName?: string;
}

const BilingualText = ({
  as = "div",
  te,
  en,
  className,
  teluguClassName,
  englishClassName,
}: BilingualTextProps) => {
  const { language } = useLanguage();

  return createElement(
    as,
    { className },
    language === "te" ? (
      <span
        lang="te"
        className={cn("block font-telugu leading-snug", teluguClassName)}
      >
        {te}
      </span>
    ) : (
      <span lang="en" className={cn("block leading-snug", englishClassName)}>
        {en}
      </span>
    ),
  );
};

export default BilingualText;
