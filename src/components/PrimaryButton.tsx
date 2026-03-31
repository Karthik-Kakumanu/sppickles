import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary";
  pulse?: boolean;
};

type PrimaryButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    to?: string;
  };

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b1e1e]/20 disabled:cursor-not-allowed disabled:border-[#d8d0ca] disabled:bg-[#d8d0ca] disabled:text-[#7b7168] disabled:shadow-none";

const variantClasses = {
  primary:
    "border-[#8b1e1e] bg-[#8b1e1e] text-white shadow-md hover:-translate-y-0.5 hover:bg-[#741616] hover:shadow-lg",
  secondary:
    "border-[#8b1e1e]/20 bg-transparent text-[#8b1e1e] shadow-sm hover:-translate-y-0.5 hover:border-[#8b1e1e]/40 hover:bg-[#8b1e1e]/5 hover:shadow-md",
};

const PrimaryButton = ({
  children,
  className,
  href,
  icon,
  pulse = false,
  to,
  type = "button",
  variant = "primary",
  ...props
}: PrimaryButtonProps) => {
  const classes = cn(baseClasses, variantClasses[variant], pulse && "cta-pulse", className);
  const wrapperClasses = className?.includes("sm:w-auto")
    ? "w-full sm:w-auto"
    : className?.includes("w-full")
      ? "w-full"
      : undefined;

  const buttonVariants = {
    whileHover: { 
      scale: 1.03,
      transition: { duration: 0.2, type: "spring", stiffness: 220 }
    },
    whileTap: { 
      scale: 0.97,
      transition: { duration: 0.1 }
    },
  };

  if (to) {
    return (
      <motion.div
        className={wrapperClasses}
        variants={buttonVariants}
        whileHover="whileHover"
        whileTap="whileTap"
      >
        <Link to={to} className={classes}>
          {icon}
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        variants={buttonVariants}
        whileHover="whileHover"
        whileTap="whileTap"
        style={{ display: "inline-flex" }}
      >
        {icon}
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button 
      type={type} 
      className={classes} 
      {...props}
      variants={buttonVariants}
      whileHover="whileHover"
      whileTap="whileTap"
    >
      {icon}
      {children}
    </motion.button>
  );
};

export default PrimaryButton;
