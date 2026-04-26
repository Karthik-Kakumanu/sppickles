import { Link } from "react-router-dom";
import { Globe2, Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import { brand, navigation } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { content as translations } from "@/content/translations";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const footerUi = {
  en: {
    trustedTitle: "Why customers trust us",
    trustBadges: [
      "Traditional vegetarian recipes",
      "Careful packing",
      "Home-style flavour",
      "Direct customer support",
    ],
    cancelOrder: "Cancel Order",
    visitUs: "Visit Us",
    refundPolicy: "Refund Policy",
    developedBy: "Developed by",
    facebook: "Facebook",
    instagram: "Instagram",
    whatsappOrders: "WhatsApp Orders",
    pixelkodeWhatsapp: "PixelKode WhatsApp",
    pixelkodeInstagram: "PixelKode Instagram",
    addressLabel: "Store address",
    aboutTitle: "About Us",
    aboutText:
      "A family-run Andhra food brand focused on premium presentation, careful packing, and traditional vegetarian flavours for India and overseas customers. Established in 2016, we bring authentic taste to your table.",
  },
  te: {
    trustedTitle: "మమ్మల్ని నమ్మే కారణాలు",
    trustBadges: [
      "సాంప్రదాయ శాకాహార రుచులు",
      "జాగ్రత్తగా ప్యాకింగ్",
      "ఇంటి రుచిని గుర్తుచేసే నాణ్యత",
      "నేరుగా కస్టమర్ సహాయం",
    ],
    cancelOrder: "ఆర్డర్ రద్దు",
    visitUs: "మా చిరునామా",
    refundPolicy: "రిఫండ్ విధానం",
    developedBy: "రూపకల్పన చేసిన వారు",
    facebook: "ఫేస్‌బుక్",
    instagram: "ఇన్‌స్టాగ్రామ్",
    whatsappOrders: "వాట్సాప్ ఆర్డర్లు",
    pixelkodeWhatsapp: "పిక్సెల్‌కోడ్ వాట్సాప్",
    pixelkodeInstagram: "పిక్సెల్‌కోడ్ ఇన్‌స్టాగ్రామ్",
    addressLabel: "దుకాణ చిరునామా",
    aboutTitle: "మా గురించి",
    aboutText:
      "సాంప్రదాయ శాకాహార రుచులను అందంగా ప్యాక్ చేసి భారతదేశం మరియు విదేశాల్లో ఉన్న కుటుంబాలకు చేరవేసే కుటుంబ ఆధారిత ఆంధ్ర ఆహార బ్రాండ్ మేము. 2016 నుండి నిజమైన ఇంటి రుచిని మీ ముందుకు తీసుకువస్తున్నాము.",
  },
} as const;

const SiteFooter = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const ui = footerUi[language];
  const isTelugu = language === "te";

  return (
    <footer className="border-t border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f6f9f4_100%)] py-10 text-theme-heading md:py-14">
      <div className={pageWrap}>
        <div className="mb-10 grid gap-10 lg:grid-cols-[1.25fr_0.9fr_1.1fr]">
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
                  <h2 className="font-heading text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.01em] text-theme-heading sm:text-[2.05rem]">
                    {brand.name}
                  </h2>
                  <p className={`mt-1.5 text-sm leading-relaxed text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
                    {isTelugu ? brand.teluguSubtitle : brand.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className={`text-xs font-semibold uppercase tracking-wide text-theme-body-soft ${isTelugu ? "font-telugu" : ""}`}>
                {ui.trustedTitle}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ui.trustBadges.map((badge) => (
                  <div
                    key={badge}
                    className={`flex items-center gap-2 rounded-xl border border-[#b9e4c5] bg-[linear-gradient(180deg,#f3fff7_0%,#eaf8f0_100%)] px-3 py-2 text-xs font-semibold text-[#1d6a3f] ${isTelugu ? "font-telugu" : ""}`}
                  >
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <span className={`text-xs font-semibold uppercase tracking-wide text-theme-body-soft ${isTelugu ? "font-telugu" : ""}`}>
                {t.footer.followUs}
              </span>
              <a
                href={brand.socialMedia.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100"
                aria-label={ui.facebook}
              >
                <Facebook className="h-4 w-4" />
                <span className={isTelugu ? "font-telugu" : ""}>{ui.facebook}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-heading text-xl font-semibold text-theme-heading">{t.footer.quickLinks}</h3>
            <div className="flex flex-col gap-4 text-sm text-theme-body">
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} className={`font-medium transition hover:text-[#956d00] ${isTelugu ? "font-telugu" : ""}`}>
                  {t.layout.nav[item.to]}
                </Link>
              ))}
              <Link to="/cancel-order" className={`font-medium transition hover:text-[#956d00] ${isTelugu ? "font-telugu" : ""}`}>
                {ui.cancelOrder}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-heading text-xl font-semibold text-theme-heading">{t.footer.contact}</h3>
            <div className="mb-6 space-y-4 text-sm leading-6 text-theme-body">
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-[#2f7a43]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2f7a43] !text-white shadow-[0_0_0_1px_rgba(47,122,67,0.18),0_8px_18px_rgba(47,122,67,0.12)]">
                  <WhatsAppLogo className="h-[22px] w-[22px]" />
                </span>
                <div>
                  <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{ui.whatsappOrders}</p>
                  <span className="font-medium">{brand.whatsappDisplay}</span>
                </div>
              </a>
              <a href={`mailto:${brand.supportEmail}`} className="flex items-start gap-2 transition hover:text-[#2f7a43]">
                <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-[#2f7a43]" />
                <span className="font-medium">{brand.supportEmail}</span>
              </a>
              {brand.phoneNumbers.map((number) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^+\d]/g, "")}`}
                  className="flex items-start gap-2 transition hover:text-[#2f7a43]"
                >
                  <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-[#2f7a43]" />
                  <span className="font-medium">{number}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h4 className={`mb-3 font-heading text-lg font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>
              {ui.aboutTitle}
            </h4>
            <p className={`text-sm leading-6 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{ui.aboutText}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h4 className={`mb-3 font-heading text-lg font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>
              {ui.visitUs}
            </h4>
            <a
              href={brand.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-sm text-theme-body transition hover:text-[#2f7a43]"
            >
              <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#2f7a43]" />
              <div>
                <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{ui.addressLabel}</p>
                <span className={`font-medium ${isTelugu ? "font-telugu" : ""}`}>{brand.address}</span>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-[#d8e5d8] pt-8">
          <div className="mb-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <p className={`text-sm text-theme-body-soft ${isTelugu ? "font-telugu" : ""}`}>{t.footer.copyright}</p>
              <div className="grid grid-cols-3 items-center gap-2 text-center md:flex md:items-center md:justify-start md:gap-4">
                <Link to="/privacy" className={`whitespace-nowrap text-xs text-theme-body-soft transition hover:text-theme-heading sm:text-sm ${isTelugu ? "font-telugu" : ""}`}>
                  {t.footer.privacy}
                </Link>
                <Link to="/terms" className={`whitespace-nowrap text-xs text-theme-body-soft transition hover:text-theme-heading sm:text-sm ${isTelugu ? "font-telugu" : ""}`}>
                  {t.footer.terms}
                </Link>
                <Link to="/refund" className={`whitespace-nowrap text-xs text-theme-body-soft transition hover:text-theme-heading sm:text-sm ${isTelugu ? "font-telugu" : ""}`}>
                  {ui.refundPolicy}
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 text-[11px] leading-5 text-theme-body-soft/80">
              <span className={`font-semibold uppercase tracking-[0.18em] text-theme-body-soft/90 ${isTelugu ? "font-telugu" : ""}`}>
                {ui.developedBy}
              </span>
              <div className="grid w-full grid-cols-3 items-center gap-2 sm:flex sm:w-auto sm:items-center sm:gap-4">
                <a
                  href="https://pixelkode.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold text-theme-heading transition hover:text-[#2f7a43]"
                >
                  <Globe2 className="h-3 w-3" />
                  PixelKode
                </a>
                <a
                  href="https://wa.me/918897925715"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition hover:text-[#2f7a43] ${isTelugu ? "font-telugu" : ""}`}
                  aria-label={ui.pixelkodeWhatsapp}
                >
                  <WhatsAppLogo className="h-3.5 w-3.5" />
                  {t.layout.whatsapp}
                </a>
                <a
                  href="https://instagram.com/pixelkode.co"
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition hover:text-[#2f7a43] ${isTelugu ? "font-telugu" : ""}`}
                  aria-label={ui.pixelkodeInstagram}
                >
                  <Instagram className="h-3.5 w-3.5" />
                  {ui.instagram}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
