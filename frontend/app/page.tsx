"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="mesh-bg flex-1 flex flex-col items-center justify-center px-6 min-h-screen relative bg-[var(--bg-primary)]">
      {/* Background Grid */}
      <div className="grid-bg absolute inset-0 z-0" />

      {/* Hero Content */}
      <div className="animate-fade-in-up w-full max-w-[920px] flex flex-col items-center text-center z-10">
        {/* Tagline Badge */}
        <div className="px-4 py-2 bg-[var(--green-glass)] rounded-full text-[var(--green)] text-xs font-extrabold uppercase tracking-[0.15em] mb-6 border border-[var(--green)]">
          AI-Powered Job Tracking
        </div>

        {/* Hero Title */}
        <h1 className="hero-text gradient-text mb-5">
          Track Job Applications <br /> with AI precision
        </h1>

        {/* Hero Description */}
        <p className="text-[clamp(1rem,3vw,1.25rem)] text-[var(--text-secondary)] max-w-[600px] mb-10 leading-[1.6] font-medium">
          Paste any job description and let our AI parse details, Extract skills, and
          generate tailored resume points instantly.
        </p>

        {/* CTA Section */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-14 px-10 bg-[var(--green)] !text-white rounded-md font-bold text-[17px] no-underline transition-all duration-200 ease-out shadow-[0_8px_32px_rgba(62,207,142,0.2)] hover:bg-[var(--green-dark)] hover:!text-white hover:-translate-y-1 active:scale-[0.97] active:translate-y-0 active:shadow-[0_4px_16px_rgba(62,207,142,0.15)]"
          >
            Get Started Free
          </Link>

          <Link
            href="/board"
            className="inline-flex items-center justify-center h-14 px-10 border-2 border-[var(--border)] !text-[var(--text-primary)] rounded-md font-bold text-[17px] no-underline transition-all duration-200 ease-out hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)] hover:!text-[var(--text-primary)] hover:-translate-y-1 active:scale-[0.97] active:translate-y-0"
          >
            Live Preview
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 w-full mt-20 p-10 border-t border-[var(--border)]">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              ),
              title: "Kanban Board",
              desc: "Manage stages effortlessly with drag-and-drop.",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v10" />
                  <path d="M18.42 15.61a10 10 0 1 1-12.84 0" />
                </svg>
              ),
              title: "AI Analysis",
              desc: "Extract key skills and requirements from any JD.",
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                  <path d="M10 10V5a2 2 0 0 1 4 0v5" />
                  <path d="M10 14h4" />
                </svg>
              ),
              title: "Resume Boost",
              desc: "Get tailored bullet points for each specific role.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--green-glass)] text-[var(--green)] flex items-center justify-center mb-4 border border-[var(--green)]">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-tertiary)] m-0">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtle Mesh */}
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(62,207,142,0.1)_0%,transparent_70%)] blur-[60px] z-0" />
    </div>
  );
}
