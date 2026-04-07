"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  color?: "green" | "blue" | "red" | "orange" | "purple" | "gray";
  variant?: "filled" | "outline" | "subtle" | "glass";
  className?: string;
  size?: "sm" | "md";
}

export default function Badge({
  label,
  color = "green",
  variant = "subtle",
  className = "",
  size = "md",
}: BadgeProps) {
  const colorMap = {
    green: "bg-green/10 text-green border-green/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    gray: "bg-secondary/50 text-muted-foreground border-border/50",
  };

  const variantStyles = {
    subtle: "border",
    filled: `bg-${color} text-white border-transparent`,
    outline: `bg-transparent border border-${color}/50 text-${color}`,
    glass: "backdrop-blur-md bg-white/5 border border-white/10 shadow-sm",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full uppercase tracking-wider transition-all",
        sizeStyles[size],
        variant === "glass" ? variantStyles.glass : colorMap[color],
        className
      )}
    >
      {label}
    </span>
  );
}
