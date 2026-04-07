"use client";

import type { JobApplication } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import type { DragEvent } from "react";
import { MoreVertical, Calendar, MapPin, Building2, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
  application: JobApplication;
  onClick: () => void;
}

export default function JobCard({ application, onClick }: JobCardProps) {
  const statusColor = STATUS_COLORS[application.status];

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("applicationId", application._id);
    e.dataTransfer.effectAllowed = "move";
    (e.target as HTMLElement).classList.add("opacity-50", "rotate-2");
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).classList.remove("opacity-50", "rotate-2");
  };

  const daysAgo = Math.floor(
    (Date.now() - new Date(application.dateApplied).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dateLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing"
    >
      <motion.div
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group relative bg-card border border-border p-4 rounded-xl overflow-hidden transition-colors hover:border-green/20"
      >
        {/* Decorative Status Accent */}
        <div 
          className="absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-80 group-hover:opacity-100 transition-opacity" 
          style={{ backgroundColor: statusColor }}
        />

        <div className="flex flex-col gap-3">
          {/* Header: Company & Actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-secondary/50 text-muted-foreground group-hover:bg-green-glass group-hover:text-green transition-colors">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground truncate max-w-[140px]">
                {application.company}
              </span>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Future: Open card menu
              }}
              className="p-1 rounded-md hover:bg-secondary text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Role Title */}
          <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-green transition-colors">
            {application.role}
          </h4>

          {/* Metadata: Location & Date */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground font-medium">
            {application.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{application.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{dateLabel}</span>
            </div>
            {application.followUpDate && (
              <div className={`flex items-center gap-1 ${new Date(application.followUpDate) < new Date() ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                <Bell className="w-3 h-3" />
                <span>Follow-up</span>
              </div>
            )}
          </div>

          {/* Skills Tags */}
          {application.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {application.requiredSkills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-secondary/50 text-[10px] font-bold text-muted-foreground border border-border/50 tracking-wide uppercase"
                >
                  {skill}
                </span>
              ))}
              {application.requiredSkills.length > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground/60 self-center">
                  +{application.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
