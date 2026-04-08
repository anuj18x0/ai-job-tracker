"use client";

import { motion } from "framer-motion";
import type { JobApplication } from "@/types";

interface DashboardStatsProps {
  applications: JobApplication[];
}

export default function DashboardStats({ applications }: DashboardStatsProps) {
  const total = applications.length;
  const interviewing = applications.filter(a => a.status === 'interview' || a.status === 'phone_screen').length;
  const offers = applications.filter(a => a.status === 'offer').length;
  
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total },
    { label: "Interviewing", value: interviewing },
    { label: "Offers", value: offers },
    { label: "Success", value: `${successRate}%` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-3"
    >
      <div className="flex items-center gap-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            {index < stats.length - 1 && (
              <div className="w-px h-4 bg-border/40" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
