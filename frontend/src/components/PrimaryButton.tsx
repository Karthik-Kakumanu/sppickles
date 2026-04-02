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
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F7A43] active:transition-none disabled:cursor-not-allowed disabled:border-[#dbe7dc] disabled:bg-[#eef4ef] disabled:text-[#9aa89a] disabled:shadow-none disabled:opacity-60";

const variantClasses = {
  primary:
    "border-[#2F7A43] bg-[#2F7A43] text-white shadow-[0_12px_28px_rgba(47,122,67,0.2)] hover:shadow-[0_16px_36px_rgba(47,122,67,0.28)] hover:bg-[#246637] active:shadow-[0_4px_12px_rgba(47,122,67,0.16)]",
  secondary:
    "border-[#2F7A43] bg-white text-[#2F7A43] shadow-[0_8px_20px_rgba(30,79,46,0.12)] hover:shadow-[0_12px_28px_rgba(30,79,46,0.16)] hover:bg-[#F5FAFD] active:shadow-[0_2px_8px_rgba(30,79,46,0.08)]",
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
