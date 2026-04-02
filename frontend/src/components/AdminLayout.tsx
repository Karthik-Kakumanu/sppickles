/**
 * Admin Layout Component
 * Sidebar + Header layout for admin pages
 */
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Orders", href: "/admin/orders", icon: "🛒" },
  ];

  return (
    <div className="flex min-h-screen bg-forest-dark">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-forest-dark text-theme-contrast transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="border-b border-[#3D7A52] px-6 py-8">
            <h1 className="font-heading text-2xl font-bold">SP Pickles Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-[#214634] active:bg-[#2E5C3E]"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-[#3D7A52] px-4 py-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-theme-body transition hover:bg-gold/10 hover:text-theme-heading"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="theme-card sticky top-0 z-40 border-b shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 text-theme-body transition hover:bg-gold/10 hover:text-theme-heading lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h2 className="text-2xl font-bold text-theme-heading">{title}</h2>
            </div>

            {/* Top Navigation Links */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 text-sm font-semibold text-theme-body hover:text-gold transition"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="px-4 py-2 text-sm font-semibold text-theme-body hover:text-gold transition"
              >
                📦 Products
              </Link>
              <Link
                to="/admin/orders"
                className="px-4 py-2 text-sm font-semibold text-theme-body hover:text-gold transition"
              >
                🛒 Orders
              </Link>
            </div>

            {/* Admin Info */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-theme-on-accent">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
