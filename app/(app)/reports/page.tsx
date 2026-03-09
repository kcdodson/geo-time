"use client";

import { useEffect, useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { TimeEntry } from "@/types";
import DateRangePicker from "@/components/reports/DateRangePicker";
import ReportTable from "@/components/reports/ReportTable";
import ExportButtons from "@/components/reports/ExportButtons";
import TopBar from "@/components/layout/TopBar";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";

export default function ReportsPage() {
  const [from, setFrom] = useState(startOfMonth(new Date()).toISOString());
  const [to, setTo] = useState(endOfMonth(new Date()).toISOString());
  const [sessions, setSessions] = useState<TimeEntry[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      setHourlyRate(d.user?.hourlyRate ?? null);
    });
  }, []);

  const load = async (f: string, t: string) => {
    setLoading(true);
    const params = new URLSearchParams({ from: f, to: t });
    const res = await fetch(`/api/reports?${params}`);
    const data = await res.json();
    setSessions(data.sessions ?? []);
    setTotalSeconds(data.totalSeconds ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(from, to); }, []);

  const handleChange = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
    load(f, t);
  };

  return (
    <>
      <TopBar title="Reports" />
      <div className="p-6 space-y-5">
        {hourlyRate == null && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--color-amber)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            No hourly rate set — earnings won&apos;t be calculated.{" "}
            <Link href="/settings" className="underline font-medium">Set your rate</Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <DateRangePicker from={from} to={to} onChange={handleChange} />
          <ExportButtons sessions={sessions} from={from} to={to} hourlyRate={hourlyRate} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size={32} />
          </div>
        ) : (
          <ReportTable sessions={sessions} totalSeconds={totalSeconds} hourlyRate={hourlyRate} />
        )}
      </div>
    </>
  );
}
