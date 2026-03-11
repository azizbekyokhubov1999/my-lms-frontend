"use client";

import Link from "next/link";
import * as React from "react";

import { useAuth } from "@/hooks/useAuth";
import { Card } from "../../components/ui/Card";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Documents received",
    body: "Your uploaded documents have been received and are under review.",
    date: "Mar 5, 2026",
    read: true,
    type: "info",
  },
  {
    id: "2",
    title: "Exam slot available",
    body: "You can now schedule your entrance exam. Go to Exams to choose a slot.",
    date: "Mar 4, 2026",
    read: false,
    type: "action",
  },
  {
    id: "3",
    title: "Document Rejected",
    body: "One or more documents did not meet requirements. Please resubmit with the corrections listed in your Documents section.",
    date: "Mar 3, 2026",
    read: true,
    type: "alert",
  },
];

export default function ApplicantNotificationsPage() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          System alerts and updates for your application.
        </p>

        <ul className="mt-6 space-y-3">
          {MOCK_NOTIFICATIONS.map((n) => (
            <li key={n.id}>
              <Card
                className={cn(
                  "border-l-4",
                  n.type === "alert" && "border-l-amber-500",
                  n.type === "action" && "border-l-blue-900",
                  n.type === "info" && "border-l-slate-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className={cn(
                        "text-sm font-semibold",
                        !n.read && "text-slate-900"
                      )}
                    >
                      {n.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                    <p className="mt-2 text-xs text-slate-500">{n.date}</p>
                  </div>
                  {!n.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-900" />
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-slate-600">
          <Link
            href="/admission/status"
            className="font-medium text-blue-900 hover:underline"
          >
            ← Back to Overview
          </Link>
        </p>
      </div>
    </div>
  );
}

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
