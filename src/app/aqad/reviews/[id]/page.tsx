"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const QUALITY_AUDIT_CHECKLIST = [
  { id: "1", label: "Learning outcomes defined" },
  { id: "2", label: "Assessment matches outcomes" },
  { id: "3", label: "Video quality standards" },
  { id: "4", label: "Reading materials provided" },
];

interface ConditionalApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (changes: string) => void;
}

function ConditionalApprovalModal({
  isOpen,
  onClose,
  onConfirm,
}: ConditionalApprovalModalProps) {
  const [changes, setChanges] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setChanges("");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = changes.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onClose();
    setChanges("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="conditional-approval-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 id="conditional-approval-title" className="text-base font-semibold text-slate-900">
            Conditional approval
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Approve only if the teacher makes these specific changes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-4">
          <label htmlFor="conditional-changes" className="block text-sm font-medium text-slate-800">
            Required changes (required)
          </label>
          <textarea
            ref={textareaRef}
            id="conditional-changes"
            rows={4}
            required
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            placeholder="e.g., Add measurable learning outcomes to slide 3. Replace video at 12:00 with HD version. Include chapter 2 reading in materials."
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!changes.trim()} className="bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600">
              Approve conditionally
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
}

function RejectModal({ isOpen, onClose, onConfirm }: RejectModalProps) {
  const [comments, setComments] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setComments("");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comments.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onClose();
    setComments("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 id="reject-modal-title" className="text-base font-semibold text-slate-900">
            Reject content — provide reasons
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Your comments will be sent to the teacher for revision.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-4">
          <label htmlFor="reject-comments" className="block text-sm font-medium text-slate-800">
            Rejection reasons (required)
          </label>
          <textarea
            ref={textareaRef}
            id="reject-comments"
            rows={4}
            required
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="e.g., Learning outcomes are vague. Please add measurable criteria. Video quality is below HD standard."
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!comments.trim()}
              className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
            >
              Confirm reject
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContentReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const reviewId = params?.id ?? "";

  const [checklistState, setChecklistState] = React.useState<
    Record<string, boolean>
  >({});
  const [status, setStatus] = React.useState<
    "Draft" | "InReview" | "Approved" | "Rejected"
  >("InReview");
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [conditionalModalOpen, setConditionalModalOpen] = React.useState(false);
  const [rejectComments, setRejectComments] = React.useState<string | null>(null);
  const [conditionalComments, setConditionalComments] = React.useState<string | null>(null);

  const handleApprove = () => {
    setStatus("Approved");
  };

  const handleConditionalApproval = (changes: string) => {
    setStatus("Approved");
    setConditionalComments(changes);
  };

  const handleReject = (comments: string) => {
    setStatus("Rejected");
    setRejectComments(comments);
  };

  const toggleCheck = (itemId: string) => {
    setChecklistState((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/aqad/reviews"
            className="text-xs font-medium text-indigo-600 hover:underline"
          >
            ← Back to content review
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            Review #{reviewId}: Introduction to Machine Learning
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            CS 440 • Prof. Sarah Chen • Submitted Mar 6, 2026
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
            status === "Approved" && "bg-emerald-50 text-emerald-800",
            status === "Rejected" && "bg-red-50 text-red-700",
            status === "InReview" && "bg-amber-50 text-amber-800",
            status === "Draft" && "bg-slate-100 text-slate-700",
          )}
        >
          {status}
        </span>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Quality Audit Checklist Sidebar */}
        <aside>
          <Card className="rounded-lg border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">
              Quality audit checklist
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              All items must pass before full approval.
            </p>
            <ul className="mt-4 space-y-3">
              {QUALITY_AUDIT_CHECKLIST.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                      checklistState[item.id]
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-slate-400 hover:border-indigo-400",
                    )}
                    aria-label={`Mark "${item.label}" as checked`}
                  >
                    {checklistState[item.id] ? "✓" : ""}
                  </button>
                  <span className="text-xs font-medium text-slate-700">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-slate-500">
              {Object.values(checklistState).filter(Boolean).length} /{" "}
              {QUALITY_AUDIT_CHECKLIST.length} criteria met
            </p>
          </Card>
        </aside>

        {/* Content Preview */}
        <section className="min-w-0">
          <Card className="rounded-lg border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">
              Content preview
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              As students would see this lecture and materials.
            </p>

            {/* Video placeholder */}
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
              <div className="flex h-48 items-center justify-center bg-slate-900 sm:h-64">
                <div className="text-center text-sm text-slate-400">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-slate-500" />
                  <p>Lecture video placeholder (Teams / YouTube)</p>
                </div>
              </div>
            </div>

            {/* Materials placeholder */}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <h3 className="text-xs font-semibold text-slate-700">
                Lecture materials
              </h3>
              <ul className="mt-2 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">📄</span> slides-week-1.pdf
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">📄</span> readings-chapter1.pdf
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-400">📄</span> assignment-1.pdf
                </li>
              </ul>
            </div>

            {/* Rejection feedback (if rejected) */}
            {status === "Rejected" && rejectComments && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <h3 className="text-xs font-semibold text-red-800">
                  Rejection feedback (sent to teacher)
                </h3>
                <p className="mt-1 text-sm text-red-700">{rejectComments}</p>
              </div>
            )}

            {/* Conditional approval feedback */}
            {status === "Approved" && conditionalComments && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <h3 className="text-xs font-semibold text-amber-800">
                  Conditional approval — required changes (sent to teacher)
                </h3>
                <p className="mt-1 text-sm text-amber-900">{conditionalComments}</p>
              </div>
            )}

            {/* Action Bar */}
            {status !== "Approved" && status !== "Rejected" && (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleApprove}
                  disabled={
                    Object.values(checklistState).filter(Boolean).length <
                    QUALITY_AUDIT_CHECKLIST.length
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600"
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setConditionalModalOpen(true)}
                  className="bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600"
                >
                  Conditional approval
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setRejectModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                >
                  Reject
                </Button>
                <Button type="button" variant="outline" className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 focus-visible:ring-indigo-600">
                  Request changes
                </Button>
              </div>
            )}
          </Card>
        </section>
      </div>

      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
      />
      <ConditionalApprovalModal
        isOpen={conditionalModalOpen}
        onClose={() => setConditionalModalOpen(false)}
        onConfirm={handleConditionalApproval}
      />
    </div>
  );
}
