"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

interface StudentNeedingGrade {
  studentId: string;
  studentName: string;
  hasOpenEnded: boolean;
  mcScore: number;
  mcMax: number;
  openEndedPending: number;
}

const EXAM_GRADE_QUEUE: Record<string, StudentNeedingGrade[]> = {
  "5": [
    { studentId: "st3", studentName: "Sam Chen", hasOpenEnded: true, mcScore: 15, mcMax: 15, openEndedPending: 1 },
    { studentId: "st8", studentName: "Jamie Park", hasOpenEnded: true, mcScore: 12, mcMax: 15, openEndedPending: 1 },
    { studentId: "st7", studentName: "Taylor Wong", hasOpenEnded: true, mcScore: 15, mcMax: 15, openEndedPending: 1 },
    { studentId: "st6", studentName: "Casey Brown", hasOpenEnded: true, mcScore: 10, mcMax: 15, openEndedPending: 1 },
  ],
};

const EXAM_NAMES: Record<string, string> = {
  "5": "Data Structures Midterm",
};

export default function ExamGradeQueuePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const students = EXAM_GRADE_QUEUE[id] ?? [];
  const examName = EXAM_NAMES[id] ?? "Exam";

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/exams" className="text-xs font-medium text-teal-600 hover:underline">
          ← Exams
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Grade: {examName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Students with open-ended questions need manual grading. View responses alongside proctoring flags.
        </p>
      </section>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">MC score</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Open-ended pending</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    No students needing manual grading.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{s.mcScore} / {s.mcMax}</td>
                    <td className="px-4 py-3 text-slate-600">{s.openEndedPending} question{s.openEndedPending !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/teacher/exams/${id}/grade/${s.studentId}`}>
                        <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                          Grade open-ended
                        </Button>
                      </Link>
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
