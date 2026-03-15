"use client";

import Link from "next/link";
import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Card } from "../../../components/ui/Card";

const MOCK_BY_FACULTY = [
  { faculty: "Engineering", accepted: 42, rejected: 18, waitlist: 12 },
  { faculty: "Business", accepted: 28, rejected: 9, waitlist: 8 },
  { faculty: "Law", accepted: 35, rejected: 12, waitlist: 5 },
  { faculty: "Medicine", accepted: 22, rejected: 15, waitlist: 10 },
  { faculty: "Arts & Sciences", accepted: 30, rejected: 11, waitlist: 6 },
];

const ACCEPT_COLOR = "#10b981";
const REJECT_COLOR = "#ef4444";
const WAITLIST_COLOR = "#8b5cf6";

export default function AdmissionReportsPage() {
  const totalAccepted = MOCK_BY_FACULTY.reduce((s, r) => s + r.accepted, 0);
  const totalRejected = MOCK_BY_FACULTY.reduce((s, r) => s + r.rejected, 0);
  const totalWaitlist = MOCK_BY_FACULTY.reduce((s, r) => s + r.waitlist, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/admission" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Admission
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Admission reports</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Analytics on accepted, rejected, and waitlisted students per faculty.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Accepted</p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">{totalAccepted}</p>
        </Card>
        <Card className="border-rose-200 bg-rose-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-rose-700">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-rose-900">{totalRejected}</p>
        </Card>
        <Card className="border-violet-200 bg-violet-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-violet-700">Waitlist</p>
          <p className="mt-1 text-2xl font-bold text-violet-900">{totalWaitlist}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">By faculty</h2>
        <p className="mt-0.5 text-xs text-slate-600">Accepted, rejected, and waitlisted counts per faculty.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_BY_FACULTY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="faculty" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="accepted" name="Accepted" stackId="a" fill={ACCEPT_COLOR} radius={[0, 0, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" stackId="a" fill={REJECT_COLOR} radius={[0, 0, 0, 0]} />
              <Bar dataKey="waitlist" name="Waitlist" stackId="a" fill={WAITLIST_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-violet-100">
                <th className="px-4 py-3 text-left font-medium text-violet-900">Faculty</th>
                <th className="px-4 py-3 text-right font-medium text-violet-900">Accepted</th>
                <th className="px-4 py-3 text-right font-medium text-violet-900">Rejected</th>
                <th className="px-4 py-3 text-right font-medium text-violet-900">Waitlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_BY_FACULTY.map((r) => (
                <tr key={r.faculty} className="hover:bg-violet-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{r.faculty}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-700">{r.accepted}</td>
                  <td className="px-4 py-3 text-right font-semibold text-rose-700">{r.rejected}</td>
                  <td className="px-4 py-3 text-right font-semibold text-violet-700">{r.waitlist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
