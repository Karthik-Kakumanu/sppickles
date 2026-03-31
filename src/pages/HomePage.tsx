import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import Hero from "@/components/Hero";
import PrimaryButton from "@/components/PrimaryButton";
import ProductCard from "@/components/ProductCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import BenefitsSection from "@/components/BenefitsSection";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { brand, categoryContent, siteMedia } from "@/data/site";

const HomePage = () => {
  const { products, bestSellers } = useStore();
  const { t } = useLanguage();
  const featuredProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 6);

  return (
    <main className="overflow-hidden bg-[#fffaf4]">
      <Seo
        title="SP Traditional Pickles"
        description="Authentic Brahmin-style homemade pickles with no preservatives."
        image="/sp-pickles-mark.svg"
      />

      <Hero
        eyebrow={brand.tagline}
        title={brand.name}
        subtitle={brand.subtitle}
        teluguSubtitle={brand.teluguSubtitle}
        highlights={brand.usps}
        primaryAction={{
          label: "Shop Now",
          to: "/products",
        }}
        secondaryAction={{
          label: "Explore Products",
          to: "/products",
        }}
        image={siteMedia.heroMeal}
        imageAlt="SP Traditional Pickles premium serving presentation"
      />

      <SectionWrapper
        className="border-b border-[#eadfd5] bg-[linear-gradient(180deg,#fff8f2_0%,#fffdf9_100%)]"
        containerClassName="w-full px-6 md:px-12 lg:px-20"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {brand.usps.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-[#eadfd5] bg-white px-6 py-6 shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                USP
              </p>
              <h3 className="mt-3 font-heading text-2xl font-semibold text-[#241612]">{item}</h3>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="border-b border-[#eadfd5] bg-[linear-gradient(180deg,#fffdf8_0%,#fff7ef_100%)]"
        containerClassName="w-full px-6 md:px-12 lg:px-20"
      >
        <SectionTitle
          eyebrow={t('home.categoriesEyebrow')}
          title={t('home.categoriesTitle')}
          subtitle={t('home.categoriesSubtitle')}
          align="center"
          className="mx-auto max-w-4xl"
          subtitleClassName="mx-auto max-w-3xl"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {categoryContent.map((category, index) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Link
                to={`/products/${category.key}`}
                className="group block overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.label}
                    loading="lazy"
                    className="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,22,18,0.05)_0%,rgba(36,22,18,0.18)_100%)]" />
                </div>

                <div className="p-7">
                  <h3 className="font-heading text-3xl font-semibold text-[#241612]">
                    {category.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#685448]">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="border-b border-[#eadfd5] bg-[linear-gradient(180deg,#fffaf4_0%,#fffdf8_100%)]"
        containerClassName="w-full px-6 md:px-12 lg:px-20"
      >
        <SectionTitle
          eyebrow={t('home.bestSellersEyebrow')}
          title={t('home.bestSellersTitle')}
          subtitle={t('home.bestSellersSubtitle')}
          align="center"
          className="mx-auto max-w-4xl"
          subtitleClassName="mx-auto max-w-3xl"
        />

        <div className="mt-14 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 min-w-min md:justify-center">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="w-full md:w-[calc(100%/3-1.5rem)] flex-shrink-0 md:flex-shrink">
                <ProductCard
                  product={product}
                  index={index}
                  isAvailable={product.isAvailable}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <BenefitsSection />

      <SectionWrapper
        className="border-b border-[#eadfd5] bg-[linear-gradient(180deg,#fff8f3_0%,#fffdf9_100%)]"
        containerClassName="w-full px-6 md:px-12 lg:px-20"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff5f3] text-[#8b1e1e]">
              <Truck className="h-6 w-6" />
            </div>
            <SectionTitle
              eyebrow="Delivery"
              title="All India delivery with clear shipping slabs"
              subtitle="Shipping is charged separately during checkout based on the pincode."
              className="mt-6"
              titleClassName="text-3xl md:text-4xl"
            />
            <div className="mt-8 grid gap-4">
              <div className="rounded-2xl bg-[#fff8f3] px-5 py-5">
                <p className="text-sm font-semibold text-[#241612]">Starts with 5</p>
                <p className="mt-2 text-sm text-[#685448]">Shipping: Rs. 150</p>
              </div>
              <div className="rounded-2xl bg-[#f4f8f3] px-5 py-5">
                <p className="text-sm font-semibold text-[#241612]">Starts with 6</p>
                <p className="mt-2 text-sm text-[#685448]">Shipping: Rs. 200</p>
              </div>
              <div className="rounded-2xl bg-[#fff8f3] px-5 py-5">
                <p className="text-sm font-semibold text-[#241612]">Other pincodes</p>
                <p className="mt-2 text-sm text-[#685448]">Shipping: Rs. 250</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(135deg,#8b1e1e_0%,#6f1616_100%)] p-8 text-white shadow-md">
            <div className="grid gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                  Contact
                </p>
                <h2 className="mt-4 font-heading text-4xl font-semibold">
                  Direct support for orders and enquiries
                </h2>
              </div>

              <div className="grid gap-4">
                <a
                  href={brand.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-5 transition hover:bg-white/15"
                >
                  <MessageCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <p className="mt-1 text-sm text-white/80">Chat with us for support and queries.</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-5">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="mt-1 text-sm text-white/80">{brand.phoneNumbers.join(" / ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-5">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Address</p>
                    <p className="mt-1 text-sm leading-7 text-white/80">{brand.address}</p>
                  </div>
                </div>
              </div>

              <PrimaryButton
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full border-white bg-white text-[#8b1e1e] hover:bg-[#fff3ef] sm:w-auto"
              >
                Start Your Order
              </PrimaryButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
};

export default HomePage;
