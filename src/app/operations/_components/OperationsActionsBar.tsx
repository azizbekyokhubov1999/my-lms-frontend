"use client";

import * as React from "react";

export default function OperationsActionsBar({
  onRefresh,
  getReport,
  reportFileBaseName,
}: {
  onRefresh: () => void;
  getReport: () => string;
  reportFileBaseName: string;
}) {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = React.useCallback(() => {
    if (downloading) return;
    setDownloading(true);

    try {
      const content = getReport();
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date()
        .toISOString()
        .replace(/[:]/g, "-")
        .replace(/\..+$/, "");
      a.href = url;
      a.download = `${reportFileBaseName}-${ts}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [downloading, getReport, reportFileBaseName]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-400/30 bg-indigo-400/5 px-4 py-3">
      <button
        type="button"
        onClick={onRefresh}
        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
      >
        Refresh Data
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {downloading ? "Preparing..." : "Download Report"}
      </button>
    </div>
  );
}

