import { type ComponentType } from "react";

type AdminStatCardProps = {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  detail: string;
};

const AdminStatCard = ({ label, value, icon: Icon, detail }: AdminStatCardProps) => {
  return (
    <article className="rounded-[2rem] border border-[#ece0cf] bg-white p-6 shadow-[0_18px_42px_rgba(66,36,13,0.06)]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1dc] text-[#8B0000]">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#9b6a27]">
        {label}
      </p>
      <p className="mt-3 font-heading text-4xl font-semibold tracking-[-0.04em] text-[#241612]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b5643]">{detail}</p>
    </article>
  );
};

export default AdminStatCard;
