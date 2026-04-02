import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { type ProductRecord } from "@/data/site";
import { useWishlist } from "@/components/WishlistProvider";

type WishlistButtonProps = {
  product: ProductRecord;
  className?: string;
};

const WishlistButton = ({ product, className = "" }: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
    exit: {
      scale: 0,
      rotate: 180,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        inWishlist
          ? "bg-[#8B0000]/10 text-[#8B0000] shadow-sm"
          : "bg-[#2E5C3E] text-theme-body hover:bg-[#356947] hover:text-theme-heading"
      } ${className}`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        key={inWishlist ? "filled" : "empty"}
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Heart
          className="h-5 w-5"
          fill={inWishlist ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
