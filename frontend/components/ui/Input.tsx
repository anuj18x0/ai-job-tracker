"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [focused, setFocused] = useState(false);
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.02em]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3.5 py-2.5 text-sm font-inherit text-[var(--text-primary)] bg-[var(--input-bg)] border rounded-md outline-none transition-all duration-150",
            error 
              ? "border-[#EF4444]" 
              : focused 
                ? "border-[var(--green)] ring-2 ring-[var(--green-glass)]" 
                : "border-[var(--input-border)]",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--text-tertiary)] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, Omit<TextareaProps, "multiline">>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [focused, setFocused] = useState(false);
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.02em]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-3.5 py-2.5 text-sm font-inherit text-[var(--text-primary)] bg-[var(--input-bg)] border rounded-md outline-none transition-all duration-150 min-h-[120px] resize-y leading-[1.6]",
            error 
              ? "border-[#EF4444]" 
              : focused 
                ? "border-[var(--green)] ring-2 ring-[var(--green-glass)]" 
                : "border-[var(--input-border)]",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--text-tertiary)] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
