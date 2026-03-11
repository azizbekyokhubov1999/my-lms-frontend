"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

const AUTO_SAVE_INTERVAL_MS = 60 * 1000;

type Question = { id: number; text: string; options: string[] };

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which data structure is typically used for LIFO behavior?",
    options: ["Queue", "Stack", "Array", "Linked list"],
  },
  {
    id: 2,
    text: "In a binary search tree, the left subtree of a node contains only values:",
    options: ["Greater than the node", "Less than the node", "Equal to the node", "None of the above"],
  },
  {
    id: 3,
    text: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  },
  {
    id: 4,
    text: "Which algorithm is used to find the shortest path in an unweighted graph?",
    options: ["Dijkstra", "BFS", "DFS", "Bellman-Ford"],
  },
  {
    id: 5,
    text: "Dynamic programming is most useful when the problem has:",
    options: ["Overlapping subproblems", "No subproblems", "Only one solution", "Linear structure"],
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getStorageKey(examId: string, suffix: string) {
  return `student_exam_${suffix}_${examId}`;
}

export default function ExamTakingPage() {
  const params = useParams();
  const examId = (params?.id as string) || "";

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(90 * 60); // 90 min
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, number | null>>({});
  const [flagged, setFlagged] = React.useState<Set<number>>(() => new Set());
  const [submitted, setSubmitted] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  const answersKey = getStorageKey(examId, "answers");
  const flaggedKey = getStorageKey(examId, "flagged");

  // Load saved state
  React.useEffect(() => {
    if (!examId) return;
    try {
      const rawAnswers = localStorage.getItem(answersKey);
      if (rawAnswers) {
        const parsed = JSON.parse(rawAnswers) as Record<string, number | null>;
        const byId: Record<number, number | null> = {};
        Object.entries(parsed).forEach(([k, v]) => {
          byId[Number(k)] = v;
        });
        setAnswers((prev) => ({ ...prev, ...byId }));
      }
      const rawFlagged = localStorage.getItem(flaggedKey);
      if (rawFlagged) {
        const arr = JSON.parse(rawFlagged) as number[];
        if (Array.isArray(arr)) setFlagged(new Set(arr));
      }
    } catch {
      /* ignore */
    }
  }, [examId, answersKey, flaggedKey]);

  // Camera (strict mode / proctoring)
  React.useEffect(() => {
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 320, height: 240 },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
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

  // Timer
  React.useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [submitted, secondsLeft]);

  // Auto-save every 60 seconds
  React.useEffect(() => {
    if (submitted) return;
    const save = () => {
      try {
        const ans: Record<string, number | null> = {};
        Object.entries(answers).forEach(([k, v]) => {
          ans[k] = v;
        });
        localStorage.setItem(answersKey, JSON.stringify(ans));
        localStorage.setItem(flaggedKey, JSON.stringify(Array.from(flagged)));
        setLastSaved(new Date());
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(save, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [submitted, answers, flagged, answersKey, flaggedKey]);

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
      localStorage.removeItem(answersKey);
      localStorage.removeItem(flaggedKey);
    } catch {
      /* ignore */
    }
  };

  const currentQuestion = MOCK_QUESTIONS[currentIndex];
  const timeStr = `${Math.floor(secondsLeft / 60).toString().padStart(2, "0")}:${(secondsLeft % 60).toString().padStart(2, "0")}`;

  // ——— Submitted ———
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Exam submitted</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your answers have been recorded. Results will be available in your gradebook.
          </p>
          <Link
            href="/student/exams"
            className="mt-6 inline-block rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Back to Exam center
          </Link>
        </Card>
      </div>
    );
  }

  // ——— Exam UI: top-fixed timer + proctoring + quiz ———
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top-fixed bar: remaining time + save status */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/student/exams" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Exam center
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg font-bold text-slate-900" aria-live="polite">
              {timeStr}
            </span>
            {lastSaved && (
              <span className="text-xs text-slate-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Proctoring: camera overlay (strict mode) */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden />
          <span className="text-[10px] font-semibold text-slate-700">Proctoring</span>
        </div>
        <div className="overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-900 shadow-lg">
          <div className="border-b border-slate-700 px-2 py-1 text-[10px] text-slate-300">
            Camera
          </div>
          <div className="h-28 w-40 bg-slate-800">
            {cameraReady && videoRef.current ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-500">
                {cameraReady ? "—" : "Camera unavailable"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-24 pt-6">
        <div className="grid gap-6 lg:grid-cols-[1fr,200px]">
          {/* Question card */}
          <Card>
            <p className="text-xs font-medium text-slate-500">
              Question {currentIndex + 1} of {MOCK_QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-base font-semibold text-slate-900">
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
                          ? "border-sky-600 bg-sky-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300",
                      )}
                    >
                      <span>{opt}</span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          selected ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300",
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
                {flagged.has(currentQuestion.id) ? "Flagged for review" : "Mark for review"}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === MOCK_QUESTIONS.length - 1}
                  onClick={() => setCurrentIndex((i) => Math.min(MOCK_QUESTIONS.length - 1, i + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>

          {/* Question navigator + submit */}
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
                    currentIndex === i && "ring-2 ring-sky-600 ring-offset-2",
                    answers[q.id] != null
                      ? "bg-sky-100 text-sky-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    flagged.has(q.id) && "border-2 border-amber-500",
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Auto-save every 60s
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
