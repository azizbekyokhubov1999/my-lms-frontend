"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

type Step = 1 | 2 | 3 | 4;

const MOCK_TEACHERS = [
  "Dr. Nina Kozlova – Software Engineering",
  "Prof. Timur Akhmetov – Corporate Finance",
  "Dr. Aigerim Sadykova – Constitutional Law",
];

const MOCK_PROGRAMS = [
  { id: "p1", label: "BSc Software Development" },
  { id: "p2", label: "BSc Computer Science" },
  { id: "p3", label: "MBA Business Administration" },
];

const MOCK_COURSES = [
  { id: "c1", label: "CS101 – Introduction to Programming" },
  { id: "c2", label: "SE301 – Software Architecture" },
  { id: "c3", label: "FIN201 – Corporate Finance" },
];

const MOCK_GROUPS = ["ENG-3A", "ENG-3B", "BUS-2B", "LAW-1C"];

export default function CreateAssignmentPage() {
  const [step, setStep] = React.useState<Step>(1);
  const [teacherSearch, setTeacherSearch] = React.useState("");
  const [selectedTeacher, setSelectedTeacher] = React.useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = React.useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<string | null>(null);
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [role, setRole] = React.useState<"Lead" | "Assistant">("Lead");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const filteredTeachers = React.useMemo(() => {
    const q = teacherSearch.trim().toLowerCase();
    if (!q) return MOCK_TEACHERS;
    return MOCK_TEACHERS.filter((t) => t.toLowerCase().includes(q));
  }, [teacherSearch]);

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );
  };

  const canNextFromStep1 = Boolean(selectedTeacher);
  const canNextFromStep2 = Boolean(selectedProgram && selectedCourse);
  const canNextFromStep3 = selectedGroups.length > 0;
  const canSubmit = Boolean(startDate && endDate && role && canNextFromStep1 && canNextFromStep2 && canNextFromStep3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link
            href="/resources/assignments"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Assignments
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Create assignment
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Multi-step workflow to link a teacher with program, course, and student group.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Step {step} of 4
        </span>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Teacher */}
          {step === 1 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Step 1 · Select teacher
              </h2>
              <Input
                label="Search teacher"
                placeholder="Start typing name or subject…"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
              />
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 text-sm">
                {filteredTeachers.length === 0 ? (
                  <li className="px-2 py-2 text-slate-500">
                    No teachers match your search.
                  </li>
                ) : (
                  filteredTeachers.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => setSelectedTeacher(t)}
                        className={
                          "flex w-full items-center justify-between rounded-md px-2 py-2 text-left " +
                          (selectedTeacher === t
                            ? "bg-teal-600 text-white"
                            : "hover:bg-slate-50")
                        }
                      >
                        <span className={selectedTeacher === t ? "font-semibold" : ""}>{t}</span>
                        {selectedTeacher === t && (
                          <span className="text-xs font-semibold opacity-90">
                            Selected
                          </span>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </section>
          )}

          {/* Step 2: Program & Course */}
          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Step 2 · Select program &amp; course
              </h2>
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Program (synced from Academic)
                </label>
                <select
                  value={selectedProgram ?? ""}
                  onChange={(e) => setSelectedProgram(e.target.value || null)}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Select program…</option>
                  {MOCK_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Course (synced from Academic)
                </label>
                <select
                  value={selectedCourse ?? ""}
                  onChange={(e) => setSelectedCourse(e.target.value || null)}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Select course…</option>
                  {MOCK_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          )}

          {/* Step 3: Groups */}
          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Step 3 · Select student group(s)
              </h2>
              <p className="text-xs text-slate-600">
                You can assign multiple groups for the same course (e.g. parallel streams).
              </p>
              <div className="flex flex-wrap gap-2">
                {MOCK_GROUPS.map((g) => {
                  const active = selectedGroups.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGroup(g)}
                      className={
                        "rounded-full border px-3 py-1 text-xs font-medium " +
                        (active
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                      }
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Step 4: Dates & role */}
          {step === 4 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Step 4 · Dates &amp; role
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  label="End date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Teaching role
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("Lead")}
                    className={
                      "rounded-md border px-3 py-1.5 text-xs font-medium " +
                      (role === "Lead"
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                    }
                  >
                    Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Assistant")}
                    className={
                      "rounded-md border px-3 py-1.5 text-xs font-medium " +
                      (role === "Assistant"
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
                    }
                  >
                    Assistant
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4">
            <div className="text-xs text-slate-500">
              {selectedTeacher && <div>Teacher: {selectedTeacher}</div>}
              {selectedProgram && <div>Program: {selectedProgram}</div>}
              {selectedCourse && <div>Course: {selectedCourse}</div>}
              {selectedGroups.length > 0 && (
                <div>Groups: {selectedGroups.join(", ")}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={step === 1}
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              >
                Back
              </Button>
              {step < 4 && (
                <Button
                  type="button"
                  className="bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700"
                  disabled={
                    (step === 1 && !canNextFromStep1) ||
                    (step === 2 && !canNextFromStep2) ||
                    (step === 3 && !canNextFromStep3)
                  }
                  onClick={() => setStep((s) => ((s + 1) as Step))}
                >
                  Next
                </Button>
              )}
              {step === 4 && (
                <Button
                  type="submit"
                  className="bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700"
                  disabled={!canSubmit || saving}
                >
                  {saving ? "Saving…" : saved ? "Saved (Demo)" : "Create assignment"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

