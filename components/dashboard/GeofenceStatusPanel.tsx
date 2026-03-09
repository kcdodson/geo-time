"use client";

import { Geofence, GeofenceStatus, TimeEntry } from "@/types";
import TrackingStatus from "@/components/tracking/TrackingStatus";
import ActiveTimer from "@/components/tracking/ActiveTimer";
import ManualControls from "@/components/tracking/ManualControls";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface GeofenceStatusPanelProps {
  geofence: Geofence | null;
  status: GeofenceStatus;
  distance: number | null;
  session: TimeEntry | null;
  sessionLoading: boolean;
  elapsedSeconds: number;
  onStart: () => void;
  onStop: () => void;
}

export default function GeofenceStatusPanel({
  geofence,
  status,
  distance,
  session,
  sessionLoading,
  elapsedSeconds,
  onStart,
  onStop,
}: GeofenceStatusPanelProps) {
  if (!geofence) {
    return (
      <Card>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(107,114,128,0.1)", border: "1px solid var(--color-border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>No Geofence Set</p>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-dim)" }}>
            Set up a geofence to enable auto-tracking
          </p>
          <Link
            href="/geofence"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black transition-all"
            style={{ background: "var(--color-amber)" }}
          >
            Configure Geofence
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <TrackingStatus status={status} distance={distance} />
          {!geofence.enabled && (
            <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(107,114,128,0.1)", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
              DISABLED
            </span>
          )}
        </div>

        {session && (
          <div className="py-4 border-y" style={{ borderColor: "var(--color-border)" }}>
            <ActiveTimer session={session} elapsedSeconds={elapsedSeconds} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <ManualControls
            session={session}
            loading={sessionLoading}
            onStart={onStart}
            onStop={onStop}
          />
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {geofence.address.split(",").slice(0, 2).join(",")}
          </p>
        </div>
      </div>
    </Card>
  );
}
