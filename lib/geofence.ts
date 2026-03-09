const EARTH_RADIUS_METERS = 6371000;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

export function isInsideGeofence(
  userLat: number,
  userLng: number,
  fenceLat: number,
  fenceLng: number,
  radiusMeters: number
): boolean {
  return haversineDistance(userLat, userLng, fenceLat, fenceLng) <= radiusMeters;
}

export type ExitDebouncer = {
  tick: () => boolean; // returns true if exit confirmed
  reset: () => void;
  isPending: () => boolean;
};

// 10 ticks × 30s = 5 minutes debounce before confirming exit
export function createExitDebouncer(ticks = 10): ExitDebouncer {
  let consecutiveOutsideTicks = 0;

  return {
    tick() {
      consecutiveOutsideTicks++;
      return consecutiveOutsideTicks >= ticks;
    },
    reset() {
      consecutiveOutsideTicks = 0;
    },
    isPending() {
      return consecutiveOutsideTicks > 0 && consecutiveOutsideTicks < ticks;
    },
  };
}
