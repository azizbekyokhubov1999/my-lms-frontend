"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";

import {
  type EligibilityRule,
  buildLogicSummary,
  FINANCIAL_OPTIONS,
  getStoredRules,
  setStoredRules,
} from "../../eligibilityRules";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ManageRulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = Boolean(id);

  const [name, setName] = React.useState("");
  const [minAttendancePercent, setMinAttendancePercent] = React.useState(80);
  const [financialStatus, setFinancialStatus] = React.useState<EligibilityRule["financialStatus"]>("no_overdue_debt");
  const [requirePrerequisiteCompletion, setRequirePrerequisiteCompletion] = React.useState(false);
  const [active, setActive] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isEdit && id) {
      const rules = getStoredRules();
      const rule = rules.find((r) => r.id === id);
      if (rule) {
        setName(rule.name);
        setMinAttendancePercent(rule.minAttendancePercent);
        setFinancialStatus(rule.financialStatus);
        setRequirePrerequisiteCompletion(rule.requirePrerequisiteCompletion);
        setActive(rule.active);
      }
    } else {
      setName("");
      setMinAttendancePercent(80);
      setFinancialStatus("no_overdue_debt");
      setRequirePrerequisiteCompletion(false);
      setActive(true);
    }
    setLoaded(true);
  }, [isEdit, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const percent = Math.min(100, Math.max(0, Number(minAttendancePercent) || 0));
    setSaving(true);

    const logic = buildLogicSummary({
      minAttendancePercent: percent,
      financialStatus,
      requirePrerequisiteCompletion,
    });

    const rules = getStoredRules();
    const newRule: EligibilityRule = {
      id: isEdit && id ? id : `r${Date.now()}`,
      name: name.trim(),
      logic,
      active,
      minAttendancePercent: percent,
      financialStatus,
      requirePrerequisiteCompletion,
    };

    const next = isEdit && id
      ? rules.map((r) => (r.id === id ? newRule : r))
      : [...rules, newRule];
    setStoredRules(next);
    router.push("/academic/exam-eligibility");
  };

  if (!loaded && isEdit) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading rule…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/academic/exam-eligibility"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to eligibility rules
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {isEdit ? "Edit rule" : "Create rule"}
        </h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Set minimum attendance, financial status, and prerequisite requirements. All conditions are combined with AND.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Rule name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Default exam eligibility"
            required
            className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
          />

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Minimum attendance %
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={minAttendancePercent}
              onChange={(e) => setMinAttendancePercent(Number(e.target.value) || 0)}
              className="mt-1 block w-full max-w-[120px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            <p className="mt-0.5 text-xs text-slate-500">
              Students must have at least this attendance percentage (e.g. 80 for 80%).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Financial status requirement
            </label>
            <select
              value={financialStatus}
              onChange={(e) => setFinancialStatus(e.target.value as EligibilityRule["financialStatus"])}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              {FINANCIAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-0.5 text-xs text-slate-500">
              e.g. &quot;No overdue debt&quot; or &quot;Fee paid for resit&quot;.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="prereq"
              checked={requirePrerequisiteCompletion}
              onChange={(e) => setRequirePrerequisiteCompletion(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <label htmlFor="prereq" className="text-sm font-medium text-slate-800">
                Require prerequisite module completion
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Student must have completed all prerequisite modules for the exam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <label htmlFor="active" className="text-sm font-medium text-slate-800">
                Rule active
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Inactive rules are not applied when evaluating eligibility.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
            <Link href="/academic/exam-eligibility">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving || !name.trim()}
              className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
