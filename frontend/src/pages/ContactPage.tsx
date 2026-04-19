import { useMemo, useState, type FormEvent } from "react";
import { Globe2, Mail, MapPin, Phone, SendHorizonal } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { brand } from "@/data/site";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";
const contactMapQuery = "23-30-24,, kanakaraju street, satyanarayana puram, Vijayawada -11";

const contactCopy = {
  en: {
    eyebrow: "Contact",
    title: "Location, phone numbers, WhatsApp, enquiry form, and delivery coverage in one place",
    intro:
      "The contact page is designed to answer the questions a serious buyer usually has: where the brand is based, how to reach the team, what kind of delivery support is available, and how to start a direct conversation quickly.",
    contactTitle: "Direct contact details",
    contactLead:
      "Customers can reach the team through WhatsApp, phone, email, or by using the quick enquiry form below.",
    coverageTitle: "Delivery support",
    coveragePoints: [
      "All India orders with careful packing and dispatch support.",
      "USA enquiries and overseas shipping handled after direct confirmation.",
      "Bulk orders, gifting orders, and repeat family orders handled through direct coordination.",
    ],
    formTitle: "Send a quick enquiry",
    formLead:
      "Use the form below and we will prepare a WhatsApp-ready message so the customer conversation can start immediately.",
    name: "Name",
    phone: "Phone",
    city: "City",
    topic: "Topic",
    message: "Message",
    placeholders: {
      name: "Your name",
      phone: "10-digit mobile number",
      city: "City or region",
      topic: "Example: bulk order, USA enquiry, custom pack",
      message: "Tell us what you need, which products you want, or what question you have.",
    },
    submit: "Send on WhatsApp",
  },
  te: {
    eyebrow: "సంప్రదించండి",
    title: "లొకేషన్, ఫోన్ నంబర్లు, వాట్సాప్, enquiry ఫారం, డెలివరీ సపోర్ట్ అన్నీ ఒకే చోట",
    intro:
      "నిజంగా కొనాలనుకునే కస్టమర్ సాధారణంగా అడిగే ప్రశ్నలకు ఈ పేజీ సమాధానం ఇస్తుంది: బ్రాండ్ ఎక్కడ ఉంది, ఎలా సంప్రదించాలి, డెలివరీ ఎలా ఉంటుంది, డైరెక్ట్‌గా ఎలా మాట్లాడాలి.",
    contactTitle: "నేరుగా సంప్రదింపు వివరాలు",
    contactLead:
      "వాట్సాప్, ఫోన్, ఈమెయిల్ లేదా కింది enquiry ఫారం ద్వారా కస్టమర్ నేరుగా టీమ్‌ను చేరుకోవచ్చు.",
    coverageTitle: "డెలివరీ సపోర్ట్",
    coveragePoints: [
      "భారతదేశం అంతటా శ్రద్ధగా ప్యాక్ చేసి పంపే సపోర్ట్.",
      "USA enquiries మరియు విదేశీ షిప్పింగ్ direct confirmation తరువాత నిర్వహణ.",
      "బల్క్ ఆర్డర్లు, గిఫ్టింగ్ ఆర్డర్లు, repeat family orders కోసం ప్రత్యేక సమన్వయం.",
    ],
    formTitle: "త్వరిత enquiry పంపండి",
    formLead:
      "కింది ఫారం నింపితే వెంటనే వాట్సాప్‌లో పంపడానికి సిద్ధమైన మెసేజ్ తయారవుతుంది.",
    name: "పేరు",
    phone: "ఫోన్",
    city: "నగరం",
    topic: "విషయం",
    message: "సందేశం",
    placeholders: {
      name: "మీ పేరు",
      phone: "10 అంకెల మొబైల్ నంబర్",
      city: "నగరం లేదా ప్రాంతం",
      topic: "ఉదాహరణ: బల్క్ ఆర్డర్, USA enquiry, ప్రత్యేక ప్యాక్",
      message: "మీకు ఏమి కావాలో, ఏ ఉత్పత్తులు కావాలో లేదా ఏ ప్రశ్న ఉందో తెలపండి.",
    },
    submit: "వాట్సాప్‌లో పంపండి",
  },
} as const;

type ContactFormState = {
  name: string;
  phone: string;
  city: string;
  topic: string;
  message: string;
};

