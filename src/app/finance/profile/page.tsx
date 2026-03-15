"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const MOCK_PROFILE = {
  fullName: "Olga Sokolova",
  employeeId: "FIN-2042",
  role: "Senior Accountant" as const,
  email: "o.sokolova@university.kz",
  phone: "+7 (701) 234-56-78",
  officeRoom: "Building A, Room 312",
  assignedFaculties: ["Business School", "Engineering", "Law"],
  approvalLimit: 500_000,
};

const MOCK_ACTIVITY = [
  { id: "a1", date: "2026-03-06", time: "14:32", label: "Validated Payment #TXN-2841", amount: 45000 },
  { id: "a2", date: "2026-03-06", time: "11:15", label: "Approved Contract #C-2026-089", amount: null },
  { id: "a3", date: "2026-03-05", time: "16:45", label: "Validated Payment #TXN-2839", amount: 52000 },
  { id: "a4", date: "2026-03-05", time: "10:00", label: "Manual match recorded (LMS ↔ 1C)", amount: null },
  { id: "a5", date: "2026-03-04", time: "15:20", label: "Rejected payment #TXN-2835", amount: 28000 },
];

export default function FinanceProfilePage() {
  const [email, setEmail] = React.useState(MOCK_PROFILE.email);
  const [phone, setPhone] = React.useState(MOCK_PROFILE.phone);
  const [officeRoom, setOfficeRoom] = React.useState(MOCK_PROFILE.officeRoom);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatAmount = (n: number) => `${n.toLocaleString()} ₸`;
  const initials = MOCK_PROFILE.fullName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/finance/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-0.5 text-sm text-slate-600">Your account and professional information.</p>
      </div>

      {/* Profile Header */}
      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-8 sm:flex sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
            {initials}
          </div>
          <div className="mt-4 sm:mt-0">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{MOCK_PROFILE.fullName}</h2>
            <p className="mt-0.5 font-mono text-sm text-emerald-100">Employee ID: {MOCK_PROFILE.employeeId}</p>
            <span className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              {MOCK_PROFILE.role}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information (editable) */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Personal Information</h3>
          <p className="mt-0.5 text-xs text-slate-600">Update your contact details.</p>
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (xxx) xxx-xx-xx"
              className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
            <Input
              label="Office Room"
              type="text"
              value={officeRoom}
              onChange={(e) => setOfficeRoom(e.target.value)}
              placeholder="Building, Room"
              className="focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
            >
              {saved ? "Saved" : "Save changes"}
            </Button>
          </form>
        </Card>

        {/* Professional Info (display-only) */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Professional Info</h3>
          <p className="mt-0.5 text-xs text-slate-600">Assigned scope and approval limits.</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Assigned Faculties</p>
              <ul className="mt-1.5 flex flex-wrap gap-2">
                {MOCK_PROFILE.assignedFaculties.map((f) => (
                  <li
                    key={f}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Financial Approval Limit</p>
              <p className="mt-1.5 text-lg font-semibold text-emerald-600">
                Up to {formatAmount(MOCK_PROFILE.approvalLimit)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Single transaction approval ceiling.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Activity Summary</h3>
        <p className="mt-0.5 text-xs text-slate-600">Last 5 financial actions performed by you.</p>
        <ul className="mt-4 border-l-2 border-emerald-200 pl-4">
          {MOCK_ACTIVITY.map((a, i) => (
            <li key={a.id} className="relative pb-5 last:pb-0">
              <span className="absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-600 shadow-sm" />
              <p className="text-sm font-medium text-slate-900">{a.label}</p>
              <p className="text-xs text-slate-500">
                {a.date} at {a.time}
                {a.amount != null && (
                  <span className="ml-2 font-medium text-slate-600">{formatAmount(a.amount)}</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
