import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";

const pageWrap = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdminAuthenticated, isAdminReady, loginAdmin } = useStore();
  const [email, setEmail] = useState("admin@sppickles.in");
  const [password, setPassword] = useState("SPPickles@2026");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminReady) {
    return (
      <main className="py-16">
        <section className={pageWrap}>
          <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 shadow-md ring-1 ring-[#eadfce]">
            <p className="text-center text-sm font-semibold text-[#6b5643]">Checking admin session...</p>
          </div>
        </section>
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ed_55%,#fffaf4_100%)] py-20">
      <Seo
        title="SP Traditional Pickles | Admin Login"
        description="Admin login for SP Traditional Pickles stock management."
      />

      <section className={pageWrap}>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#eadfd5] bg-white p-8 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#8b1e1e]">
            Admin Access
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-[#241612] md:text-5xl">
            Stock management login
          </h1>
          <p className="mt-4 text-base leading-8 text-[#685448]">
            Use the admin credentials to manage only stock availability for the static storefront.
          </p>

          <div className="mt-6 rounded-2xl bg-[#fff8f3] px-5 py-4 text-sm leading-7 text-[#685448]">
            Demo credentials are prefilled for local development.
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#241612]">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 outline-none transition focus:border-[#8b1e1e]"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#241612]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-[#eadfd5] bg-[#fffaf6] px-4 py-3 outline-none transition focus:border-[#8b1e1e]"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-[#f0b7a5] bg-[#fff5f1] px-4 py-3 text-sm text-[#8b1e1e]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-[#8b1e1e] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#741616] disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
