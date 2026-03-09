"use client";

import { useEffect, useRef, useState } from "react";
import { haversineDistance, isInsideGeofence, createExitDebouncer } from "@/lib/geofence";
import { Geofence, GeofenceStatus } from "@/types";
import { GeolocationState } from "./useGeolocation";

interface UseGeofenceResult {
  status: GeofenceStatus;
  distance: number | null;
}

export function useGeofence(
  geofence: Geofence | null | undefined,
  location: GeolocationState
): UseGeofenceResult {
  const [status, setStatus] = useState<GeofenceStatus>("UNKNOWN");
  const [distance, setDistance] = useState<number | null>(null);
  const debouncerRef = useRef(createExitDebouncer(10));

  useEffect(() => {
    if (!geofence || !geofence.enabled || location.latitude === null || location.longitude === null) {
      setStatus("UNKNOWN");
      setDistance(null);
      return;
    }

    const dist = haversineDistance(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude
    );
    setDistance(Math.round(dist));

    const inside = isInsideGeofence(
      location.latitude,
      location.longitude,
      geofence.latitude,
      geofence.longitude,
      geofence.radius
    );

    if (inside) {
      debouncerRef.current.reset();
      setStatus("INSIDE");
    } else {
      const confirmed = debouncerRef.current.tick();
      if (confirmed) {
        setStatus("OUTSIDE");
      }
      // While debouncing, keep previous status (don't flip to OUTSIDE prematurely)
    }
  }, [geofence, location.latitude, location.longitude]);

  return { status, distance };
}
