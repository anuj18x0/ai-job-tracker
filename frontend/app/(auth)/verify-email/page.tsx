"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/api-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        if (data.success) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="text-center p-10">
      <h1 className="mb-4 text-2xl font-bold">
        {status === "loading" && "Verifying..."}
        {status === "success" && "Success!"}
        {status === "error" && "Error"}
      </h1>
      <p className={status === "error" ? "text-red-500" : "text-inherit"}>{message}</p>
      {status === "success" && (
        <p className="mt-4 text-sm text-[var(--text-tertiary)]">
          Redirecting to login page...
        </p>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-[400px] px-8 py-10 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] shadow-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
