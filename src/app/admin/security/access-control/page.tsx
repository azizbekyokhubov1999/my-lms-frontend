"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface MaintenanceWindow {
  id: string;
  start: string;
  end: string;
  label: string;
  enabled: boolean;
}

export default function AccessControlPage() {
  const [ipInput, setIpInput] = React.useState("");
  const [whitelist, setWhitelist] = React.useState<string[]>(["10.0.0.0/24", "192.168.1.0/24"]);
  const [windows, setWindows] = React.useState<MaintenanceWindow[]>([
    { id: "w1", start: "2026-03-15T02:00", end: "2026-03-15T04:00", label: "March maintenance", enabled: true },
    { id: "w2", start: "2026-04-01T00:00", end: "2026-04-01T02:00", label: "April patch window", enabled: true },
  ]);
  const [saved, setSaved] = React.useState(false);

  const addIp = () => {
    const v = ipInput.trim();
    if (!v || whitelist.includes(v)) return;
    setWhitelist((prev) => [...prev, v]);
    setIpInput("");
  };

  const removeIp = (ip: string) => {
    setWhitelist((prev) => prev.filter((x) => x !== ip));
  };

  const updateWindow = (id: string, patch: Partial<MaintenanceWindow>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  };

  const addWindow = () => {
    setWindows((prev) => [
      ...prev,
      {
        id: "w" + Date.now(),
        start: "",
        end: "",
        label: "New window",
        enabled: true,
      },
    ]);
  };

  const removeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/security" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Security
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Access Control</h1>
          <p className="mt-1 text-sm text-slate-600">
            IP whitelist for Admin access and maintenance windows when the system is locked.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/security" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Authentication</Link>
          <Link href="/admin/security/incidents" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Incidents</Link>
          <Link href="/admin/security/encryption" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Encryption</Link>
          <Link href="/admin/security/audit-logs" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Audit Logs</Link>
          <Link href="/admin/security/access-control" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Access Control</Link>
        </nav>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            IP whitelist (Admin access)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Only these IPs or CIDR ranges can access the Admin panel. Others are denied.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Input
              label="Add IP or CIDR"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 10.0.0.1 or 192.168.0.0/24"
              className="max-w-xs"
            />
            <div className="flex items-end pb-1">
              <Button type="button" variant="secondary" size="sm" onClick={addIp}>
                Add
              </Button>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {whitelist.map((ip) => (
              <li
                key={ip}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-mono text-slate-800"
              >
                {ip}
                <button
                  type="button"
                  onClick={() => removeIp(ip)}
                  className="ml-1 text-slate-500 hover:text-red-600"
                  aria-label={`Remove ${ip}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          {whitelist.length === 0 && (
            <p className="mt-2 text-sm text-amber-700">No whitelist entries. Add at least one to avoid locking yourself out.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Maintenance windows
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            During these windows the system is locked for updates. Users see a maintenance message.
          </p>
          <div className="mt-4 space-y-4">
            {windows.map((w) => (
              <div
                key={w.id}
                className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4"
              >
                <Input
                  label="Label"
                  type="text"
                  value={w.label}
                  onChange={(e) => updateWindow(w.id, { label: e.target.value })}
                  className="min-w-[180px]"
                />
                <Input
                  label="Start (UTC)"
                  type="datetime-local"
                  value={w.start}
                  onChange={(e) => updateWindow(w.id, { start: e.target.value })}
                  className="min-w-[200px]"
                />
                <Input
                  label="End (UTC)"
                  type="datetime-local"
                  value={w.end}
                  onChange={(e) => updateWindow(w.id, { end: e.target.value })}
                  className="min-w-[200px]"
                />
                <label className="flex items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    checked={w.enabled}
                    onChange={(e) => updateWindow(w.id, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-sm text-slate-700">Active</span>
                </label>
                <Button type="button" variant="secondary" size="sm" onClick={() => removeWindow(w.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={addWindow}>
            Add maintenance window
          </Button>
        </Card>

        <div>
          <Button type="submit" variant="primary">
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
