import { motion } from "framer-motion";
import { MessageCircle, Star } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import SectionTitle from "@/components/SectionTitle";
import { brand, type ProductRecord } from "@/data/site";
import { formatCurrency } from "@/lib/pricing";

type FeaturedProductCarouselProps = {
  products: ProductRecord[];
};

const FeaturedProductCarousel = ({ products }: FeaturedProductCarouselProps) => {
  const cards = products.slice(0, 8);

  if (cards.length === 0) {
    return (
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Featured Products"
          title="Fresh favourites will appear here as soon as the next batch is live"
          subtitle="This showcase stays visible even when the catalog is empty, so the page still feels complete and customers know new stock is on the way."
          className="max-w-4xl"
          titleClassName="text-4xl md:text-5xl lg:text-[3.25rem]"
          subtitleClassName="max-w-3xl"
        />

        <div className="rounded-[2rem] border border-[#eadfd5] bg-white px-8 py-12 shadow-md">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8b1e1e]">
              Currently Restocking
            </p>
            <h3 className="mt-4 font-heading text-4xl font-semibold text-[#241612] md:text-5xl">
              Premium jars and fresh batches are being prepared
            </h3>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#685448]">
              Products are temporarily unavailable, but the storefront keeps its structure and guides customers back to ordering channels instead of leaving an empty gap.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <PrimaryButton href={brand.whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                Order on WhatsApp
              </PrimaryButton>
              <PrimaryButton to="/contact" variant="secondary" className="w-full sm:w-auto">
                Contact SP Pickles
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <SectionTitle
          eyebrow="Featured Products"
          title="Signature favourites customers notice first"
          subtitle="A premium horizontal showcase with calmer spacing, stronger imagery, and a clearer buying path."
          className="max-w-4xl"
          titleClassName="text-4xl md:text-5xl lg:text-[3.25rem]"
          subtitleClassName="max-w-3xl"
        />

        <div className="inline-flex items-center rounded-full border border-[#eadfd5] bg-white/80 px-5 py-3 text-sm font-medium text-[#5d4735] shadow-sm backdrop-blur-sm">
          Wide product grid for a fuller premium showcase
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((product, index) => {
          const prefilledWhatsapp = `${brand.whatsappUrl}?text=${encodeURIComponent(
            `Hi, I want to order ${product.name}`,
          )}`;

          return (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eadfd5] bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-[1.25rem]">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,22,18,0.04)_0%,rgba(36,22,18,0.24)_100%)]" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {product.isBestSeller ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#8b1e1e] px-3 py-1 text-xs font-semibold text-white">
                      <Star className="h-3 w-3" />
                      Best Seller
                    </span>
                  ) : null}
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#5d4735]">
                    Traditional
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col space-y-5 p-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-balance font-heading text-[2rem] font-semibold leading-tight text-[#241612]">
                    {product.name}
                  </h3>
                  <p className="mt-3 max-w-[28ch] text-sm leading-7 text-[#685448]">
                    {product.description}
                  </p>
                </div>

                <div className="border-t border-[#efe4da] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8b1e1e]">
                    Starting at
                  </p>
                  <p className="mt-2 font-heading text-3xl font-semibold text-[#8b1e1e]">
                    {formatCurrency(product.price_per_kg)}
                  </p>
                  <p className="mt-1 text-sm text-[#7a6655]">per kg</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <PrimaryButton to={`/products/${product.category}`} className="w-full sm:w-auto">
                    Explore
                  </PrimaryButton>
                  <PrimaryButton
                    href={prefilledWhatsapp}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    icon={<MessageCircle className="h-4 w-4 text-[#8b1e1e]" />}
                  >
                    WhatsApp
                  </PrimaryButton>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProductCarousel;
