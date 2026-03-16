"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TeacherStatus = "Pending" | "Verified" | "Active" | "Suspended";

interface TeacherRow {
  id: string;
  name: string;
  subject: string;
  faculty: string;
  status: TeacherStatus;
}

const MOCK_TEACHERS: TeacherRow[] = [
  { id: "t1", name: "Dr. Nina Kozlova", subject: "Software Engineering", faculty: "Engineering", status: "Active" },
  { id: "t2", name: "Prof. Timur Akhmetov", subject: "Corporate Finance", faculty: "Business", status: "Verified" },
  { id: "t3", name: "Dr. Aigerim Sadykova", subject: "Constitutional Law", faculty: "Law", status: "Pending" },
  { id: "t4", name: "Assoc. Prof. Malik Nurgaliyev", subject: "Internal Medicine", faculty: "Medicine", status: "Active" },
  { id: "t5", name: "Ms. Olga Petrova", subject: "Academic English", faculty: "Language Center", status: "Suspended" },
];

const STATUS_STYLES: Record<TeacherStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Verified: "bg-sky-100 text-sky-800",
  Active: "bg-emerald-100 text-emerald-800",
  Suspended: "bg-rose-100 text-rose-800",
};

export default function TeachersListPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TeacherStatus | "">("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_TEACHERS.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.faculty.toLowerCase().includes(q);
      const matchesStatus = !statusFilter || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Teachers</h1>
          <p className="mt-1 text-sm text-slate-600">
            Profiles, verification status, and subject expertise.
          </p>
        </div>
        <Link
          href="/resources/teachers/create"
          className="inline-flex h-9 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-800"
        >
          + Create teacher
        </Link>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="w-full max-w-xs">
            <Input
              type="search"
              label="Search"
              placeholder="Search by name, subject, faculty…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TeacherStatus | "")}
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="w-40 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    No teachers match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        href={`/resources/teachers/${t.id}`}
                        className="hover:underline"
                      >
                        {t.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{t.subject}</td>
                    <td className="px-4 py-3 text-slate-700">{t.faculty}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[t.status])}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/resources/teachers/${t.id}/verification`}
                        className="text-xs font-medium text-teal-700 hover:underline"
                      >
                        Verify
                      </Link>
                      <span className="mx-1 text-slate-300">|</span>
                      <Link
                        href={`/resources/teachers/${t.id}`}
                        className="text-xs font-medium text-slate-700 hover:underline"
                      >
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

