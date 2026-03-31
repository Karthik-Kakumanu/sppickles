import { LAYOUT } from "@/lib/layout";

const SectionDivider = () => (
  <div className={`${LAYOUT.container} ${LAYOUT.containerPadding}`} aria-hidden="true">
    <div className="relative py-3">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#e2d0b7] to-transparent" />
      <div className="-mt-3">
        <div className="leaf-divider opacity-75" />
      </div>
    </div>
  </div>
);

export default SectionDivider;
