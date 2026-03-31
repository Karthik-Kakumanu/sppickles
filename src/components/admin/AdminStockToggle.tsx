/**
 * Admin Stock Toggle Component
 * Manage product stock availability
 */
import { useEffect, useState } from "react";
import { useStockQuery, useUpdateStockMutation } from "@/lib/api";
import { defaultProducts } from "@/data/site";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, Check } from "lucide-react";

export function AdminStockToggle() {
  const { data: stockMap, isLoading } = useStockQuery();
  const updateMutation = useUpdateStockMutation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = defaultProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.nameTeluguguTelugu?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleToggle = async (productId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    try {
      await updateMutation.mutateAsync({
        productId,
        isAvailable: newStatus,
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B0000]" />
        <span className="ml-2 text-[#6b5643]">Loading stock data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[#6b5643]">
          Toggle stock availability for each product. Updates are saved instantly.
        </p>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg border border-[#eadfce] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />
      </div>

      <div className="grid gap-3">
        {filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-[#eadfce] bg-[#fef7f0] py-12">
            <AlertCircle className="h-5 w-5 text-[#8B0000]" />
            <span className="ml-2 text-[#6b5643]">No products found</span>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isAvailable = stockMap?.get(product.id) ?? true;
            const isUpdating = updateMutation.isPending && 
              updateMutation.variables?.productId === product.id;

            return (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-[#eadfce] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-[#241612]">{product.name}</h4>
                  {product.nameTeluguguTelugu && (
                    <p className="text-sm text-[#8B0000]">{product.nameTeluguguTelugu}</p>
                  )}
                  <p className="text-xs text-[#9b6a27] uppercase tracking-[0.18em]">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${
                    isAvailable ? "text-green-600" : "text-red-600"
                  }`}>
                    {isAvailable ? "In Stock" : "Out of Stock"}
                  </span>

                  <button
                    onClick={() => handleToggle(product.id, isAvailable)}
                    disabled={isUpdating}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      isAvailable ? "bg-green-500" : "bg-red-500"
                    } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform ${
                        isAvailable ? "translate-x-6" : "translate-x-1"
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3 w-3 animate-spin text-[#8B0000]" />
                      ) : (
                        <Check className="h-3 w-3 text-green-500" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="rounded-lg border border-[#eadfce] bg-[#fef7f0] p-4 text-sm text-[#6b5643]">
          <p className="font-semibold text-[#8B0000] mb-1">💡 Tip:</p>
          Products default to "In Stock". Toggle to "Out of Stock" to prevent orders for that item.
          Customers will see the "Out of Stock" label on the product card.
        </div>
      )}
    </div>
  );
}
