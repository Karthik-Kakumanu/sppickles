import Seo from "@/components/Seo";
import { brand, siteMedia } from "@/data/site";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

const AboutPage = () => {
  return (
    <main className="bg-[#fffaf4] py-20">
      <Seo
        title="SP Traditional Pickles | About"
        description="Learn more about SP Traditional Pickles and our traditional homemade Andhra products."
      />

      <section className={`${pageWrap} grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]`}>
        <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-md ring-1 ring-[#eadfce]">
          <img
            src={siteMedia.storyKitchen}
            alt={brand.name}
            loading="lazy"
            className="h-[430px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div className="max-w-3xl space-y-5">
          <h1 className="font-heading text-4xl font-semibold text-[#241612] md:text-5xl">
            About SP Traditional Pickles
          </h1>
          <p className="text-base leading-8 text-[#6b5643]">
            SP Traditional Pickles is built around authentic Andhra flavours prepared in a
            Brahmin-style homemade approach. The focus stays on clean ingredients, careful
            preparation, and familiar traditional taste.
          </p>
          <p className="text-base leading-8 text-[#6b5643]">
            Every product is presented through a simple order flow so the website feels premium,
            clear, and easy to use without adding unnecessary steps or complexity.
          </p>

          <div className="grid gap-4 pt-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-[#eadfd5]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                Tradition
              </p>
              <p className="mt-3 text-sm leading-7 text-[#685448]">
                Rooted in homemade Andhra taste and family-style preparation.
              </p>
            </div>
            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-[#eadfd5]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2e6a34]">
                Clean Ingredients
              </p>
              <p className="mt-3 text-sm leading-7 text-[#685448]">
                No onion, no garlic, and no preservatives.
              </p>
            </div>
            <div className="rounded-2xl bg-white px-5 py-5 shadow-sm ring-1 ring-[#eadfd5]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8b1e1e]">
                Homemade
              </p>
              <p className="mt-3 text-sm leading-7 text-[#685448]">
                Small-batch products prepared with consistency and care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
