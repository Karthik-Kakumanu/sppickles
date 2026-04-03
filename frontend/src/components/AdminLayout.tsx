/**
 * Admin Layout Component
 * Sidebar + Header layout for admin pages
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Package2, ShoppingCart, X } from "lucide-react";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package2 },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] text-[#173324]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-[#315540] bg-[linear-gradient(180deg,#173324_0%,#1d3f2d_52%,#10261b_100%)] text-theme-contrast shadow-[0_24px_80px_rgba(23,51,36,0.35)] transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-7 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f6e7b0]">
              Desktop Admin
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white">SP Pickles</h1>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Orders, products, and operations in one desktop workspace.
            </p>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3.5 transition hover:border-white/8 hover:bg-white/8 active:bg-white/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-[#f6e7b0]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-4 py-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-white/76 transition hover:bg-white/8 hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-[#f6e7b0]">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-[#d9d2c2] bg-[#faf6ed]/92 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8 xl:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl border border-[#d9d2c2] bg-white/70 p-2 text-theme-body transition hover:border-[#c9b995] hover:bg-[#fff8e8] hover:text-theme-heading md:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#756f61]">
                  Admin Workspace
                </p>
                <h2 className="mt-1 text-2xl font-bold text-theme-heading">{title}</h2>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d9d2c2] bg-white/72 px-4 py-2 text-sm font-semibold text-theme-body transition hover:border-[#c9b995] hover:bg-[#fff8e8] hover:text-theme-heading"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden rounded-full border border-[#d9d2c2] bg-white/72 px-4 py-2 text-sm font-semibold text-theme-body lg:block">
                Desktop mode
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2f7a43] to-[#1e5a31] font-bold text-white shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1600px] p-6 lg:p-8 xl:p-10">{children}</div>
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
