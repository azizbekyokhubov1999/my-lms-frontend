"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface InstallmentRow {
  dueDate: string;
  amount: number;
  status: "Paid" | "Overdue" | "Upcoming";
}

const MOCK_CONTRACTS: Record<
  string,
  {
    contractId: string;
    studentName: string;
    studentId: string;
    studentEmail: string;
    faculty: string;
    enrollmentYear: number;
    totalAmount: number;
    scholarshipPercent: number;
    startDate: string;
    endDate: string;
    status: string;
    paidAmount: number;
    installments: InstallmentRow[];
  }
> = {
  c1: {
    contractId: "CNT-2025-00142",
    studentName: "Anna Petrova",
    studentId: "STU-10001",
    studentEmail: "anna.petrova@edu.edu",
    faculty: "Engineering",
    enrollmentYear: 2025,
    totalAmount: 450000,
    scholarshipPercent: 0,
    startDate: "2025-09-01",
    endDate: "2029-06-30",
    status: "Active",
    paidAmount: 135000,
    installments: [
      { dueDate: "2025-09-15", amount: 112500, status: "Paid" },
      { dueDate: "2025-12-15", amount: 112500, status: "Paid" },
      { dueDate: "2026-03-15", amount: 112500, status: "Overdue" },
      { dueDate: "2026-06-15", amount: 112500, status: "Upcoming" },
    ],
  },
  c2: {
    contractId: "CNT-2025-00089",
    studentName: "Ivan Kozlov",
    studentId: "STU-10002",
    studentEmail: "ivan.kozlov@edu.edu",
    faculty: "Business",
    enrollmentYear: 2025,
    totalAmount: 380000,
    scholarshipPercent: 10,
    startDate: "2025-09-01",
    endDate: "2029-06-30",
    status: "Overdue",
    paidAmount: 95000,
    installments: [
      { dueDate: "2025-10-01", amount: 95000, status: "Paid" },
      { dueDate: "2026-02-20", amount: 95000, status: "Overdue" },
      { dueDate: "2026-06-20", amount: 95000, status: "Upcoming" },
      { dueDate: "2026-10-20", amount: 95000, status: "Upcoming" },
    ],
  },
  c3: {
    contractId: "CNT-2024-00321",
    studentName: "Maria Sokolova",
    studentId: "STU-10003",
    studentEmail: "maria.sokolova@edu.edu",
    faculty: "Medicine",
    enrollmentYear: 2024,
    totalAmount: 520000,
    scholarshipPercent: 0,
    startDate: "2024-09-01",
    endDate: "2028-06-30",
    status: "Active",
    paidAmount: 260000,
    installments: [
      { dueDate: "2024-10-01", amount: 130000, status: "Paid" },
      { dueDate: "2025-01-15", amount: 130000, status: "Paid" },
      { dueDate: "2025-06-15", amount: 130000, status: "Upcoming" },
      { dueDate: "2025-10-15", amount: 130000, status: "Upcoming" },
    ],
  },
  c4: {
    contractId: "CNT-2024-00215",
    studentName: "Dmitri Volkov",
    studentId: "STU-10004",
    studentEmail: "dmitri.volkov@edu.edu",
    faculty: "Law",
    enrollmentYear: 2024,
    totalAmount: 420000,
    scholarshipPercent: 0,
    startDate: "2024-09-01",
    endDate: "2028-06-30",
    status: "Completed",
    paidAmount: 420000,
    installments: [
      { dueDate: "2024-10-01", amount: 105000, status: "Paid" },
      { dueDate: "2025-02-01", amount: 105000, status: "Paid" },
      { dueDate: "2025-06-01", amount: 105000, status: "Paid" },
      { dueDate: "2025-10-01", amount: 105000, status: "Paid" },
    ],
  },
  c5: {
    contractId: "CNT-2025-00188",
    studentName: "Elena Novikova",
    studentId: "STU-10005",
    studentEmail: "elena.novikova@edu.edu",
    faculty: "Arts & Sciences",
    enrollmentYear: 2025,
    totalAmount: 390000,
    scholarshipPercent: 5,
    startDate: "2025-09-01",
    endDate: "2029-06-30",
    status: "Active",
    paidAmount: 78000,
    installments: [
      { dueDate: "2025-09-10", amount: 78000, status: "Paid" },
      { dueDate: "2026-03-01", amount: 78000, status: "Overdue" },
      { dueDate: "2026-09-01", amount: 78000, status: "Upcoming" },
      { dueDate: "2027-03-01", amount: 78000, status: "Upcoming" },
      { dueDate: "2027-09-01", amount: 78000, status: "Upcoming" },
    ],
  },
  c6: {
    contractId: "CNT-2023-00456",
    studentName: "Alexey Popov",
    studentId: "STU-10006",
    studentEmail: "alexey.popov@edu.edu",
    faculty: "Engineering",
    enrollmentYear: 2023,
    totalAmount: 480000,
    scholarshipPercent: 0,
    startDate: "2023-09-01",
    endDate: "2027-06-30",
    status: "Terminated",
    paidAmount: 120000,
    installments: [
      { dueDate: "2023-10-01", amount: 120000, status: "Paid" },
      { dueDate: "2024-02-01", amount: 120000, status: "Overdue" },
    ],
  },
};

export default function ContractDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const contract = id ? MOCK_CONTRACTS[id] : null;

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;

  if (!contract) {
    return (
      <div className="space-y-6">
        <Link href="/finance/contracts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Contracts
        </Link>
        <p className="text-slate-600">Contract not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/contracts" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Contracts
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{contract.contractId}</h1>
        <p className="mt-0.5 text-sm text-slate-600">Full contract terms and installment breakdown</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Student Details</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Name</dt>
              <dd className="font-medium text-slate-900">{contract.studentName}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Student ID</dt>
              <dd className="font-mono text-slate-900">{contract.studentId}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Email</dt>
              <dd className="text-slate-900">{contract.studentEmail}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Faculty</dt>
              <dd className="text-slate-900">{contract.faculty}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-600">Enrollment Year</dt>
              <dd className="text-slate-900">{contract.enrollmentYear}</dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contract Terms</h2>
          <dl className="mt-4 space-y-3">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Total Amount</dt>
              <dd className="font-semibold text-slate-900">{formatAmount(contract.totalAmount)}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Scholarship</dt>
              <dd className="text-slate-900">{contract.scholarshipPercent}%</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Start Date</dt>
              <dd className="text-slate-900">{contract.startDate}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">End Date</dt>
              <dd className="text-slate-900">{contract.endDate}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-600">Paid to Date</dt>
              <dd className="font-semibold text-emerald-700">{formatAmount(contract.paidAmount)}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-600">Status</dt>
              <dd>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    contract.status === "Active" && "bg-emerald-100 text-emerald-800",
                    contract.status === "Completed" && "bg-slate-100 text-slate-700",
                    contract.status === "Overdue" && "bg-amber-100 text-amber-800",
                    contract.status === "Terminated" && "bg-red-100 text-red-800",
                  )}
                >
                  {contract.status}
                </span>
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Installment Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">#</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Due Date</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {contract.installments.map((inst, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-emerald-50/50">
                  <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{inst.dueDate}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatAmount(inst.amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        inst.status === "Paid" && "bg-emerald-100 text-emerald-800",
                        inst.status === "Overdue" && "bg-amber-100 text-amber-800",
                        inst.status === "Upcoming" && "bg-slate-100 text-slate-700",
                      )}
                    >
                      {inst.status}
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
