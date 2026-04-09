"use client";

import Link from "next/link";
import { Sparkles, LayoutGrid, FileText, ArrowRight, CheckCircle2, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background overflow-hidden relative selection:bg-green/20 selection:text-green">
      
      {/* Setup Top Navigation */}
      <header className="absolute top-0 w-full px-6 lg:px-12 py-6 flex items-center justify-between z-50">
        <div className="font-extrabold text-2xl tracking-tighter text-foreground">
          JobTracker<span className="text-green">.</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border/50">
              <Link 
                href="/board" 
                className="text-sm font-bold bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => logout()} 
                className="p-2.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors border border-border/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-sm font-bold bg-background text-foreground px-5 py-2 rounded-lg hover:opacity-90 transition-opacity ml-2 border border-border/10"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Very Subtle Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-12 flex flex-col justify-center py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="flex flex-col items-start text-left z-10 w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-8 border border-border/50">
              <Sparkles className="w-4 h-4 text-green" />
              <span>AI-Powered Job Tracking</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] mb-8 tracking-tight">
              Track Job Applications with <span className="text-green">AI precision.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Stop manually copy-pasting job requirements. Just drop a job description link and let our AI instantly extract required skills, seniority, and generate tailored resume bullet points to help you land the interview.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 bg-green !text-white rounded-lg font-bold text-lg transition-all hover:bg-green-dark hover:-translate-y-0.5 active:translate-y-0 shadow-md"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/board"
                className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 bg-secondary/50 !text-foreground border border-border rounded-lg font-bold text-lg transition-all hover:bg-secondary hover:border-border-hover"
              >
                Live Preview
              </Link>
            </div>

            {/* Feature Bullet Points */}
            <div className="mt-14 flex flex-col gap-4">
              {[
                "Automated Job Description Parsing",
                "AI-Tailored Resume Bullet Points",
                "Drag-and-Drop Kanban Pipeline"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-base text-foreground font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-green" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Abstract Illustration */}
          <div className="relative w-full aspect-square max-w-[750px] mx-auto hidden lg:flex items-center justify-center z-10 scale-105">
            {/* Mockup Container */}
            <div className="relative w-[110%] h-[110%] flex items-center justify-center">
              
              {/* Back Card (Faded) */}
              <div className="absolute right-[5%] top-[15%] w-[360px] h-[400px] bg-secondary/30 rounded-2xl border border-border/40 backdrop-blur-sm -rotate-6 transform transition-transform hover:rotate-0 duration-700 ease-out shadow-xl" />
              
              {/* Main Card */}
              <div className="absolute left-[10%] top-[25%] w-[380px] bg-background rounded-2xl border border-border/80 shadow-2xl p-7 z-20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-green/10 flex items-center justify-center mb-5">
                      <LayoutGrid className="w-7 h-7 text-green" />
                    </div>
                    <div className="h-6 w-36 bg-secondary rounded-md mb-3" />
                    <div className="h-4 w-28 bg-secondary/50 rounded-md" />
                  </div>
                  <div className="px-3 py-1.5 rounded bg-[var(--status-interview)]/10 text-[var(--status-interview)] text-sm font-bold border border-[var(--status-interview)]/20">
                    Interview
                  </div>
                </div>

                <div className="space-y-4 mb-7">
                  <div className="h-3 w-full bg-secondary/40 rounded-full" />
                  <div className="h-3 w-5/6 bg-secondary/40 rounded-full" />
                  <div className="h-3 w-4/6 bg-secondary/40 rounded-full" />
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-green" />
                    AI Extracted Skills
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                     <span className="px-3 py-1.5 rounded-lg bg-green/10 text-green border border-green/20 text-sm font-semibold">React</span>
                     <span className="px-3 py-1.5 rounded-lg bg-green/10 text-green border border-green/20 text-sm font-semibold">TypeScript</span>
                     <span className="px-3 py-1.5 rounded-lg bg-green/10 text-green border border-green/20 text-sm font-semibold">Node.js</span>
                  </div>
                </div>
              </div>

              {/* Floating AI Notification */}
              <div className="absolute right-[0%] bottom-[10%] bg-background rounded-xl border border-border shadow-xl p-5 z-30 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-green" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">Tailored Resume Ready</p>
                  <p className="text-sm text-muted-foreground">3 new bullet points generated.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
