import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Megaphone } from "lucide-react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/components/LanguageProvider";
import { getAds, type AdminAd } from "@/lib/api";
import { translateDynamicText } from "@/lib/translation";

const pageWrap = "mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8";

const AdMediaFrame = ({ ad, alt }: { ad: AdminAd; alt: string }) => {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    setAspectRatio(null);

    if (ad.mediaType === "image") {
      const image = new window.Image();

      image.onload = () => {
        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          setAspectRatio(image.naturalWidth / image.naturalHeight);
        }
      };

      image.src = ad.mediaUrl;
      return;
    }

    const video = document.createElement("video");

    video.onloadedmetadata = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
    };

    video.src = ad.mediaUrl;
  }, [ad.mediaType, ad.mediaUrl]);

  return (
    <div className="relative w-full overflow-hidden bg-[#f8faf6]" style={{ aspectRatio: aspectRatio ? String(aspectRatio) : "16 / 9" }}>
      <div className="absolute inset-4 sm:inset-6">
        {ad.mediaType === "video" ? (
          <video
            src={ad.mediaUrl}
            className="h-full w-full rounded-2xl object-contain"
            autoPlay
            muted
            playsInline
            loop
            controls
            preload="auto"
          />
        ) : (
          <img src={ad.mediaUrl} alt={alt} className="h-full w-full rounded-2xl object-contain" loading="lazy" />
        )}
      </div>
    </div>
  );
};

export default function AdsPage() {
  const { language } = useLanguage();
  const isTe = language === "te";
  const { data: ads = [], refetch } = useQuery({
    queryKey: ["storefront-ads"],
    queryFn: getAds,
    staleTime: 0,
    refetchInterval: 2_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

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

  const activeAds = useMemo(
    () => ads.filter((ad) => ad.isActive).sort((left, right) => left.displayOrder - right.displayOrder),
    [ads],
  );

  return (
    <main className="bg-[var(--color-bg-primary)] pb-10">
      <Seo
        title="SP Traditional Pickles | Ads"
        description="Latest promotions and announcements managed from admin dashboard."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-8 sm:py-10`}>
          <span className="inline-flex rounded-full bg-[#edf5ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7a43]">
            {isTe ? "ప్రకటనలు" : "Ads"}
          </span>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold text-theme-heading sm:text-4xl">
            {isTe ? "ప్రచారాలు మరియు ప్రకటనలు" : "Promotions and Announcements"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-theme-body sm:text-base">
            {isTe
              ? "అడ్మిన్ జోడించిన ప్రకటనలు ఇక్కడ వెంటనే కనిపిస్తాయి. వీడియో ప్రకటనలు నిరంతరం లూప్ అవుతాయి."
              : "Admin-created ads appear here automatically. Video ads loop continuously until removed."}
          </p>
        </div>
      </section>

      <section className={`${pageWrap} py-8 sm:py-10`}>
        {activeAds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d8e5d8] bg-white px-6 py-10 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-[#2f7a43]" />
            <p className="mt-4 text-base font-semibold text-theme-heading">
              {isTe ? "యాక్టివ్ ప్రకటనలు లేవు" : "No active ads"}
            </p>
            <p className="mt-2 text-sm text-theme-body">
              {isTe ? "అడ్మిన్ కొత్త ప్రకటనలు జోడించిన వెంటనే ఇక్కడ కనిపిస్తాయి." : "New ad campaigns from admin will be visible here."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {activeAds.map((ad) => (
              <article
                key={ad.id}
                className="overflow-hidden rounded-[1.25rem] border border-[#d8e5d8] bg-white shadow-[0_12px_28px_rgba(30,79,46,0.08)] sm:rounded-[1.5rem]"
              >
                <AdMediaFrame ad={ad} alt={translateDynamicText(ad.title, language)} />
                <div className="p-5">
                  <p className="text-lg font-bold text-theme-heading">{translateDynamicText(ad.title, language)}</p>
                  {ad.description ? (
                    <p className="mt-2 text-sm text-theme-body">{translateDynamicText(ad.description, language)}</p>
                  ) : null}
                  {ad.ctaText && ad.ctaUrl ? (
                    <a
                      href={ad.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2f7a43] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] !text-white transition hover:bg-[#28683a]"
                    >
                      {ad.ctaText}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
