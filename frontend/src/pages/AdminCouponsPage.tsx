import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { BadgePercent, Loader2, Pencil, RefreshCw, Search, Tag, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import Seo from "@/components/Seo";
import { useStore } from "@/components/StoreProvider";
import { useToast } from "@/hooks/use-toast";
import {
  type AdminCoupon,
  type AdminCouponInput,
  type CouponCategoryScope,
  type CouponDiscountType,
  type CouponScope,
  useAdminCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useProductsQuery,
  useUpdateCouponMutation,
} from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

type CouponFormState = {
  code: string;
  title: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: string;
  appliesTo: CouponScope;
  targetCategory: CouponCategoryScope | "";
  targetProductId: string;
  minOrderAmount: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const emptyForm = (): CouponFormState => ({
  code: "",
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  appliesTo: "all",
  targetCategory: "",
  targetProductId: "",
  minOrderAmount: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
});

const categoryOptions: Array<{ value: CouponCategoryScope; label: string }> = [
  { value: "pickles", label: "Pickles" },
  { value: "salted-pickles", label: "Salted pickles" },
  { value: "tempered-pickles", label: "Tempered pickles" },
  { value: "powders", label: "Powders" },
  { value: "fryums", label: "Fryums" },
];

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

const toNumberOrNull = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const isExpiredCoupon = (coupon: AdminCoupon) => {
  if (!coupon.endsAt) return false;
  return new Date(coupon.endsAt).getTime() < Date.now();
};

const formatDateTime = (value: string | null) => {
  if (!value) return "No limit";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
};

const formFromCoupon = (coupon: AdminCoupon): CouponFormState => ({
  code: coupon.code,
  title: coupon.title,
  description: coupon.description,
  discountType: coupon.discountType,
  discountValue: String(coupon.discountValue),
  appliesTo: coupon.appliesTo,
  targetCategory: coupon.targetCategory ?? "",
  targetProductId: coupon.targetProductId ?? "",
  minOrderAmount: coupon.minOrderAmount === null ? "" : String(coupon.minOrderAmount),
  startsAt: toDateInput(coupon.startsAt),
  endsAt: toDateInput(coupon.endsAt),
  isActive: coupon.isActive,
});

const applyLabel = (coupon: AdminCoupon) => {
  if (coupon.appliesTo === "all") return "All products";
  if (coupon.appliesTo === "category") return coupon.targetCategory || "Category";
  return coupon.targetProductName || coupon.targetProductId || "Selected product";
};

const statusMeta = (coupon: AdminCoupon) => {
  if (!coupon.isActive) {
    return {
      label: "Inactive",
      tone: "border-[#d5d5d5] bg-[#f3f3f3] text-[#575757]",
    };
  }

  if (!coupon.startsAt || !coupon.endsAt) {
    return {
      label: "Needs dates",
      tone: "border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]",
    };
  }

  if (isExpiredCoupon(coupon)) {
    return {
      label: "Expired",
      tone: "border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]",
    };
  }

  return {
    label: "Active",
    tone: "border-[#bde2cd] bg-[#edf8f1] text-[#1f7a4d]",
  };
};

const filterOptions = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "expired", label: "Expired" },
] as const;

const fieldClass =
  "w-full rounded-xl border border-[#d8e5d8] bg-[#fcfffc] px-3 py-2 text-sm text-theme-heading outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus:border-[#b79a52] focus:bg-white focus:ring-2 focus:ring-[#b79a52]/15";

const subtleButtonClass =
  "rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading";

const discountBadgeTone: Record<CouponDiscountType, string> = {
  percentage: "border-[#b4dec3] bg-[#e9f8ef] text-[#1e6b43]",
  fixed: "border-[#d7c2f2] bg-[#f5eeff] text-[#6f46a6]",
};

type CouponFilter = (typeof filterOptions)[number]["key"];

