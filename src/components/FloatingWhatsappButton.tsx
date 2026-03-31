import { motion } from "framer-motion";
import { brand } from "@/data/site";

const FloatingWhatsappButton = () => {
  return (
    <motion.a
      href={brand.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-0"
        />
        
        <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.25)] transition-all duration-300 hover:bg-[#20BA5A] hover:shadow-[0_24px_50px_rgba(37,211,102,0.35)] md:h-16 md:w-16 group cursor-pointer">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a5.407 5.407 0 0 0-5.41 5.409v.001c0 .992.24 1.961.697 2.82l-1.041 3.795 3.89-1.021c.82.454 1.74.714 2.71.714h.001a5.409 5.409 0 0 0 5.409-5.41 5.412 5.412 0 0 0-5.407-5.409M12 0C5.372 0 0 5.372 0 12c0 2.126.552 4.127 1.52 5.845L.51 23.489l6.289-1.562C8.885 23.432 10.418 24 12 24c6.628 0 12-5.372 12-12S18.628 0 12 0" />
            </svg>
          </motion.div>
        </div>

        {/* Subtle pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#25D366]"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.a>
  );
};

export default FloatingWhatsappButton;
