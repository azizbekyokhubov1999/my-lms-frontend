"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher" className="text-xs font-medium text-teal-600 hover:underline">
          ← Teacher Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Central Material Management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Organize files, upload in bulk, and tag materials by subject.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/teacher/materials/materials-library">
          <Card className="h-full rounded-lg border-slate-200 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/20">
            <h3 className="font-semibold text-slate-900">Materials Library</h3>
            <p className="mt-1 text-sm text-slate-600">
              File-manager style UI. Organize into folders, tag by subject, see which courses use each file.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">Open library →</span>
          </Card>
        </Link>
        <Link href="/teacher/materials/material-upload">
          <Card className="h-full rounded-lg border-slate-200 p-6 transition-colors hover:border-teal-300 hover:bg-teal-50/20">
            <h3 className="font-semibold text-slate-900">Upload Hub</h3>
            <p className="mt-1 text-sm text-slate-600">
              Drag-and-drop bulk uploads with metadata: Title, Type, Accessibility.
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-teal-600">Go to upload →</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
