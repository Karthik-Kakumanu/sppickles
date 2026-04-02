import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";

const pageWrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdminAuthenticated, isAdminReady, loginAdmin } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#173324] via-[#1a3a2a] to-[#10261b] flex items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="theme-card mx-auto max-w-lg rounded-[2rem] p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 justify-center">
            <div className="h-2 w-2 rounded-full bg-[#2f7a43] animate-bounce" />
            <p className="text-theme-body text-sm font-semibold">Checking admin session...</p>
            <div className="h-2 w-2 rounded-full bg-[#2f7a43] animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </motion.div>
      </main>
    );
  }

  if (isAdminReady && isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await loginAdmin(email, password);

    if (!result.ok) {
      setError(result.error ?? "Unable to login.");
      toast({
        title: "Login failed",
        description: result.error ?? "Unable to login.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#173324] via-[#1a3a2a] to-[#10261b] py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-[#2f7a43]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-[#e2b93b]/10 rounded-full blur-3xl" />
      </div>

      <Seo
        title="SP Traditional Pickles | Admin Login"
        description="Admin login for SP Traditional Pickles stock management."
      />

      <section className={pageWrap}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-xl relative z-10"
        >
          {/* Card */}
          <div className="premium-panel bg-white/98 backdrop-blur-sm">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-[#2f7a43] to-[#e2b93b] rounded-full" />
                <span className="text-theme-heading text-xs font-bold uppercase tracking-[0.2em]">
                  Secure Access
                </span>
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-theme-heading leading-tight">
                Admin Login
              </h1>
              <p className="text-theme-body mt-4 text-base leading-relaxed">
                Use your backend-configured admin credentials to manage orders and inventory.
              </p>
            </motion.div>

            {/* Info Alert */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-[#edf5ee]/50 to-[#fff3c9]/30 border border-[#d8e5d8] rounded-2xl px-4 py-3.5 mb-8 flex items-start gap-3"
            >
              <CheckCircle className="h-5 w-5 text-[#2f7a43] flex-shrink-0 mt-0.5" />
              <p className="text-theme-body text-sm leading-relaxed">
                Credentials are securely managed and never exposed in frontend code.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block mb-2.5">
                  <span className="text-theme-heading text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#2f7a43]" />
                    Email Address
                  </span>
                </label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                  className="w-full theme-input rounded-2xl border-2 border-[#d8e5d8] px-4 py-3.5 transition-all duration-200 focus:border-[#2f7a43] focus:ring-4 focus:ring-[#2f7a43]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block mb-2.5">
                  <span className="text-theme-heading text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#2f7a43]" />
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className="w-full theme-input rounded-2xl border-2 border-[#d8e5d8] px-4 py-3.5 transition-all duration-200 focus:border-[#2f7a43] focus:ring-4 focus:ring-[#2f7a43]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </motion.div>

              {/* Error Message */}
              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border-2 border-[#d01515]/30 bg-[#fff0f0] px-4 py-3.5 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-[#d01515] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#9a1111] text-sm font-semibold mb-1">Login Failed</p>
                    <p className="text-[#c73333] text-sm">{error}</p>
                  </div>
                </motion.div>
              ) : null}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                type="submit"
                disabled={isSubmitting || !email || !password}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f7a43] to-[#246637] px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Access Admin Dashboard
                    <Lock className="h-4 w-4" />
                  </>
                )}
              </motion.button>

              {/* Help Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-theme-body text-xs leading-relaxed"
              >
                Having trouble logging in? Check that you're using the correct credentials.<br />
                For security, accounts are rate-limited after 5 failed attempts.
              </motion.p>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
