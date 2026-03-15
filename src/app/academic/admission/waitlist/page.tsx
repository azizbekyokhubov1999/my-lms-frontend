"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

interface WaitlistEntry {
  id: string;
  applicantId: string;
  name: string;
  applicationId: string;
  faculty: string;
  program: string;
  position: number;
  addedDate: string;
}

const MOCK_WAITLIST: WaitlistEntry[] = [
  { id: "w1", applicantId: "a1", name: "Alex Ivanov", applicationId: "APP-2026-010", faculty: "Engineering", program: "BSc Software Development", position: 1, addedDate: "2026-03-01" },
  { id: "w2", applicantId: "a2", name: "Sofia Kim", applicationId: "APP-2026-011", faculty: "Engineering", program: "BSc Software Development", position: 2, addedDate: "2026-03-02" },
  { id: "w3", applicantId: "a3", name: "Max Volkov", applicationId: "APP-2026-012", faculty: "Business", program: "MBA Business Administration", position: 3, addedDate: "2026-03-03" },
];

export default function WaitlistPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/admission" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Admission
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Waitlist</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Applicants who meet requirements but are waiting for available seats.
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-violet-200 bg-violet-100">
                <th className="w-16 px-4 py-3 text-left font-medium text-violet-900">#</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Applicant</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Application ID</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Faculty / Program</th>
                <th className="px-4 py-3 text-left font-medium text-violet-900">Added</th>
                <th className="w-28 px-4 py-3 text-right font-medium text-violet-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_WAITLIST.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No one on the waitlist.
                  </td>
                </tr>
              ) : (
                MOCK_WAITLIST.map((e) => (
                  <tr key={e.id} className="hover:bg-violet-50/50">
                    <td className="px-4 py-3 font-semibold text-violet-700">{e.position}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{e.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{e.applicationId}</td>
                    <td className="px-4 py-3 text-slate-700">{e.faculty} · {e.program}</td>
                    <td className="px-4 py-3 text-slate-700">{e.addedDate}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/academic/admission/${e.applicantId}`} className="font-medium text-violet-600 hover:underline">
                        Review
                      </Link>
                      <span className="mx-1 text-slate-300">|</span>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => alert(`Offer seat to ${e.name} (Demo)`)}
                      >
                        Offer seat
                      </Button>
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
