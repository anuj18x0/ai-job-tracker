"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AISuggestions from "@/components/board/AISuggestions";
import { generateAISuggestionsStream } from "@/lib/api-client";
import type { JobApplication, ApplicationStatus, ResumeSuggestion } from "@/types";
import { STATUS_LABELS } from "@/lib/constants";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Sparkles,
  Briefcase,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface JobDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
  onSave: (updated: JobApplication) => void;
  onDelete: (id: string) => void;
}

export default function JobDetailModal({
  isOpen,
  onClose,
  application,
  onSave,
  onDelete,
}: JobDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState<JobApplication | null>(null);
  const [suggestions, setSuggestions] = useState<ResumeSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiExpanded, setAiExpanded] = useState(false);

  const handleEdit = () => {
    if (application) {
      setEditData({ ...application });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editData) {
      onSave(editData);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (application) {
      onDelete(application._id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!application) return;
    
    setIsSuggestionsLoading(true);
    setIsStreaming(true);
    setStreamingText("");
    setSuggestions([]);
    setAiExpanded(true);

    try {
      let finalText = "";
      await generateAISuggestionsStream(application._id, (chunk) => {
        finalText += chunk;
        setStreamingText((prev) => prev + chunk);
      });
      
      setIsStreaming(false);

      const lines = finalText.split("\n");
      const newSuggestions: ResumeSuggestion[] = [];
      
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        const cleaned = trimmed.replace(/^([•\-\*\d\.]+\s*)/, "").trim();
        if (cleaned.length > 10) {
          newSuggestions.push({
            id: `suggestion-${Date.now()}-${idx}`,
            text: cleaned
          });
        }
      });

      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
        onSave({ ...application, resumeSuggestions: newSuggestions });
      }
    } catch (err) {
      console.error("Failed to generate suggestions", err);
      setIsStreaming(false);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (application && application.resumeSuggestions) {
      setSuggestions(application.resumeSuggestions);
      // Auto-expand if suggestions exist
      if (application.resumeSuggestions.length > 0) {
        setAiExpanded(true);
      }
    } else {
      setSuggestions([]);
    }
  }, [application]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen]);

  if (!application) return null;

  const data = isEditing && editData ? editData : application;

  const daysAgo = Math.floor(
    (Date.now() - new Date(data.dateApplied).getTime()) / (1000 * 60 * 60 * 24)
  );
  const dateLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  // Group skills into categories (simple heuristic)
  const groupSkills = (skills: string[]) => {
    if (skills.length <= 4) return null; // Don't group if few
    const displayed = skills.slice(0, 5);
    const remaining = skills.length - 5;
    return { displayed, remaining };
  };

  const statusBadgeStyles: Record<ApplicationStatus, string> = {
    applied: "bg-amber-500/10 text-amber-600",
    phone_screen: "bg-blue-500/10 text-blue-500",
    interview: "bg-purple-500/10 text-purple-500",
    offer: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-red-500/10 text-red-500",
  };

  // Fixed header content
  const headerContent = (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground leading-snug">
          {data.role}
        </h2>
        <span className={cn(
          "px-2.5 py-0.5 rounded-md text-[11px] font-medium shrink-0",
          statusBadgeStyles[data.status] || "bg-secondary text-muted-foreground"
        )}>
          {STATUS_LABELS[data.status]}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {data.company}
      </span>
      <div className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground/50">
        {data.location && (
          <>
            <span>{data.location}</span>
            <span>•</span>
          </>
        )}
        {data.seniority && (
          <>
            <span>{data.seniority}</span>
            <span>•</span>
          </>
        )}
        <span>{dateLabel}</span>
        {data.salaryRange && (
          <>
            <span>•</span>
            <span>{data.salaryRange}</span>
          </>
        )}
        {data.followUpDate && (
          <>
            <span>•</span>
            <span className={cn(
              "font-medium",
              new Date(data.followUpDate) < new Date() ? "text-red-400" : "text-amber-400"
            )}>
              Follow-up {new Date(data.followUpDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </>
        )}
      </div>
    </div>
  );

  // Fixed footer content (view mode)
  const footerContent = !isEditing ? (
    <div className="flex items-center justify-between w-full">
      {showDeleteConfirm ? (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Delete this?</span>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Confirm
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs text-muted-foreground/30 hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      )}
      <button
        onClick={handleEdit}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-end gap-3 w-full">
      <button
        onClick={() => setIsEditing(false)}
        className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-green text-white hover:bg-green/90 transition-colors"
      >
        Save
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      header={headerContent}
      footer={footerContent}
    >
      <div className="flex flex-col">

        {!isEditing ? (
          /* ═══ VIEW MODE ═══ */
          <div className="flex flex-col gap-6">
            {/* ── SKILLS ── */}
            {(data.requiredSkills.length > 0 || (data.niceToHaveSkills?.length || 0) > 0) && (
              <div className="flex flex-col gap-4">
                {/* Required */}
                {data.requiredSkills.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wide">
                      Required
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(() => {
                        const grouped = groupSkills(data.requiredSkills);
                        const display = grouped ? grouped.displayed : data.requiredSkills;
                        const remaining = grouped ? grouped.remaining : 0;
                        return (
                          <>
                            {display.map(skill => (
                              <span key={skill} className="px-2 py-0.5 rounded-md bg-secondary/60 text-xs text-foreground/70">
                                {skill}
                              </span>
                            ))}
                            {remaining > 0 && (
                              <span className="text-xs text-muted-foreground/40">
                                +{remaining} more
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Nice to Have */}
                {(data.niceToHaveSkills?.length || 0) > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wide">
                      Nice to have
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(() => {
                        const skills = data.niceToHaveSkills || [];
                        const grouped = groupSkills(skills);
                        const display = grouped ? grouped.displayed : skills;
                        const remaining = grouped ? grouped.remaining : 0;
                        return (
                          <>
                            {display.map(skill => (
                              <span key={skill} className="px-2 py-0.5 rounded-md bg-secondary/40 text-xs text-muted-foreground/60">
                                {skill}
                              </span>
                            ))}
                            {remaining > 0 && (
                              <span className="text-xs text-muted-foreground/30">
                                +{remaining} more
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── NOTES ── */}
            {data.notes && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wide">
                  Notes
                </span>
                <p className="text-sm leading-relaxed text-foreground/60 whitespace-pre-wrap">
                  {data.notes}
                </p>
              </div>
            )}

            {/* JD Link — inline, simple */}
            {data.jdLink && (
              <a
                href={data.jdLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-green transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View original posting
              </a>
            )}

            {/* ── AI RESUME SUGGESTIONS — Collapsible ── */}
            <div className="flex flex-col mt-2">
              {/* Toggle Header */}
              <button
                onClick={() => setAiExpanded(!aiExpanded)}
                className="flex items-center justify-between py-2 group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-green/60" />
                  <span className="text-sm font-medium text-foreground/80">
                    AI Resume Suggestions
                  </span>
                  {suggestions.length > 0 && !aiExpanded && (
                    <span className="text-[10px] text-muted-foreground/40">
                      {suggestions.length} suggestions
                    </span>
                  )}
                </div>
                {aiExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/30" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/30" />
                )}
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {aiExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 pb-2">
                      <AISuggestions
                        suggestions={suggestions}
                        isLoading={isSuggestionsLoading}
                        onRegenerate={suggestions.length > 0 && !isStreaming ? handleGenerateSuggestions : undefined}
                        streamingText={streamingText}
                        isStreaming={isStreaming}
                      />
                      
                      {suggestions.length === 0 && !isSuggestionsLoading && (
                        <div className="py-4">
                          <button
                            onClick={handleGenerateSuggestions}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green/10 text-green hover:bg-green/15 transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Generate Suggestions
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : editData && (
          /* ═══ EDIT MODE ═══ */
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company"
                value={editData.company}
                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
              />
              <Input
                label="Role"
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location"
                value={editData.location || ""}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />
              <div className="flex flex-col gap-1.5" style={{ marginBottom: "16px" }}>
                <label className="text-[13px] font-semibold" style={{ color: "var(--text-secondary)", letterSpacing: "0.02em" }}>Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value as ApplicationStatus })}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-2.5 px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-green/30 focus:border-green cursor-pointer transition-all"
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Required Skills (comma separated)"
                value={editData.requiredSkills.join(", ")}
                onChange={(e) => setEditData({ ...editData, requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
              />
              <Input
                label="Nice to Have (comma separated)"
                value={editData.niceToHaveSkills?.join(", ") || ""}
                onChange={(e) => setEditData({ ...editData, niceToHaveSkills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date Applied" type="date" value={editData.dateApplied} onChange={(e) => setEditData({ ...editData, dateApplied: e.target.value })} />
              <Input label="Salary Range" value={editData.salaryRange || ""} onChange={(e) => setEditData({ ...editData, salaryRange: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Follow-up Date" type="date" value={editData.followUpDate ? new Date(editData.followUpDate).toISOString().split('T')[0] : ""} onChange={(e) => setEditData({ ...editData, followUpDate: e.target.value })} />
              <Input label="JD Link" value={editData.jdLink || ""} onChange={(e) => setEditData({ ...editData, jdLink: e.target.value })} />
            </div>
            <Textarea label="Notes" value={editData.notes || ""} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} className="min-h-[100px]" />
          </div>
        )}
      </div>
    </Modal>
  );
}
