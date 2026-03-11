"use client";

import * as React from "react";

import { Button } from "../../../../../components/ui/Button";

type CurriculumItemStatus = "completed" | "current" | "locked";

interface CurriculumItem {
  id: string;
  title: string;
  status: CurriculumItemStatus;
}

type TabKey = "overview" | "resources" | "assignments";

interface Question {
  id: number;
  author: string;
  text: string;
}

interface ChatMessage {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const MOCK_CURRICULUM: CurriculumItem[] = [
  { id: "1", title: "Introduction to the course", status: "completed" },
  { id: "2", title: "Lecture 1: Foundations", status: "completed" },
  { id: "3", title: "Lecture 2: Core concepts", status: "current" },
  { id: "4", title: "Lecture 3: Case studies", status: "locked" },
  { id: "5", title: "Project guidelines", status: "locked" },
];

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    author: "Student A",
    text: "Will the concepts from this lecture appear in the midterm?",
  },
  {
    id: 2,
    author: "Student B",
    text: "Could you clarify the difference between synchronous and asynchronous flows?",
  },
];

const MOCK_CHAT: ChatMessage[] = [
  {
    id: 1,
    author: "Instructor",
    text: "Welcome to the live session. Please post your questions here.",
    timestamp: "09:00",
  },
  {
    id: 2,
    author: "Student C",
    text: "Good morning everyone!",
    timestamp: "09:01",
  },
];

const IS_SYNCHRONOUS = true; // Mock: this lecture has a live Teams session

