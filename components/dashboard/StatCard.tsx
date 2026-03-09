"use client";

import Card from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, sub, accent = "var(--color-amber)", icon }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            {label}
          </p>
          <p className="text-3xl font-bold" style={{ color: accent, fontFamily: "var(--font-mono)" }}>
            {value}
          </p>
          {sub && (
            <p className="text-xs mt-1" style={{ color: "var(--color-text-dim)" }}>{sub}</p>
          )}
        </div>
        {icon && (
          <div className="opacity-40" style={{ color: accent }}>{icon}</div>
        )}
      </div>
    </Card>
  );
}
