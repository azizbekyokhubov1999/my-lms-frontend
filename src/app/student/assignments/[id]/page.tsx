"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AssignmentDetail {
  id: string;
  subject: string;
  title: string;
  deadline: string;
  status: "active" | "submitted" | "graded";
  description: string;
  resources: { id: string; name: string; size?: string; url: string }[];
  submittedAt?: string;
  submissionComment?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

const MOCK_ASSIGNMENTS: Record<string, AssignmentDetail> = {
  "1": {
    id: "1",
    subject: "Distributed Systems",
    title: "Assignment 2: System design reflection",
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "active",
    description: `Write a short design brief (500–800 words) describing how you would design an admissions and exam module for a global university-scale LMS.

Your reflection should cover:
• Identity and access (applicants, students, staff)
• Document upload and verification flow
• Exam scheduling and proctoring considerations
• Integration with external systems (e.g. 1C, Teams)

Use clear section headings and cite at least one reading from the course. Submit as a single PDF.`,
    resources: [
      { id: "r1", name: "Assignment rubric (PDF)", size: "0.2 MB", url: "#" },
      { id: "r2", name: "Lecture 3 slides", size: "2.1 MB", url: "#" },
    ],
  },
  "2": {
    id: "2",
    subject: "Algorithms",
    title: "Problem set 3: Graph algorithms",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "active",
    description: `Complete exercises 1–5 from Chapter 7 (Graphs). Show your work and runtime analysis where requested. Submit a single PDF.`,
    resources: [
      { id: "r1", name: "Problem set (PDF)", size: "0.3 MB", url: "#" },
    ],
  },
  "3": {
    id: "3",
    subject: "Research Methods",
    title: "Essay draft: Literature review",
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "submitted",
    description: `Submit a draft of your literature review section (800–1000 words). Include at least 5 peer-reviewed sources.`,
    resources: [
      { id: "r1", name: "Citation guide", size: "0.5 MB", url: "#" },
    ],
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submissionComment: "Draft attached. Will expand methodology in final version.",
  },
  "4": {
    id: "4",
    subject: "Distributed Systems",
    title: "Assignment 1: Architecture diagram",
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "graded",
    description: `Draw an architecture diagram for a hypothetical LMS supporting 10,000 concurrent users. Annotate components and data flows.`,
    resources: [
      { id: "r1", name: "Template and rubric", size: "0.4 MB", url: "#" },
    ],
    submittedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    submissionComment: "Please see diagram and one-page explanation.",
    score: 28,
    maxScore: 30,
    feedback: `Strong work on the component breakdown and scalability considerations. Your use of a load balancer and separate services for auth and content is appropriate. Minor deduction for the missing legend on the diagram—please include one in future submissions.`,
  },
  "5": {
    id: "5",
    subject: "Algorithms",
    title: "Problem set 2: Dynamic programming",
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "graded",
    description: `Complete the dynamic programming problems from the handout.`,
    resources: [],
    score: 22,
    maxScore: 25,
    feedback: `Good solutions overall. Problem 4 needed a clearer recurrence; see solution key for the intended approach.`,
  },
};

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const assignment = id ? MOCK_ASSIGNMENTS[id] : null;

  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [comment, setComment] = React.useState("");
  const [submitted, setSubmitted] = React.useState(assignment?.status !== "active");

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const list = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...list]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...list]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!assignment) {
    return (
      <div className="space-y-4">
        <Link href="/student/assignments" className="text-sm font-medium text-sky-600 hover:text-sky-700">
          ← Assignments
        </Link>
        <Card className="py-12 text-center text-slate-600">
          Assignment not found.
        </Card>
      </div>
    );
  }

  const canSubmit = assignment.status === "active" && !submitted;
  const showFeedback = assignment.status === "graded" || (assignment.feedback && assignment.score != null);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/student/assignments"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← Assignments
        </Link>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          {assignment.subject}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {assignment.title}
        </h1>
        <span
          className={cn(
            "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
            assignment.status === "active" && "bg-amber-100 text-amber-800",
            assignment.status === "submitted" && "bg-slate-100 text-slate-700",
            assignment.status === "graded" && "bg-emerald-100 text-emerald-800",
          )}
        >
          {assignment.status === "active" && "Active"}
          {assignment.status === "submitted" && "Submitted"}
          {assignment.status === "graded" && "Graded"}
        </span>
      </div>

      {/* Description */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
          {assignment.description}
        </p>
      </Card>

      {/* Resources */}
      {assignment.resources.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Resources</h2>
          <p className="mt-1 text-xs text-slate-500">
            Downloadable files from your teacher
          </p>
          <ul className="mt-3 space-y-2">
            {assignment.resources.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-2.5"
              >
                <span className="text-sm font-medium text-slate-900">{r.name}</span>
                <a
                  href={r.url}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Submission area */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Submission</h2>
        {canSubmit ? (
          <>
            <div
              className={cn(
                "mt-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
                dragOver ? "border-sky-500 bg-sky-50/50" : "border-slate-200 bg-slate-50/30",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                Drag and drop files here, or click to browse
              </label>
            </div>
            {files.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="truncate text-slate-800">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-slate-500 hover:text-red-600"
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <label htmlFor="comment" className="block text-xs font-medium text-slate-700">
                Comments (optional)
              </label>
              <textarea
                id="comment"
                rows={4}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Add any comments for your teacher..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Submit assignment
              </button>
            </div>
          </>
        ) : (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
            {assignment.submittedAt
              ? `Submitted on ${new Date(assignment.submittedAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : submitted
                ? "Submission recorded."
                : "You have not submitted yet."}
            {(assignment.submissionComment || (submitted && comment)) && (
              <>
                <p className="mt-2 font-medium text-slate-700">Your comment:</p>
                <p className="mt-0.5 text-slate-600">
                  {assignment.submissionComment || comment}
                </p>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Feedback section (when graded) */}
      {showFeedback && assignment.score != null && assignment.maxScore != null && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <h2 className="text-sm font-semibold text-slate-900">Feedback</h2>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              {assignment.score} / {assignment.maxScore}
            </span>
          </div>
          {assignment.feedback && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-4 text-sm text-slate-700">
              <p className="font-medium text-slate-800">Teacher&apos;s comments</p>
              <p className="mt-1.5 whitespace-pre-wrap">{assignment.feedback}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
