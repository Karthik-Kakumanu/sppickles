/**
 * Admin Layout Component
 * Header layout for admin pages
 */
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useStore } from "@/components/StoreProvider";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
];

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logoutAdmin } = useStore();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] text-[#173324]">
      <main className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-[#d9d2c2] bg-[#faf6ed]/92 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-6 py-5 lg:px-8 xl:px-10">
            <div className="flex items-center gap-4">
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
    </div>
  );
}
