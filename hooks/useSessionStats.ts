"use client";

import { useEffect, useState } from "react";
import { SessionStats } from "@/types";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

interface SessionStatsWithPay extends SessionStats {
  hourlyRate: number | null;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
}

export function useSessionStats(refreshKey?: number) {
  const [stats, setStats] = useState<SessionStatsWithPay>({
    todaySeconds: 0,
    weekSeconds: 0,
    monthSeconds: 0,
    totalSessions: 0,
    hourlyRate: null,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const from = startOfMonth(now);
    const params = new URLSearchParams({
      from: from.toISOString(),
      to: now.toISOString(),
    });

    Promise.all([
      fetch(`/api/sessions?${params}`).then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([sessionData, settingsData]) => {
        const sessions = sessionData.sessions ?? [];
        const hourlyRate: number | null = settingsData.user?.hourlyRate ?? null;

        const todayStart = startOfDay(now).getTime();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }).getTime();
        const monthStart = startOfMonth(now).getTime();

        let todaySeconds = 0;
        let weekSeconds = 0;
        let monthSeconds = 0;

        for (const s of sessions) {
          const dur = s.duration ?? (s.endTime
            ? Math.floor((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1000)
            : Math.floor((Date.now() - new Date(s.startTime).getTime()) / 1000));

          const start = new Date(s.startTime).getTime();
          if (start >= todayStart) todaySeconds += dur;
          if (start >= weekStart) weekSeconds += dur;
          if (start >= monthStart) monthSeconds += dur;
        }

        const toEarnings = (seconds: number) =>
          hourlyRate != null ? (seconds / 3600) * hourlyRate : 0;

        setStats({
          todaySeconds,
          weekSeconds,
          monthSeconds,
          totalSessions: sessions.filter((s: { endTime: string | null }) => s.endTime).length,
          hourlyRate,
          todayEarnings: toEarnings(todaySeconds),
          weekEarnings: toEarnings(weekSeconds),
          monthEarnings: toEarnings(monthSeconds),
        });
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { stats, loading };
}
