import { ApplicationStatus } from "@/types";

// ========================================
// Kanban Columns
// ========================================

export const KANBAN_COLUMNS: { id: ApplicationStatus; title: string }[] = [
  { id: "applied", title: "Applied" },
  { id: "phone_screen", title: "Phone Screen" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
];

// ========================================
// Status Colors
// ========================================

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "#3ECF8E",
  phone_screen: "#60A5FA",
  interview: "#A78BFA",
  offer: "#F59E0B",
  rejected: "#EF4444",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  phone_screen: "Phone Screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

// ========================================
// API
// ========================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ========================================
// Mock Data
// ========================================

export const MOCK_APPLICATIONS = [
  {
    _id: "1",
    userId: "user1",
    company: "Stripe",
    role: "Frontend Engineer",
    status: "applied" as ApplicationStatus,
    dateApplied: "2026-04-01",
    requiredSkills: ["React", "TypeScript", "CSS"],
    niceToHaveSkills: ["GraphQL", "Next.js"],
    seniority: "Mid-Level",
    location: "San Francisco, CA (Remote)",
    salaryRange: "$140k - $180k",
    notes: "Referred by John",
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    _id: "2",
    userId: "user1",
    company: "Vercel",
    role: "Software Engineer",
    status: "phone_screen" as ApplicationStatus,
    dateApplied: "2026-03-28",
    requiredSkills: ["Next.js", "Node.js", "TypeScript"],
    niceToHaveSkills: ["Rust", "Go"],
    seniority: "Senior",
    location: "Remote",
    createdAt: "2026-03-28T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
  },
  {
    _id: "3",
    userId: "user1",
    company: "Linear",
    role: "Product Engineer",
    status: "interview" as ApplicationStatus,
    dateApplied: "2026-03-20",
    requiredSkills: ["React", "TypeScript", "PostgreSQL"],
    niceToHaveSkills: ["Figma"],
    seniority: "Mid-Level",
    location: "Remote (US)",
    salaryRange: "$130k - $160k",
    createdAt: "2026-03-20T00:00:00Z",
    updatedAt: "2026-04-05T00:00:00Z",
  },
];
