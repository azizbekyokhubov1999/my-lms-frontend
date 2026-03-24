import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

const HEALTH_SCORE = 87;

const UPCOMING_AUDITS = [
  { id: "a1", name: "ISO 27001 internal review", date: "2026-04-02", owner: "Security" },
  { id: "a2", name: "GDPR DPIA checkpoint", date: "2026-04-15", owner: "DPO" },
  { id: "a3", name: "Quarterly access certification", date: "2026-04-28", owner: "IT Ops" },
];

function ComplianceHealthGauge({ value }: { value: number }) {
  const radius = 52;
  const stroke = 10;
  const normalized = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg className="h-44 w-44 -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#818cf8"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{value}%</span>
        <span className="text-xs font-medium text-slate-500">Health</span>
      </div>
    </div>
  );
}

export default function ComplianceDashboardPage() {
  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/operations/compliance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Compliance Hub
        </Link>
        <LayoutDashboard className="h-6 w-6 text-indigo-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">Compliance Health Score</h1>
          <p className="mt-1 text-sm text-slate-600">
            Aggregate posture across policies, audits, and controls (0–100%).
          </p>
          <div className="mt-6 flex justify-center">
            <ComplianceHealthGauge value={HEALTH_SCORE} />
          </div>
          <p className="mt-2 text-center text-sm">
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
              Compliant
            </span>
          </p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Audits</h2>
          <ul className="mt-4 space-y-3">
            {UPCOMING_AUDITS.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.owner}</p>
                </div>
                <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                  {item.date}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
