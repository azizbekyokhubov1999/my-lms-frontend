"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const MOCK_FEEDBACK = [
  { id: "f1", user: "Alex Johnson", role: "Teacher", rating: 5, comment: "Gradebook and assignment workflow are clear. Would love bulk export for reports.", at: "2026-03-05" },
  { id: "f2", user: "Jordan Lee", role: "Student", rating: 4, comment: "Mobile view is good but quiz timer sometimes glitches on slow connections.", at: "2026-03-04" },
  { id: "f3", user: "Riley Davis", role: "Student", rating: 3, comment: "Login took several tries; password reset email was slow to arrive.", at: "2026-03-04" },
  { id: "f4", user: "Morgan Kim", role: "Teacher", rating: 5, comment: "Course materials and video uploads work well. Teams integration is a plus.", at: "2026-03-03" },
  { id: "f5", user: "Sam Chen", role: "Student", rating: 4, comment: "Usability is generally good. More filters on the course list would help.", at: "2026-03-02" },
];

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= value ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default function UserFeedbackPage() {
  const [ratingFilter, setRatingFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    if (!ratingFilter) return MOCK_FEEDBACK;
    const r = Number(ratingFilter);
    return MOCK_FEEDBACK.filter((f) => f.rating === r);
  }, [ratingFilter]);

  const avgRating = (MOCK_FEEDBACK.reduce((a, f) => a + f.rating, 0) / MOCK_FEEDBACK.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/support" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Support
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">User Feedback</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ratings and comments about platform usability.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link href="/admin/support" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Tickets</Link>
          <Link href="/admin/support/feedback" className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900">Feedback</Link>
          <Link href="/admin/support/knowledge-base" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">Knowledge Base</Link>
        </nav>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Average rating</p>
            <p className="text-2xl font-bold text-slate-900">{avgRating} <span className="text-amber-500">★</span></p>
          </div>
          <div>
            <label htmlFor="rating-filter" className="block text-xs font-medium text-slate-700">Filter by rating</label>
            <select
              id="rating-filter"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
        </div>
        <ul className="divide-y divide-slate-100">
          {filtered.map((f) => (
            <li key={f.id} className="py-4 first:pt-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating value={f.rating} />
                    <span className="font-medium text-slate-900">{f.user}</span>
                    <span className="text-xs text-slate-500">({f.role})</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{f.comment}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{f.at}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-slate-500">No feedback match the filter.</p>
        )}
      </Card>
    </div>
  );
}
