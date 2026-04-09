"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { uploadResume, getResumeStatus } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: status } = useQuery({
    queryKey: ['resume-status'],
    queryFn: async () => {
      const res = await getResumeStatus();
      if (!res.success) return null;
      return { hasResume: res.hasResume, lastUpdated: res.lastUpdated };
    },
    enabled: isOpen,
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const res = await uploadResume(uploadFile);
      if (!res.success) throw new Error(res.message || "Failed to upload resume.");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-status'] });
      setFile(null);
    },
    onError: (err: Error) => {
      setError(err.message || "An unexpected error occurred.");
    }
  });

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 4 * 1024 * 1024) {
      setError("File size exceeds 4MB limit.");
      return;
    }

    const type = selectedFile.type;
    if (
      type !== "application/pdf" &&
      type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      type !== "application/msword"
    ) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = () => {
    if (!file) return;
    setError(null);
    uploadMutation.mutate(file);
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Resume"
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isUploading}>
            Close
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading} isLoading={isUploading}>
            Upload Resume
          </Button>
        </>
      }
    >
      <div className="py-2">
        <p className="text-sm text-[var(--text-secondary)] mb-5 leading-normal">
          Upload your latest resume (PDF or DOCX, max 2MB) to help AI generate personalized suggestions that bridge the gap between your experience and job descriptions.
        </p>

        {status?.hasResume && (
          <div className="px-3.5 py-3 bg-[var(--green-glass)] rounded-md border border-[var(--green)] mb-5 flex items-center gap-2.5">
            <div className="text-[var(--green)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[var(--green)]">Resume Uploaded</div>
              <div className="text-[11px] text-[var(--text-tertiary)]">
                Last updated: {new Date(status.lastUpdated!).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "border-2 border-dashed rounded-lg px-5 py-8 text-center cursor-pointer relative transition-all duration-200 group flex flex-col items-center justify-center",
            file ? "bg-[var(--bg-secondary)]" : "bg-transparent",
            error ? "border-[var(--status-rejected)]" : file ? "border-[var(--green)]" : "border-[var(--border)]",
            !file && "hover:border-[var(--green)]"
          )}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          
          <div className="text-[var(--text-tertiary)] mb-3 group-hover:text-[var(--green)] transition-colors">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>

          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {file ? file.name : "Click or drag to upload resume"}
          </div>
          <div className="text-xs text-[var(--text-tertiary)] mt-1">
            PDF or DOCX up to 4MB
          </div>
        </div>

        {error && (
          <div className="text-[var(--status-rejected)] text-[13px] mt-3 font-medium">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
