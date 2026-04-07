"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ApplicationStatus } from "@/types";

interface BoardContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: ApplicationStatus | "all";
  setFilterStatus: (status: ApplicationStatus | "all") => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  initialAddStatus: ApplicationStatus | undefined;
  openAddModal: (status?: ApplicationStatus) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialAddStatus, setInitialAddStatus] = useState<ApplicationStatus | undefined>(undefined);

  const openAddModal = (status?: ApplicationStatus) => {
    setInitialAddStatus(status);
    setIsAddModalOpen(true);
  };

  return (
    <BoardContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        isAddModalOpen,
        setIsAddModalOpen,
        initialAddStatus,
        openAddModal,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}
