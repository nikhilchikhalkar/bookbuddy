"use client";

import { useState } from "react";
import {
  ImportExecutionResult,
  ImportMode,
  ImportPreviewResult,
} from "@/types/import";
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  ArrowRight,
  RotateCcw,
  Loader2,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export function ImportWizard() {
  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Preview data
  const [preview, setPreview] = useState<
    (ImportPreviewResult & { detectedColumns: Record<string, string> }) | null
  >(null);

  // Mode selection & confirmation
  const [importMode, setImportMode] = useState<ImportMode>("ADD");
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);

  // Final execution result
  const [result, setResult] = useState<ImportExecutionResult | null>(null);

  // Handle file selection and parse preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationError(null);
    setIsValidating(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/import/preview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to parse Excel file.");
      }

      setPreview(data.preview);
      setStep(2);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "Error validating file"
      );
      setSelectedFile(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Execute database import
  const handleExecuteImport = async () => {
    if (!preview || !selectedFile) return;
    if (importMode === "REPLACE" && !replaceConfirmed) {
      alert("Please confirm the Replace Existing warning before proceeding.");
      return;
    }

    setIsImporting(true);
    setValidationError(null);

    try {
      const res = await fetch("/api/admin/import/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: selectedFile.name,
          mode: importMode,
          validBooks: preview.validBooks,
          previewErrors: preview.errors,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Import execution failed.");
      }

      setResult(data.result);
      setStep(3);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "Error during import execution"
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Reset wizard
  const handleReset = () => {
    setStep(1);
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setReplaceConfirmed(false);
    setValidationError(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-4 dark:border-slate-800 text-xs font-semibold">
        <div
          className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
            step === 1
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
            1
          </span>
          <span>Upload File</span>
        </div>

        <div
          className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
            step === 2
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
            2
          </span>
          <span>Validate & Configure</span>
        </div>

        <div
          className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${
            step === 3
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
              : "text-slate-400"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px]">
            3
          </span>
          <span>Import Summary</span>
        </div>
      </div>

      {validationError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-2">
          <XCircle className="h-5 w-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900 transition-all hover:border-emerald-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Choose an Excel inventory file
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Supports <strong className="text-slate-700 dark:text-slate-300">.xlsx</strong> and{" "}
              <strong className="text-slate-700 dark:text-slate-300">.xls</strong> formats up to 5,000 rows.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all">
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Parsing & Validating...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Select Excel Spreadsheet</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  disabled={isValidating}
                  className="hidden"
                />
              </label>

              <a
                href="/api/admin/import/template"
                download="bookbuddy_inventory_template.xlsx"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Sample Template (.xlsx)</span>
              </a>
            </div>
          </div>

          {/* Expected Columns Documentation */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expected Column Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Required Columns
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  <code className="font-mono font-bold">Sr Number</code>,{" "}
                  <code className="font-mono font-bold">Book ID</code> (Unique),{" "}
                  <code className="font-mono font-bold">Title</code>,{" "}
                  <code className="font-mono font-bold">Author</code>,{" "}
                  <code className="font-mono font-bold">Buy Price</code>
                </p>
              </div>

              <div className="space-y-1.5 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/50">
                <span className="font-bold text-teal-700 dark:text-teal-400">
                  Optional Columns
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  <code className="font-mono">Rent Price</code>,{" "}
                  <code className="font-mono">Currency</code>,{" "}
                  <code className="font-mono">Category</code>,{" "}
                  <code className="font-mono">Description</code>,{" "}
                  <code className="font-mono">ISBN</code>,{" "}
                  <code className="font-mono">Publisher</code>,{" "}
                  <code className="font-mono">Published Year</code>,{" "}
                  <code className="font-mono">Available For Buy</code>,{" "}
                  <code className="font-mono">Available For Rent</code>,{" "}
                  <code className="font-mono">Active</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & CONFIGURE */}
      {step === 2 && preview && (
        <div className="space-y-6">
          {/* File summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                File Name
              </span>
              <p className="mt-1 font-bold text-slate-900 dark:text-white truncate">
                {preview.fileName}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Total Rows
              </span>
              <p className="mt-1 font-bold text-slate-900 dark:text-white">
                {preview.totalRows}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-emerald-600">
                Valid Rows
              </span>
              <p className="mt-1 font-bold text-emerald-600">
                {preview.validRowsCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[11px] font-bold uppercase text-rose-600">
                Validation Errors
              </span>
              <p className="mt-1 font-bold text-rose-600">
                {preview.invalidRowsCount}
              </p>
            </div>
          </div>

          {/* Validation Errors Box (if any) */}
          {preview.errors.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/50 dark:bg-rose-950/40 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-800 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Found {preview.errors.length} Row Validation Issues (These rows will be skipped):</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                {preview.errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-white/80 dark:bg-slate-900/80 p-2.5 text-xs text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900"
                  >
                    <span className="font-mono font-bold text-rose-800 shrink-0">
                      Row {err.rowNumber}:
                    </span>
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Import Mode Selector */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Choose Database Handling Strategy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add New Mode */}
              <label
                onClick={() => setImportMode("ADD")}
                className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  importMode === "ADD"
                    ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Option 1 — Add New (Incremental)
                    </span>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "ADD"}
                      onChange={() => setImportMode("ADD")}
                      className="h-4 w-4 text-emerald-600"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Existing books remain completely intact. New books are added. If a Book ID already exists, it is safely skipped and reported as duplicate.
                  </p>
                </div>
                <span className="mt-4 inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  Recommended for ongoing stock additions
                </span>
              </label>

              {/* Replace Existing Mode */}
              <label
                onClick={() => setImportMode("REPLACE")}
                className={`cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  importMode === "REPLACE"
                    ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 ring-2 ring-amber-500/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Option 2 — Replace Existing (Source of Truth)
                    </span>
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "REPLACE"}
                      onChange={() => setImportMode("REPLACE")}
                      className="h-4 w-4 text-amber-600"
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    The uploaded sheet becomes the new catalog master. Existing books are updated. Books not found in the uploaded sheet are safely marked inactive.
                  </p>
                </div>
                <span className="mt-4 inline-block text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Zero data loss: Non-destructive soft deactivation
                </span>
              </label>
            </div>

            {/* Warning for Replace Existing */}
            {importMode === "REPLACE" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/60 space-y-2 animate-in fade-in-50">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Important Replacement Safeguard:</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Existing books missing from this Excel will be marked as inactive so they no longer display on the public storefront. Their records remain in the database for audit history.
                </p>
                <label className="flex items-center gap-2 pt-2 text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceConfirmed}
                    onChange={(e) => setReplaceConfirmed(e.target.checked)}
                    className="h-4 w-4 rounded text-amber-600"
                  />
                  <span>I understand and confirm this inventory replacement</span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Choose Another File</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={
                isImporting ||
                preview.validRowsCount === 0 ||
                (importMode === "REPLACE" && !replaceConfirmed)
              }
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Importing into Database...</span>
                </>
              ) : (
                <>
                  <span>
                    Confirm & Execute ({preview.validRowsCount} Valid Books)
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT SUMMARY */}
      {step === 3 && result && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Batch Import Completed Successfully!
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              File: <strong className="text-slate-700 dark:text-slate-300">{result.fileName}</strong> • Mode:{" "}
              <strong className="text-slate-700 dark:text-slate-300">{result.importMode}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Total Rows
              </span>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                {result.totalRows}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/60">
              <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                New Books Inserted
              </span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {result.insertedCount}
              </p>
            </div>

            <div className="rounded-2xl bg-teal-50 p-4 dark:bg-teal-950/60">
              <span className="text-[11px] font-bold uppercase text-teal-700 dark:text-teal-400">
                Books Updated
              </span>
              <p className="mt-1 text-2xl font-extrabold text-teal-700 dark:text-teal-300">
                {result.updatedCount}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400">
                Duplicates Skipped
              </span>
              <p className="mt-1 text-2xl font-extrabold text-slate-700 dark:text-slate-300">
                {result.skippedCount}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/60">
              <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">
                Deactivated
              </span>
              <p className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-300">
                {result.deactivatedCount}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/admin/books"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Go to Inventory Catalog</span>
            </Link>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Upload Another Excel File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
