"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const INITIAL_TARGETS = [
  { id: "t1", description: "Reach 15,000 students", value: "15000", year: "2027", metric: "students" },
  { id: "t2", description: "Achieve 95% retention", value: "95", year: "2026", metric: "%" },
  { id: "t3", description: "Launch 3 new programs", value: "3", year: "2026", metric: "programs" },
];

export default function StrategicPlanningPage() {
  const [targets, setTargets] = React.useState(INITIAL_TARGETS);
  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState("");
  const [year, setYear] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !value.trim() || !year.trim()) return;
    setTargets((prev) => [
      ...prev,
      { id: `t${Date.now()}`, description: description.trim(), value: value.trim(), year: year.trim(), metric: "" },
    ]);
    setDescription("");
    setValue("");
    setYear("");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Strategic planning</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Set long-term institutional targets (e.g. reach 5000 students by 2027).
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Add target
        </h2>
        <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <Input
              label="Description"
              placeholder="e.g. Reach 5000 students by 2027"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-28">
            <Input
              label="Value"
              placeholder="5000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="w-28">
            <Input
              label="Year"
              placeholder="2027"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-700">
            Add target
          </Button>
        </form>
      </Card>

      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Long-term targets
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Current institutional targets.</p>
        <ul className="mt-4 space-y-3">
          {targets.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{t.description}</p>
                <p className="text-xs text-slate-500">Target: {t.value}{t.metric ? ` ${t.metric}` : ""} by {t.year}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                By {t.year}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-slate-200 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-700">Strategic module</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/director/strategic/forecasting" className="text-sm font-medium text-slate-700 underline decoration-indigo-500 hover:decoration-indigo-600">Forecasting →</Link>
          <Link href="/director/strategic/opportunity" className="text-sm font-medium text-slate-700 underline decoration-indigo-500 hover:decoration-indigo-600">Opportunity analysis →</Link>
        </div>
      </Card>
    </div>
  );
}
