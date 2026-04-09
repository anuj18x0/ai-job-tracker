import { ApplicationStatus } from "@/types";

export const KANBAN_COLUMNS: { id: ApplicationStatus; title: string }[] = [
  { id: "applied", title: "Applied" },
  { id: "phone_screen", title: "Phone Screen" },
  { id: "interview", title: "Interview" },
  { id: "offer", title: "Offer" },
  { id: "rejected", title: "Rejected" },
];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "#FBBF24",
  phone_screen: "#60A5FA",
  interview: "#A78BFA",
  offer: "#34D399",
  rejected: "#F87171",
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  phone_screen: "Phone Screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};