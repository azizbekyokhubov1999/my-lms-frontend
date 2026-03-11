"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const DRAFT_KEY = "admission_upload_draft";
const APPLICATION_STATUS_KEY = "admission_application_status";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const FILE_REQUIREMENTS = "PDF or JPG, max 5 MB";
const ACCEPT = ".pdf,.jpg,.jpeg,image/jpeg,image/jpg,image/png";
const AUDIT_DELAY_MS = 3000;

type DocumentType = "passport" | "diploma" | "language";
type UploadStatus = "uploading" | "pending-review";

interface UploadedFile {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  progress: number;
  status: UploadStatus;
}

interface UploadSlotProps {
  label: string;
  description: string;
  documentType: DocumentType;
  onFileSelect: (file: File, documentType: DocumentType) => void;
  requirements?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function UploadSlot({
  label,
  description,
  documentType,
  onFileSelect,
  requirements = FILE_REQUIREMENTS,
}: UploadSlotProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileSelect(files[0], documentType);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{label}</h2>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
        <p className="text-xs font-medium text-slate-500">Required</p>
      </div>
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          "border-slate-200 bg-slate-50 hover:border-blue-900 hover:bg-blue-50/60",
          isDragging && "border-blue-900 bg-blue-50/80"
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <p className="text-sm font-medium text-slate-900">Drag & drop or browse</p>
        <p className="mt-1 text-xs text-slate-500">{requirements}</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPT}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}

