import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  PackageCheck,
  Truck,
  Clock3,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────────────────────────────
   Layout token — single source of truth for
   the outer page gutter / max-width constraint
───────────────────────────────────────────── */
const pageWrap = "mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-8";

/* ─────────────────────────────────────────────
   Feature cards shown in the left hero panel
───────────────────────────────────────────── */
const desktopHighlights = [
  {
    icon: ShieldCheck,
    label: "Zero-Exposure Auth",
    value:
      "Admin credentials are verified only on backend, never from browser storage.",
  },
  {
    icon: PackageCheck,
    label: "Unified Stock Grid",
    value:
      "Track product availability in one workspace without switching contexts.",
  },
  {
    icon: Truck,
    label: "Order Fulfillment Flow",
    value:
      "Process pending to delivered updates from a single operations timeline.",
  },
  {
    icon: Clock3,
    label: "Session Guardrails",
    value:
      "Rate limits and lockout windows reduce repeated unauthorized attempts.",
  },
];

/* ─────────────────────────────────────────────
   Stagger config — used by the hero feature
   cards to cascade in one by one
───────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.08, duration: 0.42, ease: "easeOut" },
  }),
};

/* ─────────────────────────────────────────────
   Reusable labelled form field with icon slot.
   Isolating this keeps the form JSX clean.
───────────────────────────────────────────── */
interface FieldProps {
  id: string;
  label: string;
  icon: React.ElementType;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled: boolean;
}

