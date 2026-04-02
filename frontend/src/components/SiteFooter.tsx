import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { brand, navigation } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { content as translations } from "@/content/translations";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

const SiteFooter = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="border-t border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f6f9f4_100%)] py-16 text-theme-heading">
      <div className={`${pageWrap} grid gap-10 lg:grid-cols-[1.25fr_0.7fr_1fr]`}>
        <div className="max-w-xl">
          <div className="flex items-center gap-4">
            <div className="rounded-[1.6rem] border border-[#d8e5d8] bg-[#f7fbf7] p-1.5 shadow-[0_18px_34px_rgba(30,79,46,0.08)]">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 w-16 rounded-[1rem] object-cover"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-semibold text-theme-heading">
                {brand.name}
              </h2>
              <p
                className={`mt-1 text-sm text-theme-body ${
                  language === "te" ? "font-telugu" : ""
                }`}
              >
                {language === "te" ? brand.teluguSubtitle : brand.subtitle}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-lg text-sm leading-8 text-theme-body">
            {language === "te"
              ? "పచ్చళ్ళు, పొడులు, ఫ్రైయమ్స్‌ను శ్రద్ధగా తయారు చేసి, భారతదేశం మరియు విదేశాలకు పంపించడానికి సిద్ధంగా ఉన్న కుటుంబ బ్రాండ్."
              : "A family-run Andhra food brand focused on premium presentation, careful packing, and traditional vegetarian flavours for India and overseas customers."}
          </p>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold text-theme-heading">
            {t.footer.quickLinks}
          </h3>
          <div className="mt-6 flex flex-col gap-3 text-sm text-theme-body">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} className="transition hover:text-[#956d00]">
                {t.layout.nav[item.to]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold text-theme-heading">
            {t.footer.contact}
          </h3>
          <div className="mt-6 space-y-4 text-sm leading-7 text-theme-body">
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 transition hover:text-[#2f7a43]"
            >
              <MessageCircle className="mt-1 h-4 w-4 text-[#2f7a43]" />
              <span>{brand.whatsappDisplay}</span>
            </a>
            {brand.phoneNumbers.map((number) => (
              <a
                key={number}
                href={`tel:${number.replace(/[^+\d]/g, "")}`}
                className="flex items-start gap-3 transition hover:text-[#2f7a43]"
              >
                <Phone className="mt-1 h-4 w-4 text-[#2f7a43]" />
                <span>{number}</span>
              </a>
            ))}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="flex items-start gap-3 transition hover:text-[#2f7a43]"
            >
              <Mail className="mt-1 h-4 w-4 text-[#2f7a43]" />
              <span>{brand.supportEmail}</span>
            </a>
            <a
              href={brand.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 transition hover:text-[#2f7a43]"
            >
              <MapPin className="mt-1 h-4 w-4 text-[#2f7a43]" />
              <span>{brand.address}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
