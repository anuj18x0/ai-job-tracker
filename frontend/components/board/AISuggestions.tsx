"use client";

import { useMemo, useState, useEffect } from "react";
import CopyButton from "@/components/ui/CopyButton";
import Spinner from "@/components/ui/Spinner";
import type { ResumeSuggestion } from "@/types";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AISuggestionsProps {
  suggestions: ResumeSuggestion[];
  isLoading: boolean;
  onRegenerate?: () => void;
  streamingText?: string;
  isStreaming?: boolean;
}

export default function AISuggestions({
  suggestions,
  isLoading,
  onRegenerate,
  streamingText = "",
  isStreaming = false,
}: AISuggestionsProps) {
  const [smoothText, setSmoothText] = useState("");
  
  // Typewriter effect to smooth out bursty streams
  useEffect(() => {
    if (!isStreaming) {
      setSmoothText(streamingText);
      return;
    }

    if (smoothText.length < streamingText.length) {
      const timeout = setTimeout(() => {
        // Take more characters if we are falling behind significantly
        const diff = streamingText.length - smoothText.length;
        const step = diff > 40 ? 8 : diff > 10 ? 4 : 2; 
        setSmoothText(streamingText.substring(0, smoothText.length + step));
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [streamingText, smoothText, isStreaming]);

  // Parse streaming text into points
  const streamingPoints = useMemo(() => {
    if (!smoothText) return [];
    
    const lines = smoothText.split("\n");
    const points: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      const cleaned = trimmed.replace(/^([•\-\*\d\.]+\s*)/, "").trim();
      if (cleaned.length > 2) { 
        points.push(cleaned);
      }
    });
    
    return points;
  }, [smoothText]);

  const displayPoints = isStreaming ? streamingPoints : suggestions.map(s => s.text);

  if (isLoading && !isStreaming) {
    return (
      <div className="flex flex-col gap-4 py-4 animate-in fade-in transition-all">
        <div className="flex items-center gap-3 px-1">
          <Spinner size="sm" />
          <span className="text-[11px] font-bold text-muted-foreground animate-pulse uppercase tracking-widest">
            Tailoring for you...
          </span>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-secondary/30 border border-border/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (displayPoints.length === 0 && !isStreaming) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 py-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayPoints.map((text, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={`${index}-${text.substring(0, 15)}`}
              className="group relative flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-all border border-transparent hover:border-border/30"
            >
              <div className={cn(
                "mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                isStreaming && index === displayPoints.length - 1 
                  ? "bg-green animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)] scale-110" 
                  : "bg-green/40 group-hover:bg-green/60"
              )} />
              
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-[13px] leading-relaxed text-foreground/90 font-medium pr-10">
                  {text}
                </p>
                {isStreaming && index === displayPoints.length - 1 && (
                  <span className="text-[9px] font-black text-green uppercase tracking-widest animate-pulse">
                    Writing...
                  </span>
                )}
              </div>

              {!isStreaming && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton text={text} size={14} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isStreaming && (
          <div className="flex items-center gap-2 px-4 py-3 text-[11px] text-muted-foreground font-bold italic bg-green/5 border border-dashed border-green/20 rounded-2xl animate-pulse mt-2">
            <Sparkles className="w-3.5 h-3.5 text-green" />
            AI is analyzing requirements...
          </div>
        )}
      </div>

      {onRegenerate && !isStreaming && displayPoints.length > 0 && (
        <button 
          onClick={onRegenerate}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/50 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all uppercase tracking-widest mt-2"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate Suggestions
        </button>
      )}
    </div>
  );
}
