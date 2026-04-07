"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true };

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-secondary)",
  marginBottom: "6px",
  letterSpacing: "0.02em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "var(--text-primary)",
  background: "var(--input-bg)",
  border: "1px solid var(--input-border)",
  borderRadius: "var(--radius-md)",
  outline: "none",
  transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
};

const errorMsgStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#EF4444",
  marginTop: "4px",
};

const helperStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--text-tertiary)",
  marginTop: "4px",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ marginBottom: "16px" }}>
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            ...inputStyle,
            ...(error ? { borderColor: "#EF4444" } : {}),
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--border-focus)";
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "rgba(239,68,68,0.1)" : "rgba(62,207,142,0.1)"}`;
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--input-border)";
            e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <p style={errorMsgStyle}>{error}</p>}
        {helperText && !error && <p style={helperStyle}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, Omit<TextareaProps, "multiline">>(
  ({ label, error, helperText, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div style={{ marginBottom: "16px" }}>
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          style={{
            ...inputStyle,
            minHeight: "120px",
            resize: "vertical",
            lineHeight: "1.5",
            ...(error ? { borderColor: "#EF4444" } : {}),
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--border-focus)";
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? "rgba(239,68,68,0.1)" : "rgba(62,207,142,0.1)"}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "var(--input-border)";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...props}
        />
        {error && <p style={errorMsgStyle}>{error}</p>}
        {helperText && !error && <p style={helperStyle}>{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
