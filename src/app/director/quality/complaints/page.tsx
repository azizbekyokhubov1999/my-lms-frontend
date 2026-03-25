"use client";

import Link from "next/link";
import * as React from "react";
import {
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";

/** Bubble chart: category, frequency (count), sentiment (0-100). Size = frequency. */
const COMPLAINT_CATEGORIES = [
  { category: "Facilities", count: 45, sentiment: 38, fill: "#d97706" },
  { category: "Grading", count: 62, sentiment: 35, fill: "#b91c1c" },
  { category: "Scheduling", count: 38, sentiment: 42, fill: "#d97706" },
  { category: "Teaching quality", count: 28, sentiment: 45, fill: "#b45309" },
  { category: "Admin delays", count: 55, sentiment: 32, fill: "#b91c1c" },
  { category: "Resources", count: 22, sentiment: 50, fill: "#ca8a04" },
  { category: "Communication", count: 41, sentiment: 40, fill: "#d97706" },
  { category: "Fairness", count: 18, sentiment: 33, fill: "#b91c1c" },
];

/** For ScatterChart: x = category index, y = sentiment, z = count (drives bubble size via ZAxis). */
const BUBBLE_DATA = COMPLAINT_CATEGORIES.map((c, i) => ({
  ...c,
  x: i + 1,
  y: c.sentiment,
  z: c.count,
}));

export default function ComplaintsAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/director/quality" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Quality dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Complaints analysis</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Sentiment analysis of student/staff complaints. Bubble size = frequency.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Most frequent complaint categories
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Bubble chart: horizontal = category, vertical = sentiment (0 = negative, 100 = positive), size = number of complaints.
        </p>
        <div className="mt-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
              <XAxis
                dataKey="x"
                type="number"
                domain={[0.5, COMPLAINT_CATEGORIES.length + 0.5]}
                tickFormatter={(val) => COMPLAINT_CATEGORIES[Number(val) - 1]?.category ?? ""}
                tick={{ fontSize: 10, fill: "#64748b" }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                dataKey="y"
                type="number"
                name="Sentiment"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Count" />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value, name, props) => {
                  type BubbleDatum = (typeof BUBBLE_DATA)[number];
                  const p = (props?.payload as BubbleDatum | undefined) ?? undefined;

                  if (name === "y") {
                    return [p?.sentiment ?? Number(value ?? 0), "Sentiment (0–100)"];
                  }

                  if (name === "z" || name === "count") {
                    return [p?.count ?? Number(value ?? 0), "Complaints"];
                  }

                  return [String(value ?? ""), "Value"];
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.category ?? ""}
              />
              <Scatter data={BUBBLE_DATA} name="Complaints">
                {BUBBLE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>Low sentiment = more negative; larger bubble = more complaints.</span>
        </div>
      </Card>

      <Card className="border-amber-500/30 bg-amber-50/30">
        <h2 className="text-sm font-semibold text-amber-900">Summary</h2>
        <p className="mt-1 text-sm text-amber-800">
          Top categories by volume: Grading ({COMPLAINT_CATEGORIES.find((c) => c.category === "Grading")?.count}), Admin delays ({COMPLAINT_CATEGORIES.find((c) => c.category === "Admin delays")?.count}), Facilities ({COMPLAINT_CATEGORIES.find((c) => c.category === "Facilities")?.count}). 
          Lowest sentiment: Admin delays, Grading, Fairness — prioritize corrective actions in these areas.
        </p>
      </Card>
    </div>
  );
}
