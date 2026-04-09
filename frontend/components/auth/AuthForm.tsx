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
    <div className="animate-fade-in-up w-full max-w-[400px] px-8 py-10 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-lg)]">
      {/* Logo */}
      <div className="text-center mb-7">
        <div className="w-11 h-11 rounded-xl bg-[var(--green)] inline-flex items-center justify-center mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        </div>
        <h1 className="text-[22px] mb-1 font-bold">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm m-0">
          {mode === "login"
            ? "Sign in to your JobTrackr account"
            : "Start tracking your job applications"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-3.5 py-2.5 mb-4 rounded-md bg-[rgba(239,68,68,0.08)] text-[#EF4444] text-[13px] font-medium">
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

        <div className="mt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-[42px]"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>

      {/* Toggle */}
      <p className="text-center mt-5 text-[13px] text-[var(--text-tertiary)]">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--green)] hover:text-[var(--green-dark)] transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--green)] hover:text-[var(--green-dark)] transition-colors">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
