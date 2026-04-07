"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { uploadResume, getResumeStatus } from "@/lib/api-client";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ hasResume: boolean; lastUpdated?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await getResumeStatus();
      if (res.success) {
        setStatus({ hasResume: res.hasResume, lastUpdated: res.lastUpdated });
      }
    } catch (err) {
      console.error("Failed to fetch resume status", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
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

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadResume(file);
      if (res.success) {
        await fetchStatus();
        setFile(null);
      } else {
        setError(res.message || "Failed to upload resume.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Resume"
      maxWidth="480px"
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
      <div style={{ padding: "8px 0" }}>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px", lineHeight: "1.5" }}>
          Upload your latest resume (PDF or DOCX, max 2MB) to help AI generate personalized suggestions that bridge the gap between your experience and job descriptions.
        </p>

        {status?.hasResume && (
          <div
            style={{
              padding: "12px 14px",
              background: "var(--green-glass)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--green)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ color: "var(--green)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--green)" }}>Resume Uploaded</div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                Last updated: {new Date(status.lastUpdated!).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            transition: "border-color var(--transition-fast), background var(--transition-fast)",
            background: file ? "var(--bg-secondary)" : "transparent",
            borderColor: error ? "var(--status-rejected)" : file ? "var(--green)" : "var(--border)",
          }}
          onMouseEnter={(e) => {
            if (!file) e.currentTarget.style.borderColor = "var(--green)";
          }}
          onMouseLeave={(e) => {
            if (!file) e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
            }}
          />
          
          <div style={{ color: "var(--text-tertiary)", marginBottom: "12px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>

          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
            {file ? file.name : "Click or drag to upload resume"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "4px" }}>
            PDF or DOCX up to 2MB
          </div>
        </div>

        {error && (
          <div style={{ color: "var(--status-rejected)", fontSize: "13px", marginTop: "12px", fontWeight: 500 }}>
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
