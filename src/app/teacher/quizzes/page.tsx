"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function TeacherQuizzesPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Quizzes
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage quizzes. Use the assessment builder for auto-graded questions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/quizzes/grade">
            <Button type="button" variant="secondary" size="sm">
              Grade submissions
            </Button>
          </Link>
          <Link href="/teacher/quizzes/create">
            <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
              Create quiz
            </Button>
          </Link>
        </div>
      </section>

      <Card className="rounded-lg border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-600">Your quizzes will appear here.</p>
        <Link href="/teacher/quizzes/create">
          <Button type="button" variant="secondary" size="sm" className="mt-3">
            Create your first quiz
          </Button>
        </Link>
      </Card>
    </div>
  );
}
