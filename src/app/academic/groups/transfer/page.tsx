"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface StudentInGroup {
  id: string;
  name: string;
  studentId: string;
  groupId: string;
}

const MOCK_GROUPS = [
  { id: "g1", name: "SD-24-01", program: "BSc Software Development" },
  { id: "g2", name: "SD-24-02", program: "BSc Software Development" },
  { id: "g3", name: "CS-23-01", program: "BSc Computer Science" },
];

const MOCK_STUDENTS: StudentInGroup[] = [
  { id: "s1", name: "Anna Petrova", studentId: "STU-10001", groupId: "g1" },
  { id: "s2", name: "Ivan Kozlov", studentId: "STU-10002", groupId: "g1" },
  { id: "s3", name: "Maria Sokolova", studentId: "STU-10003", groupId: "g1" },
  { id: "s4", name: "Dmitri Volkov", studentId: "STU-10004", groupId: "g1" },
  { id: "s5", name: "Elena Novikova", studentId: "STU-10005", groupId: "g2" },
];

export default function GroupTransferPage() {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState("");
  const [fromGroupId, setFromGroupId] = React.useState("");
  const [toGroupId, setToGroupId] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [confirmText, setConfirmText] = React.useState("");
  const [step, setStep] = React.useState<"form" | "confirm">("form");

  const student = studentId ? MOCK_STUDENTS.find((s) => s.id === studentId) : null;
  const fromGroup = fromGroupId ? MOCK_GROUPS.find((g) => g.id === fromGroupId) : null;
  const toGroup = toGroupId ? MOCK_GROUPS.find((g) => g.id === toGroupId) : null;

  const studentsInFromGroup = fromGroupId ? MOCK_STUDENTS.filter((s) => s.groupId === fromGroupId) : [];
  const targetGroups = MOCK_GROUPS.filter((g) => g.id !== fromGroupId);

  const isValidForm = studentId && fromGroupId && toGroupId && reason.trim().length >= 10;
  const confirmExpected = student ? `TRANSFER ${student.studentId}` : "";
  const canConfirm = step === "confirm" && confirmText.trim().toUpperCase() === confirmExpected;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "form" && isValidForm) {
      setStep("confirm");
      setConfirmText("");
    } else if (step === "confirm" && canConfirm) {
      alert(`Transfer recorded (Demo): ${student?.name} from ${fromGroup?.name} to ${toGroup?.name}. Reason: ${reason}`);
      router.push("/academic/groups");
    }
  };

  const handleBack = () => {
    if (step === "confirm") setStep("form");
    else router.push("/academic/groups");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/groups" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Groups
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Group Transfer</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Move a student from one group to another. Requires a reason for the audit trail. Confirm carefully to avoid accidental moves.
        </p>
      </div>

      <Card className={cn("max-w-2xl border-2", step === "confirm" ? "border-amber-300 bg-amber-50/30" : "border-slate-200")}>
        {step === "confirm" && (
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-100/80 p-4">
            <p className="font-semibold text-amber-900">Confirm transfer</p>
            <p className="mt-1 text-sm text-amber-800">
              You are about to move <strong>{student?.name}</strong> ({student?.studentId}) from <strong>{fromGroup?.name}</strong> to <strong>{toGroup?.name}</strong>. This action will be recorded with your reason.
            </p>
            <p className="mt-2 text-sm font-medium text-amber-900">Type <code className="rounded bg-amber-200 px-1 font-mono">{confirmExpected}</code> below to confirm.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "form" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-800">Current group (From)</label>
                <select
                  value={fromGroupId}
                  onChange={(e) => {
                    const next = e.target.value;
                    setFromGroupId(next);
                    setStudentId("");
                    if (toGroupId === next) setToGroupId("");
                  }}
                  required
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">— Select current group —</option>
                  {MOCK_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.program})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  disabled={!fromGroupId}
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="">— Select student —</option>
                  {studentsInFromGroup.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">Target group (To)</label>
                <select
                  value={toGroupId}
                  onChange={(e) => setToGroupId(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  <option value="">— Select target group —</option>
                  {targetGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.program})
                    </option>
                  ))}
                </select>
                {fromGroupId && toGroupId && fromGroupId === toGroupId && (
                  <p className="mt-1 text-xs text-rose-600">From and To must be different.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800">Reason for transfer <span className="text-rose-600">*</span></label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  minLength={10}
                  rows={3}
                  placeholder="e.g. Student requested move due to schedule conflict. Approved by department head on 2026-03-01."
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-0.5 text-xs text-slate-500">Minimum 10 characters. This will be stored for audit.</p>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-800">Confirmation</label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={confirmExpected}
                className="mt-1 block w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 font-mono text-sm uppercase placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={handleBack}>
              {step === "confirm" ? "Back" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
              disabled={(step === "form" && !isValidForm) || (step === "confirm" && !canConfirm) || (fromGroupId === toGroupId && !!toGroupId)}
            >
              {step === "form" ? "Continue to confirm" : "Confirm transfer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
