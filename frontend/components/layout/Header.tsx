"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ResumeModal from "@/components/auth/ResumeModal";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useBoard } from "@/context/BoardContext";
import { Search, Plus, Filter, User, Briefcase, FileText } from "lucide-react";
import { KANBAN_COLUMNS } from "@/lib/constants";

export default function Header() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus, openAddModal } = useBoard();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-2" 
            : "bg-background border-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/board"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-green flex items-center justify-center shadow-lg shadow-green/20">
              <Briefcase className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold tracking-tight hidden sm:block">
              Job<span className="text-green">Trackr</span>
            </span>
          </Link>

          {/* Center: Search & Filter */}
          <div className="flex-1 max-w-xl flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-green transition-colors" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full bg-secondary/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative group hidden md:block">
              <select
                className="appearance-none bg-secondary/50 border border-border rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green cursor-pointer transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsResumeOpen(true)}
              className="hidden lg:flex items-center gap-2 border border-border/50"
            >
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openAddModal()}
              className="flex items-center gap-2 px-4 shadow-md shadow-green/20"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Application</span>
            </Button>

            <div className="w-[1px] h-6 bg-border mx-1 hidden sm:block" />

            <ThemeToggle />

            <Link
              href="/profile"
              className="w-9 h-9 rounded-full border border-border bg-secondary hover:border-green hover:bg-green-glass transition-all flex items-center justify-center group"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-muted-foreground group-hover:text-green transition-colors" />
            </Link>
          </div>
        </div>
      </header>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