const Field = ({
  id,
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  disabled,
}: FieldProps) => (
  <div className="group/field space-y-2">
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#173324]/70 transition-colors group-focus-within/field:text-[#2f7a43]"
    >
      {/* Icon inherits label colour via currentColor */}
      <Icon className="h-3.5 w-3.5" />
      {label}
    </label>

    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        spellCheck={false}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          /* Base layout */
          "h-[52px] w-full rounded-xl px-4 text-[15px] text-[#173324]",
          /* Border — thickens & colours on focus via outline trick */
          "border border-[#cdd9cc] bg-white/80 outline-none",
          "ring-0 transition-all duration-200",
          "placeholder:text-[#9aab98]",
          /* Focus ring matches brand green */
          "focus:border-[#2f7a43] focus:ring-[3px] focus:ring-[#2f7a43]/12",
          /* Hover border lift */
          "hover:border-[#2f7a43]/50",
          /* Disabled state */
          "disabled:cursor-not-allowed disabled:opacity-55",
        ].join(" ")}
      />
      {/* Subtle animated bottom-border accent on focus */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-b-xl bg-gradient-to-r from-[#2f7a43] to-[#4a9e5c] transition-transform duration-300 group-focus-within/field:scale-x-100"
      />
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════ */
const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdminAuthenticated, isAdminReady, loginAdmin } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Loading skeleton while auth state resolves ── */
  if (!isAdminReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#f8f3e8_0%,#efe5d2_55%,#f7f1e5_100%)] px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex max-w-sm items-center gap-4 rounded-2xl border border-[#d9d2c2] bg-white/70 px-7 py-5 shadow-[0_20px_60px_rgba(23,51,36,0.1)] backdrop-blur-sm"
        >
          {/* Three-dot pulse */}
          {[0, 0.18, 0.36].map((delay, i) => (
            <div
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-[#2f7a43]"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
          <p className="text-[13px] font-semibold tracking-wide text-[#173324]/70">
            Preparing secure session…
          </p>
        </motion.div>
      </main>
    );
  }

  if (isAdminReady && isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  /* ── Form submit ── */
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

  const canSubmit = !isSubmitting && Boolean(email) && Boolean(password);

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8f3e8_0%,#efe5d2_48%,#f6efe2_100%)] py-5 text-[#173324] lg:py-8">
      <Seo
        title="SP Traditional Pickles | Admin Login"
        description="Premium desktop admin login for SP Traditional Pickles operations."
        noIndex
      />

      {/* ── Ambient background layer ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Fine grid */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,51,36,0.025)_1px,transparent_1px),linear-gradient(0deg,rgba(23,51,36,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
        {/* Soft glow blobs */}
        <div className="absolute left-[8%] top-[10%] h-80 w-80 rounded-full bg-[#2f7a43]/10 blur-[80px]" />
        <div className="absolute bottom-[6%] right-[10%] h-96 w-96 rounded-full bg-[#e2b93b]/10 blur-[90px]" />
        {/* Extra warm midtone splash */}
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7c844]/6 blur-[70px]" />
      </div>

      <section
        className={`${pageWrap} relative z-10 flex min-h-[calc(100vh-2.5rem)] items-center`}
      >
        <div className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_480px] xl:gap-7 2xl:grid-cols-[minmax(0,1fr)_520px]">

          {/* ══════════════════════════════
              LEFT — Hero / brand panel
          ══════════════════════════════ */}
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="admin-login-hero relative overflow-hidden rounded-[2.2rem] border border-white/8 bg-[linear-gradient(130deg,#0d2b1d_0%,#143f2d_50%,#1a5239_100%)] p-7 text-white shadow-[0_40px_120px_rgba(13,43,29,0.38),0_0_0_1px_rgba(255,255,255,0.06)_inset] lg:min-h-[800px] lg:p-9 xl:p-11"
          >
            {/* Inner glow blobs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#e2b93b]/14 blur-[70px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[#2f7a43]/22 blur-[80px]"
            />
            {/* Diagonal shimmer stripe */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_50%)]"
            />

            <div className="relative flex h-full flex-col justify-between gap-10">

              {/* ── Brand header ── */}
              <div className="space-y-6">
                {/* Pill badge */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f6e7b0] backdrop-blur-sm"
                >
                  <Sparkles className="h-3 w-3" />
                  Desktop Operations Suite
                </motion.div>

                {/* Eyebrow + headline + sub */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.36em] text-white/50">
                    SP Traditional Pickles — Control Desk
                  </p>

                  <h1 className="font-heading text-[2.75rem] font-bold leading-[0.95] tracking-[-0.02em] md:text-[3.25rem] xl:text-[3.75rem]">
                    Premium admin&nbsp;workspace for serious daily operations.
                  </h1>

                  <p className="max-w-2xl text-[15px] leading-[1.75] text-white/68 xl:text-base">
                    Built for desktop consistency — a stable, premium command area across laptop and monitor resolutions.
                  </p>
                </div>
              </div>

              {/* ── Feature cards grid ── */}
              <div className="grid gap-3 md:grid-cols-2">
                {desktopHighlights.map(({ icon: Icon, label, value }, i) => (
                  <motion.div
                    key={label}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    /* Lift on hover — subtle depth cue */
                    whileHover={{ y: -2, transition: { duration: 0.18 } }}
                    className="group rounded-[1.4rem] border border-white/10 bg-white/7 p-4 backdrop-blur-sm transition-colors duration-200 hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon chip */}
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[0.65rem] bg-[#f6e7b0] text-[#173324] shadow-[0_4px_12px_rgba(230,183,43,0.25)] transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        {label}
                      </p>
                    </div>
                    <p className="mt-3 text-[13px] leading-[1.7] text-white/75">{value}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Policy info row ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.45 }}
                className="grid gap-3 rounded-[1.4rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm md:grid-cols-2"
              >
                {[
                  {
                    accent: "Session Policy",
                    title: "5 failed attempts",
                    body: "Automatic rate-limiting before temporary lockout.",
                  },
                  {
                    accent: "Desktop Baseline",
                    title: "Same visual grid",
                    body: "Balanced spacing tuned for widescreen and standard desktops.",
                  },
                ].map(({ accent, title, body }) => (
                  <div
                    key={accent}
                    className="rounded-xl border border-white/8 bg-[#f6e7b0]/8 p-4"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f7e6a3]">
                      {accent}
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-white">{title}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.65] text-white/68">{body}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.article>

          {/* ══════════════════════════════
              RIGHT — Login form panel
          ══════════════════════════════ */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="relative flex flex-col rounded-[2rem] border border-[#d6cebc] bg-[linear-gradient(170deg,#fffdf7_0%,#f5ede0_100%)] p-7 shadow-[0_32px_80px_rgba(29,61,44,0.14),0_0_0_1px_rgba(255,255,255,0.7)_inset] lg:min-h-[800px] lg:p-9"
          >
            {/* Top accent bar — gradient stripe */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[3px] rounded-t-[2rem] bg-gradient-to-r from-[#2f7a43] via-[#c9a83b] to-[#2f7a43]"
            />
            {/* Soft inner shine */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-36 rounded-t-[2rem] bg-gradient-to-b from-white/50 to-transparent"
            />

            <div className="relative flex flex-1 flex-col justify-between">

              {/* ── Panel header ── */}
              <div className="mb-8 mt-1 space-y-4">
                {/* Secure-entry badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8e0c8] bg-[#edf5ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2f7a43]">
                  <ShieldCheck className="h-3 w-3" />
                  Secure Entry
                </span>

                <div>
                  <h2 className="font-heading text-[2.25rem] font-bold leading-[1.05] tracking-[-0.02em] text-[#173324]">
                    Admin Login
                  </h2>
                  <p className="mt-2.5 text-[14.5px] leading-[1.75] text-[#3d5247]/80">
                    Access products, stock, and order workflows through a refined desktop-first admin panel.
                  </p>
                </div>

                {/* Trust badge */}
                <div className="flex items-start gap-3 rounded-xl border border-[#d0e4d0] bg-gradient-to-r from-[#edf5ee] to-[#fdf8e8] px-4 py-3">
                  <CheckCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[#2f7a43]" />
                  <p className="text-[13px] leading-[1.65] text-[#3d5247]/80">
                    Session token is issued securely and protected with backend validation rules.
                  </p>
                </div>
              </div>

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">

                <Field
                  id="email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  inputMode="email"
                  disabled={isSubmitting}
                />

                <Field
                  id="password"
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />

                {/* ── Error banner — animated in/out ── */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-start gap-3 rounded-xl border border-[#d01515]/30 bg-[#fff3f3] px-4 py-3 shadow-[0_2px_12px_rgba(208,21,21,0.06)]"
                    >
                      <AlertCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-[#cc1414]" />
                      <div>
                        <p className="text-[13px] font-semibold text-[#8f1010]">Login failed</p>
                        <p className="text-[13px] text-[#b52828]">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Submit button ── */}
                <div className="mt-auto pt-1">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={[
                      /* Layout */
                      "group relative inline-flex h-[52px] w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-5",
                      "text-[14.5px] font-semibold text-white",
                      /* Background — gradient that shifts on hover */
                      "bg-gradient-to-r from-[#2f7a43] to-[#215c31]",
                      "shadow-[0_12px_32px_rgba(38,99,56,0.28),0_0_0_1px_rgba(255,255,255,0.08)_inset]",
                      /* Transitions */
                      "transition-all duration-200",
                      "hover:shadow-[0_16px_40px_rgba(38,99,56,0.38)]",
                      "hover:brightness-110",
                      "active:scale-[0.99]",
                      /* Disabled */
                      "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:brightness-100",
                    ].join(" ")}
                  >
                    {/* Shimmer sweep on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    />

                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-[2px] border-white border-t-transparent" />
                        <span>Logging in…</span>
                      </>
                    ) : (
                      <>
                        <span>Access Admin Dashboard</span>
                        {/* Arrow nudges right on hover */}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  {/* Helper text */}
                  <p className="mt-4 text-center text-[12px] leading-[1.7] text-[#6b7f72]">
                    Use your configured admin credentials.
                    <br />
                    Security lockout activates after&nbsp;
                    <span className="font-semibold text-[#173324]/70">5 failed attempts</span>.
                  </p>
                </div>
              </form>
            </div>
          </motion.aside>

        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;