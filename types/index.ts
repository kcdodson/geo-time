export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface Geofence {
  id: string;
  userId: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  enabled: boolean;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  source: "AUTO" | "MANUAL";
  notes: string | null;
  locationLat: number | null;
  locationLng: number | null;
  createdAt: string;
  updatedAt: string;
}

export type GeofenceStatus = "INSIDE" | "OUTSIDE" | "UNKNOWN";

export interface SessionStats {
  todaySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  totalSessions: number;
}
