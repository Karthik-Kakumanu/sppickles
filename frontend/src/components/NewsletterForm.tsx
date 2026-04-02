import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type NewsletterFormProps = {
  className?: string;
  variant?: "default" | "inline" | "dialog";
};

const NewsletterForm = ({
  className = "",
  variant = "default",
}: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(true);
      setIsLoading(false);

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const inputContainerClasses = {
    default: "max-w-md",
    inline: "w-full",
    dialog: "w-full",
  };

  const formClasses = {
    default: "flex flex-col gap-3",
    inline: "flex gap-2 sm:gap-3",
    dialog: "flex flex-col gap-3",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={cn("", className)}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className={formClasses[variant]}>
          <div className="relative flex-1">
            <div className="relative flex items-center rounded-full border border-[#3D7A52] bg-[#2E5C3E] shadow-sm transition-shadow duration-300 hover:shadow-md">
              <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-theme-heading" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Your email address"
                className="w-full bg-transparent py-3 pl-11 pr-4 text-sm font-body text-theme-contrast placeholder:text-theme-body-soft outline-none"
                disabled={isLoading}
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-red-600 font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="rounded-full bg-[#8B0000] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#720000] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-[#A3D9B1]/30 border-t-[#F5C518]"
                />
                Subscribing...
              </span>
            ) : (
              "Subscribe"
            )}
          </motion.button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 rounded-full border border-[#3D7A52] bg-[#2E5C3E] px-5 py-3"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-5 w-5 text-green-600" />
          </motion.div>
          <p className="text-sm font-semibold text-theme-body">
            Thanks for subscribing! Check your email.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsletterForm;
