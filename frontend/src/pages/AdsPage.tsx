import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Megaphone } from "lucide-react";
import Seo from "@/components/Seo";
import { getAds } from "@/lib/api";

const pageWrap = "w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14";

export default function AdsPage() {
  const { data: ads = [] } = useQuery({
    queryKey: ["storefront-ads"],
    queryFn: getAds,
    staleTime: 15_000,
    refetchInterval: 20_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const activeAds = useMemo(
    () => ads.filter((ad) => ad.isActive).sort((left, right) => left.displayOrder - right.displayOrder),
    [ads],
  );

  return (
    <main className="bg-[var(--color-bg-primary)] pb-8">
      <Seo
        title="SP Traditional Pickles | Ads"
        description="Latest promotions and announcements managed from admin dashboard."
      />

      <section className="border-b border-[#d8e5d8] bg-[linear-gradient(180deg,#fffefa_0%,#f8faf6_100%)]">
        <div className={`${pageWrap} py-8`}>
          <span className="inline-flex rounded-full bg-[#edf5ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f7a43]">
            Ads
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-theme-heading sm:text-4xl">
            Promotions and Announcements
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-theme-body sm:text-base">
            Admin-created ads appear here automatically. Video ads loop continuously until removed.
          </p>
        </div>
      </section>

      <section className={`${pageWrap} py-8`}>
        {activeAds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d8e5d8] bg-white px-6 py-10 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-[#2f7a43]" />
            <p className="mt-4 text-base font-semibold text-theme-heading">No active ads</p>
            <p className="mt-2 text-sm text-theme-body">New ad campaigns from admin will be visible here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeAds.map((ad) => (
              <article
                key={ad.id}
                className="overflow-hidden rounded-3xl border border-[#d8e5d8] bg-white shadow-[0_12px_30px_rgba(30,79,46,0.08)]"
              >
                <div className="aspect-video w-full bg-[#f2f7f2]">
                  {ad.mediaType === "video" ? (
                    <video
                      src={ad.mediaUrl}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      loop
                      controls
                    />
                  ) : (
                    <img src={ad.mediaUrl} alt={ad.title} className="h-full w-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-lg font-bold text-theme-heading">{ad.title}</p>
                  {ad.description ? <p className="mt-2 text-sm text-theme-body">{ad.description}</p> : null}
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
