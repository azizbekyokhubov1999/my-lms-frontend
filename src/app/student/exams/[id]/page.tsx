"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";

/** Redirect to exam-taking route (canonical exam flow) */
export default function ExamIdRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const examId = (params?.id as string) || "";
  React.useEffect(() => {
    if (examId) router.replace(`/student/exams/${examId}/exam-taking`);
    else router.replace("/student/exams");
  }, [examId, router]);
  return (
    <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
      Redirecting to exam…
    </div>
  );
}
