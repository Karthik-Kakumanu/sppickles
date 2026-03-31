import { useEffect } from "react";
import { brand } from "@/data/site";

type SeoProps = {
  title: string;
  description: string;
  image?: string;
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

const Seo = ({ title, description, image }: SeoProps) => {
  useEffect(() => {
    const resolvedImage = image ?? `${window.location.origin}/sp-pickles-mark.svg`;
    const currentUrl = window.location.href;

    document.title = title;

    ensureMetaTag('meta[name="description"]', "name", "description").content = description;
    ensureMetaTag('meta[name="author"]', "name", "author").content = brand.name;
    ensureMetaTag('meta[name="theme-color"]', "name", "theme-color").content = "#8B0000";
    ensureMetaTag('meta[property="og:title"]', "property", "og:title").content = title;
    ensureMetaTag('meta[property="og:description"]', "property", "og:description").content =
      description;
    ensureMetaTag('meta[property="og:type"]', "property", "og:type").content = "website";
    ensureMetaTag('meta[property="og:url"]', "property", "og:url").content = currentUrl;
    ensureMetaTag('meta[property="og:image"]', "property", "og:image").content = resolvedImage;
    ensureMetaTag('meta[name="twitter:card"]', "name", "twitter:card").content =
      "summary_large_image";
    ensureMetaTag('meta[name="twitter:title"]', "name", "twitter:title").content = title;
    ensureMetaTag('meta[name="twitter:description"]', "name", "twitter:description").content =
      description;
    ensureMetaTag('meta[name="twitter:image"]', "name", "twitter:image").content = resolvedImage;
  }, [description, image, title]);

  return null;
};

export default Seo;
