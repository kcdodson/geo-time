"use client";

import { TimeEntry } from "@/types";
import { format } from "date-fns";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface SessionRowProps {
  session: TimeEntry;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (session: TimeEntry) => void;
  onDelete: (id: string) => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function SessionRow({ session, selected, onSelect, onEdit, onDelete }: SessionRowProps) {
  const dur = session.duration ?? (session.endTime
    ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
    : null);

  return (
    <tr
      className="border-b transition-colors"
      style={{
        borderColor: "var(--color-border)",
        background: selected ? "rgba(245,158,11,0.05)" : "transparent",
      }}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(session.id)}
          className="w-4 h-4 rounded"
          style={{ accentColor: "var(--color-amber)" }}
        />
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>
        {format(new Date(session.startTime), "EEE, MMM d")}
      </td>
      <td className="px-4 py-3 text-sm" style={{ color: "var(--color-text)", fontFamily: "var(--font-mono)" }}>
        {format(new Date(session.startTime), "HH:mm")}
        {session.endTime ? ` – ${format(new Date(session.endTime), "HH:mm")}` : (
          <span className="ticker ml-1" style={{ color: "var(--color-amber)" }}>ACTIVE</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}>
        {dur !== null ? formatDuration(dur) : "—"}
      </td>
      <td className="px-4 py-3">
        <Badge variant={session.source === "AUTO" ? "teal" : "gray"}>{session.source}</Badge>
      </td>
      <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ color: "var(--color-text-dim)" }}>
        {session.notes ?? "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(session)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(session.id)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </Button>
        </div>
      </td>
    </tr>
  );
}
