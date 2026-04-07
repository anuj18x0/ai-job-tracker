"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  mode: "login" | "register";
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        window.location.href = "/board";
      } else {
        await register(name, email, password);
        setError("Please check your email to verify your account.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "40px 32px",
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-lg)",
            background: "var(--green)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        </div>
        <h1 style={{ fontSize: "22px", marginBottom: "4px" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p style={{ fontSize: "14px", margin: 0 }}>
          {mode === "login"
            ? "Sign in to your JobTrackr account"
            : "Start tracking your job applications"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: "16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(239, 68, 68, 0.08)",
            color: "#EF4444",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <Input
            label="Full Name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ marginTop: "8px" }}>
          <Button
            type="submit"
            isLoading={isLoading}
            style={{ width: "100%", height: "42px" }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>

      {/* Toggle */}
      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "13px",
          color: "var(--text-tertiary)",
        }}
      >
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ fontWeight: 600 }}>
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
