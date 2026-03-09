"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Geofence } from "@/types";
import { GeocodingResult } from "@/lib/geocoding";
import AddressSearch from "@/components/geofence/AddressSearch";
import RadiusSlider from "@/components/geofence/RadiusSlider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TopBar from "@/components/layout/TopBar";

const GeofenceMap = dynamic(() => import("@/components/geofence/GeofenceMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl flex items-center justify-center" style={{ height: "300px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
      <p style={{ color: "var(--color-muted)" }}>Loading map...</p>
    </div>
  ),
});

export default function GeofencePage() {
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(200);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/geofence").then((r) => r.json()).then((d) => {
      if (d.geofence) {
        setGeofence(d.geofence);
        setLat(d.geofence.latitude);
        setLng(d.geofence.longitude);
        setAddress(d.geofence.address);
        setRadius(d.geofence.radius);
        setEnabled(d.geofence.enabled);
      }
    });
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    setLat(result.latitude);
    setLng(result.longitude);
    setAddress(result.displayName);
  };

  const handleSave = async () => {
    if (!lat || !lng || !address) {
      setError("Please search and select an address first");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/geofence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, latitude: lat, longitude: lng, radius, enabled }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
      } else {
        setGeofence(data.geofence);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete your geofence? Auto-tracking will stop.")) return;
    setDeleting(true);
    try {
      await fetch("/api/geofence", { method: "DELETE" });
      setGeofence(null);
      setLat(null);
      setLng(null);
      setAddress("");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (geofence) {
      await fetch("/api/geofence", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newEnabled }),
      });
    }
  };

  return (
    <>
      <TopBar title="Geofence Setup" />
      <div className="p-6 max-w-3xl space-y-6">
        <Card>
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Work Location
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-dim)" }}>
                Search for your workplace address and adjust the geofence radius.
              </p>
              <AddressSearch onSelect={handleSelect} />
            </div>

            {address && (
              <div className="text-sm px-3 py-2 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
                ✓ {address.split(",").slice(0, 3).join(",")}
              </div>
            )}

            <RadiusSlider value={radius} onChange={setRadius} />

            {lat !== null && lng !== null && (
              <GeofenceMap latitude={lat} longitude={lng} radius={radius} />
            )}

            {/* Enable toggle */}
            {geofence && (
              <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <div>
                  <p className="text-sm font-medium text-white">Auto-tracking</p>
                  <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>Automatically start/stop sessions based on location</p>
                </div>
                <button
                  onClick={handleToggle}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ background: enabled ? "var(--color-amber)" : "var(--color-border)" }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: enabled ? "translateX(1.25rem)" : "translateX(0.25rem)" }}
                  />
                </button>
              </div>
            )}

            {error && (
              <div className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-red)" }}>{error}</div>
            )}
            {success && (
              <div className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(20,184,166,0.1)", color: "var(--color-teal)" }}>
                Geofence saved successfully!
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={handleSave} disabled={saving || !lat}>
                {saving ? "Saving..." : geofence ? "Update Geofence" : "Save Geofence"}
              </Button>
              {geofence && (
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
