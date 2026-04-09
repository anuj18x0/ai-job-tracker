"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KanbanColumn from "./KanbanColumn";
import JobCard from "./JobCard";
import AddApplicationModal from "./AddApplicationModal";
import JobDetailModal from "./JobDetailModal";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonBoard } from "@/components/ui/Skeleton";
import { useBoard } from "@/context/BoardContext";
import type { JobApplication, ApplicationStatus, ApplicationFormData } from "@/types";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { getJobApplications, updateApplication, createApplication, deleteApplication } from "@/lib/api-client";
import { Plus, LayoutGrid, Download } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function KanbanBoard() {
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  const { 
    searchQuery, 
    filterStatus, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    initialAddStatus,
    openAddModal 
  } = useBoard();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const result = await getJobApplications();
      if (!result.success) throw new Error("Failed to fetch applications");
      return result.jobs as JobApplication[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<JobApplication> }) => {
      const result = await updateApplication(id, data);
      if (!result.success) throw new Error(result.message);
      return result.job as JobApplication;
    },
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      if (selectedApp && updatedJob._id === selectedApp._id) {
        setSelectedApp(updatedJob);
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const result = await createApplication(data);
      if (!result.success) throw new Error(result.message || "Failed to create application");
      return result.job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteApplication(id);
      if (!result.success) throw new Error("Failed to delete application");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsDetailOpen(false);
      setSelectedApp(null);
    }
  });

  const handleDrop = useCallback(
    (applicationId: string, newStatus: ApplicationStatus) => {
      // Optimistic cache update for instant UI feedback
      queryClient.setQueryData(['jobs'], (old: JobApplication[] | undefined) => {
        if (!old) return old;
        return old.map(app => app._id === applicationId ? { ...app, status: newStatus } : app);
      });
      // Fire mutation in background
      updateMutation.mutate({ id: applicationId, data: { status: newStatus } });
    },
    [queryClient, updateMutation]
  );

  const handleAddApplication = async (data: ApplicationFormData) => {
    createMutation.mutate(data);
  };

  const handleSaveApplication = async (updated: JobApplication) => {
    updateMutation.mutate({ id: updated._id, data: updated });
  };

  const handleDeleteApplication = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleExportCSV = useCallback(() => {
    if (applications.length === 0) return;

    const headers = ["Company", "Role", "Status", "Date Applied", "Location", "Salary Range", "Skills"];
    const rows = applications.map(app => [
      app.company,
      app.role,
      app.status,
      new Date(app.dateApplied).toLocaleDateString(),
      app.location || "",
      app.salaryRange || "",
      app.requiredSkills.join(", ")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [applications]);

  const handleCardClick = (app: JobApplication) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || app.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, filterStatus]);

  if (isLoading) {
    return <SkeletonBoard />;
  }

  const isEmpty = applications.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            icon={<LayoutGrid className="w-12 h-12 text-muted-foreground/40" />}
            title="No applications yet"
            description="Start tracking your job applications by adding your first one. Paste a job description and let AI do the heavy lifting."
            actionLabel="Add Your First Application"
            onAction={() => openAddModal()}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-6">
            <DashboardStats applications={applications} />
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/50 transition-all"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            <div className="flex h-full w-max px-4 py-2 gap-4">
              {KANBAN_COLUMNS.map((col) => {
                const columnApps = filteredApplications.filter((a) => a.status === col.id);
                return (
                  <KanbanColumn
                    key={col.id}
                    id={col.id}
                    title={col.title}
                    count={columnApps.length}
                    onDrop={handleDrop}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {columnApps.map((app) => (
                         <motion.div
                          key={app._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <JobCard
                            application={app}
                            onClick={() => handleCardClick(app)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </KanbanColumn>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddApplication}
        initialStatus={initialAddStatus}
      />
      <JobDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        onSave={handleSaveApplication}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}
