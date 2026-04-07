import KanbanBoard from "@/components/board/KanbanBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board — JobTrackr",
  description: "Manage your job applications on a Kanban board with AI-powered features.",
};

export default function BoardPage() {
  return <KanbanBoard />;
}
