import { motion } from "framer-motion";
import { Leaf, ShieldCheck } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useLanguage } from "@/components/LanguageProvider";
import { useStore } from "@/components/StoreProvider";
import { formatCurrency } from "@/lib/pricing";
import { getDynamicProductName } from "@/lib/translation";

const FeaturedPicklesShowcase = () => {
  const { availableProducts } = useStore();
  const { language } = useLanguage();

  const featuredPickles = availableProducts
    .filter((product) => product.category === "pickles")
    .filter(
      (product) =>
        (product.isBrahminHeritage || product.isGreenTouch) &&
        product.nameTeluguguTelugu,
    )
    .slice(0, 20);

  if (featuredPickles.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <SectionWrapper className="relative overflow-hidden border-b border-[#3D7A52] bg-[#1A3A2A]">
      <SectionTitle
        eyebrow="Signature Collection"
        title="Traditional pickles with a more curated presentation"
        subtitle="Heritage-led favourites stay grouped here so customers can scan trusted classics quickly without losing the premium feel."
        align="center"
        className="mx-auto mb-12 max-w-4xl"
        subtitleClassName="mx-auto max-w-3xl"
      />

      <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="theme-card rounded-[2rem] border border-[#3D7A52] p-8 shadow-md"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-south-red/10 text-south-red">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-south-red">
            Heritage-led
          </p>
          <h3 className="mt-4 font-heading text-4xl font-semibold leading-tight text-south-dark">
            Built around familiar Andhra flavours and clean satvik preparation
          </h3>
          <p className="mt-5 text-base leading-8 text-south-dark/60">
            This spotlight section keeps the same products, but the framing is calmer and more premium so customers can scan the range faster.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#3D7A52] bg-[#1A3A2A] px-5 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-south-red">
                Small Batch
              </p>
              <p className="mt-3 text-sm leading-7 text-theme-body">
                Handmade batches that keep texture, oil balance, and spice depth consistent.
              </p>
            </div>
            <div className="rounded-2xl border border-[#3D7A52] bg-[#1A3A2A] px-5 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-south-green">
                Clean Ingredients
              </p>
              <p className="mt-3 text-sm leading-7 text-theme-body">
                No preservatives, with green accents used only where the message supports purity.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredPickles.map((product) => (
              <motion.article
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.03 }}
                className={`theme-card group rounded-2xl border border-[#3D7A52] p-5 shadow-md transition-all duration-300 hover:shadow-lg ${
                  !product.isAvailable ? "opacity-70" : ""
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {product.isBrahminHeritage ? (
                    <span className="rounded-full border border-south-red/20 bg-south-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-south-red">
                      Brahmin Heritage
                    </span>
                  ) : null}
                  {product.isGreenTouch ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-south-green/20 bg-south-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-south-green">
                      <Leaf className="h-3 w-3" />
                      Green Touch
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 space-y-3">
	                  <h3 className="line-clamp-2 font-heading text-xl font-semibold text-theme-contrast">
	                    {getDynamicProductName(product, language)}
	                  </h3>
	                  {language !== "te" && product.nameTeluguguTelugu ? (
                    <p className="font-telugu line-clamp-1 text-sm font-medium leading-[1.8] text-south-red">
                      {product.nameTeluguguTelugu}
                    </p>
                  ) : null}
                  {!product.isAvailable ? (
                    <p className="text-sm font-semibold text-south-red">Out of Stock</p>
                  ) : null}
                </div>

                <div className="mt-5 border-t border-south-red/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-south-red">
                    From
                  </p>
                  <p className="price-figure mt-2 text-2xl font-extrabold text-theme-contrast">
                    {formatCurrency(product.price_per_kg / 4)}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <PrimaryButton to="/products/pickles" className="w-full sm:w-auto">
              Explore All {availableProducts.filter((product) => product.category === "pickles").length}+
              Pickles
            </PrimaryButton>
            <p className="text-sm leading-7 text-theme-body">
              No preservatives, traditional preparation, and clearer category browsing.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.3 }}
        className="theme-card mt-12 rounded-2xl border border-[#3D7A52] px-6 py-6 shadow-sm"
      >
        <p className="text-center text-sm leading-8 text-theme-body">
          <span className="font-semibold text-south-red">Heritage Collection:</span> Each
          pickle is presented with the same family-led recipes and clean ingredient story, now
          with more refined spacing and a clearer visual hierarchy.
        </p>
      </motion.div>
    </SectionWrapper>
  );
};

export default FeaturedPicklesShowcase;
