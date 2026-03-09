"use client";

import { useCallback, useEffect, useState } from "react";
import { TimeEntry } from "@/types";
import { TimeEntryInput } from "@/lib/validations";
import { format } from "date-fns";
import SessionTable from "@/components/sessions/SessionTable";
import SessionForm from "@/components/sessions/SessionForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TopBar from "@/components/layout/TopBar";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<TimeEntry | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/sessions?limit=100");
    const data = await res.json();
    setSessions(data.sessions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelected(selected.length === sessions.length ? [] : sessions.map((s) => s.id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    await load();
  };

  const handleMerge = async () => {
    if (selected.length < 2) return;
    if (!confirm(`Merge ${selected.length} sessions into one?`)) return;
    await fetch("/api/sessions/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionIds: selected }),
    });
    setSelected([]);
    await load();
  };

  const handleCreate = async (data: TimeEntryInput) => {
    setFormError("");
    const startTime = new Date(data.startTime).toISOString();
    const endTime = data.endTime ? new Date(data.endTime).toISOString() : undefined;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, startTime, endTime }),
    });
    const body = await res.json();
    if (!res.ok) {
      setFormError(body.error ?? "Failed to create session");
      return;
    }
    setCreating(false);
    await load();
  };

  const handleUpdate = async (data: TimeEntryInput) => {
    if (!editing) return;
    setFormError("");
    const startTime = new Date(data.startTime).toISOString();
    const endTime = data.endTime ? new Date(data.endTime).toISOString() : null;
    const res = await fetch(`/api/sessions/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, startTime, endTime }),
    });
    const body = await res.json();
    if (!res.ok) {
      setFormError(body.error ?? "Failed to update session");
      return;
    }
    setEditing(null);
    await load();
  };

  return (
    <>
      <TopBar title="Sessions" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
            {sessions.length} sessions total
          </p>
          <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Session
          </Button>
        </div>

        <SessionTable
          sessions={sessions}
          loading={loading}
          selected={selected}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onEdit={setEditing}
          onDelete={handleDelete}
          onMerge={handleMerge}
        />
      </div>

      <Modal open={creating} onClose={() => { setCreating(false); setFormError(""); }} title="Add Session">
        <SessionForm onSubmit={handleCreate} onCancel={() => setCreating(false)} error={formError} />
      </Modal>

      <Modal open={!!editing} onClose={() => { setEditing(null); setFormError(""); }} title="Edit Session">
        {editing && (
          <SessionForm session={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} error={formError} />
        )}
      </Modal>
    </>
  );
}
