import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type ContactFormProps = {
  className?: string;
};

const ContactForm = ({ className = "" }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitted(true);
      setIsLoading(false);

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  };

  if (isSubmitted) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn("", className)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[#3D7A52] bg-[#2E5C3E] p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 w-fit"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <h3 className="mb-2 font-heading text-xl font-semibold text-theme-heading">
            Message Sent!
          </h3>
          <p className="text-theme-body">
            Thank you for reaching out. We'll get back to you soon!
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={cn("", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="mb-2 block text-sm font-semibold text-theme-body">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg border border-[#3D7A52] bg-[#2E5C3E] px-4 py-3 text-sm font-body text-theme-contrast outline-none transition-all",
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-[#3D7A52] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10"
              )}
              placeholder="Your name"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-600 font-medium"
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="mb-2 block text-sm font-semibold text-theme-body">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg border border-[#3D7A52] bg-[#2E5C3E] px-4 py-3 text-sm font-body text-theme-contrast outline-none transition-all",
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-[#3D7A52] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10"
              )}
              placeholder="your@email.com"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-600 font-medium"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Phone */}
          <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="mb-2 block text-sm font-semibold text-theme-body">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg border border-[#3D7A52] bg-[#2E5C3E] px-4 py-3 text-sm font-body text-theme-contrast outline-none transition-all",
                errors.phone
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-[#3D7A52] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10"
              )}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-600 font-medium"
              >
                {errors.phone}
              </motion.p>
            )}
          </motion.div>

          {/* Subject */}
          <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
            <label className="mb-2 block text-sm font-semibold text-theme-body">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg border border-[#3D7A52] bg-[#2E5C3E] px-4 py-3 text-sm font-body text-theme-contrast outline-none transition-all",
                errors.subject
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-[#3D7A52] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10"
              )}
              placeholder="How can we help?"
            />
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-600 font-medium"
              >
                {errors.subject}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Message */}
        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
          <label className="mb-2 block text-sm font-semibold text-theme-body">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isLoading}
            rows={5}
            className={cn(
              "w-full resize-none rounded-lg border border-[#3D7A52] bg-[#2E5C3E] px-4 py-3 text-sm font-body text-theme-contrast outline-none transition-all",
              errors.message
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-[#3D7A52] focus:border-[#8B0000] focus:ring-2 focus:ring-[#8B0000]/10"
            )}
            placeholder="Your message..."
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-xs text-red-600 font-medium"
            >
              {errors.message}
            </motion.p>
          )}
        </motion.div>

        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-south-red/40 bg-[#2E5C3E] p-3"
          >
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{submitError}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          custom={5}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full rounded-lg bg-[#8B0000] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#720000] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-[#A3D9B1]/30 border-t-[#F5C518]"
              />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
