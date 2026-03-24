"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

const INITIAL_IPS = ["10.0.0.0/24", "10.10.20.0/24", "203.0.113.10/32"];

export default function IpWhitelistingPage() {
  const [ranges, setRanges] = React.useState(INITIAL_IPS);
  const [newIp, setNewIp] = React.useState("");

  const addIp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = newIp.trim();
    if (!value || !value.includes("/") || ranges.includes(value)) return;
    setRanges((prev) => [value, ...prev]);
    setNewIp("");
  };

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">IP Whitelisting</h1>
        <form onSubmit={addIp} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="e.g., 198.51.100.0/24"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-400 focus:ring-2"
          />
          <button type="submit" className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Add New IP</button>
        </form>
        <div className="mt-3 space-y-2">
          {ranges.map((range) => (
            <div key={range} className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">{range}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