export default function LecturePage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");
  const [questions, setQuestions] = React.useState<Question[]>(MOCK_QUESTIONS);
  const [chatMessages, setChatMessages] =
    React.useState<ChatMessage[]>(MOCK_CHAT);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newChatMessage, setNewChatMessage] = React.useState("");
  const [attendanceRecorded, setAttendanceRecorded] = React.useState(false);

  // Attendance tracker: mark after 5 minutes on page
  React.useEffect(() => {
    if (attendanceRecorded) return;
    const timeoutId = window.setTimeout(() => {
      setAttendanceRecorded(true);
    }, 5 * 60 * 1000);

    return () => window.clearTimeout(timeoutId);
  }, [attendanceRecorded]);

  const handleSubmitQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newQuestion.trim();
    if (!trimmed) return;
    setQuestions((prev) => [
      ...prev,
      { id: prev.length + 1, author: "You", text: trimmed },
    ]);
    setNewQuestion("");
  };

  const handleSubmitChat = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = newChatMessage.trim();
    if (!trimmed) return;
    const time = new Date();
    const timestamp = `${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: "You", text: trimmed, timestamp },
    ]);
    setNewChatMessage("");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-4 lg:flex-row">
      {/* Left: Curriculum sidebar */}
      <aside className="w-full space-y-3 rounded-lg border border-slate-200 bg-white p-3 text-sm lg:w-64 lg:shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Curriculum
        </h2>
        <ul className="mt-1 space-y-1">
          {MOCK_CURRICULUM.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5",
                item.status === "current" && "bg-blue-50 text-slate-900",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                  item.status === "completed" &&
                    "bg-emerald-50 text-emerald-700 border border-emerald-200",
                  item.status === "current" &&
                    "bg-blue-900 text-white border border-blue-900",
                  item.status === "locked" &&
                    "bg-slate-100 text-slate-400 border border-slate-200",
                )}
                aria-label={
                  item.status === "completed"
                    ? "Completed"
                    : item.status === "current"
                      ? "Current"
                      : "Locked"
                }
              >
                {item.status === "completed"
                  ? "✓"
                  : item.status === "current"
                    ? "▶"
                    : "🔒"}
              </span>
              <span className="truncate text-xs font-medium text-slate-800">
                {item.title}
              </span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Center: Main content */}
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Join Live Teams (if synchronous) */}
        {IS_SYNCHRONOUS && (
          <a
            href="#"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#5059C9] px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#464EB8]"
          >
            <span className="text-lg">▶</span>
            Join live Microsoft Teams session
          </a>
        )}

        {/* Video area */}
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-slate-50 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-300">
            <span className="font-mono text-[11px] uppercase tracking-wide text-emerald-400">
              Live session • Microsoft Teams (placeholder)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              REC
            </span>
          </div>
          <div className="flex h-56 items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-center text-sm text-slate-300 sm:h-72">
            <div className="space-y-2">
              <div className="mx-auto h-10 w-10 rounded-full border border-dashed border-slate-500" />
              <p>Video stream placeholder (Teams / YouTube)</p>
              <p className="text-xs text-slate-400">
                This area will display the live or recorded lecture feed.
              </p>
            </div>
          </div>
        </div>

        {/* Lecture info and actions */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center">
          <div>
            <h1 className="text-base font-semibold text-slate-900">
              Lecture 2: Core concepts in distributed learning
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Instructor: Dr. Alexandra Rivera • Duration: 75 minutes
            </p>
          </div>
          <Button type="button" variant="primary">
            Mark as complete
          </Button>
        </div>

        {/* Tabs */}
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex border-b border-slate-200 text-xs font-medium">
            {[
              { key: "overview", label: "Overview" },
              { key: "resources", label: "Resources" },
              { key: "assignments", label: "Assignments" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={cn(
                  "flex-1 px-4 py-2 text-center",
                  activeTab === tab.key
                    ? "border-b-2 border-blue-900 bg-blue-50 text-blue-900"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 py-3 text-sm">
            {activeTab === "overview" && (
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  In this lecture, we explore the core concepts required to
                  understand large-scale online learning platforms, including
                  scaling strategies, session management, and monitoring.
                </p>
                <p className="text-xs text-slate-500">
                  Learning outcomes: You should be able to describe key
                  trade-offs in distributed architecture and explain how they
                  impact student experience.
                </p>
              </div>
            )}

            {activeTab === "resources" && (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium text-slate-900">
                      Lecture slides (PDF)
                    </p>
                    <p className="text-xs text-slate-500">
                      2.3 MB • Updated Mar 3, 2026
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Download
                  </Button>
                </li>
                <li className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <div>
                    <p className="font-medium text-slate-900">
                      Reading list (PDF)
                    </p>
                    <p className="text-xs text-slate-500">
                      1.1 MB • Updated Feb 28, 2026
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    Download
                  </Button>
                </li>
              </ul>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-2 text-sm text-slate-700">
                <p className="font-medium text-slate-900">
                  Assignment 2: System design reflection
                </p>
                <p className="text-xs text-slate-600">
                  Write a short design brief (500–800 words) describing how you
                  would design an admissions and exam module for a global
                  university-scale LMS.
                </p>
                <p className="text-xs text-slate-500">
                  Due: Mar 15, 2026 • Weight: 15% of final grade
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right: Interaction sidebar */}
      <aside className="w-full space-y-3 rounded-lg border border-slate-200 bg-white p-3 text-xs lg:w-72 lg:shrink-0">
        {/* Q&A */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Q&amp;A
          </h2>
          <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-md bg-slate-50 px-2 py-1.5"
              >
                <p className="text-[11px] font-semibold text-slate-800">
                  {q.author}
                </p>
                <p className="text-[11px] text-slate-600">{q.text}</p>
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleSubmitQuestion}
            className="mt-2 flex flex-col gap-1"
          >
            <textarea
              rows={2}
              className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
              placeholder="Ask a question about this lecture..."
              value={newQuestion}
              onChange={(event) => setNewQuestion(event.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="self-end"
            >
              Post question
            </Button>
          </form>
        </section>

        {/* Chat */}
        <section className="border-t border-slate-200 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Live chat (mock)
          </h2>
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md bg-slate-50 p-2">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex flex-col rounded-md px-2 py-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {msg.author}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{msg.text}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSubmitChat}
            className="mt-2 flex items-center gap-1"
          >
            <input
              type="text"
              className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
              placeholder="Send a message..."
              value={newChatMessage}
              onChange={(event) => setNewChatMessage(event.target.value)}
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
            >
              Send
            </Button>
          </form>
        </section>
      </aside>

      {/* Attendance toast */}
      {attendanceRecorded && (
        <div
          className="pointer-events-none fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-emerald-50 shadow-lg"
          role="status"
          aria-live="polite"
        >
          Attendance recorded for this lecture.
        </div>
      )}
    </div>
  );
}

