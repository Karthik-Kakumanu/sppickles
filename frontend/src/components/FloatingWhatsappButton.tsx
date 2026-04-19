import { motion } from "framer-motion";
import { brand } from "@/data/site";
import WhatsAppLogo from "@/components/WhatsAppLogo";

const FloatingWhatsappButton = () => {
  return (
    <motion.a
      href={brand.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp ${brand.whatsappDisplay}`}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.35 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="fixed bottom-5 right-4 z-[70] md:bottom-8 md:right-8"
    >
      <div className="animate-whatsapp-pulse inline-flex items-center gap-3 rounded-full border border-[#cfe0cf] bg-white px-4 py-3 shadow-[0_20px_46px_rgba(30,79,46,0.18)]">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2f7a43] !text-white shadow-[0_14px_28px_rgba(47,122,67,0.24)]">
          <WhatsAppLogo className="h-[22px] w-[22px]" />
        </div>
        <div className="hidden text-left md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f7a43]">
            WhatsApp Orders
          </p>
          <p className="text-sm font-bold text-theme-heading">{brand.whatsappDisplay}</p>
        </div>
      </div>
    </motion.a>
  );
};

export default FloatingWhatsappButton;
