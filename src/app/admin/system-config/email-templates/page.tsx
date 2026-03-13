"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Sent when a new user account is created.",
    variables: ["user_name", "user_email", "login_url"],
  },
  {
    id: "password_reset",
    name: "Password Reset",
    description: "Sent when user requests a password reset.",
    variables: ["user_name", "reset_url", "expiry_minutes"],
  },
  {
    id: "grade_published",
    name: "Grade Published",
    description: "Sent when a teacher publishes a grade for an assignment.",
    variables: ["user_name", "course_name", "assignment_name", "grade", "feedback_url"],
  },
];

const DEFAULT_CONTENT: Record<string, string> = {
  welcome: `Hi {{user_name}},

Welcome to our platform. Your account has been created with email {{user_email}}.

Log in here: {{login_url}}

Best regards,
The Team`,
  password_reset: `Hi {{user_name}},

You requested a password reset. Use the link below within {{expiry_minutes}} minutes:

{{reset_url}}

If you didn't request this, ignore this email.

Best regards,
The Team`,
  grade_published: `Hi {{user_name}},

Your grade for {{assignment_name}} in {{course_name}} has been published.

Grade: {{grade}}

View details: {{feedback_url}}

Best regards,
The Team`,
};

export default function EmailTemplatesPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>("welcome");
  const [content, setContent] = React.useState<Record<string, string>>(DEFAULT_CONTENT);
  const [saved, setSaved] = React.useState(false);

  const selected = TEMPLATES.find((t) => t.id === selectedId);
  const currentContent = selectedId ? content[selectedId] ?? DEFAULT_CONTENT[selectedId] ?? "" : "";

  const setCurrentContent = (value: string) => {
    if (selectedId) setContent((prev) => ({ ...prev, [selectedId]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/system-config" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← System Config
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Email Templates</h1>
          <p className="mt-1 text-sm text-slate-600">
            Edit system emails. Use variables like {"{{user_name}}"} in your content.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/system-config"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            General
          </Link>
          <Link
            href="/admin/system-config/email-templates"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Email Templates
          </Link>
          <Link
            href="/admin/system-config/payment"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Payment
          </Link>
          <Link
            href="/admin/system-config/integrations"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Integrations
          </Link>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit p-2">
          <ul className="space-y-0.5">
            {TEMPLATES.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    selectedId === t.id
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col p-0">
          {selected ? (
            <>
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="font-semibold text-slate-900">{selected.name}</h2>
                <p className="mt-0.5 text-sm text-slate-600">{selected.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Variables: {selected.variables.map((v) => `{{${v}}}`).join(", ")}
                </p>
              </div>
              <div className="flex-1 p-4">
                <label htmlFor="template-body" className="sr-only">
                  Template body
                </label>
                <textarea
                  id="template-body"
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  rows={14}
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50/50 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="Enter email body with {{variables}}..."
                  spellCheck={false}
                />
              </div>
              <div className="border-t border-slate-100 px-4 py-3">
                <Button type="button" variant="primary" size="sm" onClick={handleSave}>
                  {saved ? "Saved" : "Save template"}
                </Button>
              </div>
            </>
          ) : (
            <p className="p-6 text-slate-500">Select a template from the list.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
