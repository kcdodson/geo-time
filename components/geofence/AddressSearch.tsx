"use client";

import { useState, useCallback } from "react";
import { searchAddress, GeocodingResult } from "@/lib/geocoding";
import Spinner from "@/components/ui/Spinner";

interface AddressSearchProps {
  onSelect: (result: GeocodingResult) => void;
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const r = await searchAddress(query);
      setResults(r);
      if (r.length === 0) setError("No results found");
    } catch {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Search for your work address..."
          className="flex-1 px-4 py-2.5 rounded-lg text-white placeholder-gray-500 outline-none"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-body)",
          }}
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 rounded-lg font-medium text-black disabled:opacity-50 transition-all"
          style={{ background: "var(--color-amber)" }}
        >
          {loading ? <Spinner size={16} color="black" /> : "Search"}
        </button>
      </div>

      {error && <p className="text-sm" style={{ color: "var(--color-red)" }}>{error}</p>}

      {results.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(r);
                setResults([]);
                setQuery(r.displayName.split(",").slice(0, 3).join(","));
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors"
              style={{
                color: "var(--color-text)",
                borderTop: i > 0 ? "1px solid var(--color-border)" : "none",
                background: "var(--color-surface-2)",
                fontFamily: "var(--font-body)",
              }}
            >
              {r.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
