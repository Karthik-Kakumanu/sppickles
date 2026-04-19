import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { content as translations } from "@/content/translations";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white/95 p-1 shadow-[0_14px_34px_rgba(30,79,46,0.08)]">
      <span className="hidden items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#2f7a43] 2xl:inline-flex">
        <Languages className="h-4 w-4" />
        {t.layout.language}
      </span>

      <button
        type="button"
        onClick={() => setLanguage("te")}
        className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
          language === "te"
            ? "bg-[#2f7a43] !text-white shadow-[0_10px_24px_rgba(47,122,67,0.2)]"
            : "text-theme-body hover:bg-[#edf5ee] hover:text-theme-heading"
        } font-telugu`}
        aria-pressed={language === "te"}
      >
        {t.layout.telugu}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
          language === "en"
            ? "bg-[#2f7a43] !text-white shadow-[0_10px_24px_rgba(47,122,67,0.2)]"
            : "text-theme-body hover:bg-[#edf5ee] hover:text-theme-heading"
        }`}
        aria-pressed={language === "en"}
      >
        {t.layout.english}
      </button>
    </div>
  );
};

export default LanguageToggle;
