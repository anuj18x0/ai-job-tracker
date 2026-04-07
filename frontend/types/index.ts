// ========================================
// AI Job Tracker — Type Definitions
// ========================================

export type ApplicationStatus =
  | "applied"
  | "phone_screen"
  | "interview"
  | "offer"
  | "rejected";

export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  jdLink?: string;
  notes?: string;
  dateApplied: string;
  salaryRange?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority?: string;
  location?: string;
  rawJobDescription?: string;
  resumeSuggestions?: ResumeSuggestion[];
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface ResumeSuggestion {
  id: string;
  text: string;
}

export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  applications: JobApplication[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  jdLink: string;
  notes: string;
  dateApplied: string;
  salaryRange: string;
  status: ApplicationStatus;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
  rawJobDescription: string;
  followUpDate?: string;
}

export interface ApiError {
  message: string;
  status: number;
}
