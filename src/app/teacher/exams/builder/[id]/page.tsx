"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ExamType = "Midterm" | "Final";
type QuestionType = "multiple_choice" | "open_ended";
type ExamStatus = "Draft" | "Pending Review" | "Approved" | "Need Correction";

interface ExamQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  points: number;
  options?: string[];
  correctIndex?: number;
}

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

function Toggle({ id, checked, onChange, label, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
          checked ? "bg-teal-600" : "bg-slate-200",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

const STORAGE_KEY = "teacher-exam-builder";

function loadExam(id: string): Partial<{
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  examType: ExamType;
  courseId: string;
  enableWebcam: boolean;
  lockBrowser: boolean;
  aiFaceDetection: boolean;
  questions: ExamQuestion[];
  status: ExamStatus;
  changeRequested: boolean;
}> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[id] ?? {};
  } catch {
    return {};
  }
}

function saveExam(id: string, data: object) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[id] = { ...all[id], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}
}

function createQuestion(type: QuestionType): ExamQuestion {
  const id = "q" + Date.now() + Math.random().toString(36).slice(2, 6);
  if (type === "multiple_choice") {
    return { id, type, prompt: "", points: 1, options: ["", "", ""], correctIndex: 0 };
  }
  return { id, type, prompt: "", points: 1 };
}

