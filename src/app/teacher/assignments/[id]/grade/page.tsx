"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface RubricCriterion {
  id: string;
  name: string;
  points: number;
}

interface Rubric {
  id: string;
  title: string;
  criteria: RubricCriterion[];
}

const STORAGE_KEY_RUBRICS = "teacher-rubrics";
const STORAGE_KEY_GRADES = "teacher-grades";

function loadRubrics(): Rubric[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RUBRICS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGrade(courseId: string, studentId: string, assignmentId: string, score: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GRADES);
    const data = raw ? JSON.parse(raw) : {};
    const key = `${courseId}-${studentId}-${assignmentId}`;
    data[key] = score;
    localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(data));
  } catch {}
}

const SUBMISSIONS: Record<string, {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assignmentId: string;
  assignmentTitle: string;
  submissionDate: string;
  type: "pdf" | "text";
  fileName?: string;
  textContent?: string;
}> = {
  s1: { studentId: "st1", studentName: "Alex Johnson", courseId: "1", courseName: "CS 440", assignmentId: "a1", assignmentTitle: "Assignment 1: Linear Regression", submissionDate: "Mar 5, 2026", type: "pdf", fileName: "linear_regression_report.pdf" },
  s2: { studentId: "st2", studentName: "Jordan Lee", courseId: "1", courseName: "CS 440", assignmentId: "a2", assignmentTitle: "Assignment 2: Classification", submissionDate: "Mar 6, 2026", type: "pdf", fileName: "classification.ipynb.pdf" },
  s3: { studentId: "st3", studentName: "Sam Chen", courseId: "2", courseName: "CS 210", assignmentId: "a1", assignmentTitle: "Trees and Graphs Problem Set", submissionDate: "Mar 4, 2026", type: "text", textContent: "I implemented the BFS and DFS algorithms as required. For BFS I used a queue and visited nodes level by level. For DFS I used recursion with a visited set. The time complexity is O(V+E) for both." },
  s4: { studentId: "st4", studentName: "Riley Davis", courseId: "1", courseName: "CS 440", assignmentId: "a1", assignmentTitle: "Assignment 1: Linear Regression", submissionDate: "Mar 6, 2026", type: "text", textContent: "My approach to linear regression: I used sklearn's LinearRegression. I split the data 80/20 and achieved an R² of 0.85 on the test set. The main challenge was handling missing values." },
  s5: { studentId: "st5", studentName: "Morgan Kim", courseId: "3", courseName: "RES 301", assignmentId: "a1", assignmentTitle: "Literature Review Draft", submissionDate: "Mar 3, 2026", type: "pdf", fileName: "lit_review_draft.pdf" },
};

const DEFAULT_RUBRIC: Rubric = {
  id: "default",
  title: "Research Paper Rubric",
  criteria: [
    { id: "c1", name: "Clarity", points: 10 },
    { id: "c2", name: "Accuracy", points: 15 },
    { id: "c3", name: "Analysis", points: 15 },
    { id: "c4", name: "Structure", points: 10 },
  ],
};

