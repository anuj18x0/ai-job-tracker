"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AISuggestions from "@/components/board/AISuggestions";
import { generateAISuggestions, generateAISuggestionsStream } from "@/lib/api-client";
import type { JobApplication, ApplicationStatus, ResumeSuggestion } from "@/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Check, 
  Sparkles,
  ChevronRight,
  Briefcase,
  Bell,
  Info
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
    } else {
      setSuggestions([]);
    }
  }, [application]);

  if (!application) return null;

  const data = isEditing && editData ? editData : application;

  const statusBadgeColor = (status: ApplicationStatus): "green" | "blue" | "red" | "orange" | "purple" | "gray" => {
    const map: Record<ApplicationStatus, any> = {
      applied: "blue",
      phone_screen: "orange",
      interview: "purple",
      offer: "green",
      rejected: "red"
    };
    return map[status] || "gray";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      className="p-0"
      footer={
        <div className="flex items-center justify-between w-full">
          {!isEditing && (
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Are you sure?</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" size="sm" onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</Button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="text-[11px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  Delete Application
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={handleEdit} className="bg-foreground text-background hover:bg-foreground/90">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-6 pb-8 border-b border-border/50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/50 shadow-sm">
              <Building2 className="w-8 h-8 text-foreground/70" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black tracking-tight leading-none text-foreground">
                {data.company}
              </h2>
              <p className="text-lg font-bold text-muted-foreground">
                {data.role}
              </p>
            </div>
          </div>
          <Badge 
            label={STATUS_LABELS[data.status]} 
            color={statusBadgeColor(data.status)}
            variant="subtle"
            className="px-4 py-1.5 text-xs"
          />
        </div>

        <div className="py-8 space-y-10">
          {/* Info Grid Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-[24px] bg-secondary/20 border border-border/30">
            {[
              { label: "Location", value: data.location, icon: MapPin },
              { label: "Seniority", value: data.seniority, icon: Briefcase },
              { label: "Applied", value: data.dateApplied ? new Date(data.dateApplied).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined, icon: Calendar },
              { 
                label: "Follow-up", 
                value: data.followUpDate ? new Date(data.followUpDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : undefined, 
                icon: Bell,
                isOverdue: data.followUpDate ? new Date(data.followUpDate) < new Date() : false
              },
            ]
            .filter(i => i.value)
            .map((item) => (
              <div key={item.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-muted-foreground/60">
                  <item.icon className={cn("w-3.5 h-3.5", (item as any).isOverdue && "text-red-500")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <span className={cn("text-[14px] font-bold", (item as any).isOverdue ? "text-red-500" : "text-foreground")}>
                  {item.value || "—"}
                </span>
              </div>
            ))}
          </div>

          {!isEditing ? (
            /* View Mode: Vertical Stack Layout */
            <div className="space-y-12">
              {/* Row 1: Skills Grid (2-Column) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Required Skills */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-green" />
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.requiredSkills.slice(0, 12).map(skill => (
                      <Badge key={skill} label={skill} color="gray" className="rounded-xl px-3" />
                    ))}
                    {data.requiredSkills.length > 12 && (
                      <Badge label={`+${data.requiredSkills.length - 12} more`} color="green" variant="glass" className="rounded-xl" />
                    )}
                    {data.requiredSkills.length === 0 && (
                      <span className="text-xs text-muted-foreground font-medium italic">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Nice To Have Skills */}
                <div className="space-y-4 border-l border-border/20 md:pl-10">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Nice to Have
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.niceToHaveSkills?.slice(0, 12).map(skill => (
                      <Badge key={skill} label={skill} color="blue" variant="subtle" className="rounded-xl px-3" />
                    ))}
                    {(data.niceToHaveSkills?.length || 0) > 12 && (
                      <Badge label={`+${(data.niceToHaveSkills?.length || 0) - 12} more`} color="blue" variant="glass" className="rounded-xl" />
                    )}
                    {(data.niceToHaveSkills?.length || 0) === 0 && (
                      <span className="text-xs text-muted-foreground font-medium italic">None listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: AI Optimization (Full Width) */}
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green/10">
                        <Sparkles className="w-5 h-5 text-green" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h4 className="text-[14px] font-black text-foreground uppercase tracking-wider">AI Resume Optimization</h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          Optimized bullet points tailored specifically for this JD and your unique skill set.
                        </p>
                      </div>
                    </div>
                    
                    {!isStreaming && suggestions.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleGenerateSuggestions}
                        className="text-[11px] font-bold uppercase tracking-widest px-4 h-9"
                      >
                        Regenerate
                      </Button>
                    )}
                  </div>

                  <div className="relative p-6 rounded-[24px] bg-foreground/5 border border-border/50 shadow-sm overflow-hidden">
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar -mx-2 px-2">
                      <AISuggestions
                        suggestions={suggestions}
                        isLoading={isSuggestionsLoading}
                        onRegenerate={undefined} // Hide regenerate inside list since we have top button
                        streamingText={streamingText}
                        isStreaming={isStreaming}
                      />
                      
                      {suggestions.length === 0 && !isSuggestionsLoading && (
                        <div className="flex flex-col items-center justify-center py-10 gap-5 text-center">
                          <p className="text-sm text-muted-foreground max-w-xs font-medium italic">
                            No suggestions yet. Let AI analyze the job to generate high-impact bullet points.
                          </p>
                          <Button
                            onClick={handleGenerateSuggestions}
                            className="bg-green text-green-950 hover:bg-green/90 px-8 font-black uppercase tracking-widest text-[11px] h-10 shadow-lg shadow-green/20"
                          >
                            Generate Suggestions
                          </Button>
                        </div>
                      )}
                    </div>

                    {isStreaming && (
                      <motion.div 
                        animate={{ opacity: [0.1, 0.4, 0.1] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute inset-0 pointer-events-none bg-gradient-to-br from-green/5 to-transparent" 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Notes & Links (Footer-ish) */}
              {(data.notes || data.jdLink) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {data.notes && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Personal Notes
                      </h4>
                      <p className="text-[13px] leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap pl-6 border-l-2 border-border/50">
                        {data.notes}
                      </p>
                    </div>
                  )}
                  
                  {data.jdLink && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Original Job Posting
                      </h4>
                      <a
                        href={data.jdLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-all"
                      >
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[200px]">
                          {data.jdLink}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-green transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : editData && (
            /* Edit Mode: Simple Form */
            <div className="flex flex-col gap-6 py-2">
              <div className="grid grid-cols-2 gap-5">
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
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Location"
                  value={editData.location || ""}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as ApplicationStatus })}
                    className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green cursor-pointer transition-all"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
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
              <div className="grid grid-cols-2 gap-5">
                <Input label="Date Applied" type="date" value={editData.dateApplied} onChange={(e) => setEditData({ ...editData, dateApplied: e.target.value })} />
                <Input label="Salary Range" value={editData.salaryRange || ""} onChange={(e) => setEditData({ ...editData, salaryRange: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input label="Follow-up Date" type="date" value={editData.followUpDate ? new Date(editData.followUpDate).toISOString().split('T')[0] : ""} onChange={(e) => setEditData({ ...editData, followUpDate: e.target.value })} />
                <Input label="JD Link" value={editData.jdLink || ""} onChange={(e) => setEditData({ ...editData, jdLink: e.target.value })} />
              </div>
              <Textarea label="Notes" value={editData.notes || ""} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} className="min-h-[120px]" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
