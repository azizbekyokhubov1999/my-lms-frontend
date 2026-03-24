"use client";

import * as React from "react";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type RecoveryProcedure = {
  id: string;
  label: string;
  done: boolean;
};

type DrillResult = "Pass" | "Needs Improvement";

type Drill = {
  id: string;
  lastDrillDate: string;
  result: DrillResult;
};

const initialProcedures: RecoveryProcedure[] = [
  { id: "p1", label: "Validate backup integrity checksums", done: true },
  { id: "p2", label: "Switch traffic to recovery region", done: false },
  { id: "p3", label: "Restore critical services and verify health", done: false },
  { id: "p4", label: "Notify stakeholders and publish status update", done: true },
];

const DRILLS: Drill[] = [
  { id: "d1", lastDrillDate: "2026-02-10", result: "Pass" },
  { id: "d2", lastDrillDate: "2025-12-15", result: "Needs Improvement" },
];

export default function DisasterRecoveryPage() {
  const [procedures, setProcedures] = React.useState(initialProcedures);

  const toggleProcedure = (id: string) => {
    setProcedures((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/backup" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Backup Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Disaster Recovery</h1>
          <p className="mt-1 text-sm text-slate-600">Recovery procedures and drill readiness tracking.</p>
        </div>
        <LifeBuoy className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recovery Procedures</h2>
        <div className="mt-3 space-y-2">
          {procedures.map((procedure) => (
            <label key={procedure.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span className="text-sm text-slate-700">{procedure.label}</span>
              <input
                type="checkbox"
                checked={procedure.done}
                onChange={() => toggleProcedure(procedure.id)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Disaster Recovery Drills</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Last Drill Date</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {DRILLS.map((drill) => (
                <tr key={drill.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3">{drill.lastDrillDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${drill.result === "Pass" ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
                      {drill.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
