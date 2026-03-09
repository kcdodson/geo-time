"use client";

import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useGeofence } from "@/hooks/useGeofence";
import { useActiveSession } from "@/hooks/useActiveSession";
import { useSessionStats } from "@/hooks/useSessionStats";
import { Geofence, TimeEntry } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import GeofenceStatusPanel from "@/components/dashboard/GeofenceStatusPanel";
import RecentSessions from "@/components/dashboard/RecentSessions";
import TopBar from "@/components/layout/TopBar";

function formatHours(seconds: number): string {
  return `${(seconds / 3600).toFixed(1)}h`;
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [recentSessions, setRecentSessions] = useState<TimeEntry[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useGeolocation();
  const { status, distance } = useGeofence(geofence, location);
  const { session, loading: sessionLoading, start, stop, elapsedSeconds } = useActiveSession(status);
  const { stats } = useSessionStats(refreshKey);

  useEffect(() => {
    fetch("/api/geofence").then((r) => r.json()).then((d) => setGeofence(d.geofence ?? null));
  }, []);

  useEffect(() => {
    fetch("/api/sessions?limit=8")
      .then((r) => r.json())
      .then((d) => setRecentSessions(d.sessions ?? []))
      .finally(() => setSessionsLoading(false));
  }, [refreshKey]);

  const handleStart = async () => {
    await start("MANUAL", location.latitude ?? undefined, location.longitude ?? undefined);
    setRefreshKey((k) => k + 1);
  };

  const handleStop = async () => {
    await stop(location.latitude ?? undefined, location.longitude ?? undefined);
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Today"
            value={formatHours(stats.todaySeconds)}
            sub={stats.hourlyRate != null ? formatMoney(stats.todayEarnings) : "hours worked"}
            accent="var(--color-amber)"
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>}
          />
          <StatCard
            label="This Week"
            value={formatHours(stats.weekSeconds)}
            sub={stats.hourlyRate != null ? formatMoney(stats.weekEarnings) : "hours worked"}
            accent="var(--color-teal)"
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
          <StatCard
            label="This Month"
            value={formatHours(stats.monthSeconds)}
            sub={stats.hourlyRate != null ? formatMoney(stats.monthEarnings) : "hours worked"}
            accent="var(--color-teal)"
          />
          <StatCard
            label={stats.hourlyRate != null ? "Rate" : "Sessions"}
            value={stats.hourlyRate != null ? `$${stats.hourlyRate}/hr` : stats.totalSessions.toString()}
            sub={stats.hourlyRate != null ? `${stats.totalSessions} sessions this month` : "completed this month"}
            accent="var(--color-muted)"
          />
        </div>

        {/* Tracking panel + recent sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <GeofenceStatusPanel
              geofence={geofence}
              status={status}
              distance={distance}
              session={session}
              sessionLoading={sessionLoading}
              elapsedSeconds={elapsedSeconds}
              onStart={handleStart}
              onStop={handleStop}
            />
          </div>
          <div className="lg:col-span-3">
            <RecentSessions sessions={recentSessions} loading={sessionsLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
