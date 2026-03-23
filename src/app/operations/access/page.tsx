"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type TabKey = "whitelist" | "vpn";

type AccessLog = {
  id: string;
  ts: string;
  user: string;
  ip: string;
  location: string;
  outcome: "Success" | "Denied";
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function outcomeBadge(outcome: AccessLog["outcome"]) {
  if (outcome === "Success") {
    return "border-indigo-400/40 bg-indigo-400/10 text-indigo-100";
  }
  return "border-amber-500/40 bg-amber-500/10 text-amber-100";
}

export default function OperationsAccessPage() {
  const [tab, setTab] = React.useState<TabKey>("whitelist");

  const [ipRanges, setIpRanges] = React.useState<string[]>([
    "10.0.0.0/24",
    "10.10.20.0/24",
    "192.168.1.0/26",
    "203.0.113.10/32",
  ]);

  const [newRange, setNewRange] = React.useState("");
  const [addError, setAddError] = React.useState<string | null>(null);

  const [logs, setLogs] = React.useState<AccessLog[]>(() => {
    const now = Date.now();
    return [
      {
        id: "a-1",
        ts: new Date(now - 38 * 60_000).toISOString(),
        user: "ops.admin",
        ip: "203.0.113.10",
        location: "Berlin, DE",
        outcome: "Success",
      },
      {
        id: "a-2",
        ts: new Date(now - 26 * 60_000).toISOString(),
        user: "network.engineer",
        ip: "198.51.100.22",
        location: "Nairobi, KE",
        outcome: "Denied",
      },
      {
        id: "a-3",
        ts: new Date(now - 14 * 60_000).toISOString(),
        user: "db.maintainer",
        ip: "10.10.20.44",
        location: "Johannesburg, ZA",
        outcome: "Success",
      },
      {
        id: "a-4",
        ts: new Date(now - 7 * 60_000).toISOString(),
        user: "security.analyst",
        ip: "192.168.1.25",
        location: "Gdańsk, PL",
        outcome: "Success",
      },
      {
        id: "a-5",
        ts: new Date(now - 3 * 60_000).toISOString(),
        user: "ops.admin",
        ip: "198.51.100.81",
        location: "Lagos, NG",
        outcome: "Denied",
      },
    ];
  });

  const [vpnQuery, setVpnQuery] = React.useState("");
  const [vpnOutcome, setVpnOutcome] = React.useState<
    "All" | AccessLog["outcome"]
  >("All");

  const filteredLogs = React.useMemo(() => {
    const q = vpnQuery.trim().toLowerCase();
    return logs.filter((l) => {
      if (vpnOutcome !== "All" && l.outcome !== vpnOutcome) return false;
      if (!q) return true;
      return (
        l.user.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    });
  }, [logs, vpnOutcome, vpnQuery]);

  const addIpRange = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setAddError(null);
      const trimmed = newRange.trim();

      if (!trimmed) return setAddError("IP range is required.");
      if (!trimmed.includes("/")) return setAddError("Use CIDR format (e.g., 10.0.0.0/24).");
      if (trimmed.length < 7) return setAddError("CIDR looks too short.");
      if (ipRanges.includes(trimmed)) return setAddError("This range already exists.");

      setIpRanges((prev) => [trimmed, ...prev]);
      setNewRange("");
    },
    [ipRanges, newRange],
  );

  const removeRange = React.useCallback((range: string) => {
    setIpRanges((prev) => prev.filter((r) => r !== range));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Access Management</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          IP whitelisting and VPN remote access logs.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTab("whitelist")}
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
            tab === "whitelist"
              ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
              : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:border-indigo-400/40"
          }`}
        >
          IP Whitelisting
        </button>
        <button
          type="button"
          onClick={() => setTab("vpn")}
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
            tab === "vpn"
              ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
              : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:border-indigo-400/40"
          }`}
        >
          VPN Access Logs
        </button>
      </div>

      {tab === "whitelist" ? (
        <div className="space-y-5">
          <Card className="border-indigo-400/30 bg-slate-950">
            <h2 className="text-sm font-semibold text-slate-100">
              Allowed IP Ranges
            </h2>
            <p className="mt-1 text-sm text-slate-100/70">
              Maintain the allowlist used for privileged network access.
            </p>

            <form onSubmit={addIpRange} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  New CIDR
                </label>
                <input
                  value={newRange}
                  onChange={(e) => setNewRange(e.target.value)}
                  placeholder="e.g., 203.0.113.10/32"
                  className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                />
                {addError ? (
                  <p className="mt-2 text-sm text-amber-100">{addError}</p>
                ) : null}
              </div>
              <button
                type="submit"
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Add Range
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {ipRanges.map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-between gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">{r}</p>
                    <p className="mt-1 text-xs text-slate-100/60">
                      Status:{" "}
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${outcomeBadge("Success")}`}
                      >
                        Safe
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRange(r)}
                    className="rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-100/80 transition-colors hover:bg-indigo-400/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {ipRanges.length === 0 ? (
                <p className="text-sm text-slate-100/70">No IP ranges in allowlist.</p>
              ) : null}
            </div>
          </Card>
        </div>
      ) : null}

      {tab === "vpn" ? (
        <div className="space-y-5">
          <Card className="border-indigo-400/30 bg-slate-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Remote Access Events
                </h2>
                <p className="mt-1 text-sm text-slate-100/70">
                  Recent VPN connection attempts (success/denied).
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-72">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    Search
                  </label>
                  <input
                    value={vpnQuery}
                    onChange={(e) => setVpnQuery(e.target.value)}
                    placeholder="User / IP / Location..."
                    className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                    Outcome
                  </label>
                  <select
                    value={vpnOutcome}
                    onChange={(e) =>
                      setVpnOutcome(e.target.value as "All" | AccessLog["outcome"])
                    }
                    className="mt-2 rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                  >
                    <option value="All">All</option>
                    <option value="Success">Success</option>
                    <option value="Denied">Denied</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
              <table className="min-w-[760px] w-full border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">IP</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="border-t border-indigo-400/20">
                      <td className="px-4 py-3 text-slate-100/70">
                        {formatDateTime(l.ts)}
                      </td>
                      <td className="px-4 py-3 text-slate-100/80">{l.user}</td>
                      <td className="px-4 py-3 font-mono text-slate-100/80">{l.ip}</td>
                      <td className="px-4 py-3 text-slate-100/70">{l.location}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${outcomeBadge(
                            l.outcome,
                          )}`}
                        >
                          {l.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-slate-100/70">
                        No events match your filter.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}


