"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timeEntrySchema, type TimeEntryInput } from "@/lib/validations";
import { TimeEntry } from "@/types";
import { format } from "date-fns";
import Button from "@/components/ui/Button";

interface SessionFormProps {
  session?: TimeEntry;
  onSubmit: (data: TimeEntryInput) => Promise<void>;
  onCancel: () => void;
  error?: string;
}

function toDatetimeLocal(iso: string) {
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}

export default function SessionForm({ session, onSubmit, onCancel, error }: SessionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TimeEntryInput>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: session
      ? {
          startTime: toDatetimeLocal(session.startTime) + ":00",
          endTime: session.endTime ? toDatetimeLocal(session.endTime) + ":00" : undefined,
          notes: session.notes ?? "",
          source: session.source,
        }
      : {
          startTime: new Date().toISOString(),
          source: "MANUAL",
        },
  });

  const labelStyle = { color: "var(--color-text-dim)", fontFamily: "var(--font-body)" };
  const inputStyle = {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-mono)",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Start Time</label>
        <input
          {...register("startTime")}
          type="datetime-local"
          className="w-full px-3 py-2 rounded-lg outline-none"
          style={inputStyle}
        />
        {errors.startTime && <p className="mt-1 text-xs" style={{ color: "var(--color-red)" }}>{errors.startTime.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>End Time</label>
        <input
          {...register("endTime")}
          type="datetime-local"
          className="w-full px-3 py-2 rounded-lg outline-none"
          style={inputStyle}
        />
        {errors.endTime && <p className="mt-1 text-xs" style={{ color: "var(--color-red)" }}>{String(errors.endTime.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Source</label>
        <select
          {...register("source")}
          className="w-full px-3 py-2 rounded-lg outline-none"
          style={inputStyle}
        >
          <option value="MANUAL">MANUAL</option>
          <option value="AUTO">AUTO</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Notes</label>
        <textarea
          {...register("notes")}
          rows={2}
          className="w-full px-3 py-2 rounded-lg outline-none resize-none"
          style={{ ...inputStyle, fontFamily: "var(--font-body)" }}
          placeholder="Optional notes..."
        />
      </div>

      {error && (
        <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-red)" }}>
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : session ? "Save Changes" : "Create Session"}
        </Button>
      </div>
    </form>
  );
}
