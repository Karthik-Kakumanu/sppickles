import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useAdsQuery } from "@/lib/api";

interface Ad {
  id: string;
  title: string;
  description: string;
  media_type: "image" | "video";
  media_url: string;
  cta_text?: string;
  cta_url?: string;
  is_active: boolean;
}

const AdsCarousel = () => {
  const { data: ads = [], isLoading } = useAdsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayActive, setAutoPlayActive] = useState(true);

  useEffect(() => {
    if (!autoPlayActive || ads.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(timer);
  }, [autoPlayActive, ads.length]);

  if (isLoading) {
    return (
      <div className="aspect-video w-full rounded-[1.5rem] bg-gradient-to-br from-[#f7f2e8] to-[#efe7d7] animate-pulse" />
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex];

  const goToPrevious = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
    setTimeout(() => setAutoPlayActive(true), 5000);
  };

  const goToNext = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    setTimeout(() => setAutoPlayActive(true), 5000);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[1.5rem] border border-[#d8e5d8] bg-white shadow-[0_14px_36px_rgba(18,54,34,0.08)]">
      {/* Ad Container */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#f7f2e8] to-[#efe7d7] overflow-hidden">
        {currentAd.media_type === "image" ? (
          <img
            src={currentAd.media_url}
            alt={currentAd.title}
            className="h-full w-full object-cover transition-opacity duration-500"
          />
        ) : (
          <video
            src={currentAd.media_url}
            controls
            autoPlay
            loop
            className="h-full w-full object-cover"
          />
        )}

        {/* Overlay with Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8d4a8]">
              Promotion
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{currentAd.title}</h2>
            {currentAd.description && (
              <p className="mt-2 text-sm text-gray-200 max-w-xl leading-relaxed">
                {currentAd.description}
              </p>
            )}

            {currentAd.cta_url && currentAd.cta_text && (
              <a
                href={currentAd.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2f7a43] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f7a4d] shadow-lg"
              >
                {currentAd.cta_text}
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {ads.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur text-[#2f7a43] transition hover:bg-white shadow-lg sm:h-14 sm:w-14"
            aria-label="Previous ad"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur text-[#2f7a43] transition hover:bg-white shadow-lg sm:h-14 sm:w-14"
            aria-label="Next ad"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {ads.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => {
                setAutoPlayActive(false);
                setCurrentIndex(index);
                setTimeout(() => setAutoPlayActive(true), 5000);
              }}
              className={`h-2 rounded-full transition ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to ad ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsCarousel;
