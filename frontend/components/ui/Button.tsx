"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const base =
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg border-none cursor-pointer whitespace-nowrap tracking-[0.01em] " +
    "transition-all duration-200 ease-out " +
    "active:scale-[0.97] " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]";

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--green)] text-white shadow-[0_2px_8px_rgba(62,207,142,0.25)] " +
      "hover:bg-[var(--green-dark)] hover:shadow-[0_4px_16px_rgba(62,207,142,0.35)] hover:-translate-y-0.5 " +
      "active:shadow-[0_1px_4px_rgba(62,207,142,0.2)] active:translate-y-0",
    secondary:
      "bg-transparent text-[var(--text-primary)] border border-[var(--border)] " +
      "hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] hover:-translate-y-0.5 " +
      "active:bg-[var(--bg-tertiary)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] " +
      "hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] " +
      "active:bg-[var(--border)]",
    danger:
      "bg-red-500 text-white shadow-[0_2px_8px_rgba(239,68,68,0.25)] " +
      "hover:bg-red-600 hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 " +
      "active:bg-red-700 active:shadow-[0_1px_4px_rgba(239,68,68,0.2)] active:translate-y-0",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-[13px] h-8",
    md: "px-4 py-2 text-sm h-[38px]",
    lg: "px-6 py-2.5 text-[15px] h-11",
  };

  return (
    <button
      disabled={isDisabled}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        isDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="animate-spin"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M8 2a6 6 0 0 1 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
