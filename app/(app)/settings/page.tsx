"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TopBar from "@/components/layout/TopBar";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setName(d.user?.name ?? "");
        setHourlyRate(d.user?.hourlyRate != null ? String(d.user.hourlyRate) : "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    const rate = hourlyRate.trim() === "" ? null : parseFloat(hourlyRate);
    if (hourlyRate.trim() !== "" && (isNaN(rate!) || rate! < 0)) {
      setError("Enter a valid hourly rate");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() || undefined, hourlyRate: rate }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "Save failed");
    }
    setSaving(false);
  };

  const labelStyle = { color: "var(--color-text-dim)" };
  const inputStyle = {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="p-6 max-w-xl space-y-6">
        <Card>
          <h2 className="text-base font-semibold text-white mb-5" style={{ fontFamily: "var(--font-heading)" }}>
            Profile & Pay Rate
          </h2>

          {loading ? (
            <p style={{ color: "var(--color-muted)" }}>Loading...</p>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-lg outline-none"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={labelStyle}>
                  Hourly Rate
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 font-medium"
                    style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg outline-none"
                    style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: "var(--color-muted)" }}>
                  Used to calculate earnings on your dashboard and reports
                </p>
              </div>

              {error && (
                <div className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-red)" }}>
                  {error}
                </div>
              )}
              {success && (
                <div className="text-sm rounded-lg px-3 py-2" style={{ background: "rgba(20,184,166,0.1)", color: "var(--color-teal)" }}>
                  Settings saved!
                </div>
              )}

              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
