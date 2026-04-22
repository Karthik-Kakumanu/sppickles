import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useAdsQuery } from "@/lib/api";
import { translateDynamicText } from "@/lib/translation";

const getImageAspectRatio = (src: string, onRatio: (ratio: number) => void) => {
  const image = new window.Image();

  image.onload = () => {
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      onRatio(image.naturalWidth / image.naturalHeight);
    }
  };

  image.src = src;
};

const getVideoAspectRatio = (src: string, onRatio: (ratio: number) => void) => {
  const video = document.createElement("video");

  video.onloadedmetadata = () => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      onRatio(video.videoWidth / video.videoHeight);
    }
  };

  video.src = src;
};

const AdsCarousel = () => {
  const [adAspectRatio, setAdAspectRatio] = useState<number | null>(null);
  const { data: ads = [], isLoading, refetch } = useAdsQuery();
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayActive, setAutoPlayActive] = useState(true);
  const activeAds = useMemo(() => ads.filter((ad) => ad.isActive), [ads]);
  const currentAd = activeAds[currentIndex] ?? activeAds[0] ?? null;

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "sp-ads-updated-at") {
        void refetch();
      }
    };

    const adsChannel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("sp-ads") : null;
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "ads-updated") {
        void refetch();
      }
    };

    window.addEventListener("storage", handleStorage);
    adsChannel?.addEventListener("message", handleBroadcast);

    const adEvents = typeof window !== "undefined" ? new EventSource("/api/ad-events", { withCredentials: true }) : null;
    const handleServerEvent = () => {
      void refetch();
    };

    adEvents?.addEventListener("ad-update", handleServerEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      adsChannel?.removeEventListener("message", handleBroadcast);
      adsChannel?.close();
      adEvents?.removeEventListener("ad-update", handleServerEvent);
      adEvents?.close();
    };
  }, [refetch]);

  useEffect(() => {
    if (!autoPlayActive || activeAds.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeAds.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeAds.length, autoPlayActive]);

  useEffect(() => {
    setCurrentIndex((current) => (activeAds.length > 0 ? Math.min(current, activeAds.length - 1) : 0));
  }, [activeAds.length]);

  useEffect(() => {
    if (!currentAd) {
      setAdAspectRatio(null);
      return;
    }

    setAdAspectRatio(null);

    if (currentAd.mediaType === "image") {
      getImageAspectRatio(currentAd.mediaUrl, setAdAspectRatio);
      return;
    }

    getVideoAspectRatio(currentAd.mediaUrl, setAdAspectRatio);
  }, [currentAd]);

  if (isLoading) {
    return (
      <div className="aspect-video w-full animate-pulse rounded-[1.5rem] bg-gradient-to-br from-[#f7f2e8] to-[#efe7d7]" />
    );
  }

  if (!currentAd || activeAds.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeAds.length) % activeAds.length);
    setTimeout(() => setAutoPlayActive(true), 5000);
  };

  const goToNext = () => {
    setAutoPlayActive(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeAds.length);
    setTimeout(() => setAutoPlayActive(true), 5000);
  };

  const mediaAspectRatio = adAspectRatio ? String(adAspectRatio) : "16 / 9";

  return (
    <div className="relative w-full overflow-hidden rounded-[1.25rem] border border-[#d8e5d8] bg-white shadow-[0_12px_28px_rgba(18,54,34,0.08)] sm:rounded-[1.5rem]">
      <div className="relative w-full overflow-hidden bg-[#f8faf6]" style={{ aspectRatio: mediaAspectRatio }}>
        <div className="absolute inset-4 sm:inset-6">
          {currentAd.mediaType === "image" ? (
            <img
              src={currentAd.mediaUrl}
              alt={translateDynamicText(currentAd.title, language)}
              className="h-full w-full rounded-2xl object-contain transition-opacity duration-500"
            />
          ) : (
            <video
              src={currentAd.mediaUrl}
              controls
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="h-full w-full rounded-2xl object-contain"
            />
          )}
        </div>

        {activeAds.length > 1 ? (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#2f7a43] shadow-md backdrop-blur transition hover:bg-white sm:left-4 sm:h-12 sm:w-12"
              aria-label="Previous ad"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#2f7a43] shadow-md backdrop-blur transition hover:bg-white sm:right-4 sm:h-12 sm:w-12"
              aria-label="Next ad"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      <div className="border-t border-[#d8e5d8] bg-white px-5 py-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase text-[#2f7a43]">Promotion</p>
          <h2 className="mt-1.5 text-xl font-bold text-theme-heading sm:text-2xl">
            {translateDynamicText(currentAd.title, language)}
          </h2>
          {currentAd.description ? (
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-theme-body">
              {translateDynamicText(currentAd.description, language)}
            </p>
          ) : null}

          {currentAd.ctaUrl && currentAd.ctaText ? (
            <a
              href={currentAd.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2f7a43] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1f7a4d]"
            >
              {translateDynamicText(currentAd.ctaText, language)}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        {activeAds.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-2">
            {activeAds.map((ad, index) => (
              <button
                key={`dot-${ad.id}`}
                onClick={() => {
                  setAutoPlayActive(false);
                  setCurrentIndex(index);
                  setTimeout(() => setAutoPlayActive(true), 5000);
                }}
                className={`h-2 rounded-full transition ${
                  index === currentIndex ? "w-8 bg-[#2f7a43]" : "w-2 bg-[#b8c9ba] hover:bg-[#7fa487]"
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdsCarousel;
