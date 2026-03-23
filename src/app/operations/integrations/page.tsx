"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type IntegrationKey = "teams" | "onec" | "asc" | "classmate";

type IntegrationState = {
  key: IntegrationKey;
  label: string;
  connectionStatus: "Healthy" | "Syncing" | "Degraded" | "Offline";
  lastSyncTs: number | null;
};

function formatAgo(seconds: number) {
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function statusDotClass(status: IntegrationState["connectionStatus"]) {
  if (status === "Healthy") return "bg-emerald-400";
  if (status === "Syncing") return "bg-indigo-400";
  if (status === "Degraded") return "bg-amber-400";
  return "bg-rose-400";
}

export default function IntegrationsDashboardPage() {
  const [integrations, setIntegrations] = React.useState<IntegrationState[]>([
    {
      key: "teams",
      label: "Teams",
      connectionStatus: "Healthy",
      lastSyncTs: Date.now() - 60_000,
    },
    {
      key: "onec",
      label: "1C",
      connectionStatus: "Degraded",
      lastSyncTs: Date.now() - 12 * 60_000,
    },
    {
      key: "asc",
      label: "aSc",
      connectionStatus: "Healthy",
      lastSyncTs: Date.now() - 4 * 60_000,
    },
    {
      key: "classmate",
      label: "Classmate",
      connectionStatus: "Healthy",
      lastSyncTs: Date.now() - 28_000,
    },
  ]);

  const [, forceTick] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => forceTick((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const reSync = React.useCallback(async (key: IntegrationKey) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.key === key
          ? { ...i, connectionStatus: "Syncing", lastSyncTs: null }
          : i,
      ),
    );

    // Simulate async sync
    await new Promise((r) => window.setTimeout(r, 1400));

    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        const r = Math.random();
        const nextStatus: IntegrationState["connectionStatus"] =
          r < 0.08 ? "Offline" : r < 0.25 ? "Degraded" : "Healthy";
        return {
          ...i,
          connectionStatus: nextStatus,
          lastSyncTs: Date.now(),
        };
      }),
    );
  }, []);

  const cardTone = React.useCallback(
    (status: IntegrationState["connectionStatus"]) => {
      if (status === "Healthy")
        return "border-emerald-400/30 bg-emerald-400/5";
      if (status === "Syncing")
        return "border-indigo-400/30 bg-indigo-400/5";
      if (status === "Degraded") return "border-amber-400/30 bg-amber-400/5";
      return "border-rose-400/30 bg-rose-400/5";
    },
    [],
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Integrations</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          Connection status for Teams, 1C, aSc, and Classmate with manual re-sync.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {integrations.map((i) => (
          <Card
            key={i.key}
            className={`rounded-xl border-indigo-400/30 bg-slate-950 ${cardTone(
              i.connectionStatus,
            )}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                  {i.label}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusDotClass(
                      i.connectionStatus,
                    )}`}
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/60">
                      Connection Status
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      {i.connectionStatus}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-100/60">
                  Last sync:{" "}
                  {i.connectionStatus === "Syncing" || i.lastSyncTs == null
                    ? "Syncing..."
                    : formatAgo(Math.max(0, Math.round((Date.now() - i.lastSyncTs) / 1000)))}
                </p>
              </div>

              <button
                type="button"
                onClick={() => reSync(i.key)}
                disabled={i.connectionStatus === "Syncing"}
                className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-xs font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {i.connectionStatus === "Syncing" ? "Re-syncing..." : "Re-sync"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

