"use client";

import * as React from "react";
import { KeyRound } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type ApiKeyRow = {
  id: string;
  name: string;
  keyMasked: string;
  scopes: string[];
  createdAt: string;
  status: "Active" | "Revoked";
};

const initialKeys: ApiKeyRow[] = [
  {
    id: "k1",
    name: "ops/metrics-service",
    keyMasked: "**********A93F1C",
    scopes: ["read:metrics", "read:alerts"],
    createdAt: "2026-01-12",
    status: "Active",
  },
  {
    id: "k2",
    name: "ops/webhook-dispatcher",
    keyMasked: "**********F77D42",
    scopes: ["write:webhooks", "read:event-logs"],
    createdAt: "2025-12-20",
    status: "Active",
  },
  {
    id: "k3",
    name: "legacy/migration-job",
    keyMasked: "**********B11E09",
    scopes: ["migration:execute"],
    createdAt: "2025-09-04",
    status: "Revoked",
  },
];

function nextMask() {
  const suffix = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `**********${suffix}`;
}

export default function ApiKeysPage() {
  const [rows, setRows] = React.useState<ApiKeyRow[]>(initialKeys);

  const rotate = (id: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id && row.status === "Active" ? { ...row, keyMasked: nextMask() } : row)),
    );
  };

  const revoke = (id: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status: "Revoked" } : row)));
  };

  return (
    <SecuritySubpageShell
      title="API Keys"
      description="Manage service tokens with secure masking, rotation, and revocation controls."
      icon={KeyRound}
      badgeText="Token vault"
    >
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Scopes</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                <td className="px-4 py-3 font-mono">{row.keyMasked}</td>
                <td className="px-4 py-3">{row.scopes.join(", ")}</td>
                <td className="px-4 py-3">{row.createdAt}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      row.status === "Active"
                        ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                        : "border-rose-200 bg-rose-50 text-rose-600"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => rotate(row.id)}
                      disabled={row.status !== "Active"}
                      className="rounded-md border border-indigo-400 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Rotate
                    </button>
                    <button
                      type="button"
                      onClick={() => revoke(row.id)}
                      disabled={row.status !== "Active"}
                      className="rounded-md border border-rose-500 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SecuritySubpageShell>
  );
}

