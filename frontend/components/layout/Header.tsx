"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ResumeModal from "@/components/auth/ResumeModal";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useBoard } from "@/context/BoardContext";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, Filter, User, Briefcase, FileText, LogOut } from "lucide-react";
import { KANBAN_COLUMNS } from "@/lib/constants";

export default function Header() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus, openAddModal } = useBoard();
  const { logout } = useAuth();
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
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-background/70 backdrop-blur-xl border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-2" 
            : "bg-background/50 backdrop-blur-md border-transparent py-2.5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/board"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-green flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight hidden sm:block">
              Job<span className="text-green">Trackr</span>
            </span>
          </Link>

          {/* Center: Search & Filter */}
          <div className="flex-1 max-w-md flex items-center gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 group-focus-within:text-green transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-secondary/40 border border-border/50 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-green/30 focus:border-green/40 transition-all placeholder:text-muted-foreground/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative group hidden md:block">
              <select
                className="appearance-none bg-secondary/40 border border-border/50 rounded-lg py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green/30 focus:border-green/40 cursor-pointer transition-all text-muted-foreground"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All</option>
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/40 pointer-events-none" />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsResumeOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openAddModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs shadow-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>

            <div className="w-px h-5 bg-border/50 mx-0.5 hidden sm:block" />

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5 ${isProfileOpen ? 'bg-secondary' : 'bg-secondary/50 hover:bg-secondary'}`}
                aria-label="Profile"
              >
                <User className={`w-4 h-4 transition-colors ${isProfileOpen ? 'text-foreground' : 'text-muted-foreground'}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border/50 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden animate-fade-in-up">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        window.location.href='/'
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
