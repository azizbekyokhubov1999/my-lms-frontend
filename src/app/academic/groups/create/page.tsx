"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const MOCK_PROGRAMS = [
  { id: "p1", name: "BSc Software Development" },
  { id: "p2", name: "BSc Computer Science" },
  { id: "p3", name: "MBA Business Administration" },
  { id: "p4", name: "LLB Law" },
];

const MOCK_TUTORS = [
  { id: "t1", name: "Dr. Olga Sokolova" },
  { id: "t2", name: "Prof. Alexei Petrov" },
  { id: "t3", name: "Dr. Nina Kozlova" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = React.useState("");
  const [programId, setProgramId] = React.useState("");
  const [cohortYear, setCohortYear] = React.useState("");
  const [tutorId, setTutorId] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const program = MOCK_PROGRAMS.find((p) => p.id === programId);
    const tutor = MOCK_TUTORS.find((t) => t.id === tutorId);
    alert(`Group "${groupName}" created (Demo). Program: ${program?.name ?? "—"}, Tutor: ${tutor?.name ?? "—"}.`);
    router.push("/academic/groups");
  };

  const isValid = groupName.trim() && programId && cohortYear.trim();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/groups" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Groups
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create Group</h1>
        <p className="mt-0.5 text-sm text-slate-600">Define a new group, select program, and assign a group tutor/mentor.</p>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g. SD-24-03"
            required
            className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
          <div>
            <label className="block text-sm font-medium text-slate-800">Program</label>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option value="">— Select program —</option>
              {MOCK_PROGRAMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Cohort year"
            type="number"
            min={2020}
            max={2030}
            value={cohortYear}
            onChange={(e) => setCohortYear(e.target.value)}
            placeholder="e.g. 2024"
            required
            className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />
          <div>
            <label className="block text-sm font-medium text-slate-800">Group tutor / mentor</label>
            <select
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option value="">— Optional —</option>
              {MOCK_TUTORS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="mt-0.5 text-xs text-slate-500">Assign a tutor or mentor responsible for this group.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/academic/groups">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
              disabled={!isValid}
            >
              Create Group
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
