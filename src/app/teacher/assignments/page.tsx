"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

interface PendingSubmission {
  id: string;
  studentName: string;
  studentId: string;
  courseId: string;
  courseName: string;
  assignmentTitle: string;
  assignmentId: string;
  submissionDate: string;
}

const PENDING_SUBMISSIONS: PendingSubmission[] = [
  { id: "s1", studentName: "Alex Johnson", studentId: "st1", courseId: "1", courseName: "CS 440 - Machine Learning", assignmentTitle: "Assignment 1: Linear Regression", assignmentId: "a1", submissionDate: "Mar 5, 2026" },
  { id: "s2", studentName: "Jordan Lee", studentId: "st2", courseId: "1", courseName: "CS 440 - Machine Learning", assignmentTitle: "Assignment 2: Classification", assignmentId: "a2", submissionDate: "Mar 6, 2026" },
  { id: "s3", studentName: "Sam Chen", studentId: "st3", courseId: "2", courseName: "CS 210 - Data Structures", assignmentTitle: "Trees and Graphs Problem Set", assignmentId: "a1", submissionDate: "Mar 4, 2026" },
  { id: "s4", studentName: "Riley Davis", studentId: "st4", courseId: "1", courseName: "CS 440 - Machine Learning", assignmentTitle: "Assignment 1: Linear Regression", assignmentId: "a1", submissionDate: "Mar 6, 2026" },
  { id: "s5", studentName: "Morgan Kim", studentId: "st5", courseId: "3", courseName: "RES 301 - Research Methods", assignmentTitle: "Literature Review Draft", assignmentId: "a1", submissionDate: "Mar 3, 2026" },
];

export default function TeacherAssignmentsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Assignments
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Pending submissions across all courses. Grade submissions and provide feedback.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/assignments/create">
            <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
              Create assignment
            </Button>
          </Link>
          <Link href="/teacher/quizzes/create">
            <Button type="button" variant="secondary" size="sm">
              Create quiz
            </Button>
          </Link>
          <Link href="/teacher/assignments/rubrics">
            <Button type="button" variant="secondary" size="sm">
              Rubrics
            </Button>
          </Link>
        </div>
      </section>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Student name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Assignment title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Submission date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {PENDING_SUBMISSIONS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.assignmentTitle}</td>
                  <td className="px-4 py-3 text-slate-600">{row.courseName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.submissionDate}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/teacher/assignments/${row.id}/grade`}>
                      <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Grade Now
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {PENDING_SUBMISSIONS.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-slate-500">
            No pending submissions.
          </div>
        )}
      </Card>
    </div>
  );
}
