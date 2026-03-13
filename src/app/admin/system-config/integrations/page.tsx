"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ApiKeyRow {
  id: string;
  name: string;
  keyPreview: string;
  createdAt: string;
}

const INTEGRATION_SERVICES = [
  { id: "teams", name: "Microsoft Teams (Azure AD)", purpose: "Lecture scheduling" },
  { id: "api", name: "API Gateway", purpose: "External service access" },
  { id: "smtp", name: "SMTP", purpose: "Transactional email" },
  { id: "storage", name: "Cloud Storage", purpose: "File uploads" },
];

export default function IntegrationsPage() {
  const [clientId, setClientId] = React.useState("");
  const [clientSecret, setClientSecret] = React.useState("");
  const [teamsSaved, setTeamsSaved] = React.useState(false);
  const [statuses, setStatuses] = React.useState<Record<string, "connected" | "disconnected" | "testing">>({
    teams: "disconnected",
    api: "connected",
    smtp: "connected",
    storage: "disconnected",
  });
  const [apiKeys, setApiKeys] = React.useState<ApiKeyRow[]>([
    { id: "k1", name: "Mobile App", keyPreview: "sk_live_••••••••••••abcd", createdAt: "2026-02-01" },
    { id: "k2", name: "Analytics Service", keyPreview: "sk_live_••••••••••••wxyz", createdAt: "2026-01-15" },
  ]);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [testingId, setTestingId] = React.useState<string | null>(null);

  const handleTeamsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTeamsSaved(true);
    setStatuses((s) => ({ ...s, teams: clientId && clientSecret ? "connected" : "disconnected" }));
    setTimeout(() => setTeamsSaved(false), 2000);
  };

  const testConnection = (id: string) => {
    setTestingId(id);
    setStatuses((s) => ({ ...s, [id]: "testing" }));
    setTimeout(() => {
      setStatuses((s) => ({ ...s, [id]: Math.random() > 0.3 ? "connected" : "disconnected" }));
      setTestingId(null);
    }, 1200);
  };

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    const preview = "sk_live_" + "•".repeat(16) + Math.random().toString(36).slice(2, 6);
    setApiKeys((prev) => [
      ...prev,
      { id: "k" + Date.now(), name: newKeyName.trim(), keyPreview: preview, createdAt: new Date().toISOString().slice(0, 10) },
    ]);
    setNewKeyName("");
    alert("API key generated (demo). Copy it now; it won’t be shown again.");
  };

  const revokeKey = (id: string) => {
    if (confirm("Revoke this API key? It will stop working immediately.")) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/system-config" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← System Config
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Integrations</h1>
          <p className="mt-1 text-sm text-slate-600">
            Teams connector, API keys, and connection status for each service.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/system-config"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            General
          </Link>
          <Link
            href="/admin/system-config/email-templates"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Email Templates
          </Link>
          <Link
            href="/admin/system-config/payment"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Payment
          </Link>
          <Link
            href="/admin/system-config/integrations"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Integrations
          </Link>
        </nav>
      </div>

      {/* Integration Status */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Integration Status
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Real-time connection status. Use &quot;Test Connection&quot; to verify.
        </p>
        <ul className="mt-4 space-y-3">
          {INTEGRATION_SERVICES.map((svc) => {
            const status = statuses[svc.id] ?? "disconnected";
            const isTesting = testingId === svc.id;
            return (
              <li
                key={svc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-slate-900">{svc.name}</span>
                  <span className="ml-2 text-sm text-slate-500">— {svc.purpose}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      status === "connected" && "bg-emerald-100 text-emerald-800",
                      status === "disconnected" && "bg-slate-200 text-slate-700",
                      status === "testing" && "bg-amber-100 text-amber-800",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        status === "connected" && "bg-emerald-500",
                        status === "disconnected" && "bg-slate-500",
                        status === "testing" && "bg-amber-500 animate-pulse",
                      )}
                    />
                    {status === "testing" ? "Testing…" : status === "connected" ? "Connected" : "Disconnected"}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => testConnection(svc.id)}
                    disabled={isTesting}
                  >
                    {isTesting ? "Testing…" : "Test Connection"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Teams Connector */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Teams Connector
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Microsoft Azure AD credentials for lecture scheduling with Teams.
        </p>
        <form onSubmit={handleTeamsSave} className="mt-4 max-w-xl space-y-4">
          <Input
            label="Client ID"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            autoComplete="off"
          />
          <Input
            label="Client Secret"
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="••••••••••••••••"
            autoComplete="new-password"
            helperText="Keep secrets secure. Do not share."
          />
          <Button type="submit" variant="primary" size="sm">
            {teamsSaved ? "Saved" : "Save credentials"}
          </Button>
        </form>
      </Card>

      {/* API Management */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          API Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Generate and revoke API keys for external services.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Mobile App)"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
          <Button type="button" variant="primary" size="sm" onClick={generateKey}>
            Generate API Key
          </Button>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Key</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Created</th>
                <th className="w-24 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiKeys.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{row.keyPreview}</td>
                  <td className="px-4 py-3 text-slate-600">{row.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => revokeKey(row.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {apiKeys.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">No API keys yet. Generate one above.</p>
        )}
      </Card>
    </div>
  );
}
