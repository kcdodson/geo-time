"use client";

import { TimeEntry } from "@/types";
import SessionRow from "./SessionRow";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface SessionTableProps {
  sessions: TimeEntry[];
  loading: boolean;
  selected: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (session: TimeEntry) => void;
  onDelete: (id: string) => void;
  onMerge: () => void;
}

export default function SessionTable({
  sessions,
  loading,
  selected,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onMerge,
}: SessionTableProps) {
  const allSelected = sessions.length > 0 && selected.length === sessions.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div>
      {selected.length > 1 && (
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <span className="text-sm" style={{ color: "var(--color-amber)" }}>{selected.length} selected</span>
          <Button variant="secondary" size="sm" onClick={onMerge}>
            Merge Sessions
          </Button>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--color-amber)" }}
                />
              </th>
              {["Date", "Time", "Duration", "Source", "Notes", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center" style={{ color: "var(--color-muted)" }}>
                  No sessions found
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  selected={selected.includes(s.id)}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
