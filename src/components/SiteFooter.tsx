import { Link } from "react-router-dom";
import { brand, navigation } from "@/data/site";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";
const brandMark = "/sp-pickles-mark.svg";
const footerLinks = navigation.filter((item) =>
  ["/", "/products", "/contact"].includes(item.to),
);

const SiteFooter = () => {
  return (
    <footer className="mt-20 border-t border-[#e3d4c8] bg-[linear-gradient(180deg,#3b1414_0%,#240d0d_100%)] py-20 text-[#fff8f0]">
      <div className={`${pageWrap} grid gap-10 lg:grid-cols-[1.3fr_0.8fr_1fr]`}>
        <div className="max-w-lg">
          <div className="flex items-center gap-3">
            <img
              src={brandMark}
              alt={brand.name}
              className="h-14 w-14 rounded-full bg-white object-contain p-1"
            />
            <div>
              <h2 className="font-heading text-3xl font-semibold">{brand.name}</h2>
              <p className="mt-1 text-sm text-white/70">{brand.tagline}</p>
            </div>
          </div>

          <p className="mt-6 max-w-md text-sm leading-8 text-white/72">
            A premium Andhra food brand experience designed around trust, clarity, and authentic home-style flavour.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold text-[#fff2ee]">Quick Links</h3>
          <div className="mt-6 flex flex-col gap-3 text-sm text-white/75">
            {footerLinks.map((item) => (
              <Link key={item.to} to={item.to} className="transition hover:text-[#fff2ee]">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-2xl font-semibold text-[#fff2ee]">Contact</h3>
          <div className="mt-6 space-y-3 text-sm leading-8 text-white/75">
            <p>{brand.address}</p>
            {brand.phoneNumbers.map((number) => (
              <a
                key={number}
                href={`tel:${number.replace(/[^+\d]/g, "")}`}
                className="block transition hover:text-[#fff2ee]"
              >
                {number}
              </a>
            ))}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="block transition hover:text-[#fff2ee]"
            >
              {brand.supportEmail}
            </a>
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-[#d3ead8]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
