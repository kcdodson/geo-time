import { format } from "date-fns";

interface SessionRow {
  id: string;
  startTime: string | Date;
  endTime: string | Date | null;
  duration: number | null;
  source: string;
  notes: string | null;
}

export function sessionsToCSV(sessions: SessionRow[]): string {
  const headers = ["ID", "Start Time", "End Time", "Duration (hours)", "Source", "Notes"];
  const rows = sessions.map((s) => {
    const start = new Date(s.startTime);
    const end = s.endTime ? new Date(s.endTime) : null;
    const hours = s.duration ? (s.duration / 3600).toFixed(2) : "";
    return [
      s.id,
      format(start, "yyyy-MM-dd HH:mm:ss"),
      end ? format(end, "yyyy-MM-dd HH:mm:ss") : "",
      hours,
      s.source,
      s.notes ?? "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function triggerPrintReport() {
  window.print();
}
