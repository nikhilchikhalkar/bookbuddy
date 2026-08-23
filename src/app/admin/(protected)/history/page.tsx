import { connectToDatabase } from "@/lib/mongodb";
import { ImportHistory } from "@/models/ImportHistory";
import { IImportHistory } from "@/types/import";
import { History, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminImportHistoryPage() {
  let logs: (IImportHistory & { _id: string })[] = [];

  try {
    await connectToDatabase();
    logs = await ImportHistory.find().sort({ createdAt: -1 }).limit(100).lean();
  } catch (err) {
    console.error("Failed to load import logs:", err);
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <History className="h-4 w-4" />
            <span>Audit Trail</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Excel Batch Import Logs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive history of all uploaded inventories, modes, duplicates skipped, and validation logs
          </p>
        </div>

        <Link
          href="/admin/import"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>New Upload</span>
        </Link>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">File Name</th>
                <th className="px-4 py-3.5">Mode</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Total Rows</th>
                <th className="px-4 py-3.5">Success / Skipped</th>
                <th className="px-4 py-3.5">Admin</th>
                <th className="px-4 py-3.5 text-right">Errors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No batch imports found in audit history.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={String(log._id)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.startedAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {log.fileName}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          log.importMode === "REPLACE"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {log.importMode}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {log.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Success</span>
                        </span>
                      ) : log.status === "PARTIAL" ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Partial</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {log.totalRows}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-[11px]">
                      <span className="font-bold text-emerald-600">
                        {log.successfulRows}
                      </span>{" "}
                      imported
                      {log.skippedRows > 0 && (
                        <span className="text-slate-400 ml-1">
                          ({log.skippedRows} skipped)
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-500 whitespace-nowrap">
                      {log.adminEmail}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {log.errors && log.errors.length > 0 ? (
                        <span className="inline-flex rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          {log.errors.length} {log.errors.length === 1 ? "Error" : "Errors"}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
