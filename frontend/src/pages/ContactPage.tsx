import { useMemo, useState, type FormEvent } from "react";
import { Globe2, Mail, MapPin, Phone, SendHorizonal } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { brand } from "@/data/site";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";
const contactMapQuery = "23-30-24, Kanakaraju Street, Satyanarayana Puram, Vijayawada - 11";

const contactCopy = {
  en: {
    eyebrow: "Contact",
    title: "Phone, WhatsApp, address, and delivery support in one place",
    intro:
      "This page keeps every direct contact option together so customers can reach the team quickly, ask product questions, and confirm delivery support without confusion.",
    contactTitle: "Direct contact details",
    contactLead:
      "Reach the team through WhatsApp, phone, email, or location details below.",
    coverageTitle: "Delivery support",
    coveragePoints: [
      "Orders are packed carefully and shipped across India.",
      "USA and overseas enquiries are handled after direct confirmation with the team.",
      "Bulk orders, gifting orders, and repeat family orders are coordinated personally.",
    ],
    formTitle: "Send a quick message",
    formLead:
      "Fill this short form and we will prepare a WhatsApp-ready message for you instantly.",
    name: "Name",
    phone: "Phone",
    city: "City",
    topic: "Topic",
    message: "Message",
    whatsapp: "WhatsApp",
    email: "Email",
    location: "Location",
    mapTitle: "SP Traditional Pickles location",
    placeholders: {
      name: "Your name",
      phone: "10-digit mobile number",
      city: "City or region",
      topic: "Example: bulk order, overseas order, custom pack",
      message: "Tell us what you need or which products you want.",
    },
    submit: "Send on WhatsApp",
    openingLine: "Hello, I have an enquiry.",
  },
  te: {
    eyebrow: "సంప్రదించండి",
    title: "ఫోన్, వాట్సాప్, చిరునామా, డెలివరీ సహాయం అన్నీ ఒకే చోట",
    intro:
      "ఈ పేజీలో కస్టమర్‌కు కావాల్సిన ప్రతి ప్రత్యక్ష సంప్రదింపు మార్గం ఒకేచోట ఉంటుంది. ఉత్పత్తుల గురించి అడగడం, డెలివరీ వివరాలు తెలుసుకోవడం, వెంటనే టీమ్‌తో మాట్లాడడం సులభమవుతుంది.",
    contactTitle: "నేరుగా సంప్రదింపు వివరాలు",
    contactLead:
      "వాట్సాప్, ఫోన్, ఈమెయిల్ లేదా లొకేషన్ ద్వారా మా టీమ్‌ను నేరుగా సంప్రదించవచ్చు.",
    coverageTitle: "డెలివరీ సహాయం",
    coveragePoints: [
      "భారతదేశం అంతటా జాగ్రత్తగా ప్యాకింగ్ చేసి ఆర్డర్లు పంపిస్తాము.",
      "USA మరియు విదేశీ ఆర్డర్ల కోసం ముందుగా టీమ్‌తో నేరుగా నిర్ధారణ చేస్తాము.",
      "బల్క్ ఆర్డర్లు, గిఫ్టింగ్ ఆర్డర్లు, కుటుంబ అవసరాల ఆర్డర్లకు ప్రత్యేక సహాయం అందిస్తాము.",
    ],
    formTitle: "త్వరిత సందేశం పంపండి",
    formLead:
      "ఈ చిన్న ఫారం నింపితే వెంటనే వాట్సాప్‌లో పంపడానికి సిద్ధమైన సందేశం తయారవుతుంది.",
    name: "పేరు",
    phone: "ఫోన్",
    city: "నగరం",
    topic: "విషయం",
    message: "సందేశం",
    whatsapp: "వాట్సాప్",
    email: "ఈమెయిల్",
    location: "చిరునామా",
    mapTitle: "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ స్థానం",
    placeholders: {
      name: "మీ పేరు",
      phone: "10 అంకెల మొబైల్ నంబర్",
      city: "నగరం లేదా ప్రాంతం",
      topic: "ఉదాహరణ: బల్క్ ఆర్డర్, విదేశీ ఆర్డర్, ప్రత్యేక ప్యాక్",
      message: "మీకు ఏమి కావాలో లేదా ఏ ఉత్పత్తులు కావాలో తెలపండి.",
    },
    submit: "వాట్సాప్‌లో పంపండి",
    openingLine: "నమస్కారం, నాకు ఒక సమాచారం కావాలి.",
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

  const isTelugu = language === "te";

  const whatsappLink = useMemo(() => {
    const lines = [
      t.openingLine,
      form.name ? `${t.name}: ${form.name}` : null,
      form.phone ? `${t.phone}: ${form.phone}` : null,
      form.city ? `${t.city}: ${form.city}` : null,
      form.topic ? `${t.topic}: ${form.topic}` : null,
      form.message ? `${t.message}: ${form.message}` : null,
    ].filter(Boolean);

    return `${brand.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [form, t]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="overflow-hidden bg-[var(--color-bg-primary)]">
      <Seo
        title={isTelugu ? "ఎస్‌పి ట్రెడిషనల్ పికిల్స్ | సంప్రదించండి" : "SP Traditional Pickles | Contact"}
        description={
          isTelugu
            ? "ఆర్డర్లు, డెలివరీ సహాయం మరియు ప్రత్యక్ష సంప్రదింపుల కోసం ఎస్‌పి ట్రెడిషనల్ పికిల్స్‌ను సంప్రదించండి."
            : "Contact SP Traditional Pickles for orders, delivery support, and direct assistance."
        }
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-10`}>
          <span className="inline-flex rounded-full bg-[#fff3c9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#956d00]">
            {t.eyebrow}
          </span>
          <h1 className="mt-5 max-w-5xl font-heading text-4xl font-semibold text-theme-heading md:text-5xl xl:text-6xl">
            {t.title}
          </h1>
          <p className={`mt-5 max-w-4xl text-base leading-8 text-theme-body md:text-lg ${isTelugu ? "font-telugu" : ""}`}>
            {t.intro}
          </p>
        </div>
      </section>

      <section className={`${pageWrap} grid gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr]`}>
        <div className="space-y-8">
          <div className="section-shell px-7 py-8">
            <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.contactTitle}</h2>
            <p className={`mt-4 text-base leading-8 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
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
                  <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.whatsapp}</p>
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
                    <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.phone}</p>
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
                  <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.email}</p>
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
                  <p className={`font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.location}</p>
                  <p className={`mt-1 leading-7 ${isTelugu ? "font-telugu" : ""}`}>{brand.address}</p>
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
                  <p className={`text-sm leading-7 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="section-shell overflow-hidden">
            <iframe
              title={t.mapTitle}
              src={`https://www.google.com/maps?q=${encodeURIComponent(contactMapQuery)}&output=embed`}
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <form onSubmit={handleSubmit} className="section-shell px-7 py-8">
            <h2 className="font-heading text-3xl font-semibold text-theme-heading">{t.formTitle}</h2>
            <p className={`mt-4 text-base leading-8 text-theme-body ${isTelugu ? "font-telugu" : ""}`}>
              {t.formLead}
            </p>

            <div className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className={`text-sm font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.name}</span>
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
                  <span className={`text-sm font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.phone}</span>
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
                  <span className={`text-sm font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.city}</span>
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
                <span className={`text-sm font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.topic}</span>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
                  placeholder={t.placeholders.topic}
                  className="theme-input w-full rounded-2xl border px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className={`text-sm font-semibold text-theme-heading ${isTelugu ? "font-telugu" : ""}`}>{t.message}</span>
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
