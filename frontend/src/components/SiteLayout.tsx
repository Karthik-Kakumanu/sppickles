import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import FloatingBottomNav from "@/components/FloatingBottomNav";
import SiteFooter from "@/components/SiteFooter";
import TopBar from "@/components/TopBar";
import LanguageToggle from "@/components/LanguageToggle";
import { brand, navigation } from "@/data/site";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/components/LanguageProvider";
import { content as translations } from "@/content/translations";

const pageWrap = "w-full px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10";

const SiteLayout = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <TopBar />

      <header className="sticky top-0 z-50 border-b border-[#e8ede8] bg-white shadow-[0_8px_20px_rgba(30,79,46,0.08)]">
        <div className={`${pageWrap} py-2.5 md:py-3.5`}>
            <div className="flex items-center justify-between gap-3 md:gap-4">
              <Link to="/" className="group flex items-center gap-2.5 shrink-0 transition-transform duration-300 hover:scale-105">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-[2.8rem] w-[2.8rem] rounded-[0.9rem] object-cover md:h-[3.1rem] md:w-[3.1rem]"
                />

                <div>
                  <p className="font-heading text-[1.1rem] font-bold leading-none tracking-[-0.02em] text-[#1a3a26] sm:text-[1.2rem] md:text-[1.35rem]">
                    {brand.name}
                  </p>
                </div>
              </Link>

              <div className="ml-auto hidden flex-1 items-center justify-end gap-2.5 md:flex">
                <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#e8ede8] bg-white px-2 py-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-[#5a7a65] transition duration-300 hover:bg-[#f5faf6] hover:text-[#2f7a43]"
                      activeClassName="bg-[#fef9f0] text-[#a87f39]"
                    >
                      {t.layout.nav[item.to]}
                    </NavLink>
                  ))}
                </nav>

                <LanguageToggle />

                <div className="hidden lg:flex flex-col items-end justify-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${brand.phoneNumbers[0].replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#2f7a43] bg-white px-3.5 py-1.5 text-[12px] font-semibold leading-none text-[#2f7a43] shadow-[0_10px_24px_rgba(47,122,67,0.16)] transition duration-300 hover:bg-[#f5faf6] hover:shadow-[0_14px_32px_rgba(47,122,67,0.2)]"
                  >
                    <Phone className="h-4 w-4" />
                    {brand.phoneNumbers[0]}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-1.5 md:hidden">
                <a
                  href={`tel:${brand.phoneNumbers[0].replace(/[^+\d]/g, "")}`}
                  className="inline-flex items-center rounded-full border border-[#d2e2d4] bg-white px-2.5 py-2 text-xs font-semibold text-[#2f7a43]"
                  aria-label="Call"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="inline-flex items-center rounded-full border border-[#d2e2d4] bg-white px-2.5 py-2 text-[#2f7a43]"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="mt-2 flex justify-center md:hidden">
              <div className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white p-1 shadow-[0_10px_24px_rgba(30,79,46,0.08)]">
                <button
                  type="button"
                  onClick={() => {
                    if (language !== "te") {
                      setLanguage("te");
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    language === "te"
                      ? "bg-[#2f7a43] !text-white"
                      : "text-theme-body hover:bg-[#edf5ee]"
                  } font-telugu`}
                  aria-pressed={language === "te"}
                >
                  తెలుగు
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (language !== "en") {
                      setLanguage("en");
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    language === "en"
                      ? "bg-[#2f7a43] !text-white"
                      : "text-theme-body hover:bg-[#edf5ee]"
                  }`}
                  aria-pressed={language === "en"}
                >
                  English
                </button>
              </div>
            </div>

            {isMobileMenuOpen ? (
              <div className="mt-3 space-y-3 rounded-[1.3rem] border border-[#d7e5d9] bg-[#fbfdfb] p-3 md:hidden">
                <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex justify-center whitespace-nowrap rounded-full border border-[#deeadf] bg-white px-3 py-2 text-[12px] font-semibold text-[#5a7a65] transition duration-300 hover:bg-[#f5faf6] hover:text-[#2f7a43]"
                    activeClassName="bg-[#fef9f0] text-[#a87f39]"
                  >
                    {t.layout.nav[item.to]}
                  </NavLink>
                ))}
                </div>

              </div>
            ) : null}
        </div>
      </header>

      <main className="flex-grow pb-36 md:pb-40">
        <Outlet />
      </main>

      <SiteFooter />
      <FloatingBottomNav />
    </div>
  );
};

export default SiteLayout;
