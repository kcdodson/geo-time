"use client";

import { TimeEntry } from "@/types";
import Button from "@/components/ui/Button";

interface ManualControlsProps {
  session: TimeEntry | null;
  loading: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function ManualControls({ session, loading, onStart, onStop }: ManualControlsProps) {
  const isActive = session && !session.endTime;

  return (
    <div className="flex items-center gap-3">
      {isActive ? (
        <Button
          variant="danger"
          size="lg"
          onClick={onStop}
          disabled={loading}
          className="border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          Stop Session
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          disabled={loading}
          className="px-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Start Session
        </Button>
      )}
    </div>
  );
}
