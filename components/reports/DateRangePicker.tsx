"use client";

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";
import Button from "@/components/ui/Button";

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}

export default function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const preset = (label: string, fromDate: Date, toDate: Date) => (
    <Button
      key={label}
      variant="secondary"
      size="sm"
      onClick={() => onChange(fromDate.toISOString(), toDate.toISOString())}
    >
      {label}
    </Button>
  );

  const now = new Date();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-2">
        {preset("This Week", startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }))}
        {preset("Last Week", startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }))}
        {preset("This Month", startOfMonth(now), endOfMonth(now))}
        {preset("Last Month", startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1)))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={format(new Date(from), "yyyy-MM-dd")}
          onChange={(e) => onChange(new Date(e.target.value).toISOString(), to)}
          className="px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            fontFamily: "var(--font-mono)",
          }}
        />
        <span style={{ color: "var(--color-muted)" }}>—</span>
        <input
          type="date"
          value={format(new Date(to), "yyyy-MM-dd")}
          onChange={(e) => onChange(from, new Date(e.target.value).toISOString())}
          className="px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            fontFamily: "var(--font-mono)",
          }}
        />
      </div>
    </div>
  );
}
