import * as React from "react";

export default function PlaceholderSection({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-100/70">{description}</p>
        ) : null}
      </div>

      <div className="rounded-lg border border-indigo-400/30 bg-indigo-400/5 p-4 text-sm text-slate-100/70">
        This page is currently a placeholder for the IT Operations module.
      </div>
    </div>
  );
}

