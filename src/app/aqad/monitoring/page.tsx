"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ATTENDANCE_THRESHOLD = 60;
const FEEDBACK_THRESHOLD = 3;

interface LiveCourse {
  id: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  /** % of planned materials uploaded */
  contentDelivery: number;
  /** Average comments/questions per student (e.g. per week) */
  interaction: number;
  /** % attendance (e.g. last 4 weeks) */
  attendance: number;
  /** Student feedback score out of 5 */
  feedbackScore: number;
  /** Currently in a live lecture session */
  isLive: boolean;
}

const LIVE_STATS = {
  activeCourses: 12,
  averageAttendance: 87,
  studentsAtRisk: 23,
  ongoingLectures: 3,
};

const LIVE_COURSES: LiveCourse[] = [
  {
    id: "1",
    courseName: "CS 440 - Machine Learning",
    courseCode: "CS 440",
    instructor: "Prof. Sarah Chen",
    contentDelivery: 92,
    interaction: 4.2,
    attendance: 88,
    feedbackScore: 4.1,
    isLive: true,
  },
  {
    id: "2",
    courseName: "CS 210 - Data Structures",
    courseCode: "CS 210",
    instructor: "Dr. James Wilson",
    contentDelivery: 80,
    interaction: 2.8,
    attendance: 72,
    feedbackScore: 3.6,
    isLive: false,
  },
  {
    id: "3",
    courseName: "Physics 201",
    courseCode: "PHY 201",
    instructor: "Prof. Michael Brown",
    contentDelivery: 65,
    interaction: 1.5,
    attendance: 54,
    feedbackScore: 2.8,
    isLive: true,
  },
  {
    id: "4",
    courseName: "RES 301 - Research Methods",
    courseCode: "RES 301",
    instructor: "Dr. Emma Davis",
    contentDelivery: 78,
    interaction: 3.1,
    attendance: 61,
    feedbackScore: 2.9,
    isLive: false,
  },
  {
    id: "5",
    courseName: "CS 350 - Database Systems",
    courseCode: "CS 350",
    instructor: "Prof. Michael Brown",
    contentDelivery: 95,
    interaction: 5.0,
    attendance: 91,
    feedbackScore: 4.3,
    isLive: true,
  },
  {
    id: "6",
    courseName: "Chemistry 101",
    courseCode: "CHE 101",
    instructor: "Dr. Emma Davis",
    contentDelivery: 70,
    interaction: 2.0,
    attendance: 58,
    feedbackScore: 3.2,
    isLive: false,
  },
];

function hasWarningFlag(course: LiveCourse): boolean {
  return (
    course.attendance < ATTENDANCE_THRESHOLD ||
    course.feedbackScore < FEEDBACK_THRESHOLD
  );
}

function getFlags(course: LiveCourse): string[] {
  const flags: string[] = [];
  if (course.attendance < ATTENDANCE_THRESHOLD) {
    flags.push(`Attendance ${course.attendance}% (< ${ATTENDANCE_THRESHOLD}%)`);
  }
  if (course.feedbackScore < FEEDBACK_THRESHOLD) {
    flags.push(`Feedback ${course.feedbackScore}/5 (< ${FEEDBACK_THRESHOLD}/5)`);
  }
  return flags;
}

export default function LiveCourseMonitoringPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Live course monitoring
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Real-time metrics, course performance, and quick actions for flagged courses.
        </p>
      </section>

      {/* 1. Live Stats Grid */}
      <section>
        <h2 className="sr-only">Live stats</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-lg border-slate-200 bg-white">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active courses
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {LIVE_STATS.activeCourses}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">Currently running</p>
          </Card>
          <Card className="rounded-lg border-slate-200 bg-white">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Average attendance
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {LIVE_STATS.averageAttendance}%
            </p>
            <p className="mt-0.5 text-xs text-slate-600">University-wide</p>
          </Card>
          <Card className="rounded-lg border-slate-200 bg-white">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Students at risk
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-700">
              {LIVE_STATS.studentsAtRisk}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">Low engagement</p>
          </Card>
          <Card className="rounded-lg border-slate-200 bg-white">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Ongoing lectures
            </p>
            <p className="mt-1 text-2xl font-bold text-sky-700">
              {LIVE_STATS.ongoingLectures}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">Live now</p>
          </Card>
        </div>
      </section>

      {/* 2. Course Performance Table */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Course performance
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Live courses with content delivery, interaction, and warning flags (attendance &lt; 60% or feedback &lt; 3/5)
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Content delivery
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Interaction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Attendance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Feedback
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Warning flags
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Quick action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {LIVE_COURSES.map((course) => {
                  const flagged = hasWarningFlag(course);
                  const flags = getFlags(course);
                  return (
                    <tr
                      key={course.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50",
                        flagged && "border-l-4 border-l-amber-400 bg-amber-50/30",
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {course.instructor}
                          {course.isLive && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                              Live
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-semibold",
                            course.contentDelivery >= 80
                              ? "text-emerald-700"
                              : "text-amber-700",
                          )}
                        >
                          {course.contentDelivery}%
                        </span>
                        <p className="text-[10px] text-slate-500">
                          materials uploaded
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="font-medium">
                          {course.interaction.toFixed(1)}
                        </span>
                        <p className="text-[10px] text-slate-500">
                          avg comments/questions
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-semibold",
                            course.attendance >= ATTENDANCE_THRESHOLD
                              ? "text-slate-800"
                              : "text-red-700",
                          )}
                        >
                          {course.attendance}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-semibold",
                            course.feedbackScore >= FEEDBACK_THRESHOLD
                              ? "text-slate-800"
                              : "text-red-700",
                          )}
                        >
                          {course.feedbackScore}/5
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {flags.length === 0 ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <ul className="space-y-0.5">
                            {flags.map((f) => (
                              <li
                                key={f}
                                className="text-xs font-medium text-amber-800"
                              >
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {course.isLive && (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-600"
                            >
                              View live class
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            Message instructor
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
