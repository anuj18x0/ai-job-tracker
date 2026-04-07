interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: 16, md: 24, lg: 36 };

export default function Spinner({ size = "md" }: SpinnerProps) {
  const s = sizes[size];
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--border)"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="var(--green)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
