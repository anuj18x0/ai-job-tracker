"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

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
  const baseStyles: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "inherit",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    border: "none",
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    transition: "all var(--transition-fast)",
    opacity: disabled || isLoading ? 0.6 : 1,
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--green)",
      color: "#FFFFFF",
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
    },
    danger: {
      background: "#EF4444",
      color: "#FFFFFF",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: "13px", height: "32px" },
    md: { padding: "8px 16px", fontSize: "14px", height: "38px" },
    lg: { padding: "10px 24px", fontSize: "15px", height: "44px" },
  };

  return (
    <button
      style={{ ...baseStyles, ...variantStyles[variant], ...sizeStyles[size] }}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ animation: "spin 1s linear infinite" }}
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
