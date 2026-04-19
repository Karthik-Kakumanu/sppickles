import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import {
  Clapperboard,
  Image as ImageIcon,
  Loader2,
  MonitorPlay,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";
import {
  type AdminAd,
  type AdMediaType,
  useAdminAdsQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} from "@/lib/api";

interface AdForm {
  title: string;
  description: string;
  mediaType: AdMediaType;
  mediaUrl: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

const emptyForm = (): AdForm => ({
  title: "",
  description: "",
  mediaType: "image",
  mediaUrl: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
});

const fieldClass =
  "w-full rounded-xl border border-[#d8e5d8] bg-[#fcfffc] px-3 py-2 text-sm text-theme-heading outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus:border-[#b79a52] focus:bg-white focus:ring-2 focus:ring-[#b79a52]/15";

const mediaFrameClass =
  "flex min-h-[11rem] max-h-[26rem] items-center justify-center overflow-hidden rounded-lg border border-[#e6efe7] bg-[#f8fcf9] p-2 sm:p-3";

const toDateInput = (value: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const toIsoDateBoundaryOrNull = (value: string, boundary: "start" | "end") => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const monthIndex = Number(dateOnlyMatch[2]) - 1;
    const day = Number(dateOnlyMatch[3]);

    const date =
      boundary === "start"
        ? new Date(year, monthIndex, day, 0, 0, 0, 0)
        : new Date(year, monthIndex, day, 23, 59, 59, 999);

    return date.toISOString();
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const formFromAd = (ad: AdminAd): AdForm => ({
  title: ad.title,
  description: ad.description,
  mediaType: ad.mediaType,
  mediaUrl: ad.mediaUrl,
  startsAt: toDateInput(ad.startsAt),
  endsAt: toDateInput(ad.endsAt),
  isActive: ad.isActive,
});

const isAdLiveNow = (ad: AdminAd) => {
  if (!ad.isActive) return false;

  const now = Date.now();
  const startsAtTime = ad.startsAt ? new Date(ad.startsAt).getTime() : null;
  const endsAtTime = ad.endsAt ? new Date(ad.endsAt).getTime() : null;

  const startsOk = startsAtTime === null || startsAtTime <= now;
  const endsOk = endsAtTime === null || endsAtTime >= now;

  return startsOk && endsOk;
};

const formatDateTime = (value: string | null) => {
  if (!value) return "No limit";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const AdminAdsPage = () => {
  const { isAdminReady, isAdminAuthenticated } = useStore();
  const { data: ads = [], isLoading, isRefetching, refetch } = useAdminAdsQuery();
  const createMutation = useCreateAdMutation();
  const updateMutation = useUpdateAdMutation();
  const deleteMutation = useDeleteAdMutation();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdForm>(emptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    let live = 0;

    for (const ad of ads) {
      if (isAdLiveNow(ad)) live += 1;
    }

    return {
      total: ads.length,
      live,
      inactive: ads.filter((ad) => !ad.isActive).length,
      images: ads.filter((ad) => ad.mediaType === "image").length,
      videos: ads.filter((ad) => ad.mediaType === "video").length,
    };
  }, [ads]);

  const filteredAds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ads.filter((ad) => {
      if (!query) return true;

      const haystack = [ad.title, ad.description, ad.mediaType].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [ads, searchQuery]);

  const handleReset = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleEdit = (ad: AdminAd) => {
    setEditingId(ad.id);
    setForm(formFromAd(ad));
  };

  const handleDelete = async (ad: AdminAd) => {
    const confirmed = window.confirm(`Delete ad "${ad.title}"? This cannot be undone.`);
    if (!confirmed) return;

    await deleteMutation.mutateAsync(ad.id);
    if (editingId === ad.id) handleReset();
  };

  const handleToggleActive = async (ad: AdminAd) => {
    await updateMutation.mutateAsync({ adId: ad.id, adData: { isActive: !ad.isActive } });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const startsAt = toIsoDateBoundaryOrNull(form.startsAt, "start");
    const endsAt = toIsoDateBoundaryOrNull(form.endsAt, "end");

    if (startsAt && endsAt && new Date(startsAt).getTime() > new Date(endsAt).getTime()) {
      toast({
        title: "Invalid dates",
        description: "Start date must be before end date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      mediaType: form.mediaType,
      mediaUrl: form.mediaUrl.trim(),
      ctaText: null,
      ctaUrl: null,
      startsAt,
      endsAt,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          adId: editingId,
          adData: payload,
        });
        toast({
          title: "Ad updated",
          description: `${form.title} has been updated successfully.`,
        });
      } else {
        await createMutation.mutateAsync(payload);
        toast({
          title: "Ad created",
          description: `${form.title} has been created successfully.`,
        });
      }
      handleReset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const inferredMediaType: AdMediaType = file.type.startsWith("video/") ? "video" : "image";

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        mediaType: inferredMediaType,
        mediaUrl: String(reader.result ?? ""),
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-20">
        <div className="theme-card mx-auto max-w-2xl rounded-[2rem] border px-8 py-16 text-center shadow-md">
          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.26em]">Loading</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-theme-heading">Preparing ads workspace</h1>
        </div>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <Seo
        title="SP Traditional Pickles | Admin Ads"
        description="Create and manage image/video ads with timing controls."
        noIndex
      />

      <AdminLayout title="Ads">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,249,233,0.98)_0%,rgba(244,251,246,0.98)_50%,rgba(232,243,236,0.98)_100%)] p-5 shadow-[0_14px_42px_rgba(17,51,32,0.1)] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c58a] bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a651a]">
                  <MonitorPlay className="h-3.5 w-3.5" />
                  Campaign media
                </span>
                <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-theme-heading md:text-4xl">
                  Ads control
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-theme-body">
                  Add image or video ads with descriptions and scheduling in a clean minimal workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <div className="rounded-[1rem] border border-[#d8e5d8] bg-white/80 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">Total</p>
                  <p className="mt-1 text-xl font-bold text-theme-heading">{summary.total}</p>
                </div>
                <div className="rounded-[1rem] border border-[#bde2cd] bg-[#edf8f1] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1f7a4d]">Live</p>
                  <p className="mt-1 text-xl font-bold text-[#1f7a4d]">{summary.live}</p>
                </div>
                <div className="rounded-[1rem] border border-[#d5d5d5] bg-[#f3f3f3] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#575757]">Inactive</p>
                  <p className="mt-1 text-xl font-bold text-[#575757]">{summary.inactive}</p>
                </div>
                <div className="rounded-[1rem] border border-[#c7def5] bg-[#eaf4ff] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2d5f91]">Images</p>
                  <p className="mt-1 text-xl font-bold text-[#2d5f91]">{summary.images}</p>
                </div>
                <div className="rounded-[1rem] border border-[#d7c2f2] bg-[#f5eeff] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f46a6]">Videos</p>
                  <p className="mt-1 text-xl font-bold text-[#6f46a6]">{summary.videos}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
            <section className="rounded-[1.4rem] border border-[#d8e5d8] bg-white/92 p-5 shadow-[0_14px_34px_rgba(18,54,34,0.07)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-theme-heading">{editingId ? "Edit ad" : "Add ad"}</h2>
                {editingId ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                  >
                    New ad
                  </button>
                ) : null}
              </div>

              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <label className="space-y-1.5 text-sm font-medium text-theme-body">
                  Title
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Summer sale banner"
                    required
                    className={fieldClass}
                  />
                </label>

                <label className="space-y-1.5 text-sm font-medium text-theme-body">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={3}
                    placeholder="Short ad description"
                    className={fieldClass}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-1">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Media type
                    <select
                      value={form.mediaType}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, mediaType: event.target.value as AdMediaType }))
                      }
                      className={fieldClass}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1.5 text-sm font-medium text-theme-body">
                  Media URL ({form.mediaType === "image" ? "image" : "video"})
                  <input
                    value={form.mediaUrl}
                    onChange={(event) => setForm((current) => ({ ...current, mediaUrl: event.target.value }))}
                    placeholder={form.mediaType === "image" ? "https://.../banner.jpg" : "https://.../promo.mp4"}
                    required
                    className={fieldClass}
                  />
                </label>

                <label className="space-y-1.5 text-sm font-medium text-theme-body">
                  Upload from device (image/video)
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="block w-full rounded-xl border border-dashed border-[#d8e5d8] bg-[#fbfdfb] px-4 py-3 text-sm text-theme-body file:mr-3 file:rounded-full file:border-0 file:bg-[#1f7a4d] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                  />
                  <p className="text-xs text-theme-body-soft">
                    You can paste a URL or upload directly from desktop/mobile.
                  </p>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Starts on
                    <input
                      type="date"
                      value={form.startsAt}
                      onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
                      className={fieldClass}
                    />
                  </label>

                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Ends on
                    <input
                      type="date"
                      value={form.endsAt}
                      onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label className="inline-flex items-center gap-2 rounded-lg border border-[#d8e5d8] bg-[#f8fcf9] px-3 py-2 text-sm font-medium text-theme-body">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                    className="h-4 w-4 rounded border-[#c7d9c8] text-[#1f7a4d]"
                  />
                  Ad is active
                </label>

                <div className="overflow-hidden rounded-[1rem] border border-[#d8e5d8] bg-[#f8fcf9]">
                  <div className="border-b border-[#e6efe7] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                    Preview
                  </div>
                  <div className="p-3">
                    {form.mediaUrl.trim() ? (
                      <div className={mediaFrameClass}>
                        {form.mediaType === "image" ? (
                          <img
                            src={form.mediaUrl}
                            alt={form.title || "Ad preview"}
                            className="max-h-[24rem] w-full rounded-md object-contain"
                          />
                        ) : (
                          <video
                            src={form.mediaUrl}
                            className="max-h-[24rem] w-full rounded-md bg-black object-contain"
                            controls
                            preload="metadata"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex min-h-[11rem] items-center justify-center rounded-lg border border-dashed border-[#d8e5d8] bg-white text-sm text-theme-body-soft">
                        Enter media URL or upload a file to preview.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,122,77,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {editingId ? "Update ad" : "Create ad"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-[#d8e5d8] bg-white px-4 py-2.5 text-sm font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-[1.4rem] border border-[#d8e5d8] bg-white/92 p-5 shadow-[0_14px_34px_rgba(18,54,34,0.07)] backdrop-blur">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-lg font-semibold text-theme-heading">Ads list</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-body-soft" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search ad title, description, type"
                  className="w-full rounded-xl border border-[#d8e5d8] bg-[#fcfffc] px-10 py-2.5 text-sm text-theme-heading outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus:border-[#b79a52] focus:bg-white focus:ring-2 focus:ring-[#b79a52]/15"
                />
              </div>

              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center gap-2 rounded-xl border border-[#d8e5d8] bg-[#f9fbf9] px-4 py-7 text-sm text-theme-body">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading ads...
                  </div>
                ) : filteredAds.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#d8e5d8] bg-[linear-gradient(180deg,#fbfdfb_0%,#f4f9f5_100%)] px-4 py-9 text-center">
                    <MonitorPlay className="mx-auto h-5 w-5 text-theme-body-soft" />
                    <p className="mt-2 text-sm font-semibold text-theme-heading">No ads in this view</p>
                    <p className="mt-1 text-xs text-theme-body">Create one from the form on the left.</p>
                  </div>
                ) : (
                  filteredAds.map((ad) => (
                    <article
                      key={ad.id}
                      className="rounded-[1rem] border border-[#d8e5d8] bg-white p-4 shadow-[0_10px_24px_rgba(18,54,34,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_14px_28px_rgba(18,54,34,0.09)]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${ad.mediaType === "image" ? "border-[#c7def5] bg-[#eaf4ff] text-[#2d5f91]" : "border-[#d7c2f2] bg-[#f5eeff] text-[#6f46a6]"}`}>
                              {ad.mediaType === "image" ? (
                                <span className="inline-flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Image</span>
                              ) : (
                                <span className="inline-flex items-center gap-1"><Clapperboard className="h-3 w-3" /> Video</span>
                              )}
                            </span>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${isAdLiveNow(ad) ? "border-[#bde2cd] bg-[#edf8f1] text-[#1f7a4d]" : "border-[#d5d5d5] bg-[#f3f3f3] text-[#575757]"}`}>
                              {isAdLiveNow(ad) ? "Live" : ad.isActive ? "Scheduled" : "Inactive"}
                            </span>
                          </div>

                          <h3 className="truncate text-base font-semibold text-theme-heading">{ad.title}</h3>
                          {ad.description ? <p className="text-sm text-theme-body">{ad.description}</p> : null}
                          <p className="text-xs text-theme-body-soft">
                            Valid: {formatDateTime(ad.startsAt)} to {formatDateTime(ad.endsAt)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(ad)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(ad)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                          >
                            {ad.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ad)}
                            className="inline-flex items-center gap-1 rounded-full border border-[#f0c8bf] px-3 py-1.5 text-xs font-semibold text-[#b64d39] transition hover:bg-[#fff2ed]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className={`mt-3 ${mediaFrameClass}`}>
                        {ad.mediaType === "image" ? (
                          <img src={ad.mediaUrl} alt={ad.title} className="max-h-[24rem] w-full rounded-md object-contain" />
                        ) : (
                          <video
                            src={ad.mediaUrl}
                            className="max-h-[24rem] w-full rounded-md bg-black object-contain"
                            controls
                            preload="metadata"
                          />
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </AdminLayout>
    </>
  );

};

export default AdminAdsPage;

