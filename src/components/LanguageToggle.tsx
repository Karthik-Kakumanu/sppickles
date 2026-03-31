import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const label = language === "te" ? "భాష" : "Language";

  return (
    <div className="flex justify-end">
      <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/95 p-1 shadow-lg backdrop-blur">
        <span className="hidden items-center gap-2 px-3 text-xs font-semibold text-muted-foreground md:inline-flex">
          <Languages className="h-4 w-4" />
          {label}
        </span>
        <button
          type="button"
          onClick={() => setLanguage("te")}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            language === "te"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          తెలుగు
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            language === "en"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
