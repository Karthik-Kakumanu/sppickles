import { type ReactNode } from "react";
import { Droplet, Flame, Heart, Leaf } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";

interface PurityPoint {
  icon: ReactNode;
  title: string;
  description: string;
}

const purityPoints: PurityPoint[] = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: "No Onion",
    description: "Pure satvik preparation following traditional Brahmin recipes.",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "No Garlic",
    description: "Light, clean flavours that stay closer to traditional home cooking.",
  },
  {
    icon: <Droplet className="h-8 w-8" />,
    title: "No Preservatives",
    description: "Only natural ingredients - nothing artificial, nothing added.",
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: "Small Batch",
    description: "Handmade in smaller batches so freshness and flavour stay more intentional.",
  },
];

const PurityPromise = () => {
  return (
    <SectionWrapper
      className="relative overflow-hidden border-b border-[#3D7A52] bg-[#1A3A2A]"
      containerClassName="w-full px-6 md:px-12 lg:px-20"
      contentClassName="space-y-12"
    >
      <div className="pointer-events-none absolute inset-0 banana-leaf-bg opacity-60" />

      <SectionTitle
        eyebrow="Kitchen Promise"
        title="Pure satvik food, prepared with discipline and tradition"
        subtitle="This section explains why the flavour feels clean, calm, and trustworthy before a customer even reaches the product grid."
        align="center"
        className="mx-auto max-w-4xl"
        subtitleClassName="mx-auto max-w-3xl"
      />

      <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {purityPoints.map((point, index) => (
          <div
            key={point.title}
            className="theme-card group section-reveal rounded-2xl p-8 shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-theme-heading transition-colors group-hover:bg-gold group-hover:text-theme-on-accent">
              {point.icon}
            </div>
            <h3 className="text-theme-heading font-heading text-xl font-semibold">{point.title}</h3>
            <p className="text-theme-body mt-3 text-sm leading-7">{point.description}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-8 rounded-[2rem] border border-[#3D7A52] bg-[#2E5C3E] px-8 py-8 text-center">
        <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.2em]">
          The Difference You Can Taste
        </p>
        <p className="text-theme-strong mt-4 text-lg leading-8">
          Every pickle is made with intention. Every ingredient matters. Every batch reflects a kitchen standard built around satvik preparation and authentic Andhra depth.
        </p>
      </div>
    </SectionWrapper>
  );
};

export default PurityPromise;
