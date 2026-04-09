import type { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in-up">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-[var(--green-glass)] flex items-center justify-center mb-4 text-[var(--green)]">
          {icon}
        </div>
      )}
      <h3 className="m-0 mb-1.5 text-base font-bold text-[var(--text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="m-0 mb-5 text-sm text-[var(--text-tertiary)] max-w-xs block">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