export default function ExamBuilderPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "new";

  const [courseId, setCourseId] = React.useState("1");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [durationMinutes, setDurationMinutes] = React.useState(90);
  const [passingScore, setPassingScore] = React.useState(60);
  const [examType, setExamType] = React.useState<ExamType>("Midterm");
  const [enableWebcam, setEnableWebcam] = React.useState(true);
  const [lockBrowser, setLockBrowser] = React.useState(true);
  const [aiFaceDetection, setAiFaceDetection] = React.useState(true);
  const [questions, setQuestions] = React.useState<ExamQuestion[]>([]);
  const [status, setStatus] = React.useState<ExamStatus>("Draft");
  const [changeRequested, setChangeRequested] = React.useState(false);
  const [saveToast, setSaveToast] = React.useState<"saving" | "saved" | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (id && id !== "new") {
      const loaded = loadExam(id);
      if (loaded.title != null) setTitle(loaded.title);
      if (loaded.description != null) setDescription(loaded.description ?? "");
      if (loaded.durationMinutes != null) setDurationMinutes(loaded.durationMinutes);
      if (loaded.passingScore != null) setPassingScore(loaded.passingScore);
      if (loaded.examType) setExamType(loaded.examType);
      if (loaded.courseId) setCourseId(loaded.courseId);
      if (loaded.enableWebcam != null) setEnableWebcam(loaded.enableWebcam);
      if (loaded.lockBrowser != null) setLockBrowser(loaded.lockBrowser);
      if (loaded.aiFaceDetection != null) setAiFaceDetection(loaded.aiFaceDetection);
      if (loaded.questions?.length) setQuestions(loaded.questions);
      if (loaded.status) setStatus(loaded.status);
      if (loaded.changeRequested) setChangeRequested(loaded.changeRequested);
    }
  }, [id]);

  const isLockedByStatus = status === "Pending Review" || status === "Approved";
  const canEdit = !isLockedByStatus || (status === "Approved" && changeRequested);

  const addQuestion = (type: QuestionType) => {
    const q = createQuestion(type);
    setQuestions((prev) => [...prev, q]);
    setExpandedId(q.id);
  };

  const updateQuestion = (qId: string, updates: Partial<ExamQuestion>) => {
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
        return { ...q, options: opts, correctIndex: Math.min(correctIndex, opts.length - 1) };
      }),
    );
  };

  const handleSaveDraft = () => {
    const examId = id === "new" ? "e" + Date.now() : id;
    setSaveToast("saving");
    const data = {
      title,
      description,
      durationMinutes,
      passingScore,
      examType,
      courseId,
      enableWebcam,
      lockBrowser,
      aiFaceDetection,
      questions,
      status: "Draft",
    };
    saveExam(examId, data);
    setStatus("Draft");
    setTimeout(() => {
      setSaveToast("saved");
      setTimeout(() => setSaveToast(null), 2000);
    }, 600);
  };

  const handleSubmitForAqad = () => {
    if (!title.trim()) return;
    const examId = id === "new" ? "e" + Date.now() : id;
    const data = {
      title,
      description,
      durationMinutes,
      passingScore,
      examType,
      courseId,
      enableWebcam,
      lockBrowser,
      aiFaceDetection,
      questions,
      status: "Pending Review",
    };
    saveExam(examId, data);
    setStatus("Pending Review");
  };

  const handleRequestChange = () => {
    setChangeRequested(true);
  };

  const statusStyles: Record<ExamStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    "Pending Review": "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    "Need Correction": "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/exams" className="text-xs font-medium text-teal-600 hover:underline">
          ← Exams
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          {id === "new" ? "New Exam" : "Exam Builder"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure metadata, proctoring, and questions. Save as draft or submit for AQAD approval.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Exam metadata */}
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Exam metadata</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700">Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Midterm Exam"
                disabled={!canEdit}
              />
              <div>
                <label className="block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Instructions for students..."
                  rows={3}
                  disabled={!canEdit}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Duration (minutes)</label>
                  <input
                    type="number"
                    min={15}
                    max={240}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(15, parseInt(e.target.value, 10) || 15))}
                    disabled={!canEdit}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Passing score (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                    disabled={!canEdit}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Exam type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  disabled={!canEdit}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
                >
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Proctoring settings */}
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Proctoring settings</h3>
            <p className="mt-0.5 text-xs text-slate-500">Configure online proctoring options</p>
            <div className="mt-4 space-y-4">
              <Toggle
                id="webcam"
                checked={enableWebcam}
                onChange={setEnableWebcam}
                label="Enable webcam"
                disabled={!canEdit}
              />
              <Toggle
                id="lock"
                checked={lockBrowser}
                onChange={setLockBrowser}
                label="Lock browser"
                disabled={!canEdit}
              />
              <Toggle
                id="ai"
                checked={aiFaceDetection}
                onChange={setAiFaceDetection}
                label="AI face detection"
                disabled={!canEdit}
              />
            </div>
          </Card>

          {/* Question bank */}
          <Card className="rounded-lg border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Question bank</h3>
              {canEdit && (
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("multiple_choice")}>
                    + Multiple choice
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addQuestion("open_ended")}>
                    + Open-ended
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
                          {q.type === "multiple_choice" ? "Multiple choice" : "Open-ended"} · {q.points} pt{q.points !== 1 ? "s" : ""}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="space-y-4 border-t border-slate-200 p-4">
                          <Input
                            label="Question"
                            value={q.prompt}
                            onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                            placeholder="Enter question text"
                            disabled={!canEdit}
                          />
                          <div>
                            <label className="block text-xs font-medium text-slate-700">Points</label>
                            <input
                              type="number"
                              min={1}
                              value={q.points}
                              onChange={(e) => updateQuestion(q.id, { points: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                              disabled={!canEdit}
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
                                      disabled={!canEdit}
                                      className="text-teal-600"
                                    />
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => updateOption(q.id, i, e.target.value)}
                                      placeholder={`Option ${i + 1}`}
                                      disabled={!canEdit}
                                      className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                                    />
                                    {(q.options?.length ?? 0) > 1 && canEdit && (
                                      <button type="button" onClick={() => removeOption(q.id, i)} className="text-red-600 hover:underline">
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {canEdit && (
                                  <Button type="button" variant="secondary" size="sm" onClick={() => addOption(q.id)}>
                                    + Option
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                          {canEdit && (
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
            <p className="mt-0.5 text-xs text-slate-500">
              {!canEdit && status === "Approved"
                ? "Editing is restricted. File a change request to modify."
                : !canEdit
                  ? "Exam is locked. Awaiting AQAD review."
                  : "Save or submit for academic quality review."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {saveToast && (
                <span className={cn("text-sm", saveToast === "saved" && "text-emerald-600")}>
                  {saveToast === "saving" ? "Saving…" : "Draft saved."}
                </span>
              )}
              {canEdit && (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleSaveDraft}
                    disabled={saveToast === "saving"}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSubmitForAqad}
                    disabled={!title.trim() || saveToast === "saving"}
                  >
                    Submit for AQAD Approval
                  </Button>
                </>
              )}
              {status === "Approved" && !changeRequested && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleRequestChange}
                >
                  Request Change
                </Button>
              )}
              <span className={cn("mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold", statusStyles[status])}>
                {status}
              </span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
