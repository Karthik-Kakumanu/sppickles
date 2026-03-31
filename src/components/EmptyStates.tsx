/**
 * Empty States - Reusable empty state components
 */
import { ShoppingBag, ShoppingCart, AlertCircle } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";
import { useNavigate } from "react-router-dom";

export function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-[#8B0000]/20 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
      <p className="text-gray-600 max-w-md mt-2">
        We couldn't find any products matching your search. Try adjusting your filters or browse all products.
      </p>
    </div>
  );
}

export function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingCart className="w-16 h-16 text-[#8B0000]/20 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">Your Cart is Empty</h3>
      <p className="text-gray-600 max-w-md mt-2">
        Start shopping to add products to your cart!
      </p>
      <SecondaryButton
        onClick={() => navigate("/products")}
        className="mt-6"
      >
        Continue Shopping
      </SecondaryButton>
    </div>
  );
}

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-16 h-16 text-[#8B0000]/20 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">No Orders Yet</h3>
      <p className="text-gray-600 max-w-md mt-2">
        You haven't placed any orders yet. Start by exploring our products!
      </p>
    </div>
  );
}

export function LoadingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="w-16 h-16 text-red-500/50 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">Something Went Wrong</h3>
      <p className="text-gray-600 max-w-md mt-2">
        We encountered an error loading the content. Please try again.
      </p>
      <SecondaryButton onClick={onRetry} className="mt-6">
        Try Again
      </SecondaryButton>
    </div>
  );
}
