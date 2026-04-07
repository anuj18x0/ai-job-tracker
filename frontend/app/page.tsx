"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      className="mesh-bg"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        minHeight: "100vh",
        background: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* Background Grid */}
      <div
        className="grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Hero Content */}
      <div
        className="animate-fade-in-up"
        style={{
          maxWidth: "920px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Tagline Badge */}
        <div
          style={{
            padding: "8px 16px",
            background: "var(--green-glass)",
            borderRadius: "var(--radius-full)",
            color: "var(--green)",
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "24px",
            border: "1px solid var(--green)",
          }}
        >
          AI-Powered Job Tracking
        </div>

        {/* Hero Title */}
        <h1 className="hero-text gradient-text" style={{ marginBottom: "20px" }}>
          Track Job Applications <br /> with AI precision
        </h1>

        {/* Hero Description */}
        <p
          style={{
            fontSize: "clamp(1rem, 3vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            marginBottom: "40px",
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          Paste any job description and let our AI parse details, Extract skills, and
          generate tailored resume points instantly.
        </p>

        {/* CTA Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "56px",
              padding: "0 40px",
              background: "var(--green)",
              color: "#FFFFFF",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "17px",
              textDecoration: "none",
              transition: "all var(--transition-fast)",
              boxShadow: "0 8px 32px rgba(62, 207, 142, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--green-dark)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--green)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Get Started Free
          </Link>

          <Link
            href="/board"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "56px",
              padding: "0 40px",
              border: "2px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius-md)",
              fontWeight: 700,
              fontSize: "17px",
              textDecoration: "none",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Live Preview
          </Link>
        </div>

        {/* Feature Highlights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            width: "100%",
            marginTop: "80px",
            padding: "40px",
            borderTop: "1px solid var(--border)",
          }}
        >
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
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--green-glass)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  border: "1px solid var(--green)",
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{feature.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-tertiary)", margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtle Mesh */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(62, 207, 142, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
    </div>
  );
}
