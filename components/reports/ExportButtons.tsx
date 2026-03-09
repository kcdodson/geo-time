"use client";

import { TimeEntry } from "@/types";
import { downloadCSV, triggerPrintReport } from "@/lib/export";
import { format } from "date-fns";
import Button from "@/components/ui/Button";

interface ExportButtonsProps {
  sessions: TimeEntry[];
  from: string;
  to: string;
  hourlyRate: number | null;
}

function sessionsToCSV(sessions: TimeEntry[], hourlyRate: number | null): string {
  const headers = ["ID", "Start Time", "End Time", "Duration (hours)", ...(hourlyRate != null ? ["Earnings ($)"] : []), "Source", "Notes"];
  const rows = sessions.map((s) => {
    const start = new Date(s.startTime);
    const end = s.endTime ? new Date(s.endTime) : null;
    const dur = s.duration ?? (end ? Math.floor((end.getTime() - start.getTime()) / 1000) : null);
    const hours = dur != null ? (dur / 3600).toFixed(2) : "";
    const earnings = hourlyRate != null && dur != null ? ((dur / 3600) * hourlyRate).toFixed(2) : "";
    const cells = [
      s.id,
      format(start, "yyyy-MM-dd HH:mm:ss"),
      end ? format(end, "yyyy-MM-dd HH:mm:ss") : "",
      hours,
      ...(hourlyRate != null ? [earnings] : []),
      s.source,
      s.notes ?? "",
    ];
    return cells.map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export default function ExportButtons({ sessions, from, to, hourlyRate }: ExportButtonsProps) {
  const handleCSV = () => {
    const csv = sessionsToCSV(sessions, hourlyRate);
    const filename = `geotime-${format(new Date(from), "yyyy-MM-dd")}-to-${format(new Date(to), "yyyy-MM-dd")}.csv`;
    downloadCSV(csv, filename);
  };

  return (
    <div className="flex items-center gap-2 no-print">
      <Button variant="secondary" size="sm" onClick={handleCSV}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export CSV
      </Button>
      <Button variant="secondary" size="sm" onClick={triggerPrintReport}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6,9 6,2 18,2 18,9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Print
      </Button>
    </div>
  );
}
