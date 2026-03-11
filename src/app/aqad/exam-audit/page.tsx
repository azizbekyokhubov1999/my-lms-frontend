"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ForensicMarker {
  time: string; // exam-relative MM:SS
  message: string;
}

interface AuditLog {
  id: string;
  studentName: string;
  courseName: string;
  examDate: string;
  riskScore: number;
  alerts: { timestamp: string; message: string }[];
  forensicTimeline: ForensicMarker[];
  slaHoursRemaining: number;
}

const AUDIT_LOGS: AuditLog[] = [
  {
    id: "1",
    studentName: "John Smith",
    courseName: "CS 440 - Machine Learning",
    examDate: "Mar 5, 2026 14:30",
    riskScore: 82,
    alerts: [
      { timestamp: "14:35:12", message: "Face not detected for 8 seconds" },
      { timestamp: "14:42:08", message: "Secondary screen detected" },
      { timestamp: "14:58:33", message: "Multiple faces in frame" },
    ],
    forensicTimeline: [
      { time: "05:20", message: "Multiple faces detected" },
      { time: "08:15", message: "Audio noise / background speech" },
      { time: "12:40", message: "Face not detected" },
      { time: "18:22", message: "Secondary screen / device detected" },
    ],
    slaHoursRemaining: 23,
  },
  {
    id: "2",
    studentName: "Emma Davis",
    courseName: "RES 301 - Research Methods",
    examDate: "Mar 4, 2026 10:00",
    riskScore: 45,
    alerts: [
      { timestamp: "10:12:05", message: "Brief glance away from screen" },
    ],
    forensicTimeline: [
      { time: "14:00", message: "Brief glance away from screen" },
    ],
    slaHoursRemaining: 48,
  },
  {
    id: "3",
    studentName: "Michael Brown",
    courseName: "CS 350 - Database Systems",
    examDate: "Mar 3, 2026 15:45",
    riskScore: 91,
    alerts: [
      { timestamp: "15:48:22", message: "Face not detected for 12 seconds" },
      { timestamp: "15:52:40", message: "Secondary screen detected" },
      { timestamp: "15:55:11", message: "Suspicious head movement pattern" },
      { timestamp: "16:02:55", message: "Multiple faces in frame" },
    ],
    forensicTimeline: [
      { time: "03:10", message: "Face not detected" },
      { time: "07:45", message: "Secondary screen detected" },
      { time: "11:20", message: "Suspicious head movement" },
      { time: "17:35", message: "Multiple faces in frame" },
    ],
    slaHoursRemaining: 12,
  },
  {
    id: "4",
    studentName: "Sarah Chen",
    courseName: "CS 210 - Data Structures",
    examDate: "Mar 2, 2026 09:00",
    riskScore: 12,
    alerts: [],
    forensicTimeline: [],
    slaHoursRemaining: 72,
  },
];

export default function ExamAuditPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = selectedId
    ? AUDIT_LOGS.find((log) => log.id === selectedId)
    : null;

  const getRiskStyles = (score: number) => {
    if (score >= 70) return "bg-red-100 text-red-800 border-red-200";
    if (score >= 40) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  const isHighRisk = (score: number) => score >= 70;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Exam audit
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review proctoring logs and forensic reports. Take action on
          high-risk exams.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Audit Logs List */}
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Audit logs
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Completed exams with proctoring risk score (0–100%)
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                      Student / Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                      Exam date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                      Risk score
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {AUDIT_LOGS.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedId(log.id)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-slate-50",
                        selectedId === log.id && "bg-indigo-50 hover:bg-indigo-50",
                        isHighRisk(log.riskScore) &&
                          "border-l-4 border-l-red-400",
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="block font-medium text-slate-900">
                          {log.studentName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {log.courseName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {log.examDate}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2 py-0.5 text-xs font-bold",
                            getRiskStyles(log.riskScore),
                          )}
                        >
                          {log.riskScore}%
                        </span>
                        {isHighRisk(log.riskScore) && (
                          <span className="ml-1 text-[10px] font-semibold text-red-600">
                            High risk
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="text-xs font-medium text-indigo-600 hover:underline"
                        >
                          View report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Forensic Report (when selected) */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Forensic report
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Timestamped alerts and recording
          </p>

          {selected ? (
            <Card className="mt-3 rounded-lg border-slate-200">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <p className="font-semibold text-slate-900">
                    {selected.studentName}
                  </p>
                  <p className="text-xs text-slate-600">{selected.courseName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selected.examDate}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs font-bold",
                      getRiskStyles(selected.riskScore),
                    )}
                  >
                    Risk: {selected.riskScore}%
                  </span>
                </div>

                {/* Timestamped alerts */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700">
                    Timestamped alerts
                  </h3>
                  {selected.alerts.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">
                      No alerts during this exam.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {selected.alerts.map((alert, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-xs"
                        >
                          <span className="shrink-0 font-mono font-semibold text-red-700">
                            {alert.timestamp}
                          </span>
                          <span className="text-red-800">{alert.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Video placeholder */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700">
                    Recorded video
                  </h3>
                  <div className="mt-2 flex h-32 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                    <div className="text-center text-xs text-slate-400">
                      <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-slate-500" />
                      <p>Video placeholder</p>
                      <p className="text-[10px]">Exam recording</p>
                    </div>
                  </div>
                </div>

                {/* AI Forensic Timeline */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700">
                    AI forensic timeline
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Timestamped markers where AI detected potential issues (exam time)
                  </p>
                  {selected.forensicTimeline.length === 0 ? (
                    <p className="mt-2 text-xs text-slate-500">
                      No AI-detected incidents.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-1.5">
                      {selected.forensicTimeline.map((marker, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs"
                        >
                          <span className="shrink-0 font-mono font-bold text-red-700">
                            {marker.time}
                          </span>
                          <span className="text-red-800">{marker.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SLA Timer */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <h3 className="text-xs font-semibold text-amber-900">
                    SLA timer
                  </h3>
                  <p className="mt-1 font-mono text-sm font-bold text-amber-800">
                    {selected.slaHoursRemaining}h remaining
                  </p>
                  <p className="text-[10px] text-amber-700">
                    Time to resolve per university policy
                  </p>
                </div>

                {/* Decision actions */}
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h3 className="text-xs font-semibold text-slate-700">
                    Decision actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600"
                    >
                      Validate result
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
                    >
                      Invalidate result (cheating)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-amber-500 text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500"
                    >
                      Escalate to director
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="mt-3 flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Select an exam to view the forensic report
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
