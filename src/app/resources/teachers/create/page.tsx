"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

export default function CreateTeacherPage() {
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/resources/teachers"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Teachers
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create teacher</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Enter personal details, academic background, and subject expertise.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="First name" required />
            <Input label="Last name" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Email" type="email" required />
            <Input label="Phone" type="tel" />
          </div>
          <Input label="Academic title" placeholder="e.g. Associate Professor" />
          <Input label="Primary department / faculty" placeholder="e.g. School of Engineering" />

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Academic background
            </label>
            <textarea
              rows={4}
              placeholder="Degrees, institutions, and key qualifications."
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800">
              Subject expertise
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Algorithms, Distributed Systems, Software Architecture."
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <p className="mt-0.5 text-xs text-slate-500">
              Include main subjects and any cross-listed expertise.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Preferred teaching language" placeholder="e.g. English, Russian" />
            <Input label="Employee ID" placeholder="Internal HR code (optional)" />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
            <Link href="/resources/teachers">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700"
            >
              {saved ? "Saved (Demo)" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

