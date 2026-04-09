"use client";

import type { DragEvent, ReactNode } from "react";
import type { ApplicationStatus } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import { Plus } from "lucide-react";
import { useBoard } from "@/context/BoardContext";

interface KanbanColumnProps {
  id: ApplicationStatus;
  title: string;
  count: number;
  children: ReactNode;
  onDrop: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export default function KanbanColumn({
  id,
  title,
  count,
  children,
  onDrop,
}: KanbanColumnProps) {
  const { openAddModal } = useBoard();
  const statusColor = STATUS_COLORS[id];

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("ring-1", "ring-green/30", "bg-green/[0.02]");
  };

  const handleDragLeave = (e: DragEvent) => {
    e.currentTarget.classList.remove("ring-1", "ring-green/30", "bg-green/[0.02]");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("ring-1", "ring-green/30", "bg-green/[0.02]");
    const applicationId = e.dataTransfer.getData("applicationId");
    if (applicationId) {
      onDrop(applicationId, id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col flex-1 min-w-[220px] rounded-xl transition-all duration-200 h-full max-h-[calc(100vh-140px)]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: statusColor }} 
          />
          <span className="text-lg font-semibold text-muted-foreground tracking-wide">
            {title}
          </span>
          <span className="text-xs text-muted-foreground/40 font-medium tabular-nums">
            {count}
          </span>
        </div>
        
        <button
          onClick={() => openAddModal(id)}
          className="p-1 rounded-md text-muted-foreground/30 hover:text-muted-foreground hover:bg-secondary/50 transition-all duration-200 hover:scale-110 active:scale-90"
          title={`Add to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Area */}
      <div className="flex-1 flex flex-col gap-2 px-1 pb-4 overflow-y-auto no-scrollbar scroll-smooth">
        {children}
        
        {/* Placeholder for empty column */}
        {count === 0 && (
          <button
            onClick={() => openAddModal(id)}
            className="flex flex-col items-center justify-center py-10 rounded-lg border border-dashed border-border/30 opacity-40 hover:opacity-100 hover:border-green/30 hover:bg-green/[0.02] transition-all duration-200 active:scale-95 group"
          >
            <Plus className="w-4 h-4 text-muted-foreground/40 group-hover:text-green transition-colors mb-1" />
            <span className="text-[11px] font-medium text-muted-foreground/40 group-hover:text-green/70 transition-colors">
              Add
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
