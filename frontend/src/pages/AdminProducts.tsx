/**
 * Admin Products Page
 * Manage product inventory
 */
import { useState } from "react";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/lib/api";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminStockToggle } from "@/components/admin/AdminStockToggle";
import { type ProductCategory } from "@/data/site";
import { formatCurrency } from "@/lib/pricing";
import { Plus, Edit2, Trash2, Package, Box } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

interface ProductForm {
  name: string;
  category: ProductCategory;
  price_per_kg: number;
  image: string;
  description: string;
  isAvailable: boolean;
}

export function AdminProducts() {
  const { data: products = [], isLoading } = useProductsQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "stock">("products");
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category: "pickles",
    price_per_kg: 0,
    image: "",
    description: "",
    isAvailable: true,
  });

  const handleReset = () => {
    setForm({
      name: "",
      category: "pickles",
      price_per_kg: 0,
      image: "",
      description: "",
      isAvailable: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ productId: editingId, productData: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      handleReset();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      category: product.category,
      price_per_kg: product.price_per_kg,
      image: product.image,
      description: product.description,
      isAvailable: product.isAvailable,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-mint/12">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-3 font-semibold text-sm transition-colors ${
              activeTab === "products"
                ? "text-theme-heading border-b-2 border-gold"
                : "text-theme-body hover:text-theme-heading"
            }`}
          >
            <Package className="inline-block w-4 h-4 mr-2" />
            Catalog
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-3 font-semibold text-sm transition-colors ${
              activeTab === "stock"
                ? "text-theme-heading border-b-2 border-gold"
                : "text-theme-body hover:text-theme-heading"
            }`}
          >
            <Box className="inline-block w-4 h-4 mr-2" />
            Stock
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "stock" && <AdminStockToggle />}

        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Header with CTA */}
            <div className="flex items-center justify-between">
              <p className="text-theme-body">
                Manage your product catalog. Click a product to edit or delete.
              </p>
              <button
                onClick={() => {
                  if (showForm) handleReset();
                  else setShowForm(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-theme-on-accent hover:bg-gold-hover"
              >
                <Plus className="w-4 h-4" />
                {showForm ? "Cancel" : "Add Product"}
              </button>
            </div>

        {/* Product Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="theme-card rounded-xl border p-6 shadow-sm space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Product name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="theme-input rounded-lg border px-4 py-2"
              />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ProductCategory })
                }
                className="theme-input rounded-lg border px-4 py-2"
              >
                <option value="pickles">Pickles</option>
                <option value="powders">Podi</option>
                <option value="snacks">Snacks</option>
                <option value="special">Specials</option>
              </select>

              <input
                type="number"
                placeholder="Price per KG"
                value={form.price_per_kg || ""}
                onChange={(e) =>
                  setForm({ ...form, price_per_kg: Number(e.target.value) })
                }
                required
                className="theme-input rounded-lg border px-4 py-2"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
                className="theme-input rounded-lg border px-4 py-2"
              />
            </div>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="theme-input w-full rounded-lg border px-4 py-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-theme-strong text-sm font-semibold">
                Available for purchase
              </span>
            </label>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-mint/18 px-4 py-2 font-semibold text-theme-strong hover:bg-gold/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="rounded-lg bg-gold px-4 py-2 font-semibold text-theme-on-accent hover:bg-gold-hover disabled:opacity-50"
              >
                {editingId ? "Update" : "Create"} Product
              </button>
            </div>
          </form>
        )}

        {/* Products Table */}
        <div className="theme-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="theme-card-soft border-b border-mint/12">
                <tr>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Image
                  </th>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="text-theme-heading px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-theme-body px-6 py-8 text-center">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-theme-body px-6 py-8 text-center">
                      No products yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-mint/12 hover:bg-gold/6"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </td>
                      <td className="text-theme-strong px-6 py-4 text-sm font-semibold">
                        {product.name}
                      </td>
                      <td className="text-theme-body px-6 py-4 text-sm">
                        {product.category}
                      </td>
                      <td className="text-theme-strong px-6 py-4 text-sm font-semibold">
                        {formatCurrency(product.price_per_kg)}/kg
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isAvailable
                              ? "bg-gold/18 text-theme-on-accent"
                              : "bg-forest-dark text-theme-body"
                          }`}
                        >
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-theme-heading rounded-lg p-2 hover:bg-gold/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-theme-body rounded-lg p-2 hover:bg-forest-dark/70 hover:text-theme-heading"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminProducts;
