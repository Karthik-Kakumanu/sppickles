import { useLanguage } from "./LanguageProvider";
import { content as translations } from "@/content/translations";

export default function TopBar() {
  const { language } = useLanguage();
  const t = translations[language];
  const marqueeItems = [...t.announcement.items, ...t.announcement.items];

  return (
    <div className="relative h-16 overflow-hidden border-b-2 border-[#d6c27a] bg-gradient-to-r from-[#faf4d2] via-[#f5dfa0] to-[#faf4d2] text-[#3d2f09] shadow-lg md:h-14">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(226,185,59,0.08)] via-transparent to-[rgba(226,185,59,0.08)]" />
      </div>
      <div className="relative flex h-full items-center overflow-hidden">
        <div className="marquee-track py-3 md:py-2.5">
          <div className="marquee-segment px-6">
            <div className="flex items-center gap-6">
              {marqueeItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={`inline-flex items-center gap-3 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors duration-200 hover:text-[#2F7A43] ${
                    language === "te" ? "font-telugu text-[13px] leading-[1.45]" : ""
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#2f7a3a] to-[#1d4620] shadow-md flex-shrink-0 animate-pulse" aria-hidden="true" />
                  <span className="text-[#3d2f09]">{item}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="marquee-segment px-6" aria-hidden="true">
            <div className="flex items-center gap-6">
              {marqueeItems.map((item, index) => (
                <span
                  key={`${item}-duplicate-${index}`}
                  className={`inline-flex items-center gap-3 text-sm font-semibold tracking-wide whitespace-nowrap ${
                    language === "te" ? "font-telugu text-[13px] leading-[1.45]" : ""
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#2f7a3a] to-[#1d4620] shadow-md flex-shrink-0 animate-pulse" aria-hidden="true" />
                  <span className="text-[#3d2f09]">{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
