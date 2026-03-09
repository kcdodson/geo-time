interface BadgeProps {
  children: React.ReactNode;
  variant?: "amber" | "teal" | "red" | "gray";
}

const styles = {
  amber: { background: "rgba(245,158,11,0.15)", color: "var(--color-amber)", border: "1px solid rgba(245,158,11,0.3)" },
  teal: { background: "rgba(20,184,166,0.15)", color: "var(--color-teal)", border: "1px solid rgba(20,184,166,0.3)" },
  red: { background: "rgba(239,68,68,0.15)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.3)" },
  gray: { background: "rgba(107,114,128,0.15)", color: "var(--color-muted)", border: "1px solid rgba(107,114,128,0.3)" },
};

export default function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ ...styles[variant], fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
  );
}