const ContactPage = () => {
  const { language } = useLanguage();
  const t = contactCopy[language];
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    phone: "",
    city: "",
    topic: "",
    message: "",
  });

  const whatsappLink = useMemo(() => {
    const lines = [
      language === "te" ? "నమస్కారం, నాకు enquiry ఉంది." : "Hello, I have an enquiry.",
      form.name ? `${t.name}: ${form.name}` : null,
      form.phone ? `${t.phone}: ${form.phone}` : null,
      form.city ? `${t.city}: ${form.city}` : null,
      form.topic ? `${t.topic}: ${form.topic}` : null,
      form.message ? `${t.message}: ${form.message}` : null,
    ].filter(Boolean);

    return `${brand.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form, language, t.city, t.message, t.name, t.phone, t.topic]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title="SP Traditional Pickles | Contact"
        description="Contact SP Traditional Pickles for orders, support, and delivery enquiries."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-10`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
            {t.eyebrow}
          </span>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-semibold text-theme-heading md:text-5xl xl:text-6xl">
            {t.title}
          </h1>
          <p
            className={`mt-5 max-w-4xl text-base leading-8 text-theme-body md:text-lg ${
              language === "te" ? "font-telugu" : ""
            }`}
          >
            {t.intro}
          </p>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr]`}>
        <div className="space-y-8">
          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.contactTitle}</h2>
            <p
              className={`mt-4 text-base leading-8 text-theme-body ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.contactLead}
            </p>

            <div className="mt-8 space-y-5 text-sm text-theme-body">
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-white px-5 py-4 transition hover:bg-[#edf5ee]"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2f7a43] !text-white shadow-[0_0_0_1px_rgba(47,122,67,0.14)]">
                  <WhatsAppLogo className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="font-semibold text-theme-heading">WhatsApp</p>
                  <p className="mt-1">{brand.whatsappDisplay}</p>
                </div>
              </a>

              {brand.phoneNumbers.map((number) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^+\d]/g, "")}`}
                  className="flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-white px-5 py-4 transition hover:bg-[#edf5ee]"
                >
                  <Phone className="mt-1 h-4 w-4 text-[#2f7a43]" />
                  <div>
                    <p className="font-semibold text-theme-heading">{language === "te" ? "ఫోన్" : "Phone"}</p>
                    <p className="mt-1">{number}</p>
                  </div>
                </a>
              ))}

              <a
                href={`mailto:${brand.supportEmail}`}
                className="flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-white px-5 py-4 transition hover:bg-[#edf5ee]"
              >
                <Mail className="mt-1 h-4 w-4 text-[#2f7a43]" />
                <div>
                  <p className="font-semibold text-theme-heading">{language === "te" ? "ఈమెయిల్" : "Email"}</p>
                  <p className="mt-1">{brand.supportEmail}</p>
                </div>
              </a>

              <a
                href={brand.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-white px-5 py-4 transition hover:bg-[#edf5ee]"
              >
                <MapPin className="mt-1 h-4 w-4 text-[#2f7a43]" />
                <div>
                  <p className="font-semibold text-theme-heading">{language === "te" ? "లొకేషన్" : "Location"}</p>
                  <p className="mt-1 leading-7">{brand.address}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.coverageTitle}</h2>
            <div className="mt-6 space-y-4">
              {t.coveragePoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3c9] text-[#956d00]">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <p
                    className={`text-sm leading-7 text-theme-body ${
                      language === "te" ? "font-telugu" : ""
                    }`}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="section-shell overflow-hidden">
            <iframe
              title="SP Traditional Pickles location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactMapQuery)}&output=embed`}
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <form onSubmit={handleSubmit} className="section-shell px-7 py-8">
            <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.formTitle}</h2>
            <p
              className={`mt-4 text-base leading-8 text-theme-body ${
                language === "te" ? "font-telugu" : ""
              }`}
            >
              {t.formLead}
            </p>

            <div className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className={`text-sm font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                  {t.name}
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder={t.placeholders.name}
                  className="theme-input w-full rounded-2xl border px-4 py-3"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className={`text-sm font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                    {t.phone}
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                    placeholder={t.placeholders.phone}
                    className="theme-input w-full rounded-2xl border px-4 py-3"
                  />
                </label>

                <label className="grid gap-2">
                  <span className={`text-sm font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                    {t.city}
                  </span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                    placeholder={t.placeholders.city}
                    className="theme-input w-full rounded-2xl border px-4 py-3"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className={`text-sm font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                  {t.topic}
                </span>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
                  placeholder={t.placeholders.topic}
                  className="theme-input w-full rounded-2xl border px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-semibold text-theme-heading ${language === "te" ? "font-telugu" : ""}`}>
                  {t.message}
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder={t.placeholders.message}
                  className="theme-input w-full rounded-2xl border px-4 py-3"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f7a43] px-6 py-4 text-sm font-semibold !text-white shadow-[0_18px_38px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a]"
              >
                <SendHorizonal className="h-4 w-4" />
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
