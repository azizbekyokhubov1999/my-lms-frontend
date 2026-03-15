"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const MOCK_PROFILE = {
  fullName: "Dr. Nina Kozlova",
  employeeId: "ACAD-3012",
  email: "n.kozlova@university.kz",
  phone: "+7 (701) 555-12-34",
  academicDepartment: "Engineering",
  assignedPrograms: ["BSc Software Development", "BSc Computer Science", "BEng Electrical Engineering"],
};

export default function AcademicProfilePage() {
  const [email, setEmail] = React.useState(MOCK_PROFILE.email);
  const [phone, setPhone] = React.useState(MOCK_PROFILE.phone);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = MOCK_PROFILE.fullName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-0.5 text-sm text-slate-600">Personal info, department, and assigned programs.</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 px-6 py-8 sm:flex sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-3xl">
            {initials}
          </div>
          <div className="mt-4 sm:mt-0">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">{MOCK_PROFILE.fullName}</h2>
            <p className="mt-0.5 font-mono text-sm text-purple-100">Employee ID: {MOCK_PROFILE.employeeId}</p>
            <span className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              Academic
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Personal information</h3>
          <p className="mt-0.5 text-xs text-slate-600">Editable contact details.</p>
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
            <button
              type="submit"
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {saved ? "Saved" : "Save changes"}
            </button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Academic department</h3>
          <p className="mt-0.5 text-xs text-slate-600">Your designated department (display only).</p>
          <p className="mt-3 text-lg font-semibold text-purple-800">{MOCK_PROFILE.academicDepartment}</p>
          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Assigned programs</h3>
          <p className="mt-0.5 text-xs text-slate-600">Programs you are responsible for.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {MOCK_PROFILE.assignedPrograms.map((p) => (
              <li
                key={p}
                className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-800"
              >
                {p}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
