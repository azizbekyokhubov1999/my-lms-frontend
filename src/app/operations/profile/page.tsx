"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type Session = {
  id: string;
  device: string;
  ip: string;
  location: string;
  startedAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
};

type PermissionLevel = "Admin" | "Operator" | "Auditor";

const STORAGE_KEY = "ops_profile_sessions_v1";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildSeedSessions(): Session[] {
  const now = Date.now();
  return [
    {
      id: "sess-current",
      device: "Cursor Desktop",
      ip: "203.0.113.10",
      location: "Berlin, DE",
      startedAt: new Date(now - 6.5 * 3600_000).toISOString(),
      lastActiveAt: new Date(now - 8 * 60_000).toISOString(),
      isCurrent: true,
    },
    {
      id: "sess-2",
      device: "Android (Chrome)",
      ip: "198.51.100.81",
      location: "Lagos, NG",
      startedAt: new Date(now - 4.1 * 3600_000).toISOString(),
      lastActiveAt: new Date(now - 58 * 60_000).toISOString(),
      isCurrent: false,
    },
    {
      id: "sess-3",
      device: "Windows Laptop",
      ip: "10.10.20.44",
      location: "Johannesburg, ZA",
      startedAt: new Date(now - 26.2 * 3600_000).toISOString(),
      lastActiveAt: new Date(now - 14 * 3600_000).toISOString(),
      isCurrent: false,
    },
  ];
}

export default function OperationsProfilePage() {
  const [permissionLevel, setPermissionLevel] =
    React.useState<PermissionLevel>("Admin");
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw) as Session[];
        setSessions(list);
      } else {
        const seed = buildSeedSessions();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        setSessions(seed);
      }
    } catch {
      setSessions(buildSeedSessions());
    }
  }, []);

  const logoutOtherDevices = React.useCallback(() => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.isCurrent);
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
      setBusy(false);
    }, 900);
  }, [busy]);

  const permissions = React.useMemo(() => {
    const base = [
      "Read Operations dashboards",
      "View security & compliance reports",
      "Export technical reports",
    ];

    if (permissionLevel === "Admin") {
      return [
        ...base,
        "Rotate & revoke API keys",
        "Assign incidents",
        "Schedule backups and restore",
        "Run compliance audits",
      ];
    }
    if (permissionLevel === "Operator") {
      return [...base, "Operate maintenance and backups", "Create incidents"];
    }
    return [...base, "Audit-only evidence review"];
  }, [permissionLevel]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Profile</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            IT Operator details, active sessions, and RBAC permission level.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-indigo-400/30 bg-slate-950">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                Permission Level
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {permissionLevel}
              </p>
              <div className="mt-3">
                <select
                  value={permissionLevel}
                  onChange={(e) =>
                    setPermissionLevel(e.target.value as PermissionLevel)
                  }
                  className="w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
                >
                  <option value="Admin">Admin</option>
                  <option value="Operator">Operator</option>
                  <option value="Auditor">Auditor</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-100">Operator</h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                Name
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Ops Admin
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                Email
              </p>
              <p className="mt-1 text-sm text-slate-100/70">ops.admin@university.edu</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                Department
              </p>
              <p className="mt-1 text-sm text-slate-100/70">IT Operations</p>
            </div>
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Active Sessions
              </h2>
              <p className="mt-1 text-xs text-slate-100/60">
                Review and invalidate other devices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={logoutOtherDevices}
                disabled={busy}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Processing..." : "Logout other devices"}
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
            <table className="min-w-[760px] w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">IP</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">State</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-t border-indigo-400/20">
                    <td className="px-4 py-3 text-slate-100/80">{s.device}</td>
                    <td className="px-4 py-3 font-mono text-slate-100/80">{s.ip}</td>
                    <td className="px-4 py-3 text-slate-100/70">{s.location}</td>
                    <td className="px-4 py-3 text-slate-100/70">
                      {formatDateTime(s.lastActiveAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          s.isCurrent
                            ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
                            : "border-amber-500/40 bg-amber-500/10 text-amber-100"
                        }`}
                      >
                        {s.isCurrent ? "Current" : "Other"}
                      </span>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-slate-100/70">
                      No active sessions.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">RBAC Permissions</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Effective permissions for the selected role (demo).
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {permissions.map((p) => (
            <div
              key={p}
              className="rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3 text-sm text-slate-100/80"
            >
              {p}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


