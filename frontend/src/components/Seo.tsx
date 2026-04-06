import { useEffect } from "react";
import { brand } from "@/data/site";

type SeoProps = {
  title: string;
  description: string;
  image?: string;
  keywords?: string[];
  canonicalPath?: string;
  noIndex?: boolean;
};

const ensureMetaTag = (
  selector: string,
  attributeName: "name" | "property",
  attributeValue: string,
) => {
  let tag = document.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(tag);
  }

  return tag;
};

const ensureLinkTag = (selector: string, rel: string) => {
  let tag = document.querySelector(selector) as HTMLLinkElement | null;

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }

  return tag;
};

const baseKeywords = [
  "sppickles",
  "sppickles.com",
  "SP Pickles",
  "Sampradaya Pickles",
  "SP Traditional Pickles",
  "Andhra pickles Vijayawada",
  "homemade pickles",
  "Brahmin style pickles",
  "traditional Indian pickles",
  "Avakaya",
  "Gongura pickle",
  "Lemon pickle",
  "Mango pickle",
  "Podulu",
  "Fryums",
  "Vadiyalu",
  "Appadalu",
  "pure vegetarian food",
  "no preservatives",
  "online pickle store",
  "Vijayawada food store",
];

const brandSameAs = Object.values(brand.socialMedia).filter(Boolean);

const Seo = ({
  title,
  description,
  image,
  keywords = [],
  canonicalPath,
  noIndex = false,
}: SeoProps) => {
  useEffect(() => {
    const resolvedImage = new URL(image ?? brand.logo, window.location.origin).toString();
    const currentUrl = new URL(window.location.href);
    currentUrl.hash = "";
    currentUrl.search = "";
    const canonicalUrl = currentUrl.toString();
    const canonicalImage = new URL("/favicon.png", window.location.origin).toString();
    const keywordContent = Array.from(
      new Set([
        ...baseKeywords,
        ...keywords,
        title,
        description,
      ].filter((keyword) => keyword.trim().length > 0)),
    ).join(", ");
    const robotsContent = noIndex
      ? "noindex,nofollow,max-image-preview:none,max-snippet:0,max-video-preview:0"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
    const siteUrl = window.location.origin;
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: brand.name,
          alternateName: ["SP Pickles", "sppickles", "sppickles.com"],
          url: siteUrl,
          logo: canonicalImage,
          description: brand.subtitle,
          sameAs: brandSameAs,
          email: brand.supportEmail,
          telephone: brand.phoneNumbers[0],
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          url: siteUrl,
          name: brand.name,
          alternateName: ["SP Pickles", "sppickles", "sppickles.com"],
          description: brand.subtitle,
          publisher: { "@id": `${siteUrl}/#organization` },
          inLanguage: "en-IN",
        },
        {
          "@type": "WebPage",
          "@id": `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: title,
          description,
          isPartOf: { "@id": `${siteUrl}/#website` },
          about: { "@id": `${siteUrl}/#organization` },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: resolvedImage,
          },
        },
        {
          "@type": "Store",
          "@id": `${siteUrl}/#localbusiness`,
          name: brand.name,
          url: siteUrl,
          image: resolvedImage,
          telephone: brand.whatsappDisplay,
          email: brand.supportEmail,
          address: {
            "@type": "PostalAddress",
            streetAddress: brand.address,
            addressLocality: "Vijayawada",
            addressRegion: "Andhra Pradesh",
            postalCode: "520011",
            addressCountry: "IN",
          },
          areaServed: ["India", "United States"],
        },
      ],
    };

    document.title = title;

    ensureMetaTag('meta[name="description"]', "name", "description").content = description;
    ensureMetaTag('meta[name="author"]', "name", "author").content = brand.name;
    ensureMetaTag('meta[name="theme-color"]', "name", "theme-color").content = "#8B0000";
    ensureMetaTag('meta[name="robots"]', "name", "robots").content = robotsContent;
    ensureMetaTag('meta[name="googlebot"]', "name", "googlebot").content = robotsContent;
    ensureMetaTag('meta[name="keywords"]', "name", "keywords").content = keywordContent;
    ensureMetaTag('meta[name="application-name"]', "name", "application-name").content = brand.name;
    ensureMetaTag('meta[name="apple-mobile-web-app-title"]', "name", "apple-mobile-web-app-title").content = brand.name;
    ensureMetaTag('meta[property="og:title"]', "property", "og:title").content = title;
    ensureMetaTag('meta[property="og:description"]', "property", "og:description").content =
      description;
    ensureMetaTag('meta[property="og:type"]', "property", "og:type").content = "website";
    ensureMetaTag('meta[property="og:url"]', "property", "og:url").content = canonicalUrl;
    ensureMetaTag('meta[property="og:image"]', "property", "og:image").content = resolvedImage;
    ensureMetaTag('meta[property="og:site_name"]', "property", "og:site_name").content =
      brand.name;
    ensureMetaTag('meta[name="twitter:card"]', "name", "twitter:card").content =
      "summary_large_image";
    ensureMetaTag('meta[name="twitter:title"]', "name", "twitter:title").content = title;
    ensureMetaTag('meta[name="twitter:description"]', "name", "twitter:description").content =
      description;
    ensureMetaTag('meta[name="twitter:image"]', "name", "twitter:image").content = resolvedImage;

    ensureLinkTag('link[rel="canonical"]', "canonical").href = canonicalPath
      ? new URL(canonicalPath, siteUrl).toString()
      : canonicalUrl;
    ensureLinkTag('link[rel="icon"]', "icon").href = "/favicon.png";
    ensureLinkTag('link[rel="shortcut icon"]', "shortcut icon").href = "/favicon.png";
    ensureLinkTag('link[rel="apple-touch-icon"]', "apple-touch-icon").href = "/favicon.png";

    const existingSchema = document.getElementById("seo-jsonld");
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaScript = document.createElement("script");
    schemaScript.id = "seo-jsonld";
    schemaScript.type = "application/ld+json";
    schemaScript.textContent = JSON.stringify(localBusinessSchema);
    document.head.appendChild(schemaScript);
  }, [canonicalPath, description, image, keywords, noIndex, title]);

  return null;
};

export default Seo;
