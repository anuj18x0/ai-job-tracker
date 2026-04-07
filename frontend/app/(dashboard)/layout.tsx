import Header from "@/components/layout/Header";
import { BoardProvider } from "@/context/BoardContext";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <BoardProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </BoardProvider>
  );
}
