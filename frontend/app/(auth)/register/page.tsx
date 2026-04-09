import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — JobTracker",
  description: "Create a JobTracker account to start tracking your job applications.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
