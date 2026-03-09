"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TimeEntry, GeofenceStatus } from "@/types";

interface UseActiveSessionResult {
  session: TimeEntry | null;
  loading: boolean;
  start: (source?: "AUTO" | "MANUAL", lat?: number, lng?: number) => Promise<void>;
  stop: (lat?: number, lng?: number) => Promise<void>;
  elapsedSeconds: number;
}

export function useActiveSession(geofenceStatus: GeofenceStatus): UseActiveSessionResult {
  const [session, setSession] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevStatusRef = useRef<GeofenceStatus>("UNKNOWN");
  const initializedRef = useRef(false);

  // Recover session on mount
  useEffect(() => {
    fetch("/api/sessions/active")
      .then((r) => r.json())
      .then((data) => {
        if (data.session) setSession(data.session);
      })
      .finally(() => setLoading(false));
  }, []);

  // Timer
  useEffect(() => {
    if (session && !session.endTime) {
      const updateElapsed = () => {
        const start = new Date(session.startTime).getTime();
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      };
      updateElapsed();
      timerRef.current = setInterval(updateElapsed, 1000);
    } else {
      setElapsedSeconds(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session]);

  const start = useCallback(async (
    source: "AUTO" | "MANUAL" = "MANUAL",
    lat?: number,
    lng?: number
  ) => {
    const res = await fetch("/api/sessions/active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, locationLat: lat, locationLng: lng }),
    });
    if (res.ok) {
      const data = await res.json();
      setSession(data.session);
    }
  }, []);

  const stop = useCallback(async (lat?: number, lng?: number) => {
    if (!session) return;
    const res = await fetch("/api/sessions/active", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locationLat: lat, locationLng: lng }),
    });
    if (res.ok) {
      setSession(null);
    }
  }, [session]);

  // Auto start/stop based on geofence
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      prevStatusRef.current = geofenceStatus;
      return;
    }

    const prev = prevStatusRef.current;
    prevStatusRef.current = geofenceStatus;

    if (prev !== "INSIDE" && geofenceStatus === "INSIDE" && !session) {
      start("AUTO");
    } else if (prev === "INSIDE" && geofenceStatus === "OUTSIDE" && session) {
      stop();
    }
  }, [geofenceStatus, session, start, stop]);

  return { session, loading, start, stop, elapsedSeconds };
}
