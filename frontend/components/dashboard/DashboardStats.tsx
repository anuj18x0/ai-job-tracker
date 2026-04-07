"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Target, 
  MessageSquare, 
  CheckCircle2, 
  XCircle,
  TrendingUp
} from "lucide-react";
import type { JobApplication } from "@/types";

interface DashboardStatsProps {
  applications: JobApplication[];
}

export default function DashboardStats({ applications }: DashboardStatsProps) {
  const total = applications.length;
  const interviewing = applications.filter(a => a.status === 'interview' || a.status === 'phone_screen').length;
  const offers = applications.filter(a => a.status === 'offer').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  const stats = [
    {
      label: "Total Apps",
      value: total,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Offers",
      value: offers,
      icon: CheckCircle2,
      color: "text-green",
      bg: "bg-green/10",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: Target,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden group p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 hover:border-border transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </span>
                <span className="text-2xl font-black tracking-tight text-foreground">
                  {stat.value}
                </span>
              </div>
              {/* <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" strokeWidth={2.5} />
              </div> */}
            </div>
            
            {/* Subtle background decoration */}
            <div className="absolute right-4 bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-20 h-20" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
