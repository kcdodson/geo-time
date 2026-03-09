export interface GeocodingResult {
  address: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    addressdetails: "1",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        "User-Agent": "GeoTime/1.0 (work-hour-tracker)",
        "Accept-Language": "en",
      },
    }
  );

  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();
  return data.map((item: Record<string, unknown>) => ({
    address: item.display_name as string,
    latitude: parseFloat(item.lat as string),
    longitude: parseFloat(item.lon as string),
    displayName: item.display_name as string,
  }));
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: "json",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        "User-Agent": "GeoTime/1.0 (work-hour-tracker)",
        "Accept-Language": "en",
      },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.display_name ?? null;
}
