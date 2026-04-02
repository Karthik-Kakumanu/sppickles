import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { faqItems } from "@/data/site";

const FaqSection = () => {
  return (
    <SectionWrapper
      className="relative overflow-hidden border-b border-[#3D7A52] bg-[#1A3A2A]"
      contentClassName="space-y-12"
    >
      <SectionTitle
        eyebrow="FAQ"
        title="Clear answers that remove hesitation"
        subtitle="A small FAQ helps customers understand quality, delivery, and the ordering process without adding clutter."
        align="center"
        className="mx-auto max-w-4xl"
        subtitleClassName="mx-auto max-w-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
        className="theme-card mx-auto mt-12 max-w-4xl rounded-2xl border px-6 py-4 shadow-md md:px-8"
      >
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="border-mint/12"
            >
              <AccordionTrigger className="text-theme-heading py-5 text-left font-heading text-2xl font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-theme-body pb-6 text-base leading-8">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </SectionWrapper>
  );
};

export default FaqSection;
