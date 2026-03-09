"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
  primary: "bg-amber-500 text-black hover:bg-amber-400 font-semibold",
  secondary: "text-white hover:bg-white/10",
  danger: "text-red-400 hover:bg-red-500/10",
  ghost: "text-gray-400 hover:text-white hover:bg-white/5",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 rounded-lg",
  lg: "px-6 py-3 rounded-xl text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center gap-2 transition-all
          border border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        style={{
          fontFamily: "var(--font-body)",
          ...(variant === "secondary" ? { borderColor: "var(--color-border)", background: "var(--color-surface-2)" } : {}),
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
