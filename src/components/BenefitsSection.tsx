import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/content/translations";
import {
  Leaf,
  Leaf as LeafIcon,
  Package,
  Shield,
  Truck,
} from "lucide-react";

const BenefitsSection = () => {
  const { language } = useLanguage();
  const t = content[language];

  const benefits = [
    {
      icon: <Leaf className="h-8 w-8" />,
      titleKey: "noOnion" as const,
      descKey: "noOnionDesc" as const,
    },
    {
      icon: <LeafIcon className="h-8 w-8" />,
      titleKey: "noGarlic" as const,
      descKey: "noGarlicDesc" as const,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      titleKey: "noPreservatives" as const,
      descKey: "noPreservativesDesc" as const,
    },
    {
      icon: <Package className="h-8 w-8" />,
      titleKey: "homemade" as const,
      descKey: "homemadeDesc" as const,
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      titleKey: "noPalmOil" as const,
      descKey: "noPalmOilDesc" as const,
    },
    {
      icon: <Truck className="h-8 w-8" />,
      titleKey: "freeShipping" as const,
      descKey: "freeShippingDesc" as const,
    },
    {
      icon: <Package className="h-8 w-8" />,
      titleKey: "securePackage" as const,
      descKey: "securePackageDesc" as const,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      titleKey: "securePayments" as const,
      descKey: "securePaymentsDesc" as const,
    },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-[#fff8f3] to-[#fffaf4] py-16 md:py-20">
      <div className="px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-[#eadfd5] bg-white p-6 shadow-sm transition hover:shadow-md hover:border-[#d9ccc2]"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff8f3] text-[#8b1e1e] transition group-hover:bg-[#ffeee9]">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-[#241612]">
                {t.benefits[benefit.titleKey]}
              </h3>
              <p className="mt-2 text-sm text-[#685448]">
                {t.benefits[benefit.descKey]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
