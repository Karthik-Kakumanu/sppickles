import { useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  loading?: "eager" | "lazy";
  decoding?: "sync" | "async" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 * Uses Intersection Observer for efficient lazy loading
 * Falls back to native loading="lazy" if supported
 */
export function LazyImage({
  src,
  alt,
  className = "",
  width,
  height,
  placeholder,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  sizes,
  srcSet,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageSrc = src || placeholder || "";

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <img
      src={imageSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      {...({ fetchpriority: fetchPriority } as Record<string, string>)}
      onLoad={handleLoad}
      onError={handleError}
      className={`${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-95"}`}
      role={error ? "img" : undefined}
      aria-label={error ? `Failed to load: ${alt}` : alt}
    />
  );
}

/**
 * Progressive Image Component
 * Loads low-quality placeholder first, then high-quality image
 */
export function ProgressiveImage({
  src: highQualitySrc,
  placeholder: lowQualitySrc,
  placeholderSrc,
  fallbackSrc,
  alt,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
}: {
  src: string;
  placeholder?: string;
  placeholderSrc?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(highQualitySrc);
  const resolvedPlaceholder = lowQualitySrc ?? placeholderSrc;

  const handleImageError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoaded(false);
      return;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Low-quality placeholder */}
      {resolvedPlaceholder && (
        <img
          src={resolvedPlaceholder}
          alt=""
          className={`absolute inset-0 ${className}`}
          style={{
            filter: "blur(14px)",
            opacity: isLoaded ? 0 : 1,
            transition: "opacity 0.25s ease-out",
          }}
          aria-hidden="true"
        />
      )}

      {/* High-quality image */}
      <LazyImage
        src={currentSrc}
        alt={alt}
        className={className}
        placeholder={resolvedPlaceholder}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
      />
    </div>
  );
}
