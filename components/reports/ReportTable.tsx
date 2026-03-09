"use client";

import { TimeEntry } from "@/types";
import { format } from "date-fns";
import Badge from "@/components/ui/Badge";

interface ReportTableProps {
  sessions: TimeEntry[];
  totalSeconds: number;
  hourlyRate: number | null;
}

function formatDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ReportTable({ sessions, totalSeconds, hourlyRate }: ReportTableProps) {
  const totalEarnings = hourlyRate != null ? (totalSeconds / 3600) * hourlyRate : null;
  const completedSessions = sessions.filter((s) => s.endTime);

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: "var(--color-muted)" }}>
        No sessions in this date range
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className={`grid gap-4 mb-6 ${hourlyRate != null ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}>
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>Sessions</p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}>{completedSessions.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>Total Hours</p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}>{(totalSeconds / 3600).toFixed(1)}h</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>Avg / Session</p>
          <p className="text-2xl font-bold" style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}>
            {completedSessions.length > 0 ? formatDuration(Math.floor(totalSeconds / completedSessions.length)) : "—"}
          </p>
        </div>
        {hourlyRate != null && (
          <div className="rounded-xl p-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>Total Earnings</p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
              {formatMoney(totalEarnings!)}
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
              {["Date", "Start", "End", "Duration", ...(hourlyRate != null ? ["Earnings"] : []), "Source", "Notes"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              const dur = s.duration ?? (s.endTime
                ? Math.floor((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1000)
                : null);
              const earnings = hourlyRate != null && dur != null ? (dur / 3600) * hourlyRate : null;
              return (
                <tr key={s.id} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-4 py-3 text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text)" }}>
                    {format(new Date(s.startTime), "EEE, MMM d")}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text)" }}>
                    {format(new Date(s.startTime), "HH:mm")}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text)" }}>
                    {s.endTime ? format(new Date(s.endTime), "HH:mm") : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--color-teal)" }}>
                    {dur != null ? formatDuration(dur) : "—"}
                  </td>
                  {hourlyRate != null && (
                    <td className="px-4 py-3 text-sm font-medium" style={{ fontFamily: "var(--font-mono)", color: "var(--color-amber)" }}>
                      {earnings != null ? formatMoney(earnings) : "—"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <Badge variant={s.source === "AUTO" ? "teal" : "gray"}>{s.source}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ color: "var(--color-text-dim)" }}>
                    {s.notes ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
