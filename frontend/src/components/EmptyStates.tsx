/**
 * Empty States - Reusable empty state components
 */
import { useNavigate } from "react-router-dom";
import { AlertCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

export function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingBag className="mb-4 h-16 w-16 text-gold/20" />
      <h3 className="text-theme-heading text-xl font-semibold">No Products Found</h3>
      <p className="text-theme-body mt-2 max-w-md">
        We couldn't find any products matching your search. Try adjusting your filters or browse all products.
      </p>
    </div>
  );
}

export function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingCart className="mb-4 h-16 w-16 text-gold/20" />
      <h3 className="text-theme-heading text-xl font-semibold">Your Cart is Empty</h3>
      <p className="text-theme-body mt-2 max-w-md">
        Start shopping to add products to your cart!
      </p>
      <PrimaryButton onClick={() => navigate("/products")} className="mt-6">
        Continue Shopping
      </PrimaryButton>
    </div>
  );
}

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="mb-4 h-16 w-16 text-gold/20" />
      <h3 className="text-theme-heading text-xl font-semibold">No Orders Yet</h3>
      <p className="text-theme-body mt-2 max-w-md">
        You haven't placed any orders yet. Start by exploring our products!
      </p>
    </div>
  );
}

export function LoadingError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="mb-4 h-16 w-16 text-gold/50" />
      <h3 className="text-theme-heading text-xl font-semibold">Something Went Wrong</h3>
      <p className="text-theme-body mt-2 max-w-md">
        We encountered an error loading the content. Please try again.
      </p>
      <PrimaryButton onClick={onRetry} className="mt-6">
        Try Again
      </PrimaryButton>
    </div>
  );
}
