"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type MaterialType = "pdf" | "video" | "image" | "document" | "other";

interface MaterialFile {
  id: string;
  title: string;
  type: MaterialType;
  fileName: string;
  folderId: string;
  tags: string[];
  usedByCourses: string[];
  uploadedAt: string;
}

interface MaterialFolder {
  id: string;
  name: string;
  parentId: string | null;
}

const STORAGE_KEY = "teacher-materials-library";

function loadMaterials(): { files: MaterialFile[]; folders: MaterialFolder[] } {
  if (typeof window === "undefined") return { files: [], folders: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { files: [], folders: [] };
    return JSON.parse(raw);
  } catch {
    return { files: [], folders: [] };
  }
}

const MOCK_FILES: MaterialFile[] = [
  { id: "f1", title: "Syllabus", type: "pdf", fileName: "syllabus.pdf", folderId: "root", tags: ["Syllabus", "CS"], usedByCourses: ["CS 440", "CS 210"], uploadedAt: "Mar 1, 2026" },
  { id: "f2", title: "Lecture 1 Slides", type: "pdf", fileName: "lecture1.pdf", folderId: "root", tags: ["Lecture", "ML"], usedByCourses: ["CS 440"], uploadedAt: "Mar 2, 2026" },
  { id: "f3", title: "Intro Video", type: "video", fileName: "intro.mp4", folderId: "fd1", tags: ["Video", "Introduction"], usedByCourses: ["CS 440", "RES 301"], uploadedAt: "Mar 3, 2026" },
  { id: "f4", title: "Reading: Research Methods", type: "pdf", fileName: "reading.pdf", folderId: "fd1", tags: ["Reading", "Research"], usedByCourses: ["RES 301"], uploadedAt: "Mar 4, 2026" },
  { id: "f5", title: "Data Structures Cheat Sheet", type: "document", fileName: "cheatsheet.docx", folderId: "root", tags: ["Reference", "CS"], usedByCourses: ["CS 210"], uploadedAt: "Mar 5, 2026" },
];

const MOCK_FOLDERS: MaterialFolder[] = [
  { id: "root", name: "All Materials", parentId: null },
  { id: "fd1", name: "Week 1", parentId: "root" },
  { id: "fd2", name: "Reference", parentId: "root" },
];

const COURSES = ["CS 440 - Machine Learning", "CS 210 - Data Structures", "RES 301 - Research Methods"];
const SUBJECT_TAGS = ["Syllabus", "Lecture", "ML", "CS", "Video", "Reading", "Research", "Reference", "Introduction"];

function getTypeIcon(type: MaterialType): string {
  switch (type) {
    case "pdf": return "📄";
    case "video": return "🎬";
    case "image": return "🖼️";
    case "document": return "📝";
    default: return "📁";
  }
}

