"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const APPLICATION_STATUS_KEY = "admission_application_status";
const REFRESH_COUNT_KEY = "admission_refresh_count";
const HISTORY_KEY = "admission_application_history";
const EXAM_ANSWERS_KEY = "admission_exam_answers";
const AUTO_SAVE_INTERVAL_MS = 30 * 1000;

type Question = { id: number; text: string; options: string[] };

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "The Unified Online University LMS primarily aims to:",
    options: [
      "Provide social media sharing features",
      "Deliver a scalable online learning environment",
      "Replace all in-person classes worldwide",
      "Act as a file storage platform only",
    ],
  },
  {
    id: 2,
    text: "Which of the following is most important for academic integrity during online exams?",
    options: [
      "Colorful UI themes",
      "High-resolution course thumbnails",
      "Robust identity verification and proctoring",
      "Animated page transitions",
    ],
  },
  {
    id: 3,
    text: "What is a key benefit of using a Learning Management System (LMS)?",
    options: [
      "Automatic generation of social media posts",
      "Centralized management of courses, students, and assessments",
      "Unlimited cloud storage for movies",
      "Offline-only exam delivery",
    ],
  },
];

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export default function ExamByIdPage() {
  const params = useParams();
  const router = useRouter();
  const examId = (params?.id as string) || "entrance";

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const overlayVideoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [phase, setPhase] = React.useState<"photo" | "exam">("photo");
  const [photoCaptured, setPhotoCaptured] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(30 * 60);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number | null>>(() => ({}));
  const [flagged, setFlagged] = React.useState<Set<number>>(() => new Set());
  const [submitted, setSubmitted] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [aiStatus, setAiStatus] = React.useState({ face: true, tab: true });

  // Load saved answers from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(EXAM_ANSWERS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number | null>;
        const byId: Record<number, number | null> = {};
        Object.entries(parsed).forEach(([k, v]) => {
          byId[Number(k)] = v;
        });
        setAnswers((prev) => ({ ...prev, ...byId }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Camera for photo and proctoring
  React.useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        if (overlayVideoRef.current) overlayVideoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch {
        setCameraReady(false);
      }
    };
    start();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (phase === "exam" && streamRef.current && overlayVideoRef.current) {
      overlayVideoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // Timer
  React.useEffect(() => {
    if (phase !== "exam" || submitted) return;
    if (secondsLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, submitted, secondsLeft]);

  // Auto-save every 30s
  React.useEffect(() => {
    if (phase !== "exam" || submitted) return;
    const save = () => {
      try {
        localStorage.setItem(EXAM_ANSWERS_KEY, JSON.stringify(answers));
        setLastSaved(new Date());
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(save, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phase, submitted, answers]);

  // Security: disable context menu, copy, paste, cut
  React.useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, []);

  // Fullscreen: request on exam start, re-request on exit
  React.useEffect(() => {
    if (phase !== "exam" || submitted) return;
    const el = document.documentElement;
    const requestFullscreen = () => {
      try {
        if (!document.fullscreenElement) el.requestFullscreen?.();
      } catch {
        /* ignore */
      }
    };
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) requestFullscreen();
    };
    requestFullscreen();
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [phase, submitted]);

  const capturePhoto = () => {
    setPhotoCaptured(true);
  };

  const startExam = () => {
    setPhase("exam");
  };

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const setAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitExam = () => {
    setSubmitted(true);
    try {
      localStorage.removeItem(EXAM_ANSWERS_KEY);
      localStorage.setItem(APPLICATION_STATUS_KEY, "UNDER_REVIEW");
      const raw = localStorage.getItem(HISTORY_KEY);
      const defaultRow = {
        activity: "Initial Application",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        paymentStatus: "Paid",
        result: "Pending",
      };
      let history: Array<{ activity: string; date: string; paymentStatus: string; result: string }> = raw
        ? (() => {
            try {
              const p = JSON.parse(raw);
              return Array.isArray(p) ? p : [defaultRow];
            } catch {
              return [defaultRow];
            }
          })()
        : [defaultRow];
      const examCount = history.filter((r) => r.activity.startsWith("Entrance Exam #")).length;
      history = [
        ...history,
        {
          activity: `Entrance Exam #${examCount + 1}`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          paymentStatus: "Paid",
          result: "Pending",
        },
      ];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      localStorage.setItem(REFRESH_COUNT_KEY, "0");
    } catch {
      /* ignore */
    }
  };

  const currentQuestion = MOCK_QUESTIONS[currentIndex];
  const timeStr = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0")}:${(secondsLeft % 60).toString().padStart(2, "0")}`;

  // ——— Photo phase: Identity re-verification ———
  if (phase === "photo") {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/admission/exams/check"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Technical check
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Identity re-verification
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Take a fresh photo before starting the exam.
          </p>
          <Card className="mt-6 overflow-hidden">
            <div className="relative aspect-video bg-slate-900">
              {cameraReady ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  Camera not available
                </div>
              )}
              {photoCaptured && (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/20">
                  <div className="rounded-full bg-emerald-500 p-4 text-white">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              {!photoCaptured ? (
                <Button type="button" variant="primary" onClick={capturePhoto} disabled={!cameraReady}>
                  Take photo
                </Button>
              ) : (
                <>
                  <p className="text-sm font-medium text-emerald-700">Photo captured</p>
                  <Button type="button" variant="primary" onClick={startExam}>
                    Start exam
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ——— Submitted: success modal ———
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Exam submitted</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your answers have been recorded. Results will be available on your dashboard within 24 hours.
          </p>
          <Link
            href="/admission/status"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-900 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ——— Exam phase: Quiz + Proctoring overlay ———
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Proctoring overlay: floating window with camera + AI status */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Proctoring</span>
        </div>
        <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 bg-slate-800 px-2 py-1.5">
            <span className="text-[10px] font-medium text-slate-300">Live feed</span>
            <div className="flex gap-1">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                  aiStatus.face ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                )}
              >
                {aiStatus.face ? "Face Detected" : "No face"}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[9px] font-semibold",
                  aiStatus.tab ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                )}
              >
                {aiStatus.tab ? "Active Tab Monitor" : "Tab change"}
              </span>
            </div>
          </div>
          <div className="relative h-36 w-52 bg-slate-800">
            <video
              ref={overlayVideoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-24 pt-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Entrance exam</h1>
            <p className="text-sm text-slate-600">Question {currentIndex + 1} of {MOCK_QUESTIONS.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg font-bold text-red-600">{timeStr}</span>
            {lastSaved && (
              <span className="text-xs text-slate-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,200px]">
          <Card className="border-slate-200/80 shadow-md">
            <h2 className="text-sm font-semibold text-slate-900">
              {currentQuestion.text}
            </h2>
            <ul className="mt-4 space-y-2">
              {currentQuestion.options.map((opt, i) => {
                const selected = answers[currentQuestion.id] === i;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setAnswer(currentQuestion.id, i)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                        selected
                          ? "border-blue-900 bg-blue-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                      )}
                    >
                      <span>{opt}</span>
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold",
                          selected ? "border-blue-900 bg-blue-900 text-white" : "border-slate-300"
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant={flagged.has(currentQuestion.id) ? "primary" : "outline"}
                size="sm"
                onClick={() => toggleFlag(currentQuestion.id)}
              >
                {flagged.has(currentQuestion.id) ? "Flagged for review" : "Flag for review"}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={currentIndex === MOCK_QUESTIONS.length - 1}
                  onClick={() => setCurrentIndex((i) => Math.min(MOCK_QUESTIONS.length - 1, i + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>

          {/* Question navigator grid */}
          <Card className="h-fit">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Questions
            </h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {MOCK_QUESTIONS.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                    currentIndex === i && "ring-2 ring-blue-900 ring-offset-2",
                    answers[q.id] != null
                      ? "bg-blue-100 text-blue-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    flagged.has(q.id) && "border-2 border-amber-500"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Auto-save every 30s
            </p>
            <Button
              type="button"
              variant="primary"
              className="mt-4 w-full"
              onClick={handleSubmitExam}
            >
              Submit exam
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
