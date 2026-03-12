"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface Lecture {
  id: string;
  title: string;
  durationMinutes?: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

interface CourseMetadata {
  title: string;
  description: string;
  category: string;
  credits: string;
}

type MaterialType = "pdf" | "video_link" | "quiz";

interface MaterialResource {
  id: string;
  type: MaterialType;
  title: string;
  description: string;
  /** For video_link: YouTube or Teams URL */
  url?: string;
  /** For pdf/quiz: displayed file name after upload */
  fileName?: string;
  /** 0–100 when uploading */
  uploadProgress?: number;
}

const CATEGORIES = ["Computer Science", "Engineering", "Research", "Business", "Mathematics", "Other"];

const EMPTY_METADATA: CourseMetadata = {
  title: "",
  description: "",
  category: "Computer Science",
  credits: "",
};

const DEFAULT_MODULES: Module[] = [
  { id: "m1", title: "Introduction", order: 0, lectures: [{ id: "l1", title: "Welcome & Syllabus", durationMinutes: 15 }] },
  { id: "m2", title: "Core Concepts", order: 1, lectures: [{ id: "l2", title: "Lecture 1: Foundations", durationMinutes: 45 }, { id: "l3", title: "Lecture 2: Deep Dive", durationMinutes: 50 }] },
  { id: "m3", title: "Applications", order: 2, lectures: [] },
];

function computeCompleteness(meta: CourseMetadata, modules: Module[]): number {
  let score = 0;
  const total = 6;
  if (meta.title.trim()) score += 1;
  if (meta.description.trim()) score += 1;
  if (meta.category) score += 1;
  if (meta.credits.trim()) score += 1;
  if (modules.length > 0) score += 1;
  const hasLectures = modules.some((m) => m.lectures.length > 0);
  if (hasLectures) score += 1;
  return Math.round((score / total) * 100);
}

