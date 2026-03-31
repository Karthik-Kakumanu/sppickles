import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

type StockIndicatorProps = {
  isAvailable: boolean;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
};

const getStockStatus = (isAvailable: boolean): StockStatus => {
  return isAvailable ? "in-stock" : "out-of-stock";
};

const StockIndicator = ({
  isAvailable,
  className = "",
  showLabel = true,
  compact = false,
}: StockIndicatorProps) => {
  const status = getStockStatus(isAvailable);

  const statusConfig = {
    "in-stock": {
      icon: CheckCircle,
      label: "In Stock",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      badgeColor: "bg-green-100",
      dotColor: "bg-green-600",
    },
    "low-stock": {
      icon: AlertCircle,
      label: "Limited Stock",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      badgeColor: "bg-yellow-100",
      dotColor: "bg-yellow-600",
    },
    "out-of-stock": {
      icon: TrendingDown,
      label: "Out of Stock",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      badgeColor: "bg-red-100",
      dotColor: "bg-red-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={cn("inline-flex items-center gap-1.5", className)}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn("h-2 w-2 rounded-full", config.dotColor)}
        />
        {showLabel && (
          <span className={cn("text-xs font-semibold", config.textColor)}>
            {config.label}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-2 border",
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: status === "in-stock" ? [1, 1.15, 1] : [1, 0.9, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={cn("h-4 w-4", config.textColor)} />
        </motion.div>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-semibold", config.textColor)}>
          {config.label}
        </span>
      )}
    </motion.div>
  );
};

export default StockIndicator;
