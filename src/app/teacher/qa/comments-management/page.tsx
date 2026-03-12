"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface QaComment {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  comment: string;
  source: string;
  sourceRef?: string;
  createdAt: string;
  pinned: boolean;
  escalated: boolean;
}

const COMMENTS: QaComment[] = [
  { id: "c1", courseId: "1", courseName: "CS 440", studentName: "Alex J.", comment: "The cross-validation example at 12:34 really helped—thanks!", source: "Lecture 3", sourceRef: "12:34", createdAt: "Mar 6, 2026", pinned: true, escalated: false },
  { id: "c2", courseId: "1", courseName: "CS 440", studentName: "Jordan L.", comment: "Can we use sklearn for Assignment 2, or must we implement from scratch?", source: "Assignment 2", createdAt: "Mar 6, 2026", pinned: false, escalated: true },
  { id: "c3", courseId: "2", courseName: "CS 210", studentName: "Sam C.", comment: "Graph traversal explanation was unclear. Can we review in office hours?", source: "Lecture 5", sourceRef: "Lecture 5", createdAt: "Mar 6, 2026", pinned: false, escalated: false },
  { id: "c4", courseId: "2", courseName: "CS 210", studentName: "Riley D.", comment: "Spam message—please ignore", source: "Lecture 4", createdAt: "Mar 5, 2026", pinned: false, escalated: false },
  { id: "c5", courseId: "3", courseName: "RES 301", studentName: "Morgan K.", comment: "APA 7 vs MLA for literature review—which should we use?", source: "Syllabus", createdAt: "Mar 5, 2026", pinned: false, escalated: true },
  { id: "c6", courseId: "1", courseName: "CS 440", studentName: "Casey B.", comment: "Great clarification on regularization—L1 vs L2 made sense after this.", source: "Lecture 2", sourceRef: "45:00", createdAt: "Mar 4, 2026", pinned: true, escalated: false },
];

export default function CommentsManagementPage() {
  const [comments, setComments] = React.useState<QaComment[]>(COMMENTS);
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [showPinnedOnly, setShowPinnedOnly] = React.useState(false);

  const filtered = comments.filter((c) => {
    if (courseFilter !== "all" && c.courseId !== courseFilter) return false;
    if (showPinnedOnly && !c.pinned) return false;
    return true;
  });

  const handlePin = (id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  };

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEscalate = (id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, escalated: true } : c)));
  };

  const courses = [
    { id: "all", name: "All courses" },
    { id: "1", name: "CS 440 - Machine Learning" },
    { id: "2", name: "CS 210 - Data Structures" },
    { id: "3", name: "RES 301 - Research Methods" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/qa" className="text-xs font-medium text-teal-600 hover:underline">
          ← Q&A Hub
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Comments management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Unified feed of all comments. Pin helpful ones, delete inappropriate, or escalate to Q&A thread.
        </p>
      </section>

      {/* Filters */}
      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="course-filter" className="block text-xs font-medium text-slate-600">Course</label>
            <select
              id="course-filter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="pinned-only"
              type="checkbox"
              checked={showPinnedOnly}
              onChange={(e) => setShowPinnedOnly(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="pinned-only" className="text-sm text-slate-700">Pinned only</label>
          </div>
          <div className="pt-6">
            <Link href="/teacher/qa">
              <span className="text-sm font-medium text-teal-600 hover:underline">View Q&A threads →</span>
            </Link>
          </div>
        </div>
      </Card>

      {/* Unified feed */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Unified feed</h2>
          <p className="text-xs text-slate-500">{filtered.length} comment{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <ul className="divide-y divide-slate-200">
          {filtered.length === 0 ? (
            <li className="px-4 py-12 text-center text-sm text-slate-500">
              No comments match your filters.
            </li>
          ) : (
            filtered.map((comment) => (
              <li
                key={comment.id}
                className={cn(
                  "px-4 py-4 transition-colors hover:bg-slate-50/50",
                  comment.pinned && "bg-amber-50/50",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {comment.pinned && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                          📌 Pinned
                        </span>
                      )}
                      {comment.escalated && (
                        <span className="inline-flex items-center gap-1 rounded bg-teal-100 px-1.5 py-0.5 text-xs font-semibold text-teal-800">
                          Q&A thread
                        </span>
                      )}
                      <span className="text-xs text-slate-500">{comment.courseName}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-slate-500">{comment.source}</span>
                      {comment.sourceRef && (
                        <span className="text-xs text-slate-400">({comment.sourceRef})</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">{comment.comment}</p>
                    <p className="mt-1 text-xs text-slate-500">{comment.studentName} · {comment.createdAt}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePin(comment.id)}
                      className={cn(
                        "rounded px-2 py-1.5 text-xs font-medium transition-colors",
                        comment.pinned
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                      )}
                      title={comment.pinned ? "Unpin" : "Pin helpful"}
                    >
                      {comment.pinned ? "Unpin" : "Pin"}
                    </button>
                    {!comment.escalated && (
                      <button
                        type="button"
                        onClick={() => handleEscalate(comment.id)}
                        className="rounded bg-teal-100 px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-200"
                        title="Escalate to Q&A thread"
                      >
                        Escalate
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                      title="Delete inappropriate"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
