import { type ReactNode } from "react";
import { Bell, Search } from "lucide-react";

type AdminTopbarProps = {
  title: string;
  description: string;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  action?: ReactNode;
};

const AdminTopbar = ({
  title,
  description,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  action,
}: AdminTopbarProps) => {
  const hasSearch = typeof searchValue === "string" && typeof onSearchChange === "function";

  return (
    <div className="sticky top-4 z-20 rounded-[2rem] border border-[#ece0cf] bg-white/88 px-5 py-5 shadow-[0_16px_40px_rgba(66,36,13,0.07)] backdrop-blur-md md:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b6a27]">
            Admin Workspace
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#241612] md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5643]">{description}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {hasSearch ? (
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f7865]" />
              <input
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder ?? "Search"}
                className="w-full rounded-full border border-[#e6d7c3] bg-[#fbf7f2] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8B0000] md:w-[300px]"
              />
            </label>
          ) : null}

          <div className="flex items-center gap-3">
            {action}
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eadfce] bg-[#fff8ef] text-[#8B0000] shadow-sm">
              <Bell className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;
