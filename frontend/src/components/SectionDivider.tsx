import { LAYOUT } from "@/lib/layout";

const SectionDivider = () => (
  <div className={`${LAYOUT.container} ${LAYOUT.containerPadding} relative z-10 -my-6 md:-my-8`} aria-hidden="true">
    <div className="flex items-center justify-center py-4 md:py-5">
      <div className="h-px flex-1 max-w-[12rem] bg-gradient-to-r from-transparent via-south-yellow/60 to-south-green/70 md:max-w-[18rem]" />
      <div className="mx-4 flex items-center gap-2 rounded-full border border-[#3D7A52] bg-[#2E5C3E] px-3 py-2 shadow-[0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-sm md:mx-5">
        <span className="h-2 w-2 rounded-full bg-south-red" />
        <span className="relative flex h-8 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#1A3A2A] via-[#F5C518] to-[#1A3A2A] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
          <span className="absolute inset-[3px] rounded-full border border-[#A3D9B1]/30" />
          <span className="h-4 w-px rounded-full bg-[#A3D9B1]/80" />
        </span>
        <span className="h-2 w-2 rounded-full bg-south-green" />
      </div>
      <div className="h-px flex-1 max-w-[12rem] bg-gradient-to-l from-transparent via-south-yellow/60 to-south-green/70 md:max-w-[18rem]" />
    </div>
    <div className="mx-auto h-px max-w-[18rem] bg-gradient-to-r from-transparent via-[#A3D9B1]/70 to-transparent md:max-w-[24rem]" />
  </div>
);

export default SectionDivider;
