"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

const ROADMAP = [
  { quarter: "2026 Q2", item: "Add 2× web nodes (same SKU)", capex: 18 },
  { quarter: "2026 Q3", item: "Expand object storage tier + replication", capex: 42 },
  { quarter: "2027 Q1", item: "DR region warm standby (compute)", capex: 95 },
];

const BUDGET_VS_ACTUAL = [
  { category: "Compute", budget: 120, actual: 108, unit: "k USD / qtr" },
  { category: "Storage", budget: 64, actual: 71, unit: "k USD / qtr" },
  { category: "Network", budget: 22, actual: 19, unit: "k USD / qtr" },
  { category: "Licensing", budget: 38, actual: 35, unit: "k USD / qtr" },
];

const EFFICIENCY_SCORE = 82;

function ResourceEfficiencyGauge({ value }: { value: number }) {
  const radius = 52;
  const stroke = 10;
  const normalized = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;
  const strokeColor = normalized >= 75 ? "#10b981" : "#f43f5e";

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
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{value}%</span>
        <span className="text-xs font-medium text-slate-500">Efficiency</span>
      </div>
    </div>
  );
}

export default function CapacityPlanningPage() {
  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <TrendingUp className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Capacity planning</h1>
        <p className="mt-1 text-sm text-slate-600">
          Budget vs. actuals, procurement waves, and resource efficiency posture.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Resource efficiency</h2>
          <p className="mt-1 text-xs text-slate-600">
            Provisioned vs. used (weighted). Above 75% is considered healthy alignment.
          </p>
          <div className="mt-4 flex justify-center">
            <ResourceEfficiencyGauge value={EFFICIENCY_SCORE} />
          </div>
          <p className="mt-2 text-center text-sm">
            <span className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              On target
            </span>
          </p>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Budget vs. actual (000s USD)</h2>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUDGET_VS_ACTUAL} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} width={36} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  formatter={(value, name) => [
                    `$${Number(value ?? 0)}k`,
                    String(name) === "budget" ? "Budget" : "Actual",
                  ]}
                />
                <Bar dataKey="budget" fill="#818cf8" name="budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#10b981" name="actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Rose highlight in table below for categories over budget.
          </p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Line-item view</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[640px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3">Variance</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_VS_ACTUAL.map((row) => {
                const over = row.actual > row.budget;
                const varPct = Math.round(((row.actual - row.budget) / row.budget) * 100);
                return (
                  <tr key={row.category} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.category}</td>
                    <td className="px-4 py-3 font-mono text-slate-800">${row.budget}k</td>
                    <td
                      className={`px-4 py-3 font-mono font-semibold ${
                        over ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      ${row.actual}k
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          over
                            ? "rounded-full border border-rose-500/40 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600"
                            : "rounded-full border border-emerald-500/40 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600"
                        }
                      >
                        {varPct > 0 ? "+" : ""}
                        {varPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Growth assumptions</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span>Student enrollment YoY</span>
              <span className="font-semibold text-slate-900">+12%</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span>Media storage per course hour</span>
              <span className="font-semibold text-slate-900">+8% / yr</span>
            </li>
            <li className="flex justify-between pb-2">
              <span>Peak concurrent sessions (design target)</span>
              <span className="font-semibold text-slate-900">25k</span>
            </li>
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-indigo-400 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Recalculate runway model
          </button>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Runway</h2>
          <p className="mt-2 text-4xl font-bold text-slate-900">14 mo</p>
          <p className="mt-2 text-sm text-slate-600">
            Before any tier exceeds policy (CPU &gt; 75% sustained, disk &gt; 85%) at modeled
            demand.
          </p>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Hardware roadmap (draft)</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[640px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Window</th>
                <th className="px-4 py-3">Initiative</th>
                <th className="px-4 py-3">Est. CAPEX</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((row) => (
                <tr key={row.quarter} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.quarter}</td>
                  <td className="px-4 py-3 text-slate-700">{row.item}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">${row.capex}k</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
