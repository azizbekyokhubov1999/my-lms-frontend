"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ContentType = "article" | "faq";

interface Article {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  body: string;
}

const INITIAL_ARTICLES: Article[] = [
  { id: "a1", type: "article", title: "Getting started for students", slug: "getting-started-students", body: "Welcome! This guide walks you through enrolling in courses, submitting assignments, and viewing grades.\n\n1. Log in with your university credentials.\n2. Go to My Courses to see your enrollments.\n3. Open a course to access materials and assignments.\n4. Submit work before the due date and check feedback in the gradebook." },
  { id: "a2", type: "article", title: "Gradebook for teachers", slug: "gradebook-teachers", body: "The gradebook shows all students and their scores for assignments, quizzes, and exams.\n\n- Use the course selector to switch courses.\n- Post grades from the assignment grading page; they appear in the gradebook.\n- Use the Refresh button to load the latest scores.\n- Export or filter by student/group as needed." },
  { id: "f1", type: "faq", title: "I forgot my password", slug: "faq-forgot-password", body: "Click \"Forgot password\" on the login page. Enter your email and we will send a reset link. The link expires in 60 minutes. If you do not see the email, check spam or request another link." },
  { id: "f2", type: "faq", title: "My grade is missing or wrong", slug: "faq-grade-issue", body: "Teachers publish grades from the assignment or exam grading screens. If you believe a grade is missing or incorrect, contact your instructor or open a support ticket with your course name and assignment details." },
];

export default function KnowledgeBasePage() {
  const [items, setItems] = React.useState<Article[]>(INITIAL_ARTICLES);
  const [selectedId, setSelectedId] = React.useState<string | null>(INITIAL_ARTICLES[0]?.id ?? null);
  const [typeFilter, setTypeFilter] = React.useState<ContentType | "">("");

  const selected = items.find((i) => i.id === selectedId);
  const filteredList = typeFilter ? items.filter((i) => i.type === typeFilter) : items;

  const updateSelected = (patch: Partial<Article>) => {
    if (!selectedId) return;
    setItems((prev) => prev.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)));
  };

  const addNew = (type: ContentType) => {
    const id = "n" + Date.now();
    const newItem: Article = {
      id,
      type,
      title: type === "faq" ? "New FAQ" : "New help article",
      slug: type === "faq" ? "faq-new" : "article-new",
      body: "",
    };
    setItems((prev) => [...prev, newItem]);
    setSelectedId(id);
  };

  const removeItem = (id: string) => {
    if (!confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(filteredList[0]?.id ?? null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/support" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Support
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage help articles and FAQ for students and teachers.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/support" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Tickets</Link>
          <Link href="/admin/support/feedback" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Feedback</Link>
          <Link href="/admin/support/knowledge-base" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Knowledge Base</Link>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit p-3">
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter("")}
              className={cn("rounded px-2 py-1 text-xs font-medium", !typeFilter ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600")}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("article")}
              className={cn("rounded px-2 py-1 text-xs font-medium", typeFilter === "article" ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600")}
            >
              Help Articles
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("faq")}
              className={cn("rounded px-2 py-1 text-xs font-medium", typeFilter === "faq" ? "bg-slate-200 text-slate-900" : "bg-slate-100 text-slate-600")}
            >
              FAQ
            </button>
          </div>
          <div className="mb-2 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => addNew("article")}>
              + Article
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => addNew("faq")}>
              + FAQ
            </Button>
          </div>
          <ul className="space-y-0.5">
            {filteredList.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selectedId === item.id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <span className="block truncate">{item.title}</span>
                  <span className="text-xs text-slate-500">{item.type === "faq" ? "FAQ" : "Article"}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col p-0">
          {selected ? (
            <>
              <div className="border-b border-slate-100 px-4 py-3">
                <input
                  type="text"
                  value={selected.title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-lg font-semibold text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={selected.slug}
                  onChange={(e) => updateSelected({ slug: e.target.value })}
                  className="mt-2 w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-mono text-slate-600 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="Slug (URL)"
                />
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={selected.body}
                  onChange={(e) => updateSelected({ body: e.target.value })}
                  rows={14}
                  className="block w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="Content (markdown or plain text)..."
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                <Button variant="secondary" size="sm" onClick={() => removeItem(selected.id)}>
                  Delete
                </Button>
                <Button variant="primary" size="sm">Save</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-slate-500">
              Select an article or FAQ, or create a new one.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
