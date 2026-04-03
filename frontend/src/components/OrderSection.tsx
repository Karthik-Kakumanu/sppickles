import { motion } from "framer-motion";
import { MapPin, Phone, Truck, CreditCard } from "lucide-react";
import BilingualText from "@/components/BilingualText";

const OrderSection = () => {
  const whatsappUrl = "https://wa.me/917981370664?text=Hi%2C%20I%20would%20like%20to%20order%20pickles";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="order" className="py-16 md:py-24 bg-warm-brown text-ivory">
      <div className="container max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <BilingualText
            as="p"
            te="ఇప్పుడే ఆర్డర్ చేయండి"
            en="Order Now"
            className="mb-3 text-center text-turmeric"
            teluguClassName="font-body text-sm"
            englishClassName="font-heading text-sm uppercase tracking-[0.25em]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <BilingualText
            as="h2"
            te="అసలైన రుచిని ఇంటికి తీసుకెళ్లండి"
            en="Bring Home the Authentic Taste"
            className="mb-4 text-center"
            teluguClassName="font-heading text-2xl md:text-3xl font-bold"
            englishClassName="font-heading text-3xl md:text-4xl font-bold"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <BilingualText
            as="p"
            te="ఆర్డర్ వచ్చిన తర్వాతే తాజాగ తయారు చేస్తాం, ప్రేమగా పంపిస్తాం"
            en="Freshly prepared after order, made with love, delivered with care"
            className="mb-12 max-w-lg mx-auto text-center text-ivory/70"
            teluguClassName="font-body text-base"
            englishClassName="font-body"
          />
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {["250g", "500g", "1kg"].map((size, idx) => (
            <motion.div
              key={size}
              variants={itemVariants}
              whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="px-8 py-4 rounded-xl border border-ivory/20 bg-ivory/5 text-center transition-all duration-300 cursor-pointer"
            >
              <p className="font-heading text-2xl font-bold text-turmeric">{size}</p>
              <BilingualText
                as="p"
                te="లభ్యం"
                en="Available"
                className="text-ivory/60"
                teluguClassName="font-body text-xs"
                englishClassName="font-body text-sm"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-10 py-4 rounded-lg text-lg font-heading font-semibold hover:brightness-110 transition-all shadow-lg"
          >
            <motion.svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </motion.svg>
            <BilingualText
              as="span"
              te="వాట్సాప్‌లో ఆర్డర్ చేయండి"
              en="Order on WhatsApp"
              className="text-left"
              teluguClassName="font-body text-sm"
              englishClassName="font-heading text-base"
            />
          </motion.a>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <BilingualText
              as="p"
              te="మీ ఆర్డర్ కోసం మాతో నేరుగా చాట్ చేయండి"
              en="Chat with us directly to place your order"
              className="mt-3 text-ivory/50"
              teluguClassName="font-body text-xs"
              englishClassName="font-body text-sm"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="flex items-start gap-3 bg-ivory/5 rounded-xl p-4 border border-ivory/10 transition-all duration-300"
          >
            <Phone className="w-5 h-5 text-turmeric mt-0.5 shrink-0" />
            <div>
              <BilingualText
                as="p"
                te="వాట్సాప్ ఆర్డర్"
                en="WhatsApp Order"
                teluguClassName="font-heading text-xs font-semibold"
                englishClassName="font-heading text-sm font-semibold"
              />
              <p className="font-body text-xs text-ivory/60">7981370664</p>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="flex items-start gap-3 bg-ivory/5 rounded-xl p-4 border border-ivory/10 transition-all duration-300"
          >
            <MapPin className="w-5 h-5 text-turmeric mt-0.5 shrink-0" />
            <div>
              <BilingualText
                as="p"
                te="ప్రాంతం"
                en="Location"
                teluguClassName="font-heading text-xs font-semibold"
                englishClassName="font-heading text-sm font-semibold"
              />
              <BilingualText
                as="p"
                te="విజయవాడ, ఆంధ్రప్రదేశ్"
                en="Vijayawada, Andhra Pradesh"
                className="text-ivory/60"
                teluguClassName="font-body text-xs"
                englishClassName="font-body text-xs"
              />
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="flex items-start gap-3 bg-ivory/5 rounded-xl p-4 border border-ivory/10 transition-all duration-300"
          >
            <Truck className="w-5 h-5 text-turmeric mt-0.5 shrink-0" />
            <div>
              <BilingualText
                as="p"
                te="డెలివరీ"
                en="Shipping"
                teluguClassName="font-heading text-xs font-semibold"
                englishClassName="font-heading text-sm font-semibold"
              />
              <BilingualText
                as="p"
                te="భారతదేశం మొత్తం & అంతర్జాతీయంగా"
                en="All India & International"
                className="text-ivory/60"
                teluguClassName="font-body text-xs"
                englishClassName="font-body text-xs"
              />
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            className="flex items-start gap-3 bg-ivory/5 rounded-xl p-4 border border-ivory/10 transition-all duration-300"
          >
            <CreditCard className="w-5 h-5 text-turmeric mt-0.5 shrink-0" />
            <div>
              <BilingualText
                as="p"
                te="చెల్లింపు"
                en="Payment"
                teluguClassName="font-heading text-xs font-semibold"
                englishClassName="font-heading text-sm font-semibold"
              />
              <BilingualText
                as="p"
                te="బ్యాంక్ ట్రాన్స్‌ఫర్"
                en="Bank Transfer"
                className="text-ivory/60"
                teluguClassName="font-body text-xs"
                englishClassName="font-body text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
