import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./providers";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobTracker — AI-Powered Job Application Tracker",
  description:
    "Track your job applications on a Kanban board. AI parses job descriptions and generates tailored resume suggestions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} ${raleway.className}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
