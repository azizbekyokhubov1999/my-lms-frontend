"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AQADStatus = "Approved" | "Pending Approval";

interface ProgramRow {
  id: string;
  name: string;
  code: string;
  version: string;
  accreditationStatus: "accredited" | "pending" | "expired";
  aqadStatus: AQADStatus;
  durationYears: number;
  credits: number;
}

const MOCK_PROGRAMS: ProgramRow[] = [
  { id: "p1", name: "BSc Software Development", code: "BSC-SD", version: "2024.1", accreditationStatus: "accredited", aqadStatus: "Approved", durationYears: 4, credits: 240 },
  { id: "p2", name: "BSc Computer Science", code: "BSC-CS", version: "2023.2", accreditationStatus: "accredited", aqadStatus: "Approved", durationYears: 4, credits: 240 },
  { id: "p3", name: "MBA Business Administration", code: "MBA-BA", version: "2024.0", accreditationStatus: "pending", aqadStatus: "Pending Approval", durationYears: 2, credits: 120 },
  { id: "p4", name: "LLB Law", code: "LLB", version: "2022.1", accreditationStatus: "expired", aqadStatus: "Pending Approval", durationYears: 4, credits: 240 },
  { id: "p5", name: "BEng Electrical Engineering", code: "BENG-EE", version: "2023.1", accreditationStatus: "accredited", aqadStatus: "Approved", durationYears: 4, credits: 248 },
];

const AQAD_STATUS_STYLES: Record<AQADStatus, string> = {
  Approved: "bg-green-100 text-green-700",
  "Pending Approval": "bg-amber-100 text-amber-700",
};

const STATUS_STYLES: Record<ProgramRow["accreditationStatus"], string> = {
  accredited: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  expired: "bg-rose-100 text-rose-800",
};

export default function ProgramsListPage() {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_PROGRAMS;
    return MOCK_PROGRAMS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.version.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Programs</h1>
          <p className="mt-0.5 text-sm text-slate-600">Search and manage academic programs, versions, and accreditation.</p>
        </div>
        <Link
          href="/academic/programs/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          Create Program
        </Link>
      </div>

      <Card className="p-4">
        <div className="mb-4 max-w-sm">
          <Input
            type="search"
            placeholder="Search by name, code, or version..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Program</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Code</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Version</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Accreditation</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">AQAD Status</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Duration</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Credits</th>
                <th className="w-36 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No programs match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{p.code}</td>
                    <td className="px-4 py-3 text-slate-700">{p.version}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[p.accreditationStatus])}>
                        {p.accreditationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", AQAD_STATUS_STYLES[p.aqadStatus])}>
                        {p.aqadStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">{p.durationYears} yrs</td>
                    <td className="px-4 py-3 text-right text-slate-700">{p.credits}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/academic/programs/${p.id}`}
                        className="text-sm font-medium text-purple-700 hover:underline"
                      >
                        View
                      </Link>
                      <span className="mx-1 text-slate-300">|</span>
                      <Link
                        href={`/academic/programs/${p.id}/structure`}
                        className="text-sm font-medium text-purple-700 hover:underline"
                      >
                        Structure
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
