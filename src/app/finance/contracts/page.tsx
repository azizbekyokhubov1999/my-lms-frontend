"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ContractStatus = "Active" | "Completed" | "Overdue" | "Terminated";

interface ContractRow {
  id: string;
  contractId: string;
  studentName: string;
  totalAmount: number;
  status: ContractStatus;
  enrollmentYear: number;
  faculty: string;
}

const ENROLLMENT_YEARS = [2022, 2023, 2024, 2025, 2026];
const FACULTIES = ["Engineering", "Business", "Medicine", "Law", "Arts & Sciences"];

const MOCK_CONTRACTS: ContractRow[] = [
  { id: "c1", contractId: "CNT-2025-00142", studentName: "Anna Petrova", totalAmount: 450000, status: "Active", enrollmentYear: 2025, faculty: "Engineering" },
  { id: "c2", contractId: "CNT-2025-00089", studentName: "Ivan Kozlov", totalAmount: 380000, status: "Overdue", enrollmentYear: 2025, faculty: "Business" },
  { id: "c3", contractId: "CNT-2024-00321", studentName: "Maria Sokolova", totalAmount: 520000, status: "Active", enrollmentYear: 2024, faculty: "Medicine" },
  { id: "c4", contractId: "CNT-2024-00215", studentName: "Dmitri Volkov", totalAmount: 420000, status: "Completed", enrollmentYear: 2024, faculty: "Law" },
  { id: "c5", contractId: "CNT-2025-00188", studentName: "Elena Novikova", totalAmount: 390000, status: "Active", enrollmentYear: 2025, faculty: "Arts & Sciences" },
  { id: "c6", contractId: "CNT-2023-00456", studentName: "Alexey Popov", totalAmount: 480000, status: "Terminated", enrollmentYear: 2023, faculty: "Engineering" },
];

export default function ContractsListPage() {
  const [search, setSearch] = React.useState("");
  const [enrollmentYear, setEnrollmentYear] = React.useState<string>("");
  const [faculty, setFaculty] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    return MOCK_CONTRACTS.filter((c) => {
      if (enrollmentYear && c.enrollmentYear !== Number(enrollmentYear)) return false;
      if (faculty && c.faculty !== faculty) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!c.studentName.toLowerCase().includes(q) && !c.contractId.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, enrollmentYear, faculty]);

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contracts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Management & imports. Search, filter, and manage student contracts.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/finance/contracts/bulk-import"
            className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-600 px-4 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Bulk Import
          </Link>
          <Link
            href="/finance/contracts/create"
            className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Create Contract
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by student name or contract ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={enrollmentYear}
            onChange={(e) => setEnrollmentYear(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Enrollment Year: All</option>
            {ENROLLMENT_YEARS.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Faculty: All</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Contract ID</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Total Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="w-20 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-emerald-50/70 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.studentName}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{c.contractId}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(c.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        c.status === "Active" && "bg-emerald-100 text-emerald-800",
                        c.status === "Completed" && "bg-slate-100 text-slate-700",
                        c.status === "Overdue" && "bg-amber-100 text-amber-800",
                        c.status === "Terminated" && "bg-red-100 text-red-800",
                      )}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/finance/contracts/${c.id}`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No contracts match the filters.</p>
        )}
      </Card>
    </div>
  );
}
