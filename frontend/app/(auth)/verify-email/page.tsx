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
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1 style={{ marginBottom: "16px" }}>
        {status === "loading" && "Verifying..."}
        {status === "success" && "Success!"}
        {status === "error" && "Error"}
      </h1>
      <p style={{ color: status === "error" ? "#EF4444" : "inherit" }}>{message}</p>
      {status === "success" && (
        <p style={{ marginTop: "16px", fontSize: "14px", color: "var(--text-tertiary)" }}>
          Redirecting to login page...
        </p>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
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
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
