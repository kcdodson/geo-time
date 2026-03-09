"use client";

import { TimeEntry } from "@/types";
import { format } from "date-fns";

interface ActiveTimerProps {
  session: TimeEntry | null;
  elapsedSeconds: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ActiveTimer({ session, elapsedSeconds }: ActiveTimerProps) {
  if (!session) return null;

  return (
    <div className="text-center">
      <p
        className="text-5xl font-bold tracking-widest ticker"
        style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}
      >
        {formatDuration(elapsedSeconds)}
      </p>
      <p className="text-xs mt-2" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
        Started {format(new Date(session.startTime), "HH:mm:ss")} · {session.source}
      </p>
    </div>
  );
}