const AdminCouponsPage = () => {
  const { isAdminReady, isAdminAuthenticated } = useStore();
  const { data: coupons = [], isLoading, isRefetching, refetch } = useAdminCouponsQuery();
  const { data: products = [] } = useProductsQuery();
  const createCouponMutation = useCreateCouponMutation();
  const updateCouponMutation = useUpdateCouponMutation();
  const deleteCouponMutation = useDeleteCouponMutation();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<CouponFilter>("all");
  const [form, setForm] = useState<CouponFormState>(emptyForm());
  const [cardsVisible, setCardsVisible] = useState(false);

  const isSaving =
    createCouponMutation.isPending ||
    updateCouponMutation.isPending ||
    deleteCouponMutation.isPending;

  const summary = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let expired = 0;

    for (const coupon of coupons) {
      if (!coupon.isActive) inactive += 1;
      else if (isExpiredCoupon(coupon)) expired += 1;
      else active += 1;
    }

    return {
      total: coupons.length,
      active,
      inactive,
      expired,
    };
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return coupons.filter((coupon) => {
      if (filter === "active" && (!coupon.isActive || isExpiredCoupon(coupon))) return false;
      if (filter === "inactive" && coupon.isActive) return false;
      if (filter === "expired" && !isExpiredCoupon(coupon)) return false;

      if (!query) return true;

      const haystack = [
        coupon.code,
        coupon.title,
        coupon.description,
        coupon.appliesTo,
        coupon.targetCategory || "",
        coupon.targetProductName || "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [coupons, filter, searchQuery]);

  useEffect(() => {
    setCardsVisible(false);
    const animationFrameId = window.requestAnimationFrame(() => setCardsVisible(true));
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [filteredCoupons.length]);

  const activeCampaignsToday = useMemo(() => {
    const now = Date.now();

    return coupons.filter((coupon) => {
      if (!coupon.isActive || isExpiredCoupon(coupon)) return false;

      const startsAtTime = coupon.startsAt ? new Date(coupon.startsAt).getTime() : null;
      const endsAtTime = coupon.endsAt ? new Date(coupon.endsAt).getTime() : null;

      const startsOk = startsAtTime !== null && Number.isFinite(startsAtTime) && startsAtTime <= now;
      const endsOk = endsAtTime !== null && Number.isFinite(endsAtTime) && endsAtTime >= now;

      return startsOk && endsOk;
    });
  }, [coupons]);

  const handleReset = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedMinOrderAmount = toNumberOrNull(form.minOrderAmount);
    const parsedDiscountValue = Number(form.discountValue);
    const startsAt = toIsoDateBoundaryOrNull(form.startsAt, "start");
    const endsAt = toIsoDateBoundaryOrNull(form.endsAt, "end");

    if (!Number.isFinite(parsedDiscountValue) || parsedDiscountValue <= 0) {
      toast({
        title: "Discount value required",
        description: "Enter a discount value greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (form.discountType === "fixed" && (parsedMinOrderAmount === null || parsedMinOrderAmount <= 0)) {
      toast({
        title: "Minimum order required",
        description: "Fixed amount coupons need a minimum eligible amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!startsAt || !endsAt) {
      toast({
        title: "Dates required",
        description: "Start date and end date are mandatory for every coupon.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startsAt).getTime() > new Date(endsAt).getTime()) {
      toast({
        title: "Invalid dates",
        description: "Start date must be before end date.",
        variant: "destructive",
      });
      return;
    }

    const payload: AdminCouponInput = {
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      description: form.description.trim(),
      discountType: form.discountType,
      discountValue: parsedDiscountValue,
      appliesTo: form.appliesTo,
      targetCategory: form.appliesTo === "category" ? (form.targetCategory || null) : null,
      targetProductId: form.appliesTo === "product" ? form.targetProductId.trim() || null : null,
      minOrderAmount: parsedMinOrderAmount,
      startsAt,
      endsAt,
      isActive: form.isActive,
    };

    if (editingId) {
      await updateCouponMutation.mutateAsync({ couponId: editingId, couponData: payload });
    } else {
      await createCouponMutation.mutateAsync(payload);
    }

    handleReset();
  };

  const handleEdit = (coupon: AdminCoupon) => {
    setEditingId(coupon.id);
    setForm(formFromCoupon(coupon));
  };

  const handleDelete = async (coupon: AdminCoupon) => {
    const confirmed = window.confirm(`Delete coupon ${coupon.code}? This cannot be undone.`);
    if (!confirmed) return;

    await deleteCouponMutation.mutateAsync(coupon.id);

    if (editingId === coupon.id) {
      handleReset();
    }
  };

  const handleToggleActive = async (coupon: AdminCoupon) => {
    if (!coupon.startsAt || !coupon.endsAt) {
      toast({
        title: "Dates required",
        description: "Add start and end dates before changing this coupon status.",
        variant: "destructive",
      });
      handleEdit(coupon);
      return;
    }

    await updateCouponMutation.mutateAsync({
      couponId: coupon.id,
      couponData: { isActive: !coupon.isActive },
    });
  };

  if (!isAdminReady) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#efe7d7_100%)] px-6 py-20">
        <div className="theme-card mx-auto max-w-2xl rounded-[2rem] border px-8 py-16 text-center shadow-md">
          <p className="text-theme-heading text-sm font-semibold uppercase tracking-[0.26em]">Loading</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-theme-heading">Preparing coupons</h1>
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
        title="SP Traditional Pickles | Admin Coupons"
        description="Create and manage coupon offers with product and category targeting."
        noIndex
      />

      <AdminLayout title="Coupons">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,249,233,0.98)_0%,rgba(244,251,246,0.98)_50%,rgba(232,243,236,0.98)_100%)] p-5 shadow-[0_14px_42px_rgba(17,51,32,0.1)] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c58a] bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a651a]">
                  <BadgePercent className="h-3.5 w-3.5" />
                  Offers
                </span>
                <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-theme-heading md:text-4xl">
                  Coupon control
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-theme-body">Create and manage discounts by product, category, or all products.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-[1rem] border border-[#d8e5d8] bg-white/80 p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">Total</p>
                  <p className="mt-1 text-xl font-bold text-theme-heading">{summary.total}</p>
                </div>
                <div className="rounded-[1rem] border border-[#bde2cd] bg-[#edf8f1] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1f7a4d]">Active</p>
                  <p className="mt-1 text-xl font-bold text-[#1f7a4d]">{summary.active}</p>
                </div>
                <div className="rounded-[1rem] border border-[#d5d5d5] bg-[#f3f3f3] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#575757]">Inactive</p>
                  <p className="mt-1 text-xl font-bold text-[#575757]">{summary.inactive}</p>
                </div>
                <div className="rounded-[1rem] border border-[#f0c8bf] bg-[#fff0eb] p-3 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b64d39]">Expired</p>
                  <p className="mt-1 text-xl font-bold text-[#b64d39]">{summary.expired}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-[#d8e5d8] bg-white/80 px-3 py-1 text-[11px] font-semibold text-theme-body">
                Scope: All / Category / Product
              </span>
              <span className="rounded-full border border-[#d8e5d8] bg-white/80 px-3 py-1 text-[11px] font-semibold text-theme-body">
                Supports percentage and fixed discounts
              </span>
              <span className="rounded-full border border-[#d8e5d8] bg-white/80 px-3 py-1 text-[11px] font-semibold text-theme-body">
                Active toggle with expiry tracking
              </span>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[440px_minmax(0,1fr)]">
            <section className="rounded-[1.4rem] border border-[#d8e5d8] bg-white/92 p-5 shadow-[0_14px_34px_rgba(18,54,34,0.07)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-theme-heading">{editingId ? "Edit coupon" : "Add coupon"}</h2>
                {editingId ? (
                  <button
                    type="button"
                    onClick={handleReset}
                    className={subtleButtonClass}
                  >
                    New coupon
                  </button>
                ) : null}
              </div>

              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Code
                    <input
                      value={form.code}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          code: event.target.value.toUpperCase().replace(/\s+/g, "-"),
                        }))
                      }
                      placeholder="FESTIVE10"
                      required
                      className={fieldClass}
                    />
                  </label>

                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Title
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Festival offer"
                      required
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label className="space-y-1.5 text-sm font-medium text-theme-body">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={2}
                    placeholder="Optional short note shown in admin."
                    className={fieldClass}
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Discount type
                    <select
                      value={form.discountType}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, discountType: event.target.value as CouponDiscountType }))
                      }
                      className={fieldClass}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed amount (Rs)</option>
                    </select>
                  </label>

                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Value
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.discountValue}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, discountValue: event.target.value }))
                      }
                      placeholder={form.discountType === "percentage" ? "10" : "50"}
                      required
                      className={fieldClass}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Apply to
                    <select
                      value={form.appliesTo}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          appliesTo: event.target.value as CouponScope,
                          targetCategory: "",
                          targetProductId: "",
                        }))
                      }
                      className={fieldClass}
                    >
                      <option value="all">All products</option>
                      <option value="category">Category</option>
                      <option value="product">Single product</option>
                    </select>
                  </label>

                  {form.appliesTo === "category" ? (
                    <label className="space-y-1.5 text-sm font-medium text-theme-body">
                      Category
                      <select
                        value={form.targetCategory}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            targetCategory: event.target.value as CouponCategoryScope,
                          }))
                        }
                        required
                        className={fieldClass}
                      >
                        <option value="">Choose a category</option>
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {form.appliesTo === "product" ? (
                    <label className="space-y-1.5 text-sm font-medium text-theme-body">
                      Product
                      <select
                        value={form.targetProductId}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, targetProductId: event.target.value }))
                        }
                        required
                        className={fieldClass}
                      >
                        <option value="">Choose a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Min order amount
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.minOrderAmount}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, minOrderAmount: event.target.value }))
                      }
                      placeholder={form.discountType === "fixed" ? "Required for fixed" : "Optional for percentage"}
                      required={form.discountType === "fixed"}
                      className={fieldClass}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Starts on
                    <input
                      type="date"
                      value={form.startsAt}
                      onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))}
                      required
                      className={fieldClass}
                    />
                  </label>

                  <label className="space-y-1.5 text-sm font-medium text-theme-body">
                    Ends on
                    <input
                      type="date"
                      value={form.endsAt}
                      onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))}
                      min={form.startsAt || undefined}
                      required
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
                  Coupon is active
                </label>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,122,77,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                    {editingId ? "Update coupon" : "Create coupon"}
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
              <div className="mb-4 rounded-[1rem] border border-[#d6e4d7] bg-[linear-gradient(180deg,#f8fcf9_0%,#eff7f0_100%)] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">Today's active campaigns</p>
                  <span className="rounded-full border border-[#bde2cd] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1f7a4d]">
                    {activeCampaignsToday.length} live
                  </span>
                </div>

                {activeCampaignsToday.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {activeCampaignsToday.slice(0, 6).map((coupon) => (
                      <span
                        key={`campaign-${coupon.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e5d8] bg-white px-2.5 py-1 text-[11px] font-semibold text-theme-heading"
                      >
                        {coupon.code}
                        <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${discountBadgeTone[coupon.discountType]}`}>
                          {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-theme-body">No active campaigns right now.</p>
                )}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-lg font-semibold text-theme-heading">Coupon list</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  {filterOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setFilter(option.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        filter === option.key
                          ? "border-[#c9b995] bg-[#fff8e8] text-theme-heading shadow-sm"
                          : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#c8d8ca] hover:bg-[#f7fbf8]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-body-soft" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by code, title, category, or product"
                  className="w-full rounded-xl border border-[#d8e5d8] bg-[#fcfffc] px-10 py-2.5 text-sm text-theme-heading outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition focus:border-[#b79a52] focus:bg-white focus:ring-2 focus:ring-[#b79a52]/15"
                />
              </div>

              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center gap-2 rounded-xl border border-[#d8e5d8] bg-[#f9fbf9] px-4 py-7 text-sm text-theme-body">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading coupons...
                  </div>
                ) : filteredCoupons.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#d8e5d8] bg-[linear-gradient(180deg,#fbfdfb_0%,#f4f9f5_100%)] px-4 py-9 text-center">
                    <Tag className="mx-auto h-5 w-5 text-theme-body-soft" />
                    <p className="mt-2 text-sm font-semibold text-theme-heading">No coupons in this view</p>
                    <p className="mt-1 text-xs text-theme-body">Create one on the left to see it here instantly.</p>
                  </div>
                ) : (
                  filteredCoupons.map((coupon, index) => {
                    const status = statusMeta(coupon);

                    return (
                      <article
                        key={coupon.id}
                        className="rounded-[1rem] border border-[#d8e5d8] bg-white p-4 shadow-[0_10px_24px_rgba(18,54,34,0.06)] transition hover:-translate-y-[1px] hover:shadow-[0_14px_28px_rgba(18,54,34,0.09)]"
                        style={{
                          opacity: cardsVisible ? 1 : 0,
                          transform: cardsVisible ? "translateY(0)" : "translateY(8px)",
                          transition: `opacity 360ms ease, transform 420ms ease`,
                          transitionDelay: `${Math.min(index * 70, 420)}ms`,
                        }}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-[#ead9a2] bg-[#fff8e8] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#8a651a]">
                                {coupon.code}
                              </span>
                              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${discountBadgeTone[coupon.discountType]}`}>
                                {coupon.discountType === "percentage" ? "Percentage" : "Fixed"}
                              </span>
                              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${status.tone}`}>
                                {status.label}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-theme-heading">{coupon.title}</h3>
                            <p className="text-sm text-theme-body">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% off`
                                : `${formatCurrency(coupon.discountValue)} off`} | {applyLabel(coupon)}
                            </p>
                            {coupon.description ? <p className="text-sm text-theme-body-soft">{coupon.description}</p> : null}
                            <p className="text-xs text-theme-body-soft">
                              Valid: {formatDateTime(coupon.startsAt)} to {formatDateTime(coupon.endsAt)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(coupon)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(coupon)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#d8e5d8] bg-white px-3 py-1.5 text-xs font-semibold text-theme-body transition hover:border-[#c8d8ca] hover:bg-[#f7fbf8] hover:text-theme-heading"
                            >
                              {coupon.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(coupon)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#f0c8bf] px-3 py-1.5 text-xs font-semibold text-[#b64d39] transition hover:bg-[#fff2ed]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminCouponsPage;