function AdmissionStepper() {
  const steps = [
    { key: "register", label: "Register", current: false, completed: true },
    { key: "upload", label: "Upload Docs", current: true, completed: false },
    { key: "payment", label: "Payment", current: false, completed: false },
    { key: "exam", label: "Exam", current: false, completed: false },
    { key: "enrolled", label: "Enrolled", current: false, completed: false },
  ];
  return (
    <nav aria-label="Admission steps" className="mb-6">
      <ol className="flex items-center justify-between gap-2 text-xs sm:text-sm">
        {steps.map((step, index) => (
          <li key={step.key} className="flex flex-1 items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold",
                  step.completed && "border-blue-900 bg-blue-900 text-white",
                  step.current && !step.completed && "border-blue-900 bg-white text-blue-900",
                  !step.current && !step.completed && "border-slate-300 bg-slate-100 text-slate-500"
                )}
                aria-current={step.current ? "step" : undefined}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "font-medium",
                  step.current ? "text-blue-900" : step.completed ? "text-slate-900" : "text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 hidden h-px flex-1 bg-slate-200 sm:block" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface DraftData {
  uploads: UploadedFile[];
  fullName: string;
  passportSerial: string;
  birthDate: string;
  govVerified: boolean;
}

function loadDraft(): Partial<DraftData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function saveDraft(data: DraftData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

type AuditStatus = "verifying" | "verified";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [uploads, setUploads] = React.useState<UploadedFile[]>([]);
  const [fileUrls, setFileUrls] = React.useState<Record<string, string>>({});
  const [fullName, setFullName] = React.useState("");
  const [passportSerial, setPassportSerial] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [ocrLoading, setOcrLoading] = React.useState(false);
  const [govVerified, setGovVerified] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [auditStatus, setAuditStatus] = React.useState<{
    passport: AuditStatus;
    diploma: AuditStatus;
  }>({ passport: "verifying", diploma: "verifying" });
  const [auditComplete, setAuditComplete] = React.useState(false);

  const hasPassport = uploads.some((u) => u.type === "passport" && u.progress >= 100);
  const hasDiploma = uploads.some((u) => u.type === "diploma" && u.progress >= 100);
  const showDocumentAudit = hasPassport && hasDiploma;

  // Auto-check: after 3s set Verified and DOCUMENTS_APPROVED
  React.useEffect(() => {
    if (!showDocumentAudit || auditComplete) return;
    const t = setTimeout(() => {
      setAuditStatus({ passport: "verified", diploma: "verified" });
      setAuditComplete(true);
      try {
        localStorage.setItem(APPLICATION_STATUS_KEY, "DOCUMENTS_APPROVED");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("admission-documents-approved"));
        }
      } catch {
        /* ignore */
      }
    }, AUDIT_DELAY_MS);
    return () => clearTimeout(t);
  }, [showDocumentAudit, auditComplete]);

  // Load draft on mount; restore audit state if already DOCUMENTS_APPROVED
  React.useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.uploads?.length) setUploads(draft.uploads);
      if (draft.fullName != null) setFullName(draft.fullName);
      if (draft.passportSerial != null) setPassportSerial(draft.passportSerial);
      if (draft.birthDate != null) setBirthDate(draft.birthDate);
      if (draft.govVerified != null) setGovVerified(draft.govVerified);
    }
    try {
      if (typeof window !== "undefined" && localStorage.getItem(APPLICATION_STATUS_KEY) === "DOCUMENTS_APPROVED") {
        setAuditStatus({ passport: "verified", diploma: "verified" });
        setAuditComplete(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleFileSelect = React.useCallback(
    (file: File, documentType: DocumentType) => {
      setUploadError(null);
      if (file.size > MAX_FILE_BYTES) {
        setUploadError(`File "${file.name}" exceeds 5 MB. Please choose a smaller file.`);
        return;
      }
      const id = `${documentType}-${Date.now()}`;
      const url = URL.createObjectURL(file);
      setFileUrls((prev) => ({ ...prev, [id]: url }));

      const newUpload: UploadedFile = {
        id,
        name: file.name,
        type: documentType,
        size: file.size,
        progress: 0,
        status: "uploading",
      };
      setUploads((prev) => [...prev, newUpload]);

      // Simulate upload progress
      const stepMs = 150;
      let step = 0;
      const steps = 10;
      const intervalId = window.setInterval(() => {
        step += 1;
        const progress = Math.min(100, Math.round((step / steps) * 100));
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, progress, status: progress >= 100 ? "pending-review" : u.status }
              : u
          )
        );
        if (progress >= 100) window.clearInterval(intervalId);
      }, stepMs);

      if (documentType === "passport") {
        setOcrLoading(true);
        setTimeout(() => {
          setFullName("John Smith");
          setPassportSerial("AB 1234567");
          setBirthDate("1995-03-15");
          setOcrLoading(false);
        }, 2000);
      }
    },
    []
  );

  const handleDelete = React.useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    setFileUrls((prev) => {
      const next = { ...prev };
      if (next[id]) URL.revokeObjectURL(next[id]);
      delete next[id];
      return next;
    });
  }, []);

  const handleSaveDraft = React.useCallback(() => {
    saveDraft({
      uploads,
      fullName,
      passportSerial,
      birthDate,
      govVerified,
    });
    setUploadError(null);
    // Brief feedback could go here (e.g. toast)
  }, [uploads, fullName, passportSerial, birthDate, govVerified]);

  const handleView = React.useCallback((id: string) => {
    const url = fileUrls[id];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, [fileUrls]);

  const uploadedCount = uploads.filter((u) => u.progress >= 100).length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-3xl">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">
            Admission Process
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            Upload your documents
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Provide the required documents. {FILE_REQUIREMENTS} per file.
          </p>
        </header>

        <AdmissionStepper />

        {uploadError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {uploadError}
          </div>
        )}

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <UploadSlot
              label="Passport"
              description="Clear scan or photo of your valid passport."
              documentType="passport"
              onFileSelect={handleFileSelect}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!uploads.some((u) => u.type === "passport" && u.progress >= 100)}
                onClick={() => setGovVerified(true)}
              >
                Verify with Gov.uz
              </Button>
              {govVerified && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <span aria-hidden>✓</span> Verified
                </span>
              )}
            </div>
            {ocrLoading && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-900" />
                <span className="text-sm text-slate-700">Extracting data via OCR...</span>
              </div>
            )}
            {!ocrLoading && (fullName || passportSerial || birthDate) && (
              <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-medium text-slate-500">Extracted from passport</p>
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Passport Serial"
                  value={passportSerial}
                  onChange={(e) => setPassportSerial(e.target.value)}
                />
                <Input
                  label="Birth Date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <UploadSlot
              label="Diploma"
              description="Latest diploma or graduation certificate."
              documentType="diploma"
              onFileSelect={handleFileSelect}
            />
            <UploadSlot
              label="Language Certificate"
              description="e.g. IELTS, TOEFL."
              documentType="language"
              onFileSelect={handleFileSelect}
            />
          </div>
        </div>

        {showDocumentAudit && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Document audit</h2>
            <p className="mt-0.5 text-xs text-slate-600">
              {auditComplete
                ? "All required documents have been verified."
                : "Verifying your documents…"}
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3">
                <span className="font-medium text-slate-900">Passport</span>
                <span className="flex items-center gap-2">
                  {auditStatus.passport === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                      <span className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" aria-hidden />
                      Verifying…
                    </span>
                  )}
                </span>
              </li>
              <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-3">
                <span className="font-medium text-slate-900">Diploma</span>
                <span className="flex items-center gap-2">
                  {auditStatus.diploma === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                      <span className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" aria-hidden />
                      Verifying…
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </section>
        )}

        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Uploaded files</h2>
            <p className="text-xs text-slate-500">{FILE_REQUIREMENTS}</p>
          </div>

          {uploads.length === 0 ? (
            <p className="mt-3 text-xs text-slate-500">
              No files uploaded yet. PDF or JPG, max 5 MB per file.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {uploads.map((file) => (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {file.type === "passport" ? "Passport" : file.type === "diploma" ? "Diploma" : "Language"}{" "}
                      • {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">
                      {file.progress >= 100 ? "Pending Review" : "Uploading"}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={!fileUrls[file.id]}
                      onClick={() => handleView(file.id)}
                    >
                      View
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200">
                    <div
                      className="h-1.5 rounded-full bg-blue-900 transition-[width]"
                      style={{ width: `${file.progress}%` }}
                      aria-hidden
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleSaveDraft}>
              Save for Later
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={uploadedCount === 0}
              onClick={() => router.push("/admission/payment")}
            >
              Continue to payment
            </Button>
          </div>
        </section>
      </Card>
    </div>
  );
}
