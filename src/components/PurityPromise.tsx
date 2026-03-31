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
      className="relative overflow-hidden border-b border-[#eadfd5] bg-[radial-gradient(circle_at_top_left,rgba(139,30,30,0.08),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(49,91,69,0.05),transparent_20%),linear-gradient(180deg,#fffaf4_0%,#fff7ef_100%)]"
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
            className="group section-reveal rounded-2xl bg-white/94 p-8 shadow-md ring-1 ring-[#eadfd5] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff5f3] text-[#8b1e1e] transition-colors group-hover:bg-[#8b1e1e] group-hover:text-white">
              {point.icon}
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#241612]">{point.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#685448]">{point.description}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-8 rounded-[2rem] bg-gradient-to-r from-[#8b1e1e]/8 to-[#315b45]/8 px-8 py-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b1e1e]">
          The Difference You Can Taste
        </p>
        <p className="mt-4 text-lg leading-8 text-[#241612]">
          Every pickle is made with intention. Every ingredient matters. Every batch reflects a kitchen standard built around satvik preparation and authentic Andhra depth.
        </p>
      </div>
    </SectionWrapper>
  );
};

export default PurityPromise;
