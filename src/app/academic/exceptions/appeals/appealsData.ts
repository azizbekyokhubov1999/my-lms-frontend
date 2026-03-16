/**
 * Shared appeal types and storage for appeals list and detail.
 * Persisted in sessionStorage for demo (no backend).
 */

export type AppealType = "grade" | "disciplinary";
export type AppealStatus = "pending" | "under_review" | "resolved";
export type AppealOutcome = "approved" | "rejected";

export interface AppealEvidence {
  id: string;
  name: string;
  uploadedAt: string;
}

export interface Appeal {
  id: string;
  studentName: string;
  studentId: string;
  type: AppealType;
  subject: string;
  submittedAt: string;
  status: AppealStatus;
  summary: string;
  /** Full appeal text from the student. */
  appealText: string;
  /** Original grade or decision being appealed (e.g. "Grade: 62%", "Warning issued"). */
  originalGradeOrDecision: string;
  /** Uploaded evidence file names / references. */
  evidence: AppealEvidence[];
  /** Set when status is resolved. */
  outcome?: AppealOutcome;
  reviewedBy?: string;
  reviewedAt?: string;
  /** Academic officer feedback / reason for decision. */
  officerFeedback?: string;
}

export interface AppealNotification {
  id: string;
  appealId: string;
  studentId: string;
  message: string;
  createdAt: string;
}

const STORAGE_KEY = "academic-appeals";
const NOTIFICATIONS_KEY = "academic-appeals-notifications";

const DEFAULT_APPEALS: Appeal[] = [
  {
    id: "ap1",
    studentName: "Ivan Kozlov",
    studentId: "STU-10002",
    type: "grade",
    subject: "CS101 Mid-term",
    submittedAt: "2026-03-05",
    status: "pending",
    summary: "Student appeals grade; claims grading error on question 3.",
    appealText: "I believe there was a grading error on question 3. My solution was correct according to the rubric. I have attached my script and the instructor's solution for comparison. I request a re-grade of this question.",
    originalGradeOrDecision: "Grade: 62% (D). Question 3 marked 0/20.",
    evidence: [
      { id: "e1", name: "my_solution_q3.pdf", uploadedAt: "2026-03-05 09:00" },
      { id: "e2", name: "rubric_q3.pdf", uploadedAt: "2026-03-05 09:01" },
    ],
  },
  {
    id: "ap2",
    studentName: "Dmitri Volkov",
    studentId: "STU-10004",
    type: "disciplinary",
    subject: "Attendance warning",
    submittedAt: "2026-03-04",
    status: "under_review",
    summary: "Appeal against attendance-based warning. Medical documentation provided.",
    appealText: "I was unable to attend several sessions due to a medical condition. I have attached a doctor's note and hospital discharge summary. I request that the attendance warning be withdrawn and my eligibility for the exam be restored.",
    originalGradeOrDecision: "Attendance warning issued. Below 70% threshold; exam access at risk.",
    evidence: [
      { id: "e3", name: "medical_certificate.pdf", uploadedAt: "2026-03-04 14:00" },
    ],
  },
  {
    id: "ap3",
    studentName: "Elena Novikova",
    studentId: "STU-10005",
    type: "grade",
    subject: "SE201 Assignment",
    submittedAt: "2026-03-01",
    status: "resolved",
    outcome: "approved",
    summary: "Re-grade request.",
    appealText: "I requested a re-grade of the final assignment. The feedback indicated marks were deducted for referencing; I had included the references in an appendix.",
    originalGradeOrDecision: "Grade: 68% (C+). Feedback: Referencing not in required format.",
    evidence: [],
    reviewedBy: "Dr. Sokolova",
    reviewedAt: "2026-03-03 11:00",
    officerFeedback: "Partial marks restored after re-check. Appendix was accepted as valid reference list.",
  },
];

function getStored(): Appeal[] {
  if (typeof window === "undefined") return DEFAULT_APPEALS;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APPEALS;
    const parsed = JSON.parse(raw) as Appeal[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_APPEALS;
  } catch {
    return DEFAULT_APPEALS;
  }
}

function setStored(appeals: Appeal[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
  } catch {
    /* ignore */
  }
}

export function getAppeals(): Appeal[] {
  return getStored();
}

export function getAppealById(id: string): Appeal | undefined {
  return getStored().find((a) => a.id === id);
}

export function setAppeals(appeals: Appeal[]): void {
  setStored(appeals);
}

export function resolveAppeal(
  appealId: string,
  outcome: AppealOutcome,
  officerFeedback: string,
  reviewedBy: string
): void {
  const appeals = getStored();
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const updated = appeals.map((a) =>
    a.id === appealId
      ? {
          ...a,
          status: "resolved" as AppealStatus,
          outcome,
          officerFeedback,
          reviewedBy,
          reviewedAt: now,
        }
      : a
  );
  setStored(updated);

  const appeal = updated.find((a) => a.id === appealId);
  if (appeal) {
    const message =
      outcome === "approved"
        ? `Your appeal regarding "${appeal.subject}" has been approved. ${officerFeedback || "Original decision reversed."}`
        : `Your appeal regarding "${appeal.subject}" has been rejected. ${officerFeedback || "Original decision upheld."}`;
    addNotification({
      appealId,
      studentId: appeal.studentId,
      message,
    });
  }
}

function getNotifications(): AppealNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppealNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setNotifications(notifications: AppealNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch {
    /* ignore */
  }
}

function addNotification(n: Omit<AppealNotification, "id" | "createdAt">): void {
  const list = getNotifications();
  const created = new Date().toISOString().slice(0, 19).replace("T", " ");
  list.push({
    ...n,
    id: `notif-${Date.now()}`,
    createdAt: created,
  });
  setNotifications(list);
}

export function getNotificationsForStudent(studentId: string): AppealNotification[] {
  return getNotifications().filter((n) => n.studentId === studentId);
}
