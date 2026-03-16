/**
 * Shared types and storage helpers for exam eligibility rules.
 * Rules are persisted in sessionStorage for the demo (no backend).
 */

export interface EligibilityRule {
  id: string;
  name: string;
  logic: string;
  active: boolean;
  /** Minimum attendance percentage (0–100). */
  minAttendancePercent: number;
  /** Financial status requirement. */
  financialStatus: "no_overdue_debt" | "fee_paid_for_resit" | "any";
  /** Whether prerequisite modules must be completed. */
  requirePrerequisiteCompletion: boolean;
}

export const FINANCIAL_OPTIONS: Array<{ value: EligibilityRule["financialStatus"]; label: string }> = [
  { value: "any", label: "No financial requirement" },
  { value: "no_overdue_debt", label: "No overdue debt" },
  { value: "fee_paid_for_resit", label: "Fee paid for resit" },
];

export function buildLogicSummary(r: {
  minAttendancePercent: number;
  financialStatus: EligibilityRule["financialStatus"];
  requirePrerequisiteCompletion: boolean;
}): string {
  const parts: string[] = [];
  parts.push(`Min attendance ≥ ${r.minAttendancePercent}%`);
  if (r.financialStatus === "no_overdue_debt") parts.push("No outstanding debt");
  if (r.financialStatus === "fee_paid_for_resit") parts.push("Fee paid for resit");
  if (r.requirePrerequisiteCompletion) parts.push("Prerequisite modules completed");
  return parts.join(" AND ");
}

const STORAGE_KEY = "exam-eligibility-rules";

const DEFAULT_RULES: EligibilityRule[] = [
  {
    id: "r1",
    name: "Default exam eligibility",
    logic: "Min attendance ≥ 80% AND No outstanding debt",
    active: true,
    minAttendancePercent: 80,
    financialStatus: "no_overdue_debt",
    requirePrerequisiteCompletion: false,
  },
  {
    id: "r2",
    name: "Resit eligibility",
    logic: "Min attendance ≥ 70% AND Fee paid for resit",
    active: true,
    minAttendancePercent: 70,
    financialStatus: "fee_paid_for_resit",
    requirePrerequisiteCompletion: false,
  },
  {
    id: "r3",
    name: "Thesis defense",
    logic: "Min attendance ≥ 80% AND Prerequisite modules completed",
    active: false,
    minAttendancePercent: 80,
    financialStatus: "any",
    requirePrerequisiteCompletion: true,
  },
];

export function getStoredRules(): EligibilityRule[] {
  if (typeof window === "undefined") return DEFAULT_RULES;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RULES;
    const parsed = JSON.parse(raw) as EligibilityRule[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RULES;
  } catch {
    return DEFAULT_RULES;
  }
}

export function setStoredRules(rules: EligibilityRule[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    /* ignore */
  }
}

export function getRuleById(id: string): EligibilityRule | undefined {
  return getStoredRules().find((r) => r.id === id);
}

export { DEFAULT_RULES };
