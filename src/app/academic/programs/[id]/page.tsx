"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const MOCK_PROGRAMS: Record<string, { name: string; code: string; version: string; accreditationStatus: string; durationYears: number; credits: number; faculty: string; description: string }> = {
  p1: { name: "BSc Software Development", code: "BSC-SD", version: "2024.1", accreditationStatus: "accredited", durationYears: 4, credits: 240, faculty: "Engineering", description: "Full-time programme covering software design, development, and deployment with industry placement." },
  p2: { name: "BSc Computer Science", code: "BSC-CS", version: "2023.2", accreditationStatus: "accredited", durationYears: 4, credits: 240, faculty: "Engineering", description: "Core computer science with algorithms, systems, and theory." },
  p3: { name: "MBA Business Administration", code: "MBA-BA", version: "2024.0", accreditationStatus: "pending", durationYears: 2, credits: 120, faculty: "Business", description: "Executive MBA with focus on strategy and leadership." },
  p4: { name: "LLB Law", code: "LLB", version: "2022.1", accreditationStatus: "expired", durationYears: 4, credits: 240, faculty: "Law", description: "Qualifying law degree for professional practice." },
  p5: { name: "BEng Electrical Engineering", code: "BENG-EE", version: "2023.1", accreditationStatus: "accredited", durationYears: 4, credits: 248, faculty: "Engineering", description: "Accredited engineering degree with design project." },
};

const STATUS_STYLES: Record<string, string> = {
  accredited: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  expired: "bg-rose-100 text-rose-800",
};

export default function ProgramDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const program = id ? MOCK_PROGRAMS[id] : null;

  if (!program) {
    return (
      <div className="space-y-6">
        <Link href="/academic/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Programs
        </Link>
        <p className="text-slate-600">Program not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Programs
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{program.name}</h1>
          <p className="mt-0.5 text-sm text-slate-600">{program.code} · Version {program.version}</p>
        </div>
        <Link
          href={`/academic/programs/${id}/structure`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          Edit Structure
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Overview</h2>
        <p className="mt-2 text-slate-700">{program.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Duration</dt>
            <dd className="mt-0.5 text-lg font-semibold text-slate-900">{program.durationYears} years</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Total credits</dt>
            <dd className="mt-0.5 text-lg font-semibold text-slate-900">{program.credits}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Faculty</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{program.faculty}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Accreditation</dt>
            <dd>
              <span className={cn("mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[program.accreditationStatus] ?? "bg-slate-100 text-slate-800")}>
                {program.accreditationStatus}
              </span>
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
