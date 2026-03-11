"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../../components/ui/Button";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const LECTURE_DURATION_MINUTES = 75;
const ATTENDANCE_THRESHOLD_PCT = 0.75;
const ATTENDANCE_THRESHOLD_MS =
  LECTURE_DURATION_MINUTES * 60 * 1000 * ATTENDANCE_THRESHOLD_PCT;

const NOTES_STORAGE_PREFIX = "lecture_notes_";

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

const MOCK_QUESTIONS: Question[] = [
  { id: 1, author: "Student A", text: "Will this appear in the midterm?" },
  { id: 2, author: "Student B", text: "Could you clarify synchronous vs asynchronous flows?" },
];

const MOCK_CHAT: ChatMessage[] = [
  { id: 1, author: "Instructor", text: "Welcome. Post your questions here.", timestamp: "09:00" },
  { id: 2, author: "Student C", text: "Good morning everyone!", timestamp: "09:01" },
];

const MOCK_MATERIALS = [
  { id: "1", title: "Lecture slides (PDF)", size: "2.3 MB", url: "#" },
  { id: "2", title: "Session notes", size: "0.5 MB", url: "#" },
];

type SidebarTab = "chat" | "materials" | "notes";

export default function LecturePage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || "";
  const lectureId = (params?.lectureId as string) || "";
  const notesKey = `${NOTES_STORAGE_PREFIX}${courseId}_${lectureId}`;

  const [sidebarTab, setSidebarTab] = React.useState<SidebarTab>("chat");
  const [questions, setQuestions] = React.useState<Question[]>(MOCK_QUESTIONS);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(MOCK_CHAT);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newChatMessage, setNewChatMessage] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [notesSaved, setNotesSaved] = React.useState(false);
  const [attendanceStatus, setAttendanceStatus] = React.useState<"pending" | "present" | null>(null);

  // Load notes from localStorage
  React.useEffect(() => {
    if (typeof window === "undefined" || !notesKey) return;
    try {
      const saved = localStorage.getItem(notesKey);
      if (saved != null) setNotes(saved);
    } catch {
      /* ignore */
    }
  }, [notesKey]);

  // Auto-save notes (debounced)
  React.useEffect(() => {
    if (!notesKey) return;
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(notesKey, notes);
        setNotesSaved(true);
        const hide = setTimeout(() => setNotesSaved(false), 2000);
        return () => clearTimeout(hide);
      } catch {
        /* ignore */
      }
    }, 500);
    return () => window.clearTimeout(t);
  }, [notes, notesKey]);

  // Attendance: mark Present only after 75% of lecture duration on page
  React.useEffect(() => {
    if (attendanceStatus === "present") return;
    const timeoutId = window.setTimeout(() => {
      setAttendanceStatus("present");
    }, ATTENDANCE_THRESHOLD_MS);
    return () => clearTimeout(timeoutId);
  }, [attendanceStatus]);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newQuestion.trim();
    if (!t) return;
    setQuestions((prev) => [...prev, { id: prev.length + 1, author: "You", text: t }]);
    setNewQuestion("");
  };

  const handleSubmitChat = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newChatMessage.trim();
    if (!t) return;
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setChatMessages((prev) => [...prev, { id: prev.length + 1, author: "You", text: t, timestamp: ts }]);
    setNewChatMessage("");
  };

  const sidebarTabs: { key: SidebarTab; label: string }[] = [
    { key: "chat", label: "Chat / Q&A" },
    { key: "materials", label: "Materials" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col gap-4 lg:flex-row">
      {/* Main: Large video / Teams area */}
      <section className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/student/courses/${courseId}`}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to course
          </Link>
          {attendanceStatus === "present" && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Present
            </span>
          )}
        </div>

        {/* Video player / Teams area — large placeholder */}
        <div className="relative flex aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg">
          <div className="flex flex-1 items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-400">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-slate-600">
                <span className="text-2xl">▶</span>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-300">
                Teams Meeting Overlay
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Live stream or recording will appear here
              </p>
            </div>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-black/60 px-2.5 py-1.5 text-[11px] text-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <h1 className="text-base font-semibold text-slate-900">
            Lecture {lectureId}: Core concepts
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Duration: {LECTURE_DURATION_MINUTES} min · Stay 75%+ for attendance
          </p>
        </div>
      </section>

      {/* Interactive sidebar — 3 tabs */}
      <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm lg:w-80">
        <div className="flex border-b border-slate-200">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSidebarTab(tab.key)}
              className={cn(
                "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
                sidebarTab === tab.key
                  ? "border-b-2 border-sky-600 text-sky-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex max-h-[420px] flex-col overflow-hidden">
          {sidebarTab === "chat" && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase text-slate-500">
                    Q&A
                  </p>
                  <ul className="space-y-2">
                    {questions.map((q) => (
                      <li key={q.id} className="rounded-lg bg-slate-50 px-2.5 py-2">
                        <p className="text-[11px] font-semibold text-slate-800">{q.author}</p>
                        <p className="text-xs text-slate-600">{q.text}</p>
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={handleSubmitQuestion} className="mt-2">
                    <textarea
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Ask a question..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <Button type="submit" variant="secondary" size="sm" className="mt-1.5">
                      Post question
                    </Button>
                  </form>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase text-slate-500">
                    Live chat
                  </p>
                  <div className="max-h-32 space-y-1.5 overflow-y-auto rounded-lg bg-slate-50 p-2">
                    {chatMessages.map((m) => (
                      <div key={m.id} className="text-[11px]">
                        <div className="flex justify-between gap-2">
                          <span className="font-semibold text-slate-800">{m.author}</span>
                          <span className="text-slate-500">{m.timestamp}</span>
                        </div>
                        <p className="mt-0.5 text-slate-600">{m.text}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSubmitChat} className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Send a message..."
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </>
          )}

          {sidebarTab === "materials" && (
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-500">
                Slides & notes for this lecture
              </p>
              <ul className="mt-3 space-y-2">
                {MOCK_MATERIALS.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.title}</p>
                      <p className="text-[11px] text-slate-500">{m.size}</p>
                    </div>
                    <a
                      href={m.url}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sidebarTab === "notes" && (
            <div className="flex flex-1 flex-col overflow-hidden p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase text-slate-500">
                  Your notes
                </p>
                {notesSaved && (
                  <span className="text-[10px] text-emerald-600">Saved</span>
                )}
              </div>
              <textarea
                className="mt-2 min-h-[280px] flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Type your notes here. They are auto-saved."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Attendance toast — after 75% duration */}
      {attendanceStatus === "present" && (
        <div
          className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-emerald-50 shadow-lg"
          role="status"
          aria-live="polite"
        >
          Marked as Present (75%+ of lecture)
        </div>
      )}
    </div>
  );
}
