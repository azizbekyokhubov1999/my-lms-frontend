"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface GroupRow {
  id: string;
  name: string;
  program: string;
  cohortYear: number;
  studentCount: number;
  status: "active" | "graduated";
}

const MOCK_GROUPS: GroupRow[] = [
  { id: "g1", name: "SD-24-01", program: "BSc Software Development", cohortYear: 2024, studentCount: 28, status: "active" },
  { id: "g2", name: "SD-24-02", program: "BSc Software Development", cohortYear: 2024, studentCount: 25, status: "active" },
  { id: "g3", name: "CS-23-01", program: "BSc Computer Science", cohortYear: 2023, studentCount: 30, status: "active" },
  { id: "g4", name: "SD-20-01", program: "BSc Software Development", cohortYear: 2020, studentCount: 22, status: "graduated" },
  { id: "g5", name: "MBA-24-A", program: "MBA Business Administration", cohortYear: 2024, studentCount: 18, status: "active" },
];

const STATUS_STYLES: Record<GroupRow["status"], string> = {
  active: "bg-emerald-100 text-emerald-800",
  graduated: "bg-slate-100 text-slate-700",
};

export default function GroupsListPage() {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_GROUPS;
    return MOCK_GROUPS.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.program.toLowerCase().includes(q) ||
        String(g.cohortYear).includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Groups</h1>
          <p className="mt-0.5 text-sm text-slate-600">Cohorts and student groups. View, create, bulk assign, or transfer.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/academic/groups/bulk-assign"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Bulk Assign
          </Link>
          <Link
            href="/academic/groups/transfer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Group Transfer
          </Link>
          <Link
            href="/academic/groups/create"
            className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            Create Group
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 max-w-sm">
          <Input
            type="search"
            placeholder="Search by group name, program, or cohort year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-purple-200 bg-purple-100">
                <th className="px-4 py-3 text-left font-medium text-purple-900">Group Name</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Program</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Cohort Year</th>
                <th className="px-4 py-3 text-right font-medium text-purple-900">Students</th>
                <th className="px-4 py-3 text-left font-medium text-purple-900">Status</th>
                <th className="w-24 px-4 py-3 text-right font-medium text-purple-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No groups match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-purple-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{g.name}</td>
                    <td className="px-4 py-3 text-slate-700">{g.program}</td>
                    <td className="px-4 py-3 text-slate-700">{g.cohortYear}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{g.studentCount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[g.status])}>
                        {g.status === "active" ? "Active" : "Graduated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/academic/groups/${g.id}`} className="font-medium text-purple-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
