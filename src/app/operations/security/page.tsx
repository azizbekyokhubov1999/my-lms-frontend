"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type SafeState = "Safe" | "Warning";

type Threat = {
  id: string;
  title: string;
  count: number;
  state: SafeState;
  description: string;
};

type Certificate = {
  id: string;
  label: string;
  domain: string;
  expiresAt: string; // ISO
};

type ApiSecretRow = {
  id: string;
  kind: "API Key" | "Access Token";
  name: string;
  keyMasked: string;
  scopes: string[];
  createdAt: string;
  lastRotatedAt: string;
  status: "Active" | "Revoked";
};

function daysUntil(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function stateBadge(state: SafeState) {
  if (state === "Safe") {
    return "border-indigo-400/40 bg-indigo-400/10 text-indigo-100";
  }
  return "border-amber-500/40 bg-amber-500/10 text-amber-100";
}

function stateDot(state: SafeState) {
  if (state === "Safe") return "bg-indigo-400";
  return "bg-amber-500";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { year: "numeric", month: "short", day: "2-digit" });
}

function makeMaskedKey() {
  const tail = Math.random().toString(16).slice(2, 10).toUpperCase();
  return `••••••••••${tail}`;
}

export default function OperationsSecurityPage() {
  const [threats, setThreats] = React.useState<Threat[]>([
    {
      id: "t-1",
      title: "Port scanning attempts",
      count: 18,
      state: "Safe",
      description: "No sustained scanning patterns detected in the last hour.",
    },
    {
      id: "t-2",
      title: "Auth anomalies",
      count: 3,
      state: "Warning",
      description: "Atypical login attempts from new IP ranges observed.",
    },
    {
      id: "t-3",
      title: "Malware indicators",
      count: 0,
      state: "Safe",
      description: "No threat signatures matched for current endpoints.",
    },
    {
      id: "t-4",
      title: "Data exfiltration attempts",
      count: 2,
      state: "Warning",
      description: "Small volume anomalies flagged; investigate outbound rules.",
    },
  ]);

  const [certificates] = React.useState<Certificate[]>(() => {
    const now = Date.now();
    return [
      {
        id: "c-1",
        label: "Primary API TLS",
        domain: "api.online-university.com",
        expiresAt: new Date(now + 75 * 86400_000).toISOString(),
      },
      {
        id: "c-2",
        label: "Admin Portal TLS",
        domain: "admin.online-university.com",
        expiresAt: new Date(now + 21 * 86400_000).toISOString(),
      },
      {
        id: "c-3",
        label: "Operations Console TLS",
        domain: "ops.online-university.com",
        expiresAt: new Date(now + 44 * 86400_000).toISOString(),
      },
    ];
  });

  const [firewallState, setFirewallState] = React.useState<SafeState>("Safe");

  const [secrets, setSecrets] = React.useState<ApiSecretRow[]>(() => {
    const now = Date.now();
    return [
      {
        id: "s-1",
        kind: "API Key",
        name: "ops/metrics-svc",
        keyMasked: "••••••••••9A3F2C7B",
        scopes: ["read:metrics", "read:alerts"],
        createdAt: new Date(now - 120 * 86400_000).toISOString(),
        lastRotatedAt: new Date(now - 60 * 86400_000).toISOString(),
        status: "Active",
      },
      {
        id: "s-2",
        kind: "API Key",
        name: "ops/webhooks",
        keyMasked: "••••••••••C0FFEE12",
        scopes: ["write:webhooks", "read:event-logs"],
        createdAt: new Date(now - 210 * 86400_000).toISOString(),
        lastRotatedAt: new Date(now - 90 * 86400_000).toISOString(),
        status: "Active",
      },
      {
        id: "s-3",
        kind: "Access Token",
        name: "backup/restore-runner",
        keyMasked: "••••••••••7B4D2A09",
        scopes: ["backup:restore", "backup:read"],
        createdAt: new Date(now - 55 * 86400_000).toISOString(),
        lastRotatedAt: new Date(now - 35 * 86400_000).toISOString(),
        status: "Active",
      },
      {
        id: "s-4",
        kind: "Access Token",
        name: "legacy-migration-job",
        keyMasked: "••••••••••AA11BB22",
        scopes: ["migration:execute"],
        createdAt: new Date(now - 340 * 86400_000).toISOString(),
        lastRotatedAt: new Date(now - 260 * 86400_000).toISOString(),
        status: "Revoked",
      },
    ];
  });

  const rotateSecret = React.useCallback((id: string) => {
    setSecrets((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (row.status !== "Active") return row;
        return {
          ...row,
          keyMasked: makeMaskedKey(),
          lastRotatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const revokeSecret = React.useCallback((id: string) => {
    setSecrets((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        return { ...row, status: "Revoked" };
      }),
    );
  }, []);

  const simulateThreatRefresh = React.useCallback(() => {
    setThreats((prev) =>
      prev.map((t) => {
        const r = Math.random();
        const nextState: SafeState = r < 0.78 ? "Safe" : "Warning";
        return {
          ...t,
          count: Math.max(0, Math.round(t.count + (r - 0.5) * 7)),
          state: nextState,
        };
      }),
    );

    const fw: SafeState = Math.random() < 0.72 ? "Safe" : "Warning";
    setFirewallState(fw);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Security</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Threat overview, TLS certificate expiry, and firewall status.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={simulateThreatRefresh}
            className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {threats.map((t) => (
          <Card
            key={t.id}
            className={`border-indigo-400/30 bg-slate-950 ${t.state === "Safe" ? "hover:border-indigo-400/60" : "hover:border-amber-500/60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  {t.title}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-100">
                  {t.count}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${stateBadge(t.state)}`}
                >
                  <span className={`h-2 w-2 rounded-full ${stateDot(t.state)}`} aria-hidden />
                  {t.state}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-100/70">{t.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-indigo-400/30 bg-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                SSL Certificate Expiry
              </h2>
              <p className="mt-1 text-sm text-slate-100/70">
                Days remaining (safe if &gt; 30 days).
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {certificates.map((c) => {
              const d = daysUntil(c.expiresAt);
              const state: SafeState = d > 30 ? "Safe" : "Warning";
              return (
                <div key={c.id} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {c.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-100/60">
                      {c.domain}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${stateBadge(
                        state,
                      )}`}
                    >
                      {state}
                    </span>
                    <p className="text-sm font-semibold text-slate-100">
                      {Number.isFinite(d) ? `${d} days` : "—"}
                    </p>
                    <p className="text-xs text-slate-100/60">
                      Expires: {formatDate(c.expiresAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">Firewall Status</h2>
          <p className="mt-1 text-sm text-slate-100/70">
            High-level health for ingress/egress enforcement.
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Status
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-100">
                {firewallState}
              </p>
              <p className="mt-2 text-sm text-slate-100/70">
                {firewallState === "Safe"
                  ? "Rules are active and no suspicious spikes are present."
                  : "Elevated rule retries and blocked traffic anomalies detected."}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${stateBadge(
                  firewallState,
                )}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${stateDot(firewallState)}`}
                  aria-hidden
                />
                {firewallState}
              </span>
              <p className="text-xs text-slate-100/60">
                Auto-enforcement: enabled
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* API Keys management */}
      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              API Keys & Access Tokens
            </h2>
            <p className="mt-1 text-sm text-slate-100/70">
              View, rotate, or revoke secrets (masked display).
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
          <table className="min-w-[820px] w-full border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Scopes</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last rotated</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {secrets.map((row) => {
                const rowSafe = row.status === "Active";
                return (
                  <tr key={row.id} className="border-t border-indigo-400/20">
                    <td className="px-4 py-3 text-slate-100/80">{row.kind}</td>
                    <td className="px-4 py-3 text-slate-100/80">{row.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-100/80">
                      {row.keyMasked}
                    </td>
                    <td className="px-4 py-3 text-slate-100/70">
                      {row.scopes.slice(0, 3).join(", ")}
                      {row.scopes.length > 3 ? "…" : ""}
                    </td>
                    <td className="px-4 py-3 text-slate-100/70">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-100/70">
                      {formatDate(row.lastRotatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          rowSafe
                            ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={row.status !== "Active"}
                          onClick={() => rotateSecret(row.id)}
                          className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Rotate
                        </button>
                        <button
                          type="button"
                          disabled={row.status !== "Active"}
                          onClick={() => revokeSecret(row.id)}
                          className="rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}


