"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Underserved / opportunity: subject area, demand score (0-100), current capacity, opportunity score (gap). Heat = opportunity. */
const OPPORTUNITY_GRID = [
  { subject: "Data Science", demand: 92, capacity: 45, opportunity: 47 },
  { subject: "Cybersecurity", demand: 88, capacity: 38, opportunity: 50 },
  { subject: "Public Health", demand: 85, capacity: 55, opportunity: 30 },
  { subject: "FinTech", demand: 82, capacity: 40, opportunity: 42 },
  { subject: "Sustainability", demand: 78, capacity: 50, opportunity: 28 },
  { subject: "Digital Marketing", demand: 75, capacity: 60, opportunity: 15 },
  { subject: "AI & ML", demand: 95, capacity: 42, opportunity: 53 },
  { subject: "EdTech", demand: 70, capacity: 35, opportunity: 35 },
  { subject: "Law & Tech", demand: 68, capacity: 48, opportunity: 20 },
];

const maxOpportunity = Math.max(...OPPORTUNITY_GRID.map((r) => r.opportunity));

function heatColor(opportunity: number): string {
  const pct = maxOpportunity > 0 ? opportunity / maxOpportunity : 0;
  if (pct >= 0.8) return "bg-indigo-600 text-white";
  if (pct >= 0.6) return "bg-indigo-500 text-white";
  if (pct >= 0.4) return "bg-indigo-400 text-white";
  if (pct >= 0.2) return "bg-indigo-200 text-indigo-900";
  return "bg-indigo-100 text-indigo-800";
}

export default function OpportunityAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/strategic" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Strategic planning
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Opportunity analysis</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Heatmaps: underserved subjects and potential areas for new program launches.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Underserved subjects (opportunity heatmap)
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Opportunity = Demand − Capacity (higher = more potential for new programs). Darker = higher opportunity.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {OPPORTUNITY_GRID.map((row) => (
            <div
              key={row.subject}
              className={cn(
                "rounded-lg border border-slate-200 p-4 transition-opacity hover:opacity-90",
                heatColor(row.opportunity),
              )}
            >
              <p className="font-semibold">{row.subject}</p>
              <p className="mt-1 text-xs opacity-90">
                Demand {row.demand} · Capacity {row.capacity} · Opportunity {row.opportunity}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Opportunity score table
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Demand</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Current capacity</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Opportunity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OPPORTUNITY_GRID.sort((a, b) => b.opportunity - a.opportunity).map((row) => (
                <tr key={row.subject} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.subject}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.demand}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.capacity}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", heatColor(row.opportunity))}>
                      {row.opportunity}
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
