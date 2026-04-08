"use client";

import type { JobApplication } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";
import type { DragEvent } from "react";
import { Calendar, MapPin, Building2, Bell } from "lucide-react";
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
    (e.target as HTMLElement).classList.add("opacity-40");
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).classList.remove("opacity-40");
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
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group relative bg-card border border-transparent hover:border-border/60 p-3 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      >
        {/* Status Accent — thin top bar */}
        <div 
          className="absolute top-0 left-2 right-2 h-[2px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" 
          style={{ backgroundColor: statusColor }}
        />

        <div className="flex flex-col gap-2 pt-1">
          {/* Role Title — Primary */}
          <h4 className="text-[13px] font-semibold text-foreground leading-snug tracking-tight">
            {application.role}
          </h4>

          {/* Company — Secondary */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-muted-foreground/40" />
            <span className="text-xs font-medium text-muted-foreground">
              {application.company}
            </span>
          </div>

          {/* Meta: Location or Date — pick one to keep it clean */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50 font-medium">
            {application.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span className="truncate max-w-[100px]">{application.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              <span>{dateLabel}</span>
            </div>
            {application.followUpDate && (
              <div className={`flex items-center gap-1 ${new Date(application.followUpDate) < new Date() ? 'text-red-400' : 'text-amber-400'}`}>
                <Bell className="w-2.5 h-2.5" />
              </div>
            )}
          </div>

          {/* Skills Tags — max 2 */}
          {application.requiredSkills.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {application.requiredSkills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 rounded bg-secondary/60 text-[10px] font-medium text-muted-foreground/70"
                >
                  {skill}
                </span>
              ))}
              {application.requiredSkills.length > 2 && (
                <span className="text-[10px] font-medium text-muted-foreground/30">
                  +{application.requiredSkills.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
