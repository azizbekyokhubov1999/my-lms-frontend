"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ThreadStatus = "Unanswered" | "Answered" | "Flagged";

interface QaThread {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  question: string;
  status: ThreadStatus;
  createdAt: string;
  lectureRef?: string;
}

const COURSES = [
  { id: "all", name: "All courses" },
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

const THREADS: QaThread[] = [
  { id: "q1", courseId: "1", courseName: "CS 440", studentName: "Alex J.", question: "Can we use sklearn for Assignment 2, or must we implement from scratch?", status: "Unanswered", createdAt: "Mar 6, 2026" },
  { id: "q2", courseId: "1", courseName: "CS 440", studentName: "Jordan L.", question: "At 12:34 in Lecture 3, you mentioned cross-validation—could you clarify the k-fold vs leave-one-out difference?", status: "Answered", createdAt: "Mar 5, 2026", lectureRef: "L3 @ 12:34" },
  { id: "q3", courseId: "2", courseName: "CS 210", studentName: "Sam C.", question: "Is the graph traversal quiz deadline extended?", status: "Flagged", createdAt: "Mar 6, 2026" },
  { id: "q4", courseId: "2", courseName: "CS 210", studentName: "Riley D.", question: "Could you share the slides from today's Trees lecture?", status: "Unanswered", createdAt: "Mar 6, 2026" },
  { id: "q5", courseId: "3", courseName: "RES 301", studentName: "Morgan K.", question: "Which citation style for the literature review—APA 7 or MLA?", status: "Answered", createdAt: "Mar 4, 2026" },
];

export default function TeacherQaHubPage() {
  const [statusFilter, setStatusFilter] = React.useState<ThreadStatus | "all">("Unanswered");
  const [courseFilter, setCourseFilter] = React.useState("all");
  const [expandedId, setExpandedId] = React.useState<string | null>("q1");
  const [replyText, setReplyText] = React.useState("");
  const [replyLectureRef, setReplyLectureRef] = React.useState("");
  const [repliedIds, setRepliedIds] = React.useState<Set<string>>(new Set(["q2", "q5"]));

  const getStatus = (t: QaThread) => (repliedIds.has(t.id) ? "Answered" as ThreadStatus : t.status);

  const filteredThreads = THREADS.filter((t) => {
    const matchStatus = statusFilter === "all" || getStatus(t) === statusFilter;
    const matchCourse = courseFilter === "all" || t.courseId === courseFilter;
    return matchStatus && matchCourse;
  });

  const handleSubmitReply = (threadId: string) => {
    setRepliedIds((prev) => new Set(prev).add(threadId));
    setReplyText("");
    setReplyLectureRef("");
    setExpandedId(null);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Q&A Hub
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Student questions by course. Quick reply, attach files, or link to lecture timestamps.
          </p>
        </div>
        <Link href="/teacher/qa/comments-management">
          <Button type="button" variant="secondary" size="sm">
            Comments management
          </Button>
        </Link>
      </section>

      {/* Filters */}
      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-xs font-medium text-slate-600">Status</label>
            <div className="mt-1 flex gap-2">
              {(["Unanswered", "Answered", "Flagged"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold",
                    statusFilter === s
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="course-filter" className="block text-xs font-medium text-slate-600">Course</label>
            <select
              id="course-filter"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Thread list */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <ul className="divide-y divide-slate-200">
          {filteredThreads.length === 0 ? (
            <li className="px-4 py-12 text-center text-sm text-slate-500">No questions match the filters.</li>
          ) : (
            filteredThreads.map((thread) => {
              const isExpanded = expandedId === thread.id;
              return (
                <li key={thread.id}>
                  <div
                    className="flex cursor-pointer flex-wrap items-start justify-between gap-3 px-4 py-3 hover:bg-slate-50/50"
                    onClick={() => {
                      setExpandedId(isExpanded ? null : thread.id);
                      if (!isExpanded) {
                        setReplyText("");
                        setReplyLectureRef("");
                      }
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "inline-flex rounded px-2 py-0.5 text-xs font-semibold",
                          getStatus(thread) === "Unanswered" && "bg-amber-100 text-amber-800",
                          getStatus(thread) === "Answered" && "bg-emerald-100 text-emerald-800",
                          getStatus(thread) === "Flagged" && "bg-red-100 text-red-800",
                        )}
                      >
                        {getStatus(thread)}
                      </span>
                      <span className="ml-2 text-xs text-slate-500">{thread.courseName}</span>
                      <p className="mt-1 font-medium text-slate-900">{thread.question}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {thread.studentName} · {thread.createdAt}
                        {thread.lectureRef && ` · ${thread.lectureRef}`}
                      </p>
                    </div>
                    <span className="text-slate-400">{isExpanded ? "−" : "+"}</span>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-4">
                      <h3 className="text-xs font-semibold text-slate-700">Quick reply</h3>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your answer..."
                        rows={3}
                        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={replyLectureRef}
                          onChange={(e) => setReplyLectureRef(e.target.value)}
                          placeholder="Lecture ref (e.g. L3 @ 12:34)"
                          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          <span>📎</span>
                          Attach file
                          <input type="file" className="hidden" onClick={(e) => e.stopPropagation()} />
                        </label>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubmitReply(thread.id);
                          }}
                          disabled={!replyText.trim()}
                        >
                          Submit reply
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </Card>
    </div>
  );
}
