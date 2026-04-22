import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  BadgeCheck,
  Box,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminStockToggle } from "@/components/admin/AdminStockToggle";
import Seo from "@/components/Seo";
import { defaultProducts, type ProductCategory, type ProductRecord } from "@/data/site";
import { resolvePickleImage } from "@/lib/pickleImages";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  usePermanentDeleteProductMutation,
  useProductsQuery,
  useRestoreProductMutation,
  useUpdateProductMutation,
} from "@/lib/api";
import { formatCurrency } from "@/lib/pricing";

type ProductFormState = {
  name: string;
  category: ProductCategory;
  subcategory: "salt" | "asafoetida" | "";
  price_per_kg: string;
  image: string;
  description: string;
  customTag: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  isBrahminHeritage: boolean;
  isGreenTouch: boolean;
};

type CatalogFilter = "all" | "salted-pickles" | "tempered-pickles" | "powders" | "fryums";

const emptyForm = (): ProductFormState => ({
  name: "",
  category: "pickles",
  subcategory: "salt",
  price_per_kg: "",
  image: "",
  description: "",
  customTag: "",
  isAvailable: true,
  isBestSeller: false,
  isBrahminHeritage: true,
  isGreenTouch: true,
});

const formFromProduct = (product: ProductRecord): ProductFormState => ({
  name: product.name,
  category: product.category,
  subcategory: product.subcategory ?? "",
  price_per_kg: String(product.price_per_kg ?? ""),
  image: product.image,
  description: product.description,
  customTag: String(product.customTag ?? ""),
  isAvailable: Boolean(product.isAvailable),
  isBestSeller: Boolean(product.isBestSeller),
  isBrahminHeritage: Boolean(product.isBrahminHeritage ?? true),
  isGreenTouch: Boolean(product.isGreenTouch ?? true),
});

const categoryLabel: Record<ProductCategory, string> = {
  pickles: "Pickles",
  powders: "Podulu",
  fryums: "Fryums",
};

const productCountClass = "rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-[0_14px_36px_rgba(18,54,34,0.08)] backdrop-blur-xl";

const buildImageLookup = (products: ProductRecord[]) => {
  const lookup = new Map<string, string>();

  for (const product of products) {
    if (!lookup.has(product.name)) {
      lookup.set(product.name, product.image);
    }
  }

  return lookup;
};

const resolveAdminProductImage = (product: ProductRecord, imageLookup: Map<string, string>) => {
  const explicitImage = String(product.image ?? "").trim();
  if (explicitImage) {
    return explicitImage;
  }

  const knownImage = imageLookup.get(product.name)?.trim();
  if (knownImage) {
    return knownImage;
  }

  if (product.category === "pickles") {
    return resolvePickleImage(product.name);
  }

  return "";
};

