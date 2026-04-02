import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { testimonials } from "@/data/site";

const TestimonialsSection = () => {
  return (
    <SectionWrapper
      className="relative overflow-hidden border-b border-[#eadfd5] bg-[radial-gradient(circle_at_top_left,rgba(139,30,30,0.08),transparent_18%),linear-gradient(180deg,#fffdf9_0%,#fff7ef_100%)]"
      containerClassName="w-full px-6 md:px-12 lg:px-20"
    >
      <SectionTitle
        eyebrow="Testimonials"
        title="Customers should feel the trust before they place the next order"
        subtitle="Real feedback helps reinforce quality, authenticity, and the confidence to order immediately."
        align="center"
        className="mx-auto max-w-4xl"
        subtitleClassName="mx-auto max-w-3xl"
      />

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="theme-card rounded-2xl border p-6 shadow-md backdrop-blur-sm"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-south-red/10 text-south-red">
              <Quote className="h-5 w-5" />
            </span>
            <p className="text-theme-body mt-5 text-sm leading-8">"{testimonial.review}"</p>
            <p className="text-theme-heading mt-6 font-heading text-2xl font-semibold">
              {testimonial.name}
            </p>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
