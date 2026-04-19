import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";
import { brand } from "@/data/site";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdminAuthenticated, isAdminReady, loginAdmin } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-16">
        <p className="text-sm font-semibold text-[#1e4f2e]">Preparing login...</p>
      </main>
    );
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await loginAdmin(email, password);

    if (!result.ok) {
      const message = result.error ?? "Unable to login.";
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-4 py-10 sm:px-6">
      <Seo
        title="SP Traditional Pickles | Admin Login"
        description="Admin login page for SP Traditional Pickles"
        noIndex
      />

      <section className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-[1.8rem] border border-[#d8e5d8] bg-white p-7 shadow-[0_20px_40px_rgba(30,79,46,0.08)] sm:p-8">
          <div className="mb-7 text-center">
            <img
              src={brand.logo}
              alt={brand.name}
              className="mx-auto h-16 w-16 rounded-full object-contain"
            />
            <h1 className="mt-4 font-heading text-3xl font-semibold text-theme-heading">Admin Login</h1>
            <p className="mt-2 text-sm text-theme-body">Your login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="block space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-theme-body-soft">
                <Lock className="h-3.5 w-3.5" />
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 pr-12 text-sm text-theme-heading outline-none transition focus:border-[#2f7a43] focus:ring-2 focus:ring-[#2f7a43]/15 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-theme-body-soft transition hover:bg-[#edf5ee] hover:text-theme-heading"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link
                to="/admin/forgot-password"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2f7a43] transition hover:text-[#28683a]"
              >
                Forgot password?
              </Link>
            </div>

            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-[#d9644c]/30 bg-[#fff4f1] px-3 py-3 text-sm text-[#b84c39]">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f7a43] px-5 text-sm font-semibold !text-white shadow-[0_16px_32px_rgba(47,122,67,0.22)] transition hover:bg-[#28683a] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
            >
              {isSubmitting ? "Logging in..." : "Login"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;