export default function MaterialsLibraryPage() {
  const [data, setData] = React.useState<{ files: MaterialFile[]; folders: MaterialFolder[] }>({ files: [], folders: [] });
  const [currentFolderId, setCurrentFolderId] = React.useState("root");
  const [tagFilter, setTagFilter] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [newFolderName, setNewFolderName] = React.useState("");
  const [showNewFolder, setShowNewFolder] = React.useState(false);

  React.useEffect(() => {
    const stored = loadMaterials();
    if (stored.files.length === 0 && stored.folders.length === 0) {
      setData({ files: MOCK_FILES, folders: MOCK_FOLDERS });
    } else {
      setData(stored);
    }
  }, []);

  const foldersInCurrent = data.folders.filter((f) => f.parentId === currentFolderId);
  const filesInCurrent = data.files.filter((f) => {
    if (f.folderId !== currentFolderId) return false;
    if (tagFilter && !f.tags.includes(tagFilter)) return false;
    if (searchQuery && !f.title.toLowerCase().includes(searchQuery.toLowerCase()) && !f.fileName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const breadcrumbs = React.useMemo(() => {
    const path: MaterialFolder[] = [];
    let fid: string | null = currentFolderId;
    while (fid) {
      const folder = data.folders.find((f) => f.id === fid);
      if (!folder) break;
      path.unshift(folder);
      fid = folder.parentId;
    }
    return path;
  }, [currentFolderId, data.folders]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: MaterialFolder = {
      id: "fd" + Date.now(),
      name: newFolderName.trim(),
      parentId: currentFolderId,
    };
    const next = {
      folders: [...data.folders, newFolder],
      files: data.files,
    };
    setData(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleRemoveFile = (id: string) => {
    const next = { ...data, files: data.files.filter((f) => f.id !== id) };
    setData(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleRemoveFolder = (id: string) => {
    const childFolders = data.folders.filter((f) => f.parentId === id);
    const childFiles = data.files.filter((f) => f.folderId === id);
    if (childFolders.length > 0 || childFiles.length > 0) return;
    const next = { ...data, folders: data.folders.filter((f) => f.id !== id) };
    setData(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher" className="text-xs font-medium text-teal-600 hover:underline">
          ← Teacher Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Materials Library
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Organize files into folders, tag by subject, and see which courses use each file.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/teacher/materials/material-upload">
          <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
            + Upload materials
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <select
            value={tagFilter ?? ""}
            onChange={(e) => setTagFilter(e.target.value || null)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">All tags</option>
            {SUBJECT_TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex rounded-md border border-slate-300">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn("px-2 py-1.5 text-sm", viewMode === "list" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-slate-50")}
              title="List view"
            >
              ☰
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn("px-2 py-1.5 text-sm", viewMode === "grid" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-slate-50")}
              title="Grid view"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-4 py-2">
          <button
            type="button"
            onClick={() => setCurrentFolderId("root")}
            className="text-sm font-medium text-teal-600 hover:underline"
          >
            Library
          </button>
          {breadcrumbs.map((f) => (
            <span key={f.id} className="flex items-center gap-1 text-slate-500">
              <span>/</span>
              <button
                type="button"
                onClick={() => setCurrentFolderId(f.id)}
                className={cn(
                  "text-sm",
                  f.id === currentFolderId ? "font-semibold text-slate-900" : "text-teal-600 hover:underline",
                )}
              >
                {f.name}
              </button>
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setShowNewFolder(true)}>
            + New folder
          </Button>
        </div>

        {showNewFolder && (
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <Button type="button" variant="primary" size="sm" className="bg-teal-600" onClick={handleCreateFolder}>
              Create
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => { setShowNewFolder(false); setNewFolderName(""); }}>
              Cancel
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[320px]">
          {viewMode === "list" ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Tags</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Used by</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {foldersInCurrent.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50">
                    <td colSpan={5} className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setCurrentFolderId(f.id)}
                        className="flex items-center gap-2 text-left font-medium text-slate-900 hover:text-teal-600"
                      >
                        <span>📁</span>
                        {f.name}
                      </button>
                    </td>
                  </tr>
                ))}
                {filesInCurrent.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="mr-2">{getTypeIcon(f.type)}</span>
                      <span className="font-medium text-slate-900">{f.title}</span>
                      <span className="ml-1 text-xs text-slate-500">{f.fileName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{f.type}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {f.tags.map((t) => (
                          <span
                            key={t}
                            className="cursor-pointer rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 hover:bg-slate-200"
                            onClick={() => setTagFilter(t)}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600">{f.usedByCourses.join(", ") || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(f.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {foldersInCurrent.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCurrentFolderId(f.id)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center hover:border-teal-300 hover:bg-teal-50/30"
                >
                  <span className="text-3xl">📁</span>
                  <span className="text-sm font-medium text-slate-900">{f.name}</span>
                </button>
              ))}
              {filesInCurrent.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
                >
                  <span className="text-3xl">{getTypeIcon(f.type)}</span>
                  <span className="truncate text-sm font-medium text-slate-900" title={f.title}>{f.title}</span>
                  <div className="flex flex-wrap justify-center gap-1">
                    {f.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{t}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">{f.usedByCourses.length} course(s)</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(f.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {foldersInCurrent.length === 0 && filesInCurrent.length === 0 && (
            <div className="px-4 py-16 text-center text-sm text-slate-500">
              {currentFolderId === "root" && !searchQuery && !tagFilter
                ? "No materials yet. Upload files to get started."
                : "No files match your filters."}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
