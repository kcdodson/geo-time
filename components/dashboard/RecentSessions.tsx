"use client";

import { TimeEntry } from "@/types";
import { format, formatDistanceStrict } from "date-fns";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface RecentSessionsProps {
  sessions: TimeEntry[];
  loading: boolean;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function RecentSessions({ sessions, loading }: RecentSessionsProps) {
  return (
    <Card padding={false}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <h2 className="font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Recent Sessions</h2>
        <Link href="/sessions" className="text-xs hover:underline" style={{ color: "var(--color-amber)" }}>
          View all
        </Link>
      </div>

      {loading ? (
        <div className="px-6 py-8 text-center" style={{ color: "var(--color-muted)" }}>Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="px-6 py-8 text-center" style={{ color: "var(--color-muted)" }}>
          No sessions yet. Start tracking to see them here.
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {sessions.map((s) => {
            const dur = s.duration ?? (s.endTime
              ? Math.floor((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1000)
              : null);
            return (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-mono)" }}>
                    {format(new Date(s.startTime), "EEE, MMM d")}
                    {" · "}
                    {format(new Date(s.startTime), "HH:mm")}
                    {s.endTime ? ` – ${format(new Date(s.endTime), "HH:mm")}` : ""}
                  </p>
                  {s.notes && <p className="text-xs mt-0.5" style={{ color: "var(--color-text-dim)" }}>{s.notes}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {dur !== null ? (
                    <span className="text-sm font-medium" style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}>
                      {formatDuration(dur)}
                    </span>
                  ) : (
                    <span className="text-xs ticker" style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
                      ACTIVE
                    </span>
                  )}
                  <Badge variant={s.source === "AUTO" ? "teal" : "gray"}>
                    {s.source}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
