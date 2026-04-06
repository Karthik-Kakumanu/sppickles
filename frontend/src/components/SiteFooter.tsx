import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube } from "lucide-react";
import { brand, navigation } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { content as translations } from "@/content/translations";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const SiteFooter = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="border-t border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f6f9f4_100%)] py-10 md:py-14 text-theme-heading">
      <div className={pageWrap}>
        {/* Main Footer Grid */}
        <div className="mb-10 grid gap-10 lg:grid-cols-[1.25fr_0.9fr_1.1fr]">
          {/* Brand Section */}
          <div className="max-w-xl">
            <div className="mb-6 rounded-2xl border border-[#dce8dc] bg-[linear-gradient(145deg,#ffffff_0%,#f4f8f1_100%)] p-4 shadow-[0_20px_35px_rgba(30,79,46,0.08)]">
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                <div className="rounded-[1.4rem] border border-[#cfe2cf] bg-white p-1.5 shadow-[0_14px_26px_rgba(30,79,46,0.1)]">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-20 w-20 rounded-[0.95rem] object-cover sm:h-16 sm:w-16"
                  />
                </div>
                <div className="min-w-0 pt-0 sm:pt-0.5">
                  <h2 className="font-heading text-[1.9rem] leading-[1.05] font-semibold tracking-[-0.01em] text-theme-heading sm:text-[2.05rem]">
                    {brand.name}
                  </h2>
                  <p className={`mt-1.5 text-sm leading-relaxed text-theme-body ${language === "te" ? "font-telugu" : ""}`}>
                    {language === "te" ? brand.teluguSubtitle : brand.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-theme-body-soft uppercase tracking-wide">Why We're Trusted:</p>
              <div className="grid grid-cols-2 gap-2">
                {brand.usps.map((usp) => (
                  <div
                    key={usp}
                    className="flex items-center gap-2 rounded-xl border border-[#b9e4c5] bg-[linear-gradient(180deg,#f3fff7_0%,#eaf8f0_100%)] px-3 py-2 text-xs font-semibold text-[#1d6a3f]"
                  >
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
                    {usp}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-5 flex items-center gap-2.5">
              <span className="text-xs font-semibold text-theme-body-soft uppercase tracking-wide">{t.footer.followUs}</span>
              <div className="flex gap-3">
                <a
                  href={brand.socialMedia.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-pink-100 bg-pink-50 p-2.5 text-pink-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-pink-100"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={brand.socialMedia.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={brand.socialMedia.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-100"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-theme-heading mb-6">
              {t.footer.quickLinks}
            </h3>
            <div className="flex flex-col gap-4 text-sm text-theme-body">
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} className="transition hover:text-[#956d00] font-medium">
                  {t.layout.nav[item.to]}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-theme-heading mb-6">
              {t.footer.contact}
            </h3>
            <div className="space-y-4 text-sm leading-6 text-theme-body mb-6">
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-[#2f7a43]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2f7a43] text-white shadow-[0_0_0_1px_rgba(47,122,67,0.18),0_8px_18px_rgba(47,122,67,0.12)]">
                  <WhatsAppLogo className="h-[22px] w-[22px]" />
                </span>
                <span className="font-medium">{brand.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${brand.supportEmail}`}
                className="flex items-start gap-2 transition hover:text-[#2f7a43]"
              >
                <Mail className="mt-1 h-4 w-4 text-[#2f7a43] flex-shrink-0" />
                <span className="font-medium">{brand.supportEmail}</span>
              </a>
              {brand.phoneNumbers.map((number) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^+\d]/g, "")}`}
                  className="flex items-start gap-2 transition hover:text-[#2f7a43]"
                >
                  <Phone className="mt-1 h-4 w-4 text-[#2f7a43] flex-shrink-0" />
                  <span className="font-medium">{number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-heading text-lg font-semibold text-theme-heading mb-3">{t.footer.about}</h4>
            <p className={`text-sm leading-6 text-theme-body ${language === "te" ? "font-telugu" : ""}`}>
              {language === "te"
                ? "కుటుంబ ఆధారిత ఆంధ్ర ఆహార బ్రాండ్, ఇది సరిపోవు వీక్ష్యాన్ని, జాగ్రత్త పూర్ణ ప్యాకేజింగ్, మరియు సంప్రదాయ శాకాహార రుచులపై దృష్టి సారిస్తుంది."
                : t.footer.aboutText}
            </p>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-heading text-lg font-semibold text-theme-heading mb-3">{t.footer.shipping}</h4>
            <p className={`text-sm leading-6 text-theme-body ${language === "te" ? "font-telugu" : ""}`}>
              {language === "te" ? t.footer.shippingText : t.footer.shippingText}
            </p>
          </div>

          {/* Contact Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-heading text-lg font-semibold text-theme-heading mb-3">Visit Us</h4>
            <a
              href={brand.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-sm text-theme-body hover:text-[#2f7a43] transition"
            >
              <MapPin className="mt-1 h-5 w-5 text-[#2f7a43] flex-shrink-0" />
              <span className="font-medium">{brand.address}</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#d8e5d8] pt-8">
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <p className={`text-sm text-theme-body-soft ${language === "te" ? "font-telugu" : ""}`}>
              {t.footer.copyright}
            </p>
            <div className="flex flex-wrap gap-4 justify-end md:justify-start">
              <Link to="/privacy" className="text-sm text-theme-body-soft hover:text-theme-heading transition">
                {t.footer.privacy}
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/terms" className="text-sm text-theme-body-soft hover:text-theme-heading transition">
                {t.footer.terms}
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/refund" className="text-sm text-theme-body-soft hover:text-theme-heading transition">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
