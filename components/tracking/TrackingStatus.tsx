"use client";

import { GeofenceStatus } from "@/types";

interface TrackingStatusProps {
  status: GeofenceStatus;
  distance: number | null;
}

export default function TrackingStatus({ status, distance }: TrackingStatusProps) {
  const isInside = status === "INSIDE";
  const isOutside = status === "OUTSIDE";

  return (
    <div className="flex items-center gap-4">
      {/* Radar / indicator */}
      <div className="relative flex items-center justify-center w-16 h-16">
        {isInside && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(245,158,11,0.2)" }} />
            <div className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(245,158,11,0.1)",
                animation: "radar-pulse 2s ease-out infinite",
              }} />
          </>
        )}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: isInside
              ? "rgba(245,158,11,0.2)"
              : isOutside
              ? "rgba(107,114,128,0.2)"
              : "rgba(107,114,128,0.1)",
            border: isInside
              ? "2px solid var(--color-amber)"
              : isOutside
              ? "2px solid var(--color-muted)"
              : "2px solid rgba(107,114,128,0.3)",
            boxShadow: isInside ? "0 0 20px rgba(245,158,11,0.4)" : "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isInside ? "var(--color-amber)" : "var(--color-muted)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="10" r="3" />
            <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" />
          </svg>
        </div>
      </div>

      <div>
        <p
          className="text-sm font-medium"
          style={{ color: isInside ? "var(--color-amber)" : "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}
        >
          {status === "INSIDE" ? "INSIDE GEOFENCE" : status === "OUTSIDE" ? "OUTSIDE GEOFENCE" : "LOCATION UNKNOWN"}
        </p>
        {distance !== null && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
            {distance < 1000 ? `${distance}m from zone` : `${(distance / 1000).toFixed(1)}km from zone`}
          </p>
        )}
        {status === "UNKNOWN" && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
            Enable location to auto-track
          </p>
        )}
      </div>
    </div>
  );
}
