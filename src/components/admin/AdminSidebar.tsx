import { type ComponentType } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type AdminSidebarProps = {
  adminEmail: string | null;
  items: AdminNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  onLogout: () => void;
};

const AdminSidebar = ({
  adminEmail,
  items,
  activeKey,
  onSelect,
  onLogout,
}: AdminSidebarProps) => {
  return (
    <aside className="lg:fixed lg:inset-y-0 lg:left-0 lg:w-[288px]">
      <div className="flex h-full flex-col border-r border-[#ece0cf] bg-[linear-gradient(180deg,#2f1d16_0%,#22140f_100%)] px-5 py-6 text-white shadow-[0_24px_60px_rgba(28,14,9,0.24)] lg:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 px-5 py-5 backdrop-blur-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f3c983]">
            SP Pickles Admin
          </p>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em]">
            Premium Control
          </h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Manage products, orders, and store settings from one clean workspace.
          </p>
        </div>

        <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Signed in as
          </p>
          <p className="mt-2 truncate text-sm font-medium text-white/85">
            {adminEmail ?? "admin@sppickles.in"}
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3.5 text-left text-sm font-semibold transition duration-300",
                  activeKey === item.key
                    ? "bg-[linear-gradient(135deg,#8B0000_0%,#a3150e_100%)] text-white shadow-[0_16px_30px_rgba(139,0,0,0.22)]"
                    : "text-white/72 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.8rem] border border-white/10 bg-white/5 px-5 py-5">
          <p className="text-sm leading-7 text-white/70">
            Use this dashboard to keep the storefront polished, current, and easy to order from.
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/12"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
