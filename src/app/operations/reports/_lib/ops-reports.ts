export type ReportType = "Security" | "Health" | "Performance";

export type ReportFormat = "PDF" | "XLSX";

export type ReportDraft = {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  format: ReportFormat;
};

export type GeneratedReport = {
  id: string;
  title: string;
  createdAt: string;
  generatedBy: string;
  sizeLabel: string;
  draft: ReportDraft;
  preview: string;
};

/** v2 shape — older session keys ignored */
export const OPS_REPORTS_STORAGE_KEY = "ops_reports_hub_v2";
