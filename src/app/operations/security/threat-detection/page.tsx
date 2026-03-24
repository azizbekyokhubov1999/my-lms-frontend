"use client";

import * as React from "react";
import { Flame } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type ThreatItem = {
  id: string;
  ip: string;
  country: string;
  reason: string;
  level: "Warning" | "Critical";
  blocked: boolean;
};

const seedThreats: ThreatItem[] = [
  { id: "t1", ip: "185.91.77.23", country: "RU", reason: "Brute-force login attempts", level: "Critical", blocked: true },
  { id: "t2", ip: "103.44.18.91", country: "VN", reason: "Credential stuffing pattern", level: "Critical", blocked: false },
  { id: "t3", ip: "84.16.203.10", country: "DE", reason: "Abnormal token refresh volume", level: "Warning", blocked: false },
  { id: "t4", ip: "217.65.34.201", country: "NL", reason: "Suspicious scanner signature", level: "Warning", blocked: true },
];

export default function ThreatDetectionPage() {
  const [threats, setThreats] = React.useState<ThreatItem[]>(seedThreats);

  const blockIp = (id: string) => {
    setThreats((prev) => prev.map((item) => (item.id === id ? { ...item, blocked: true } : item)));
  };

  return (
    <SecuritySubpageShell
      title="Threat Detection"
      description="Review suspicious activities and block hostile sources in real time."
      icon={Flame}
      badgeText="Threat feed"
    >
      <div className="space-y-3">
        {threats.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.ip} ({item.country})</p>
              <p className="mt-1 text-sm text-slate-600">{item.reason}</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  item.level === "Critical"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
                    : "border-indigo-200 bg-indigo-50 text-indigo-600"
                }`}
              >
                {item.level}
              </span>
            </div>
            <button
              type="button"
              onClick={() => blockIp(item.id)}
              disabled={item.blocked}
              className={`rounded-md border px-3 py-2 text-xs font-semibold ${
                item.blocked
                  ? "cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-rose-500 text-rose-600 hover:bg-rose-50"
              }`}
            >
              {item.blocked ? "Blocked" : "Block IP"}
            </button>
          </div>
        ))}
      </div>
    </SecuritySubpageShell>
  );
}
