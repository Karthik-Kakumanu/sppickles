import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, CheckCircle, ShieldCheck, PackageCheck, Truck, Clock3 } from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";

const pageWrap = "mx-auto w-full max-w-[1500px] px-5 lg:px-8 xl:px-10";

const desktopHighlights = [
  {
    icon: ShieldCheck,
    label: "Protected Access",
    value: "Backend-authenticated admin entry only",
  },
  {
    icon: PackageCheck,
    label: "Inventory Control",
    value: "Track stock, products, and live catalog availability",
  },
  {
    icon: Truck,
    label: "Order Operations",
    value: "Handle fulfillment flow, shipping progress, and dispatch review",
  },
  {
    icon: Clock3,
    label: "Realtime Workflow",
    value: "Move between pending, processing, and delivered states faster",
  },
];

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
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8f3e8_0%,#efe5d2_52%,#f5efe2_100%)] px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="theme-card mx-auto max-w-xl rounded-[2rem] border border-[#d9d2c2] p-8 shadow-[0_30px_80px_rgba(23,51,36,0.15)]"
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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8f3e8_0%,#efe5d2_52%,#f5efe2_100%)] py-8 text-[#173324]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,122,67,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(226,185,59,0.16),transparent_26%)]" />
        <div className="absolute left-[6%] top-[14%] h-72 w-72 rounded-full bg-[#2f7a43]/8 blur-3xl" />
        <div className="absolute bottom-[8%] right-[8%] h-80 w-80 rounded-full bg-[#e2b93b]/10 blur-3xl" />
      </div>
      <Seo
        title="SP Traditional Pickles | Admin Login"
        description="Admin login for SP Traditional Pickles stock management."
      />

      <section className={`${pageWrap} relative z-10 flex min-h-[calc(100vh-4rem)] items-center`}>
        <div className="grid w-full items-stretch gap-8 xl:grid-cols-[minmax(0,1.28fr)_500px]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2.5rem] border border-[#d9d2c2] bg-[linear-gradient(145deg,rgba(17,39,27,0.98),rgba(24,58,42,0.94))] p-8 text-white shadow-[0_35px_120px_rgba(23,51,36,0.28)] lg:p-10 xl:p-12"
          >
            <div className="absolute right-[-8%] top-[-10%] h-64 w-64 rounded-full bg-[#e2b93b]/16 blur-3xl" />
            <div className="absolute bottom-[-12%] left-[-8%] h-72 w-72 rounded-full bg-[#2f7a43]/28 blur-3xl" />

            <div className="relative grid h-full gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex flex-col justify-between gap-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#f6e7b0]">
                    Desktop Admin Console
                  </div>

                  <div className="space-y-4">
                    <p className="max-w-[20rem] text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                      SP Traditional Pickles
                    </p>
                    <h1 className="max-w-2xl font-heading text-5xl font-bold leading-[0.95] lg:text-6xl xl:text-7xl">
                      Built for full desktop control.
                    </h1>
                    <p className="max-w-2xl text-base leading-8 text-white/78 xl:text-lg">
                      This admin workspace is now framed like a proper desktop control room,
                      giving orders, stock, and day-to-day operations more breathing room on large screens.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {desktopHighlights.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6e7b0] text-[#173324] shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/68">
                          {label}
                        </p>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-white/80">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-[1.9rem] border border-[#e2b93b]/20 bg-[#f7f0df] p-6 text-[#173324] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2f7a43]">
                    Operations Snapshot
                  </p>
                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl border border-[#d8cfbf] bg-white/80 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d6a63]">
                        Session Security
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#173324]">5 failed attempts</p>
                      <p className="mt-2 text-sm leading-6 text-[#5d5a54]">
                        Rate limiting is active before access is restricted.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#d8cfbf] bg-white/80 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d6a63]">
                        Admin Workflow
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#173324]">Orders + stock</p>
                      <p className="mt-2 text-sm leading-6 text-[#5d5a54]">
                        Review customer orders and product availability from the same admin space.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="rounded-[1.5rem] border border-white/10 bg-white/8 px-5 py-4 text-sm leading-7 text-white/75">
                  Use the desktop panel on the right to sign in with your configured admin credentials.
                  The layout is intentionally stretched and balanced for laptop and monitor-sized screens.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            className="premium-panel h-full bg-white/96 backdrop-blur-md xl:ml-auto xl:max-w-[500px]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="mb-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#2f7a43] to-[#e2b93b]" />
                <span className="text-theme-heading text-xs font-bold uppercase tracking-[0.22em]">
                  Secure Access
                </span>
              </div>
              <h2 className="font-heading text-4xl font-bold leading-tight text-theme-heading md:text-5xl">
                Admin Login
              </h2>
              <p className="mt-4 text-base leading-relaxed text-theme-body">
                Sign in to manage products, orders, and fulfillment with the desktop admin panel.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="mb-8 flex items-start gap-3 rounded-2xl border border-[#d8e5d8] bg-gradient-to-r from-[#edf5ee]/60 to-[#fff3c9]/40 px-4 py-3.5"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2f7a43]" />
              <p className="text-sm leading-relaxed text-theme-body">
                Credentials are securely managed and never exposed in frontend code.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.33 }}
              >
                <label className="mb-2.5 block">
                  <span className="flex items-center gap-2 text-sm font-semibold text-theme-heading">
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
                  className="theme-input w-full rounded-2xl border-2 border-[#d8e5d8] px-4 py-4 transition-all duration-200 focus:border-[#2f7a43] focus:ring-4 focus:ring-[#2f7a43]/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <label className="mb-2.5 block">
                  <span className="flex items-center gap-2 text-sm font-semibold text-theme-heading">
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
                  className="theme-input w-full rounded-2xl border-2 border-[#d8e5d8] px-4 py-4 transition-all duration-200 focus:border-[#2f7a43] focus:ring-4 focus:ring-[#2f7a43]/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </motion.div>

              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-2xl border-2 border-[#d01515]/30 bg-[#fff0f0] px-4 py-3.5"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#d01515]" />
                  <div>
                    <p className="mb-1 text-sm font-semibold text-[#9a1111]">Login Failed</p>
                    <p className="text-sm text-[#c73333]">{error}</p>
                  </div>
                </motion.div>
              ) : null}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                type="submit"
                disabled={isSubmitting || !email || !password}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f7a43] to-[#246637] px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Access Admin Dashboard
                    <Lock className="h-4 w-4" />
                  </>
                )}
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.52 }}
                className="text-center text-xs leading-relaxed text-theme-body"
              >
                Having trouble logging in? Check that you're using the correct credentials.
                <br />
                For security, accounts are rate-limited after 5 failed attempts.
              </motion.p>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
