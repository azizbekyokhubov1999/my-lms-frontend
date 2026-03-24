"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";

import { SecuritySubpageShell } from "../_components/SecuritySubpageShell";

type CertRow = {
  id: string;
  domain: string;
  remainingDays: number;
};

const initialCerts: CertRow[] = [
  { id: "c1", domain: "api.online-university.com", remainingDays: 74 },
  { id: "c2", domain: "admin.online-university.com", remainingDays: 19 },
  { id: "c3", domain: "ops.online-university.com", remainingDays: 41 },
];

const MAX_DAYS = 90;

export default function CertificatesPage() {
  const [certs, setCerts] = React.useState<CertRow[]>(initialCerts);

  const renew = (id: string) => {
    setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, remainingDays: 90 } : c)));
  };

  return (
    <SecuritySubpageShell
      title="Certificates"
      description="Track SSL validity windows and renew certificates before expiration."
      icon={ShieldCheck}
      badgeText="TLS lifecycle"
    >
      <div className="space-y-4">
        {certs.map((cert) => {
          const percent = Math.max(0, Math.min(100, (cert.remainingDays / MAX_DAYS) * 100));
          const critical = cert.remainingDays <= 21;

          return (
            <div key={cert.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{cert.domain}</p>
                  <p className="mt-1 text-sm text-slate-600">{cert.remainingDays} days remaining</p>
                </div>
                <button
                  type="button"
                  onClick={() => renew(cert.id)}
                  className="rounded-md border border-indigo-400 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                >
                  Renew
                </button>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${critical ? "bg-rose-500" : "bg-indigo-400"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SecuritySubpageShell>
  );
}
