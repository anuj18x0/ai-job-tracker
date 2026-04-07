import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — JobTrackr",
  description: "Create a JobTrackr account to start tracking your job applications.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
