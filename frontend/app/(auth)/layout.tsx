import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-primary)] min-h-screen">
      {children}
    </div>
  );
}