export function AdminProducts() {
  const { data: products = [], isLoading, isFetching } = useProductsQuery();
  const { data: deletedProducts = [], isLoading: isDeletedLoading, isFetching: isDeletedFetching } = useProductsQuery(null, true);
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const restoreMutation = useRestoreProductMutation();
  const permanentDeleteMutation = usePermanentDeleteProductMutation();

  const [activeTab, setActiveTab] = useState<"catalog" | "stock">("catalog");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>("all");
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [previewAspectRatio, setPreviewAspectRatio] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageLookup = useMemo(() => buildImageLookup(defaultProducts), []);

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    restoreMutation.isPending ||
    permanentDeleteMutation.isPending;

  const categoryFilteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (catalogFilter === "all") return true;
      if (catalogFilter === "fryums") return product.category === "fryums";
      if (catalogFilter === "powders") return product.category === "powders";
      if (catalogFilter === "salted-pickles") {
        return product.category === "pickles" && product.subcategory === "salt";
      }

      return product.category === "pickles" && product.subcategory === "asafoetida";
    });
  }, [catalogFilter, products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categoryFilteredProducts;
    }

    return categoryFilteredProducts.filter((product) => {
      const haystack = [product.name, product.description, product.category, product.id]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [categoryFilteredProducts, searchQuery]);

  const summary = useMemo(() => {
    const counts = filteredProducts.reduce(
      (accumulator, product) => {
        accumulator.total += 1;
        if (product.isAvailable) accumulator.inStock += 1;
        else accumulator.outOfStock += 1;
        return accumulator;
      },
      {
        total: 0,
        inStock: 0,
        outOfStock: 0,
      },
    );

    return counts;
  }, [filteredProducts]);

  const productPreviewImage = form.image.trim();

  const handleReset = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
    setPreviewAspectRatio(null);
    setIsUploading(false);
  };

  const handleEdit = (product: ProductRecord) => {
    setForm(formFromProduct(product));
    setEditingId(product.id);
    setShowForm(false);
    setPreviewAspectRatio(null);
    setActiveTab("catalog");
  };

  const handleDelete = async (product: ProductRecord) => {
    const confirmed = window.confirm(`Delete ${product.name}? It will move to Deleted products and can be restored.`);

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync(product.id);

    if (editingId === product.id) {
      handleReset();
    }
  };

  const handleRestoreArchived = async (product: ProductRecord) => {
    await restoreMutation.mutateAsync(product.id);
  };

  const handlePermanentDeleteArchived = async (product: ProductRecord) => {
    const confirmed = window.confirm(
      `Permanently delete ${product.name}? This removes it completely and it cannot be restored.`,
    );

    if (!confirmed) {
      return;
    }

    await permanentDeleteMutation.mutateAsync(product.id);
  };

  const handleRemoveImage = () => {
    setForm((current) => ({ ...current, image: "" }));
    setPreviewAspectRatio(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalImage = productPreviewImage.trim();

    if (!finalImage) {
      window.alert("Please upload a product image from your device before saving.");
      return;
    }

    const payload = {
      ...form,
      price_per_kg: Number(form.price_per_kg),
      customTag: form.customTag.trim() ? form.customTag.trim() : undefined,
      subcategory: form.category === "pickles" && form.subcategory ? form.subcategory : undefined,
      image: finalImage,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ productId: editingId, productData: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    handleReset();
    window.location.reload();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      window.alert("File is too large! Please upload an image under 5MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setForm((current) => ({ ...current, image: reader.result as string }));
      setPreviewAspectRatio(null);
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout title="Products">
      <Seo
        title="SP Traditional Pickles | Admin Products"
        description="Premium database-backed product management for the admin team."
        noIndex
      />

      <div className="space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,249,233,0.96)_0%,rgba(244,251,246,0.96)_48%,rgba(232,243,236,0.98)_100%)] p-5 shadow-[0_18px_60px_rgba(17,51,32,0.1)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c58a] bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#8a651a]">
                <Sparkles className="h-3.5 w-3.5" />
                Premium catalog control
              </span>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-theme-heading md:text-4xl">
                  Product overview
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-theme-body md:text-[0.96rem]">
                  Add, edit, and manage stock.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className={productCountClass}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">Products</p>
                  <p className="mt-2 text-2xl font-extrabold text-theme-heading">{summary.total}</p>
                </div>
                <div className={productCountClass}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">In stock</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#1f7a4d]">{summary.inStock}</p>
                </div>
                <div className={productCountClass}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">Out of stock</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#b64d39]">{summary.outOfStock}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm());
                  setPreviewAspectRatio(null);
                  setShowForm((current) => !current);
                  setActiveTab("catalog");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,122,77,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_18px_36px_rgba(31,122,77,0.28)] sm:col-span-2"
              >
                <Plus className="h-4 w-4" />
                {showForm ? "Close add form" : "Add product"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("catalog")}
                className={`rounded-[1.1rem] border px-4 py-3 text-sm font-semibold transition ${
                  activeTab === "catalog"
                    ? "border-[#c9b995] bg-[#fff8e8] text-theme-heading"
                    : "border-[#d8e5d8] bg-white text-theme-body hover:text-theme-heading"
                }`}
              >
                <Package className="mr-2 inline h-4 w-4" />
                Catalog
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stock")}
                className={`rounded-[1.1rem] border px-4 py-3 text-sm font-semibold transition ${
                  activeTab === "stock"
                    ? "border-[#c9b995] bg-[#fff8e8] text-theme-heading"
                    : "border-[#d8e5d8] bg-white text-theme-body hover:text-theme-heading"
                }`}
              >
                <Box className="mr-2 inline h-4 w-4" />
                Stock
              </button>
            </div>
          </div>
        </section>

        {activeTab === "stock" ? (
          <AdminStockToggle />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[#d8e5d8] bg-white/85 p-4 shadow-sm backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">
                  Product catalog
                </p>
                <h2 className="mt-1 text-xl font-semibold text-theme-heading">
                  Search, edit, and publish product changes.
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([
                    { key: "all", label: "All" },
                    { key: "salted-pickles", label: "Salted pickles" },
                    { key: "tempered-pickles", label: "Tempered pickles" },
                    { key: "powders", label: "Powders" },
                    { key: "fryums", label: "Fryums" },
                  ] as Array<{ key: CatalogFilter; label: string }>).map((filterOption) => (
                    <button
                      key={filterOption.key}
                      type="button"
                      onClick={() => setCatalogFilter(filterOption.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        catalogFilter === filterOption.key
                          ? "border-[#c9b995] bg-[#fff8e8] text-theme-heading"
                          : "border-[#d8e5d8] bg-white text-theme-body hover:border-[#bfd2c1] hover:text-theme-heading"
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex w-full max-w-md items-center gap-3 rounded-[1rem] border border-[#d8e5d8] bg-[#fbfdfb] px-4 py-3 text-sm text-theme-body shadow-inner">
                <Search className="h-4 w-4 flex-shrink-0 text-theme-body-soft" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search product name, category, or id"
                  className="w-full bg-transparent outline-none placeholder:text-theme-body-soft"
                />
              </label>
            </div>

            {showForm ? (
              <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_44px_rgba(18,54,34,0.08)] backdrop-blur-xl sm:p-6"
              >
                <div className="flex flex-col gap-2 border-b border-[#e5eee5] pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">
                      {editingId ? "Edit product" : "New product"}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-theme-heading">
                      {editingId ? "Modify the selected product" : "Create a catalog entry"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-sm font-semibold text-theme-body transition hover:border-[#c6d8c7] hover:text-theme-heading"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Name</span>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                        className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                        placeholder="Avakaya Premium"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Category</span>
                        <select
                          value={form.category}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              category: event.target.value as ProductCategory,
                              subcategory: event.target.value === "pickles" ? current.subcategory || "salt" : "",
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                        >
                          <option value="pickles">Pickles</option>
                          <option value="powders">Podulu</option>
                          <option value="fryums">Fryums</option>
                        </select>
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Price per kg</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={form.price_per_kg}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, price_per_kg: event.target.value }))
                          }
                          className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                          placeholder="750"
                        />
                      </label>
                    </div>

                    {form.category === "pickles" ? (
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Pickle type</span>
                        <select
                          value={form.subcategory}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              subcategory: event.target.value as ProductFormState["subcategory"],
                            }))
                          }
                          className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                        >
                          <option value="salt">Salt</option>
                          <option value="asafoetida">Asafoetida</option>
                        </select>
                      </label>
                    ) : null}

                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full rounded-xl border border-dashed border-[#d8e5d8] bg-[#fbfdfb] px-4 py-3 text-sm text-theme-body file:mr-4 file:rounded-full file:border-0 file:bg-[#1f7a4d] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-[#bfd2c1]"
                      />
                      {isUploading ? (
                        <p className="text-xs font-semibold text-[#1f7a4d]">Processing image...</p>
                      ) : (
                        <p className="text-xs text-theme-body-soft">
                          Select an image from your device.
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="block space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">
                          Product tag (optional)
                        </span>
                        <span className="text-xs font-semibold text-theme-body-soft">
                          {form.customTag.length}/30
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={30}
                        value={form.customTag}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, customTag: event.target.value.slice(0, 30) }))
                        }
                        className="h-12 w-full rounded-xl border border-[#d8e5d8] bg-white px-4 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                        placeholder="Best Seller, Seasonal, Limited Batch"
                      />
                      <p className="text-xs text-theme-body-soft">
                        This optional tag will be available for storefront display later.
                      </p>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Description</span>
                      <textarea
                        rows={8}
                        value={form.description}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, description: event.target.value }))
                        }
                        className="w-full rounded-xl border border-[#d8e5d8] bg-white px-4 py-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d] focus:ring-2 focus:ring-[#1f7a4d]/15"
                        placeholder="Write a clear product description, benefits, and usage notes. (Optional)"
                      />
                    </label>

                    <div className="overflow-hidden rounded-[1.3rem] border border-[#d8e5d8] bg-[#f8fbf8]">
                      <div className="flex items-center justify-between gap-3 border-b border-[#e1ebe1] px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ImagePlus className="h-4 w-4 text-theme-body-soft" />
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-theme-body-soft">Preview</p>
                        </div>
                        {productPreviewImage ? (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="rounded-full border border-[#f0c8bf] bg-[#fff4f1] px-3 py-1 text-[11px] font-semibold text-[#b64d39] transition hover:bg-[#ffe9e2]"
                          >
                            Clear image
                          </button>
                        ) : null}
                      </div>
                      <div className="p-3">
                        {productPreviewImage ? (
                          <div
                            className="overflow-hidden rounded-[1rem] border border-[#e5eee5] bg-white"
                            style={{ aspectRatio: previewAspectRatio ? `${previewAspectRatio}` : "4 / 3" }}
                          >
                            <img
                              src={productPreviewImage}
                              alt={form.name || "Product preview"}
                              className="h-full w-full object-contain"
                              onLoad={(event) => {
                                const img = event.currentTarget;
                                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                  setPreviewAspectRatio(img.naturalWidth / img.naturalHeight);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-48 items-center justify-center rounded-[1rem] border border-dashed border-[#d8e5d8] bg-white text-sm text-theme-body-soft">
                            Upload an image from your device to preview it here.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-[#e5eee5] pt-4 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-5 py-3 text-sm font-semibold text-theme-body transition hover:border-[#c6d8c7] hover:text-theme-heading"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,122,77,0.24)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    {editingId ? "Save changes" : "Create product"}
                  </button>
                </div>
              </form>
            ) : null}

            {isLoading ? (
              <div className="rounded-[1.5rem] border border-[#d8e5d8] bg-white/85 p-6 text-center text-sm font-semibold text-theme-body shadow-sm">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-[#d8e5d8] bg-white/85 p-6 text-center shadow-sm">
                <p className="text-lg font-semibold text-theme-heading">No products found</p>
                <p className="mt-2 text-sm text-theme-body">
                  Try a different search.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/90 shadow-[0_14px_38px_rgba(18,54,34,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(18,54,34,0.12)]"
                  >
                    <div className="relative h-52 overflow-hidden bg-[#f3f7f3]">
                      <img
                        src={resolveAdminProductImage(product, imageLookup)}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-theme-heading">
                          {categoryLabel[product.category]}
                        </span>
                        {product.customTag ? (
                          <span className="rounded-full border border-[#ecd7ad] bg-[#fff6df] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8a651a]">
                            {product.customTag}
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                            product.isAvailable
                              ? "border border-[#cde8d7] bg-[#eaf8ef] text-[#1f7a4d]"
                              : "border border-[#f0c8bf] bg-[#fff0eb] text-[#b64d39]"
                          }`}
                        >
                          {product.isAvailable ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                      {product.isBestSeller ? (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Best seller
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-4 p-5">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold text-theme-heading">{product.name}</h3>
                            <p className="mt-1 text-sm text-theme-body">{product.description}</p>
                          </div>
                          <p className="text-right text-lg font-extrabold text-theme-heading">
                            {formatCurrency(product.price_per_kg)}
                            <span className="ml-1 text-xs font-semibold text-theme-body-soft">/kg</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-theme-body">
                        <div className="rounded-xl bg-[#f8fbf8] p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                            Product ID
                          </p>
                          <p className="mt-1 break-all font-semibold text-theme-heading">{product.id}</p>
                        </div>
                        <div className="rounded-xl bg-[#f8fbf8] p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                            Subcategory
                          </p>
                          <p className="mt-1 font-semibold text-theme-heading">{product.subcategory ?? "—"}</p>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-sm font-semibold text-theme-heading transition hover:border-[#b9d7be] hover:bg-[#f7fbf8]"
                        >
                          <Plus className="h-4 w-4 rotate-45" />
                          Edit details
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(product)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#f0c8bf] bg-[#fff4f1] px-4 py-2 text-sm font-semibold text-[#b64d39] transition hover:bg-[#ffe9e2] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          Move to deleted
                        </button>
                      </div>

                      {editingId === product.id ? (
                        <form
                          onSubmit={handleSubmit}
                          className="mt-4 space-y-3 rounded-2xl border border-[#d8e5d8] bg-[#f8fbf8] p-4"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-body-soft">
                            Edit this product
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                              className="h-11 rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                              placeholder="Product name"
                            />
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              value={form.price_per_kg}
                              onChange={(event) =>
                                setForm((current) => ({ ...current, price_per_kg: event.target.value }))
                              }
                              className="h-11 rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                              placeholder="Price per kg"
                            />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <select
                              value={form.category}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  category: event.target.value as ProductCategory,
                                  subcategory: event.target.value === "pickles" ? current.subcategory || "salt" : "",
                                }))
                              }
                              className="h-11 rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                            >
                              <option value="pickles">Pickles</option>
                              <option value="powders">Podulu</option>
                              <option value="fryums">Fryums</option>
                            </select>
                            {form.category === "pickles" ? (
                              <select
                                value={form.subcategory}
                                onChange={(event) =>
                                  setForm((current) => ({
                                    ...current,
                                    subcategory: event.target.value as ProductFormState["subcategory"],
                                  }))
                                }
                                className="h-11 rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                              >
                                <option value="salt">Salt</option>
                                <option value="asafoetida">Asafoetida</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                maxLength={30}
                                value={form.customTag}
                                onChange={(event) =>
                                  setForm((current) => ({ ...current, customTag: event.target.value.slice(0, 30) }))
                                }
                                className="h-11 rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                                placeholder="Optional tag (max 30 chars)"
                              />
                            )}
                          </div>

                          {form.category === "pickles" ? (
                            <input
                              type="text"
                              maxLength={30}
                              value={form.customTag}
                              onChange={(event) =>
                                setForm((current) => ({ ...current, customTag: event.target.value.slice(0, 30) }))
                              }
                              className="h-11 w-full rounded-xl border border-[#d8e5d8] bg-white px-3 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                              placeholder="Optional tag (max 30 chars)"
                            />
                          ) : null}

                          <div className="space-y-2 rounded-2xl border border-[#d8e5d8] bg-white p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-theme-body-soft">
                                Product image
                              </span>
                              {productPreviewImage ? (
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="rounded-full border border-[#f0c8bf] bg-[#fff4f1] px-3 py-1 text-[11px] font-semibold text-[#b64d39] transition hover:bg-[#ffe9e2]"
                                >
                                  Clear image
                                </button>
                              ) : null}
                            </div>

                            {productPreviewImage ? (
                              <div
                                className="overflow-hidden rounded-xl border border-[#e5eee5] bg-[#fbfdfb]"
                                style={{ aspectRatio: previewAspectRatio ? `${previewAspectRatio}` : "4 / 3" }}
                              >
                                <img
                                  src={productPreviewImage}
                                  alt={form.name || "Product preview"}
                                  className="h-full w-full object-contain"
                                  onLoad={(event) => {
                                    const img = event.currentTarget;
                                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                      setPreviewAspectRatio(img.naturalWidth / img.naturalHeight);
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-[#d8e5d8] bg-[#fbfdfb] text-center text-xs font-semibold text-theme-body-soft">
                                Upload a replacement image before saving.
                              </div>
                            )}

                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="block w-full rounded-xl border border-dashed border-[#d8e5d8] bg-white px-3 py-2 text-xs text-theme-body file:mr-3 file:rounded-full file:border-0 file:bg-[#1f7a4d] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                            />
                            {isUploading ? (
                              <p className="mt-2 text-xs font-semibold text-[#1f7a4d]">Processing image...</p>
                            ) : null}
                          </div>

                          <textarea
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                              setForm((current) => ({ ...current, description: event.target.value }))
                            }
                            className="w-full rounded-xl border border-[#d8e5d8] bg-white px-3 py-2 text-sm text-theme-heading outline-none transition focus:border-[#1f7a4d]"
                            placeholder="Description (optional)"
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={handleReset}
                              className="inline-flex items-center justify-center rounded-full border border-[#d8e5d8] bg-white px-4 py-2 text-sm font-semibold text-theme-body transition hover:border-[#c6d8c7]"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSaving || isUploading}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#1f7a4d_0%,#165b38_100%)] px-4 py-2 text-sm font-semibold !text-white"
                              style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                            >
                              {isSaving || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                              Save changes
                            </button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}

            <section className="space-y-4 rounded-[1.8rem] border border-[#d8e5d8] bg-white/90 p-5 shadow-[0_18px_44px_rgba(18,54,34,0.08)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-2 border-b border-[#e5eee5] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-theme-body-soft">
                    Deleted products
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-theme-heading">
                    Restore or permanently delete items.
                  </h3>
                </div>
                <p className="text-sm font-semibold text-theme-body">
                  {deletedProducts.length} recoverable product{deletedProducts.length === 1 ? "" : "s"}
                </p>
              </div>

              {isDeletedLoading ? (
                <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-[#fbfdfb] p-5 text-center text-sm text-theme-body-soft">
                  Loading deleted products...
                </div>
              ) : deletedProducts.length === 0 ? (
                <div className="rounded-[1.2rem] border border-dashed border-[#d8e5d8] bg-[#fbfdfb] p-5 text-center text-sm text-theme-body-soft">
                  Nothing has been deleted yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {deletedProducts.map((product) => (
                    <article
                      key={`deleted-${product.id}`}
                      className="overflow-hidden rounded-[1.5rem] border border-[#ead7d2] bg-[#fff8f5] shadow-[0_12px_28px_rgba(182,77,57,0.08)]"
                    >
                      <div className="relative h-52 overflow-hidden bg-[#f3f7f3]">
                        <img
                          src={resolveAdminProductImage(product, imageLookup)}
                          alt={product.name}
                          className="h-full w-full object-cover opacity-80"
                        />
                        <span className="absolute left-4 top-4 rounded-full border border-[#f0c8bf] bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#b64d39]">
                          Deleted
                        </span>
                      </div>

                      <div className="space-y-3 p-4">
                        <div>
                          <h4 className="text-lg font-semibold text-theme-heading">{product.name}</h4>
                          <p className="mt-1 text-sm text-theme-body">{product.description}</p>
                        </div>

                        <div className="grid gap-2">
                          <button
                            type="button"
                            onClick={() => void handleRestoreArchived(product)}
                            disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1f7a4d] px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#165b38] disabled:cursor-not-allowed disabled:opacity-60"
                            style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
                          >
                            {restoreMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 rotate-180" />}
                            Restore product
                          </button>

                          <button
                            type="button"
                            onClick={() => void handlePermanentDeleteArchived(product)}
                            disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#f0c8bf] bg-white px-4 py-2.5 text-sm font-semibold text-[#b64d39] transition hover:bg-[#fff2ed] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {permanentDeleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Delete permanently
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
