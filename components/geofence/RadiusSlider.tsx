"use client";

interface RadiusSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const label = value < 1000 ? `${value}m` : `${(value / 1000).toFixed(1)}km`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium" style={{ color: "var(--color-text-dim)" }}>
          Geofence Radius
        </label>
        <span className="text-sm font-bold" style={{ color: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
          {label}
        </span>
      </div>
      <input
        type="range"
        min={50}
        max={5000}
        step={50}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-amber) 0%, var(--color-amber) ${((value - 50) / 4950) * 100}%, var(--color-border) ${((value - 50) / 4950) * 100}%, var(--color-border) 100%)`,
          accentColor: "var(--color-amber)",
        }}
      />
      <div className="flex justify-between text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>
        <span>50m</span>
        <span>5km</span>
      </div>
    </div>
  );
}