export default function CourseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";
  const isNewCourse = id === "new";

  const [resolvedId, setResolvedId] = React.useState<string | null>(null);
  const [metadata, setMetadata] = React.useState<CourseMetadata>(
    isNewCourse ? EMPTY_METADATA : {
      title: "Machine Learning",
      description: "Introduction to supervised and unsupervised learning, model evaluation, and practical applications.",
      category: "Computer Science",
      credits: "3",
    },
  );
  const [modules, setModules] = React.useState<Module[]>(isNewCourse ? [] : DEFAULT_MODULES);
  const [expandedModuleId, setExpandedModuleId] = React.useState<string | null>(isNewCourse ? null : "m1");
  const [submitted, setSubmitted] = React.useState(false);
  const [saveToast, setSaveToast] = React.useState<"saving" | "saved" | null>(null);
  const [materials, setMaterials] = React.useState<MaterialResource[]>(
    isNewCourse
      ? []
      : [
          { id: "mat1", type: "video_link", title: "Intro video", description: "Week 1 overview recording.", url: "https://teams.microsoft.com/..." },
          { id: "mat2", type: "pdf", title: "Syllabus", description: "Course syllabus and policies.", fileName: "syllabus.pdf", uploadProgress: 100 },
        ],
  );
  const [materialModalOpen, setMaterialModalOpen] = React.useState(false);
  const [newMaterialType, setNewMaterialType] = React.useState<MaterialType>("pdf");
  const [newMaterialTitle, setNewMaterialTitle] = React.useState("");
  const [newMaterialDescription, setNewMaterialDescription] = React.useState("");
  const [newMaterialUrl, setNewMaterialUrl] = React.useState("");
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadFileName, setUploadFileName] = React.useState("");
  const uploadSimulationRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const completeness = computeCompleteness(metadata, modules);

  const openMaterialModal = () => {
    setNewMaterialType("pdf");
    setNewMaterialTitle("");
    setNewMaterialDescription("");
    setNewMaterialUrl("");
    setUploadProgress(0);
    setUploadFileName("");
    setMaterialModalOpen(true);
  };

  const closeMaterialModal = () => {
    setMaterialModalOpen(false);
    if (uploadSimulationRef.current) {
      clearInterval(uploadSimulationRef.current);
      uploadSimulationRef.current = null;
    }
  };

  const simulateFileUpload = (file: File, onDone: (fileName: string) => void) => {
    setUploadProgress(0);
    setUploadFileName(file.name);
    let progress = 0;
    uploadSimulationRef.current = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        if (uploadSimulationRef.current) {
          clearInterval(uploadSimulationRef.current);
          uploadSimulationRef.current = null;
        }
        setUploadProgress(100);
        onDone(file.name);
        return;
      }
      setUploadProgress(Math.round(progress));
    }, 200);
  };

  const addMaterial = () => {
    const id = "mat" + Date.now();
    if (newMaterialType === "video_link") {
      setMaterials((prev) => [
        ...prev,
        { id, type: "video_link", title: newMaterialTitle || "Video link", description: newMaterialDescription, url: newMaterialUrl },
      ]);
    } else {
      setMaterials((prev) => [
        ...prev,
        { id, type: newMaterialType, title: newMaterialTitle || (newMaterialType === "pdf" ? "PDF" : "Quiz"), description: newMaterialDescription, fileName: uploadFileName || undefined, uploadProgress: 100 },
      ]);
    }
    closeMaterialModal();
  };

  const updateMaterial = (matId: string, updates: Partial<MaterialResource>) => {
    setMaterials((prev) => prev.map((m) => (m.id === matId ? { ...m, ...updates } : m)));
  };

  const removeMaterial = (matId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== matId));
  };

  const addModule = () => {
    const newId = "m" + Date.now();
    setModules((prev) => [
      ...prev,
      { id: newId, title: "New Module", order: prev.length, lectures: [] },
    ]);
    setExpandedModuleId(newId);
  };

  const updateModule = (moduleId: string, updates: Partial<Pick<Module, "title" | "order">>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
    );
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    if (expandedModuleId === moduleId) setExpandedModuleId(prev[0]?.id ?? null);
  };

  const moveModule = (moduleId: string, direction: "up" | "down") => {
    const idx = modules.findIndex((m) => m.id === moduleId);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= modules.length) return;
    const reordered = [...modules];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    setModules(reordered.map((m, i) => ({ ...m, order: i })));
  };

  const addLecture = (moduleId: string) => {
    const newId = "l" + Date.now();
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lectures: [...m.lectures, { id: newId, title: "New Lecture", durationMinutes: 30 }] }
          : m,
      ),
    );
  };

  const updateLecture = (moduleId: string, lectureId: string, updates: Partial<Lecture>) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lectures: m.lectures.map((l) => (l.id === lectureId ? { ...l, ...updates } : l)) }
          : m,
      ),
    );
  };

  const removeLecture = (moduleId: string, lectureId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lectures: m.lectures.filter((l) => l.id !== lectureId) } : m,
      ),
    );
  };

  const handleSubmitToAqad = () => {
    setSubmitted(true);
  };

  const effectiveId = resolvedId ?? id;

  const handleSaveDraft = () => {
    setSaveToast("saving");
    const newId = isNewCourse && !resolvedId ? "c" + Date.now() : effectiveId;
    if (isNewCourse && !resolvedId) {
      setResolvedId(newId);
      router.replace(`/teacher/courses/builder/${newId}`);
    }
    setTimeout(() => {
      setSaveToast("saved");
      setTimeout(() => setSaveToast(null), 2500);
    }, 1200);
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/courses" className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to Courses
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Course not found.</p>
          <Link href="/teacher/courses">
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Back to Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky header with Save Draft */}
      <header className="sticky top-0 z-10 -mx-4 -mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-6 lg:-mt-6 lg:px-6">
        <div>
          <Link href="/teacher/courses" className="text-xs font-medium text-teal-600 hover:underline">
            ← Back to Courses
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {isNewCourse ? "New Course" : "Course Builder"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {isNewCourse ? "Create your course. Save draft to get a unique ID." : "Edit metadata, modules, and lectures. Submit to AQAD when ready."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveToast && (
            <span
              role="status"
              className={cn(
                "text-sm font-medium",
                saveToast === "saving" && "text-amber-700",
                saveToast === "saved" && "text-emerald-700",
              )}
            >
              {saveToast === "saving" ? "Saving…" : "Draft saved."}
            </span>
          )}
          <Button
            type="button"
            variant="primary"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleSaveDraft}
            disabled={saveToast === "saving"}
          >
            Save Draft
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* 1. Course Metadata */}
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Course metadata</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="course-title" className="block text-xs font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="course-title"
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata((m) => ({ ...m, title: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Course title"
                />
              </div>
              <div>
                <label htmlFor="course-desc" className="block text-xs font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="course-desc"
                  rows={3}
                  value={metadata.description}
                  onChange={(e) => setMetadata((m) => ({ ...m, description: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Brief course description"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="course-category" className="block text-xs font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    id="course-category"
                    value={metadata.category}
                    onChange={(e) => setMetadata((m) => ({ ...m, category: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="course-credits" className="block text-xs font-medium text-slate-700">
                    Credits
                  </label>
                  <input
                    id="course-credits"
                    type="text"
                    value={metadata.credits}
                    onChange={(e) => setMetadata((m) => ({ ...m, credits: e.target.value }))}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Module Manager (list-based with reorder) */}
          <Card className="rounded-lg border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Modules</h2>
              <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={addModule}>
                + Add Module
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {modules.map((mod, index) => (
                <li key={mod.id} className="rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 p-3">
                    <span className="text-slate-400" aria-hidden>⋮⋮</span>
                    <button
                      type="button"
                      onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                      className="min-w-0 flex-1 text-left font-medium text-slate-900"
                    >
                      {mod.title}
                    </button>
                    <span className="text-xs text-slate-500">{mod.lectures.length} lectures</span>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => moveModule(mod.id, "up")}
                        disabled={index === 0}
                        className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-40"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveModule(mod.id, "down")}
                        disabled={index === modules.length - 1}
                        className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-40"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  {expandedModuleId === mod.id && (
                    <div className="border-t border-slate-200 bg-white p-4">
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => updateModule(mod.id, { title: e.target.value })}
                        className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder="Module title"
                      />
                      {/* 3. Lecture Editor within module */}
                      <p className="text-xs font-medium text-slate-600">Lectures</p>
                      <ul className="mt-2 space-y-2">
                        {mod.lectures.map((lec) => (
                          <li key={lec.id} className="flex items-center gap-2 rounded border border-slate-100 bg-slate-50/50 p-2">
                            <input
                              type="text"
                              value={lec.title}
                              onChange={(e) => updateLecture(mod.id, lec.id, { title: e.target.value })}
                              className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                              placeholder="Lecture title"
                            />
                            <input
                              type="number"
                              min={1}
                              value={lec.durationMinutes ?? 30}
                              onChange={(e) => updateLecture(mod.id, lec.id, { durationMinutes: Number(e.target.value) || 30 })}
                              className="w-16 rounded border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                              title="Minutes"
                            />
                            <span className="text-xs text-slate-500">min</span>
                            <button
                              type="button"
                              onClick={() => removeLecture(mod.id, lec.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                              aria-label="Remove lecture"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => addLecture(mod.id)}>
                        + Add Lecture
                      </Button>
                      <button
                        type="button"
                        onClick={() => removeModule(mod.id)}
                        className="ml-2 text-xs text-red-600 hover:underline"
                      >
                        Remove module
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          {/* Materials: PDF, Video links, Quiz + progress + description */}
          <Card className="rounded-lg border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Materials</h2>
              <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={openMaterialModal}>
                + Add resource
              </Button>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              PDFs, video links (YouTube/Teams), and quiz attachments. Add a description for each.
            </p>
            <ul className="mt-4 space-y-3">
              {materials.length === 0 ? (
                <li className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-sm text-slate-500">
                  No materials yet. Add a PDF, video link, or quiz.
                </li>
              ) : (
                materials.map((mat) => (
                  <li key={mat.id} className="rounded-lg border border-slate-200 bg-slate-50/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "inline-flex rounded px-2 py-0.5 text-xs font-semibold",
                            mat.type === "pdf" && "bg-red-100 text-red-800",
                            mat.type === "video_link" && "bg-blue-100 text-blue-800",
                            mat.type === "quiz" && "bg-violet-100 text-violet-800",
                          )}
                        >
                          {mat.type === "video_link" ? "Video" : mat.type.toUpperCase()}
                        </span>
                        <p className="mt-1 font-medium text-slate-900">{mat.title}</p>
                        {mat.description && (
                          <p className="mt-0.5 text-sm text-slate-600">{mat.description}</p>
                        )}
                        {mat.type === "video_link" && mat.url && (
                          <a href={mat.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block truncate text-xs text-teal-600 hover:underline max-w-full">
                            {mat.url}
                          </a>
                        )}
                        {(mat.type === "pdf" || mat.type === "quiz") && mat.fileName && (
                          <p className="mt-1 text-xs text-slate-500">{mat.fileName}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMaterial(mat.id)}
                        className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                        aria-label="Remove resource"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={mat.description}
                        onChange={(e) => updateMaterial(mat.id, { description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>

        {/* 4. Sidebar: Completeness + Submit + Preview */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Course completeness</h2>
            <div className="mt-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Ready for review</span>
                <span className="font-semibold text-slate-900">{completeness}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    completeness >= 100 ? "bg-emerald-500" : completeness >= 50 ? "bg-teal-500" : "bg-amber-500",
                  )}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Title, description, category, credits, at least one module, and at least one lecture.
            </p>
          </Card>
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Actions</h2>
            <div className="mt-3 space-y-2">
              <Button
                type="button"
                variant="primary"
                className="w-full bg-teal-600 hover:bg-teal-700"
                onClick={handleSubmitToAqad}
                disabled={submitted || completeness < 100}
              >
                {submitted ? "Submitted to AQAD" : "Submit to AQAD"}
              </Button>
              <Link href={`/teacher/courses/${effectiveId}/preview`} target="_blank" rel="noopener noreferrer" className="block">
                <Button type="button" variant="outline" className="w-full">
                  Real-time Preview
                </Button>
              </Link>
            </div>
            {submitted && (
              <p className="mt-2 text-xs font-medium text-emerald-700">
                Course submitted for AQAD review.
              </p>
            )}
          </Card>
        </aside>
      </div>

      {/* Add Resource Modal */}
      {materialModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            aria-hidden
            onClick={closeMaterialModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-modal-title"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-4 shadow-xl"
          >
            <h2 id="material-modal-title" className="text-sm font-semibold text-slate-900">
              Add resource
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-700">Type</span>
                <div className="mt-1 flex gap-2">
                  {(["pdf", "video_link", "quiz"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewMaterialType(t)}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-semibold",
                        newMaterialType === t
                          ? "bg-teal-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                      )}
                    >
                      {t === "video_link" ? "Video link" : t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="mat-title" className="block text-xs font-medium text-slate-700">Title</label>
                <input
                  id="mat-title"
                  type="text"
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={newMaterialType === "video_link" ? "e.g. Week 1 recording" : "e.g. Syllabus PDF"}
                />
              </div>
              {newMaterialType === "video_link" ? (
                <div>
                  <label htmlFor="mat-url" className="block text-xs font-medium text-slate-700">YouTube or Teams recording URL</label>
                  <input
                    id="mat-url"
                    type="url"
                    value={newMaterialUrl}
                    onChange={(e) => setNewMaterialUrl(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    {newMaterialType === "pdf" ? "PDF file" : "Quiz attachment"}
                  </label>
                  <input
                    type="file"
                    accept={newMaterialType === "pdf" ? ".pdf" : ".pdf,.doc,.docx"}
                    className="mt-1 block w-full text-sm text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-teal-700 file:text-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) simulateFileUpload(file, setUploadFileName);
                    }}
                  />
                  {uploadFileName && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{uploadFileName}</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="mat-desc" className="block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  id="mat-desc"
                  rows={2}
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Brief description for students"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={closeMaterialModal}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={addMaterial}
                disabled={
                  newMaterialType === "video_link"
                    ? !newMaterialUrl.trim()
                    : (newMaterialType === "pdf" || newMaterialType === "quiz") && uploadProgress < 100
                }
              >
                Add resource
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
