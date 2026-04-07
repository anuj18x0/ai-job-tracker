import AuthForm from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — JobTrackr",
  description: "Sign in to your JobTrackr account to manage your job applications.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
