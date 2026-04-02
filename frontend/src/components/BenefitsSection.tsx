import { motion } from "framer-motion";
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
    <section className="relative w-full overflow-hidden bg-[var(--color-bg-primary)] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 banana-leaf-bg opacity-20" />
      <div className="px-6 md:px-10 lg:px-16 xl:px-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="theme-card group rounded-[1.7rem] border border-[#d8e5d8] border-t-4 border-t-[#E2B93B] p-6 shadow-[0_18px_38px_rgba(30,79,46,0.08)] transition hover:-translate-y-1 hover:bg-[#fdfcf8] hover:shadow-[0_24px_44px_rgba(30,79,46,0.12)]"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8e5d8] bg-[#EDF5EE] text-theme-heading transition group-hover:scale-105">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-theme-heading">
                {t.benefits[benefit.titleKey]}
              </h3>
              <p className="mt-2 text-sm text-theme-body">
                {t.benefits[benefit.descKey]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
