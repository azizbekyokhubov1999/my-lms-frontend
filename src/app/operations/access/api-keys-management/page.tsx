"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

type KeyRow = {
  id: string;
  name: string;
  masked: string;
  status: "Active" | "Revoked";
};

const INITIAL_KEYS: KeyRow[] = [
  { id: "k1", name: "ops-api-gateway", masked: "********A21F", status: "Active" },
  { id: "k2", name: "audit-exporter", masked: "********D18C", status: "Active" },
  { id: "k3", name: "legacy-sync", masked: "********B90E", status: "Revoked" },
];

function maskTail() {
  return `********${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

export default function ApiKeysManagementPage() {
  const [keys, setKeys] = React.useState(INITIAL_KEYS);

  const rotate = (id: string) => setKeys((prev) => prev.map((k) => (k.id === id && k.status === "Active" ? { ...k, masked: maskTail() } : k)));
  const revoke = (id: string) => setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "Revoked" } : k)));
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // noop
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">API Keys Management</h1>
        <div className="mt-3 space-y-2">
          {keys.map((key) => (
            <div key={key.id} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{key.name}</p>
                <p className="font-mono text-xs text-slate-600">{key.masked}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => rotate(key.id)} disabled={key.status !== "Active"} className="rounded-md border border-indigo-400 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50">Rotate Key</button>
                <button type="button" onClick={() => revoke(key.id)} disabled={key.status !== "Active"} className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">Revoke</button>
                <button type="button" onClick={() => copy(key.masked)} className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">Copy</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
