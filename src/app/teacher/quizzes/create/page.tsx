"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type QuestionType = "multiple_choice" | "true_false" | "short_answer";
type AqadStatus = "Draft" | "Pending Review" | "Approved" | "Need Correction";

interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  points: number;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
}

interface QuizDraft {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimitMinutes: number;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  status: AqadStatus;
}

const STORAGE_KEY = "teacher-quiz-drafts";

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

function loadDrafts(): QuizDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: QuizDraft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function createEmptyQuestion(type: QuestionType): QuizQuestion {
  const id = "q" + Date.now() + Math.random().toString(36).slice(2, 6);
  if (type === "multiple_choice") {
    return { id, type, prompt: "", points: 1, options: ["", "", ""], correctIndex: 0 };
  }
  if (type === "true_false") {
    return { id, type, prompt: "", points: 1, options: ["True", "False"], correctIndex: 0 };
  }
  return { id, type, prompt: "", points: 1, correctAnswer: "" };
}

export default function QuizCreatePage() {
  const [id] = React.useState(() => "quiz" + Date.now());
  const [courseId, setCourseId] = React.useState("1");
  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = React.useState(30);
  const [shuffleQuestions, setShuffleQuestions] = React.useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = React.useState(true);
  const [status, setStatus] = React.useState<AqadStatus>("Draft");
  const [saveToast, setSaveToast] = React.useState<"saving" | "saved" | null>(null);
  const [drafts, setDrafts] = React.useState<QuizDraft[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDrafts(loadDrafts());
  }, []);

  const isLocked = status === "Pending Review" || status === "Approved";

  const addQuestion = (type: QuestionType) => {
    const q = createEmptyQuestion(type);
    setQuestions((prev) => [...prev, q]);
    setExpandedId(q.id);
  };

  const updateQuestion = (qId: string, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, ...updates } : q)),
    );
  };

  const removeQuestion = (qId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
    if (expandedId === qId) setExpandedId(null);
  };

  const addOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        return { ...q, options: [...q.options, ""] };
      }),
    );
  };

  const updateOption = (qId: string, idx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options) return q;
        const opts = [...q.options];
        opts[idx] = value;
        return { ...q, options: opts };
      }),
    );
  };

  const removeOption = (qId: string, idx: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || !q.options || q.options.length <= 1) return q;
        const opts = q.options.filter((_, i) => i !== idx);
        const correctIndex = q.correctIndex ?? 0;
        const newCorrect = Math.min(correctIndex, opts.length - 1);
        return { ...q, options: opts, correctIndex: newCorrect };
      }),
    );
  };

  const handleSaveDraft = () => {
    setSaveToast("saving");
    const draft: QuizDraft = {
      id,
      title,
      questions,
      timeLimitMinutes,
      shuffleQuestions,
      showCorrectAnswers,
      status: "Draft",
    };
    const updated = [...drafts.filter((d) => d.id !== id), draft];
    setDrafts(updated);
    saveDrafts(updated);
    setStatus("Draft");
    setTimeout(() => {
      setSaveToast("saved");
      setTimeout(() => setSaveToast(null), 2000);
    }, 600);
  };

  const handleSubmitToAqad = () => {
    if (!title.trim()) return;
    const draft: QuizDraft = {
      id,
      title,
      questions,
      timeLimitMinutes,
      shuffleQuestions,
      showCorrectAnswers,
      status: "Pending Review",
    };
    const updated = [...drafts.filter((d) => d.id !== id), draft];
    setDrafts(updated);
    saveDrafts(updated);
    setStatus("Pending Review");
  };

  const statusStyles: Record<AqadStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    "Pending Review": "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    "Need Correction": "bg-red-100 text-red-800",
  };

  const approvedCount = drafts.filter((d) => d.status === "Approved").length;
  const needCorrectionCount = drafts.filter((d) => d.status === "Need Correction").length;

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/assignments" className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to Assignments
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Create Quiz
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Build questions with auto-grading. Save as draft or submit to AQAD.
        </p>
      </section>

      {/* Status Tracker */}
      <Card className="rounded-lg border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Assessment status</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-emerald-600">{approvedCount}</span>
            <span className="text-sm text-slate-600">Approved</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-red-600">{needCorrectionCount}</span>
            <span className="text-sm text-slate-600">Need Correction</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-amber-600">
              {drafts.filter((d) => d.status === "Pending Review").length}
            </span>
            <span className="text-sm text-slate-600">Pending Review</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Quiz details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="course-select" className="block text-xs font-medium text-slate-700">Course</label>
                <select
                  id="course-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={isLocked}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Module 1: Foundations"
                disabled={isLocked}
              />
            </div>
          </Card>

          {/* Auto-grading settings */}
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Auto-grading settings</h2>
            <p className="mt-0.5 text-xs text-slate-500">Configure how the quiz is scored and shown</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="time-limit" className="block text-xs font-medium text-slate-700">Time limit (minutes)</label>
                <input
                  id="time-limit"
                  type="number"
                  min={5}
                  max={180}
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Math.max(5, parseInt(e.target.value, 10) || 5))}
                  disabled={isLocked}
                  className="mt-1 w-full max-w-[120px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="shuffle"
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  disabled={isLocked}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="shuffle" className="text-sm text-slate-700">Shuffle question order</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="show-answers"
                  type="checkbox"
                  checked={showCorrectAnswers}
                  onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                  disabled={isLocked}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="show-answers" className="text-sm text-slate-700">Show correct answers after submission</label>
              </div>
            </div>
          </Card>

          {/* Question builder */}
          <Card className="rounded-lg border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Questions</h2>
              {!isLocked && (
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("multiple_choice")}>
                    + Multiple choice
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("true_false")}>
                    + True/False
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("short_answer")}>
                    + Short answer
                  </Button>
                </div>
              )}
            </div>
            {questions.length === 0 ? (
              <p className="mt-6 text-center text-sm text-slate-500">Add questions to get started.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {questions.map((q, idx) => {
                  const isExpanded = expandedId === q.id;
                  return (
                    <li key={q.id} className="rounded-lg border border-slate-200 bg-slate-50/50">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      >
                        <span className="text-sm font-medium text-slate-900">
                          Q{idx + 1}: {q.prompt || "Untitled question"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {q.type === "multiple_choice" && "Multiple choice"}
                          {q.type === "true_false" && "True/False"}
                          {q.type === "short_answer" && "Short answer"}
                          {" · "}{q.points} pt{q.points !== 1 ? "s" : ""}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="space-y-4 border-t border-slate-200 p-4">
                          <Input
                            label="Question"
                            value={q.prompt}
                            onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                            placeholder="Enter question text"
                            disabled={isLocked}
                          />
                          <div>
                            <label className="block text-xs font-medium text-slate-700">Points</label>
                            <input
                              type="number"
                              min={1}
                              value={q.points}
                              onChange={(e) => updateQuestion(q.id, { points: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                              disabled={isLocked}
                              className="mt-1 w-20 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                            />
                          </div>
                          {q.type === "multiple_choice" && q.options && (
                            <div>
                              <label className="block text-xs font-medium text-slate-700">Options (select correct)</label>
                              <div className="mt-2 space-y-2">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct-${q.id}`}
                                      checked={q.correctIndex === i}
                                      onChange={() => updateQuestion(q.id, { correctIndex: i })}
                                      disabled={isLocked}
                                      className="text-teal-600"
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => updateOption(q.id, i, e.target.value)}
                                      placeholder={`Option ${i + 1}`}
                                      disabled={isLocked}
                                      className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                                    />
                                    {(q.options?.length ?? 0) > 1 && !isLocked && (
                                      <button type="button" onClick={() => removeOption(q.id, i)} className="text-red-600 hover:underline">
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {!isLocked && (
                                  <Button type="button" variant="secondary" size="sm" onClick={() => addOption(q.id)}>
                                    + Option
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          {q.type === "true_false" && q.options && (
                            <div>
                              <label className="block text-xs font-medium text-slate-700">Correct answer</label>
                              <div className="mt-1 flex gap-4">
                                {["True", "False"].map((opt, i) => (
                                  <label key={i} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`tf-${q.id}`}
                                      checked={q.correctIndex === i}
                                      onChange={() => updateQuestion(q.id, { correctIndex: i })}
                                      disabled={isLocked}
                                      className="text-teal-600"
                                    />
                                    {opt}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                          {q.type === "short_answer" && (
                            <Input
                              label="Expected answer (for auto-grade)"
                              value={q.correctAnswer ?? ""}
                              onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                              placeholder="Exact match or keyword"
                              disabled={isLocked}
                            />
                          )}
                          {!isLocked && (
                            <Button type="button" variant="secondary" size="sm" onClick={() => removeQuestion(q.id)}>
                              Remove question
                            </Button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Actions</h3>
            <div className="mt-4 flex flex-col gap-2">
              {saveToast && (
                <span className={cn("text-sm", saveToast === "saved" && "text-emerald-600")}>
                  {saveToast === "saving" ? "Saving…" : "Draft saved."}
                </span>
              )}
              <Button
                type="button"
                variant="primary"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleSaveDraft}
                disabled={isLocked || saveToast === "saving"}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmitToAqad}
                disabled={isLocked || !title.trim() || questions.length === 0 || saveToast === "saving"}
              >
                Submit to AQAD
              </Button>
              {status !== "Draft" && (
                <span className={cn("mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold", statusStyles[status])}>
                  {status}
                </span>
              )}
            </div>
          </Card>

          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Your quiz drafts</h3>
            {drafts.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No saved drafts yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {drafts.slice(-5).reverse().map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-slate-800">{d.title || "Untitled"}</span>
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 font-medium", statusStyles[d.status])}>
                      {d.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
