"use client";

import type { DragEvent, ReactNode } from "react";
import type { ApplicationStatus } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import { Plus, MoreHorizontal } from "lucide-react";
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
    e.currentTarget.classList.add("bg-muted/50", "border-green/50", "border-dashed");
  };

  const handleDragLeave = (e: DragEvent) => {
    e.currentTarget.classList.remove("bg-muted/50", "border-green/50", "border-dashed");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-muted/50", "border-green/50", "border-dashed");
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
      className="flex flex-col flex-1 min-w-[200px] bg-secondary/30 rounded-2xl border border-transparent transition-all duration-200 h-full max-h-[calc(100vh-140px)]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-2.5 h-2.5 rounded-full shadow-sm" 
            style={{ backgroundColor: statusColor }} 
          />
          <h4 className="text-sm text-foreground tracking-tight uppercase">
            {title}
          </h4>
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-secondary text-[10px] font-bold text-muted-foreground border border-border">
            {count}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => openAddModal(id)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-green transition-all"
            title={`Add to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Area */}
      <div className="flex-1 flex flex-col gap-3 px-3 pb-6 overflow-y-auto no-scrollbar scroll-smooth">
        {children}
        
        {/* Placeholder for empty column */}
        {count === 0 && (
          <button
            onClick={() => openAddModal(id)}
            className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed border-border opacity-15 hover:opacity-100 hover:border-green/30 hover:bg-green-glass transition-all group"
          >
            <Plus className="w-5 h-5 text-muted-foreground/40 group-hover:text-green transition-colors mb-1" />
            <span className="text-xs font-medium text-muted-foreground/60 group-hover:text-green/80 transition-colors">
              Add Application
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
