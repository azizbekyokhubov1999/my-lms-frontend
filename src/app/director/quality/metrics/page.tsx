"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PROGRAM_STATUS = [
  { id: "1", program: "CS (Engineering)", status: "Approved", complianceScore: 92, lastReview: "2025-01" },
  { id: "2", program: "MBA (Business)", status: "Approved", complianceScore: 88, lastReview: "2024-11" },
  { id: "3", program: "LLB (Law)", status: "Approved", complianceScore: 95, lastReview: "2025-02" },
  { id: "4", program: "MD (Medicine)", status: "Pending", complianceScore: 78, lastReview: "2024-09" },
  { id: "5", program: "BA Liberal Arts", status: "Approved", complianceScore: 85, lastReview: "2024-12" },
  { id: "6", program: "Applied Linguistics", status: "Pending", complianceScore: 72, lastReview: "2024-10" },
  { id: "7", program: "Diploma in Nursing", status: "Rejected", complianceScore: 58, lastReview: "2024-08" },
];

export default function AQADMetricsPage() {
  const approved = PROGRAM_STATUS.filter((p) => p.status === "Approved").length;
  const pending = PROGRAM_STATUS.filter((p) => p.status === "Pending").length;
  const rejected = PROGRAM_STATUS.filter((p) => p.status === "Rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/quality" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Quality dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">AQAD metrics</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Detailed breakdown: which programs meet standards and which are pending or rejected.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 bg-slate-900 shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Meeting standards</p>
          <p className="mt-2 text-2xl font-bold text-white">{approved}</p>
          <p className="mt-0.5 text-xs text-emerald-400">Approved</p>
        </Card>
        <Card className="border-amber-500/50 bg-amber-50/50 shadow">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-900">{pending}</p>
          <p className="mt-0.5 text-xs text-amber-700">Under review</p>
        </Card>
        <Card className="border-0 bg-slate-900 shadow-lg">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-white">{rejected}</p>
          <p className="mt-0.5 text-xs text-red-400">Requires action</p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Program status
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Compliance score (0–100) and last AQAD review.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Compliance</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Last review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROGRAM_STATUS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.program}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        row.status === "Approved" && "bg-emerald-100 text-emerald-800",
                        row.status === "Pending" && "bg-amber-100 text-amber-800",
                        row.status === "Rejected" && "bg-red-100 text-red-800",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      "font-medium",
                      row.complianceScore >= 85 && "text-emerald-700",
                      row.complianceScore >= 70 && row.complianceScore < 85 && "text-amber-700",
                      row.complianceScore < 70 && "text-red-700",
                    )}>
                      {row.complianceScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.lastReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