export default function AssignmentGradePage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const submission = SUBMISSIONS[id];

  const [rubrics, setRubrics] = React.useState<Rubric[]>([]);
  const [selectedRubric, setSelectedRubric] = React.useState<Rubric | null>(null);
  const [criterionScores, setCriterionScores] = React.useState<Record<string, number>>({});
  const [feedback, setFeedback] = React.useState("");
  const [posted, setPosted] = React.useState(false);

  React.useEffect(() => {
    const loaded = loadRubrics();
    setRubrics(loaded);
    if (loaded.length > 0 && !selectedRubric) {
      setSelectedRubric(loaded[0]);
      const init: Record<string, number> = {};
      loaded[0].criteria.forEach((c) => { init[c.id] = 0; });
      setCriterionScores(init);
    } else if (loaded.length === 0) {
      setSelectedRubric(DEFAULT_RUBRIC);
      const init: Record<string, number> = {};
      DEFAULT_RUBRIC.criteria.forEach((c) => { init[c.id] = 0; });
      setCriterionScores(init);
    }
  }, []);

  React.useEffect(() => {
    if (selectedRubric) {
      setCriterionScores((prev) => {
        const next = { ...prev };
        selectedRubric.criteria.forEach((c) => {
          if (next[c.id] === undefined) next[c.id] = 0;
        });
        return next;
      });
    }
  }, [selectedRubric]);

  const totalPossible = selectedRubric
    ? selectedRubric.criteria.reduce((s, c) => s + c.points, 0)
    : 0;
  const totalEarned = selectedRubric
    ? selectedRubric.criteria.reduce((s, c) => s + (criterionScores[c.id] ?? 0), 0)
    : 0;
  const scorePct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  const setCriterionScore = (criterionId: string, maxPoints: number) => {
    const current = criterionScores[criterionId] ?? 0;
    const next = current >= maxPoints ? 0 : Math.min(current + 1, maxPoints);
    setCriterionScores((prev) => ({ ...prev, [criterionId]: next }));
  };

  const updateCriterionScore = (criterionId: string, maxPoints: number, value: string) => {
    const n = parseInt(value, 10);
    const next = isNaN(n) ? 0 : Math.min(maxPoints, Math.max(0, n));
    setCriterionScores((prev) => ({ ...prev, [criterionId]: next }));
  };

  const handleGradeAndPost = () => {
    if (!submission) return;
    saveGrade(submission.courseId, submission.studentId, submission.assignmentId, scorePct);
    setPosted(true);
  };

  if (!submission) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/assignments" className="text-xs font-medium text-teal-600 hover:underline">
          ← Assignments
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Submission not found.</p>
          <Link href="/teacher/assignments">
            <Button type="button" variant="secondary" size="sm" className="mt-3">
              Back to Assignments
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/assignments" className="text-xs font-medium text-teal-600 hover:underline">
          ← Assignments
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Grade: {submission.assignmentTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {submission.studentName} · {submission.courseName} · {submission.submissionDate}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Submission viewer */}
        <div className="space-y-4">
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Submission</h3>
            {submission.type === "pdf" ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex h-[480px] items-center justify-center p-8">
                  <div className="text-center">
                    <p className="text-4xl text-slate-300">📄</p>
                    <p className="mt-2 text-sm font-medium text-slate-600">{submission.fileName}</p>
                    <p className="mt-1 text-xs text-slate-500">PDF preview would render here</p>
                    <p className="mt-4 text-xs text-slate-400">In production: embed PDF viewer or open in new tab</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="max-h-[400px] overflow-y-auto p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
                    {submission.textContent}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* Feedback box */}
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Feedback</h3>
            <p className="mt-0.5 text-xs text-slate-500">Comments for the student</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Add your feedback... You can describe strengths, areas for improvement, and resources to review."
              rows={6}
              className="mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </Card>
        </div>

        {/* Grading rubric sidebar */}
        <aside className="space-y-4">
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Grading rubric</h3>
            <p className="mt-0.5 text-xs text-slate-500">Click a criterion to assign points</p>
            {rubrics.length > 0 && (
              <select
                value={selectedRubric?.id ?? ""}
                onChange={(e) => {
                  const r = rubrics.find((x) => x.id === e.target.value);
                  if (r) setSelectedRubric(r);
                }}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {rubrics.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            )}
            {selectedRubric && (
              <ul className="mt-4 space-y-3">
                {selectedRubric.criteria.map((c) => {
                  const earned = criterionScores[c.id] ?? 0;
                  return (
                    <li key={c.id}>
                      <div
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 transition-colors",
                          earned > 0 ? "border-teal-300 bg-teal-50/50" : "border-slate-200",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setCriterionScore(c.id, c.points)}
                          className="flex-1 text-left text-sm font-medium text-slate-900"
                        >
                          {c.name}
                        </button>
                        <input
                          type="number"
                          min={0}
                          max={c.points}
                          value={earned}
                          onChange={(e) => updateCriterionScore(c.id, c.points, e.target.value)}
                          className="w-14 rounded border border-slate-300 px-2 py-1 text-center text-sm"
                        />
                        <span className="text-xs text-slate-500">/ {c.points}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">Click name or enter points</p>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-teal-700">{totalEarned} / {totalPossible}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{scorePct}%</p>
            </div>
          </Card>

          <Card className="rounded-lg border-teal-200 bg-teal-50/30 p-4">
            <Button
              type="button"
              variant="primary"
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={handleGradeAndPost}
              disabled={posted}
            >
              {posted ? "Grade posted ✓" : "Grade & Post"}
            </Button>
            <p className="mt-2 text-xs text-slate-600">
              {posted
                ? "Grade has been saved and will appear in the gradebook."
                : "Post grade to update the student's gradebook immediately."}
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
