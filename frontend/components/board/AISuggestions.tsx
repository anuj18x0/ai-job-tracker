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
  
  useEffect(() => {
    if (!isStreaming) {
      setSmoothText(streamingText);
      return;
    }

    if (smoothText.length < streamingText.length) {
      const timeout = setTimeout(() => {
        const diff = streamingText.length - smoothText.length;
        const step = diff > 40 ? 8 : diff > 10 ? 4 : 2; 
        setSmoothText(streamingText.substring(0, smoothText.length + step));
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [streamingText, smoothText, isStreaming]);

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
      <div className="flex items-center gap-2 py-3">
        <Spinner size="sm" />
        <span className="text-xs text-muted-foreground/60">
          Analyzing job requirements...
        </span>
      </div>
    );
  }

  if (displayPoints.length === 0 && !isStreaming) return null;

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        {displayPoints.map((text, index) => (
          <motion.div
            layout
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            key={`${index}-${text.substring(0, 15)}`}
            className="group relative flex items-start gap-3 py-2 rounded-lg hover:bg-secondary/30 transition-colors -mx-1 px-1"
          >
            <div className={cn(
              "mt-[7px] w-1 h-1 rounded-full shrink-0",
              isStreaming && index === displayPoints.length - 1 
                ? "bg-green animate-pulse" 
                : "bg-muted-foreground/25"
            )} />
            
            <p className="flex-1 text-[13px] leading-[1.6] text-foreground/80 pr-8">
              {text}
            </p>

            {!isStreaming && (
              <div className="absolute top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={text} size={12} />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isStreaming && (
        <div className="flex items-center gap-2 py-2 text-xs text-green/60 animate-pulse">
          <Sparkles className="w-3 h-3" />
          Writing...
        </div>
      )}

      {onRegenerate && !isStreaming && displayPoints.length > 0 && (
        <button 
          onClick={onRegenerate}
          className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors self-start"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate
        </button>
      )}
    </div>
  );
}
