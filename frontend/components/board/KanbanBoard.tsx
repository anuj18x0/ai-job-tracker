"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KanbanColumn from "./KanbanColumn";
import JobCard from "./JobCard";
import AddApplicationModal from "./AddApplicationModal";
import JobDetailModal from "./JobDetailModal";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useBoard } from "@/context/BoardContext";
import type { JobApplication, ApplicationStatus, ApplicationFormData } from "@/types";
import { KANBAN_COLUMNS } from "@/lib/constants";
import { getJobApplications, updateApplication, createApplication, deleteApplication } from "@/lib/api-client";
import { Plus, LayoutGrid, Download } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";

export default function KanbanBoard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    searchQuery, 
    filterStatus, 
    isAddModalOpen, 
    setIsAddModalOpen, 
    initialAddStatus,
    openAddModal 
  } = useBoard();

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getJobApplications();
      if (result.success) {
        setApplications(result.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDrop = useCallback(
    async (applicationId: string, newStatus: ApplicationStatus) => {
      const originalApps = [...applications];
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      try {
        const result = await updateApplication(applicationId, { status: newStatus });
        if (!result.success) {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("Failed to update app status", err);
        setApplications(originalApps);
      }
    },
    [applications]
  );

  const handleAddApplication = useCallback(async (data: ApplicationFormData) => {
    try {
      const result = await createApplication(data);
      if (result.success) {
        setApplications((prev) => [result.job, ...prev]);
        setIsAddModalOpen(false);
      } else {
        alert(result.message || "Failed to create application");
      }
    } catch (err) {
      console.error("Failed to create application", err);
    }
  }, [setIsAddModalOpen]);

  const handleSaveApplication = useCallback(async (updated: JobApplication) => {
    try {
      const result = await updateApplication(updated._id, updated);
      if (result.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === result.job._id ? result.job : app))
        );
        setSelectedApp(result.job);
      }
    } catch (err) {
      console.error("Failed to save application", err);
    }
  }, []);

  const handleDeleteApplication = useCallback(async (id: string) => {
    try {
      const result = await deleteApplication(id);
      if (result.success) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
        setIsDetailOpen(false);
        setSelectedApp(null);
      }
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  }, []);

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
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Spinner size="lg" />
      </div>
    );
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

          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex h-full w-full px-4 py-2 gap-3">
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
