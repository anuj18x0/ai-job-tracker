import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import type { ApplicationFormData, ParsedJobDescription, ApplicationStatus } from "@/types";
import { parseJD } from "@/lib/api-client";
import { Layout, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ApplicationFormData) => void;
  initialStatus?: ApplicationStatus;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  onSave,
  initialStatus,
}: AddApplicationModalProps) {
  const [rawJD, setRawJD] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: "",
    role: "",
    jdLink: "",
    notes: "",
    dateApplied: new Date().toISOString().split("T")[0],
    salaryRange: "",
    status: "applied",
    requiredSkills: [],
    niceToHaveSkills: [],
    seniority: "",
    location: "",
    rawJobDescription: "",
  });

  // Reset form when modal opens or initialStatus changes
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        status: initialStatus || "applied"
      }));
    }
  }, [isOpen, initialStatus]);

  const handleParse = async () => {
    if (!rawJD.trim()) return;
    setIsParsing(true);

    try {
      const result = await parseJD(rawJD);
      if (result.success) {
        const parsedData: ParsedJobDescription = result.data;
        setFormData((prev) => ({
          ...prev,
          company: parsedData.company,
          role: parsedData.role,
          requiredSkills: parsedData.requiredSkills,
          niceToHaveSkills: parsedData.niceToHaveSkills,
          seniority: parsedData.seniority,
          location: parsedData.location,
          rawJobDescription: rawJD,
        }));
        setParsed(true);
      } else {
        alert(result.message || "Failed to parse JD");
      }
    } catch (err) {
      console.error("Failed to parse JD", err);
      alert("An error occurred while parsing the job description.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = () => {
    if (!formData.company || !formData.role) return;
    onSave(formData);
    // Reset
    setRawJD("");
    setParsed(false);
    setFormData({
      company: "",
      role: "",
      jdLink: "",
      notes: "",
      dateApplied: new Date().toISOString().split("T")[0],
      salaryRange: "",
      status: "applied",
      requiredSkills: [],
      niceToHaveSkills: [],
      seniority: "",
      location: "",
      rawJobDescription: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Application"
      maxWidth="620px"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="shadow-sm"
            onClick={handleSave} 
            disabled={!formData.company || !formData.role}
          >
            Save Application
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 py-2">
        {/* AI Parse Section */}
        {!parsed && (
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                <Layout className="w-3.5 h-3.5 text-green" />
                Paste Job Description
              </label>
              <Textarea
                placeholder="Paste the full job description here and let AI extract the details..."
                value={rawJD}
                onChange={(e) => {
                  setRawJD(e.target.value);
                  setFormData(prev => ({ ...prev, rawJobDescription: e.target.value }));
                }}
                className="min-h-[140px] bg-background resize-none"
              />
            </div>
            
            <Button
              onClick={handleParse}
              isLoading={isParsing}
              disabled={!rawJD.trim()}
              className="w-full h-11 shadow-sm"
            >
              {isParsing ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" /> 
                  <span>AI is parsing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Parse with Gemini AI</span>
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Parsed result indicator */}
        {parsed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-green/10 border border-green/20 rounded-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-green" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-bold text-green leading-none mb-1">
                AI Parsed Successfully
              </p>
              <p className="text-[11px] text-green/70 font-medium">
                Review extracted details below and save
              </p>
            </div>
          </motion.div>
        )}

        {/* Divider */}
        {!parsed && (
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              or enter manually
            </span>
            <div className="flex-1 h-px bg-border/60" />
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company"
              placeholder="e.g., Stripe"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <Input
              label="Role"
              placeholder="e.g., Frontend Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g., Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Seniority"
              placeholder="e.g., Senior"
              value={formData.seniority}
              onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date Applied"
              type="date"
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
            />
            <Input
              label="Salary Range"
              placeholder="e.g., $120k - $150k"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            />
          </div>

          <Input
            label="JD Link"
            type="https"
            placeholder="https://..."
            value={formData.jdLink}
            onChange={(e) => setFormData({ ...formData, jdLink: e.target.value })}
          />

          <Textarea
            label="Notes"
            placeholder="Any personal notes about this application..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="min-h-[100px]"
          />

          {/* Skills display */}
          {(formData.requiredSkills.length > 0 || formData.niceToHaveSkills.length > 0) && (
            <div className="flex flex-col gap-4 mt-2 p-5 rounded-2xl bg-secondary/20 border border-border/50">
              {formData.requiredSkills.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Required Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map((s) => (
                      <Badge key={s} label={s} className="bg-green/10 text-green border-green/20" />
                    ))}
                  </div>
                </div>
              )}
              {formData.niceToHaveSkills.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Nice to Have
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.niceToHaveSkills.map((s) => (
                      <Badge key={s} label={s} className="bg-blue-500/10 text-blue-500 border-blue-500/20" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
