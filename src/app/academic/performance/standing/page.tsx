"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Standing = "probation" | "good_standing" | "deans_list";

interface StudentStanding {
  id: string;
  name: string;
  studentId: string;
  group: string;
  standing: Standing;
  gpa: number;
}

const MOCK_STANDING: StudentStanding[] = [
  { id: "st1", name: "Anna Petrova", studentId: "STU-10001", group: "SD-24-01", standing: "deans_list", gpa: 3.88 },
  { id: "st2", name: "Ivan Kozlov", studentId: "STU-10002", group: "SD-24-01", standing: "probation", gpa: 2.1 },
  { id: "st3", name: "Maria Sokolova", studentId: "STU-10003", group: "SD-24-01", standing: "deans_list", gpa: 3.92 },
  { id: "st4", name: "Dmitri Volkov", studentId: "STU-10004", group: "SD-24-01", standing: "probation", gpa: 1.9 },
  { id: "st5", name: "Elena Novikova", studentId: "STU-10005", group: "SD-24-02", standing: "good_standing", gpa: 3.2 },
];

const STANDING_STYLES: Record<Standing, string> = {
  probation: "bg-amber-100 text-amber-800",
  good_standing: "bg-emerald-100 text-emerald-800",
  deans_list: "bg-purple-100 text-purple-800",
};

const STANDING_LABELS: Record<Standing, string> = {
  probation: "Probation",
  good_standing: "Good Standing",
  deans_list: "Dean's List",
};

export default function AcademicStandingPage() {
  const [search, setSearch] = React.useState("");
  const [filterStanding, setFilterStanding] = React.useState<Standing | "">("");

  const filtered = React.useMemo(() => {
    let list = MOCK_STANDING;
    if (filterStanding) list = list.filter((s) => s.standing === filterStanding);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.group.toLowerCase().includes(q));
    return list;
  }, [search, filterStanding]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/performance" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Performance
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Academic standing</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Track statuses: Probation, Good Standing, or Dean's List.
        </p>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="search"
            placeholder="Search by name, ID, or group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
          <select
            value={filterStanding}
            onChange={(e) => setFilterStanding(e.target.value as Standing | "")}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
          >
            <option value="">All standings</option>
            <option value="probation">Probation</option>
            <option value="good_standing">Good Standing</option>
            <option value="deans_list">Dean's List</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-purple-200 bg-purple-50/30">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Student</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Group</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">GPA</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-purple-100/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs font-mono text-slate-500">{s.studentId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.group}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{s.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STANDING_STYLES[s.standing])}>
                      {STANDING_LABELS[s.standing]}
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
