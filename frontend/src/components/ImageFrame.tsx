import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ImageFrameProps {
  src: string;
  alt: string;
  ratio?: "square" | "video" | "4-3"; // 1:1, 16:9, 4:3
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
  loading?: "lazy" | "eager";
  overlay?: boolean;
}

const aspectRatios: Record<string, number> = {
  square: 1,
  video: 16 / 9,
  "4-3": 4 / 3,
};

/**
 * Premium image frame component with consistent styling
 * - Fixed aspect ratio
 * - Rounded corners
 * - Hover zoom effect
 * - Optional overlay
 */
export const ImageFrame = ({
  src,
  alt,
  ratio = "square",
  className,
  imageClassName,
  children,
  loading = "lazy",
  overlay = true,
}: ImageFrameProps) => {
  const aspectRatio = aspectRatios[ratio] || 1;
  const paddingBottom = (1 / aspectRatio) * 100;

  const containerStyle: CSSProperties = {
    paddingBottom: `${paddingBottom}%`,
  };

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border border-[#3D7A52] bg-[#2E5C3E] shadow-sm",
        className
      )}
    >
      {/* Aspect ratio container */}
      <div className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            imageClassName
          )}
        />

        {/* Subtle overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/5" />
        )}

        {/* Soft shadow effect */}
        <div className="absolute inset-0 rounded-3xl shadow-inset shadow-black/5" />
      </div>

      {/* Padding-based aspect ratio fallback */}
      <div style={containerStyle} />

      {/* Children overlay (if any) */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ImageFrame;
