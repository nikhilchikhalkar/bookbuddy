import { ImportWizard } from "@/components/admin/ImportWizard";
import { FileSpreadsheet } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminImportPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Batch Inventory Importer</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Upload Excel Inventory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload spreadsheets to seamlessly add new books or replace current active stock with safety reconciliation
        </p>
      </div>

      <ImportWizard />
    </div>
  );
}
