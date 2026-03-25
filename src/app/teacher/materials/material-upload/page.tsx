"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type MaterialType = "pdf" | "video" | "image" | "document" | "other";
type Accessibility = "public" | "enrolled_only" | "restricted";

interface UploadItem {
  id: string;
  file: File | { name: string };
  title: string;
  type: MaterialType;
  accessibility: Accessibility;
  tags: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

const STORAGE_KEY = "teacher-materials-library";

function saveToLibrary(item: Omit<UploadItem, "file" | "status" | "progress"> & { fileName: string; folderId: string }) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : { files: [], folders: [] };
  const newFile = {
    id: "f" + Date.now(),
    title: item.title,
    type: item.type,
    fileName: item.fileName,
    folderId: item.folderId,
    tags: item.tags.split(",").map((t) => t.trim()).filter(Boolean),
    usedByCourses: [],
    uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
  data.files.push(newFile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function MaterialUploadPage() {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [targetFolderId, setTargetFolderId] = React.useState("root");
  const [folders, setFolders] = React.useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const root = { id: "root", name: "Root" };
      if (raw) {
        const data = JSON.parse(raw);
        const allFolders = data.folders || [];
        const topLevel = allFolders.filter((f: { parentId: string | null }) => f.parentId === "root");
        setFolders([root, ...topLevel.map((f: { id: string; name: string }) => ({ id: f.id, name: f.name }))]);
      } else {
        setFolders([root]);
      }
    } catch {
      setFolders([{ id: "root", name: "Root" }]);
    }
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      id: "u" + Date.now() + Math.random().toString(36).slice(2, 6),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      type: "other",
      accessibility: "enrolled_only",
      tags: "",
      status: "pending",
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const updateItem = (id: string, updates: Partial<UploadItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const simulateUpload = (id: string, itemData: { title: string; type: MaterialType; accessibility: Accessibility; tags: string; file: File | { name: string } }) => {
    updateItem(id, { status: "uploading", progress: 0 });
    let p = 0;
    const fileName = itemData.file instanceof File ? itemData.file.name : itemData.file.name;
    const interval = setInterval(() => {
      p += 15;
      if (p >= 100) {
        clearInterval(interval);
        saveToLibrary({
          id,
          title: itemData.title,
          type: itemData.type,
          accessibility: itemData.accessibility,
          tags: itemData.tags,
          fileName,
          folderId: targetFolderId,
        });
        updateItem(id, { status: "done", progress: 100 });
      } else {
        updateItem(id, { progress: p });
      }
    }, 200);
  };

  const handleUploadAll = () => {
    const pending = items.filter((i) => i.status === "pending");
    pending.forEach((i, idx) => {
      setTimeout(() => simulateUpload(i.id, { title: i.title, type: i.type, accessibility: i.accessibility, tags: i.tags, file: i.file }), idx * 300);
    });
  };

  const pendingCount = items.filter((i) => i.status === "pending").length;

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/materials/materials-library" className="text-xs font-medium text-teal-600 hover:underline">
          ← Materials Library
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Upload Hub
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Drag and drop files for bulk upload. Add metadata: Title, Type, and Accessibility.
        </p>
      </section>

      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="block text-xs font-medium text-slate-700">Destination folder</label>
          <select
            value={targetFolderId}
            onChange={(e) => setTargetFolderId(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "rounded-xl border-2 border-dashed p-12 text-center transition-colors",
          isDragging
            ? "border-teal-500 bg-teal-50"
            : "border-slate-300 bg-slate-50/50 hover:border-slate-400",
        )}
      >
        <p className="text-lg font-medium text-slate-700">Drop files here</p>
        <p className="mt-1 text-sm text-slate-500">or click to browse</p>
        <input
          type="file"
          multiple
          className="mt-4 hidden"
          id="file-input"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <label
          htmlFor="file-input"
          className="mt-4 inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200"
        >
          Browse files
        </label>
      </div>

      {items.length > 0 && (
        <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Upload queue ({items.length})</h3>
            {pendingCount > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleUploadAll}
              >
                Upload all
              </Button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-600">File</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Accessibility</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Tags</th>
                  <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item) => {
                  const fileName = item.file instanceof File ? item.file.name : (item.file as { name: string }).name;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-600">{fileName}</td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(item.id, { title: e.target.value })}
                          placeholder="Title"
                          disabled={item.status !== "pending"}
                          className="max-w-[160px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.type}
                          onChange={(e) => updateItem(item.id, { type: e.target.value as MaterialType })}
                          disabled={item.status !== "pending"}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                        >
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                          <option value="image">Image</option>
                          <option value="document">Document</option>
                          <option value="other">Other</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.accessibility}
                          onChange={(e) => updateItem(item.id, { accessibility: e.target.value as Accessibility })}
                          disabled={item.status !== "pending"}
                          className="rounded-md border border-slate-300 px-2 py-1 text-sm disabled:bg-slate-100"
                        >
                          <option value="public">Public</option>
                          <option value="enrolled_only">Enrolled only</option>
                          <option value="restricted">Restricted</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={item.tags}
                          onChange={(e) => updateItem(item.id, { tags: e.target.value })}
                          placeholder="e.g., Lecture, ML"
                          disabled={item.status !== "pending"}
                          className="max-w-[120px]"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                        {item.status === "uploading" && (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full bg-teal-500 transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600">{item.progress}%</span>
                          </div>
                        )}
                        {item.status === "done" && (
                          <span className="text-xs font-medium text-emerald-600">Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-xs text-slate-500">
        <strong>Accessibility:</strong> Public (visible to all), Enrolled only (students in assigned courses), Restricted (specific groups).
      </p>
    </div>
  );
}
