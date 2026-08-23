import { BookService } from "@/services/book.service";
import { ImportHistory } from "@/models/ImportHistory";
import { IImportHistory } from "@/types/import";
import { connectToDatabase } from "@/lib/mongodb";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  ShoppingBag,
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Database,
  PhoneCall,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = {
    totalBooks: 0,
    activeBooks: 0,
    inactiveBooks: 0,
    availableForBuy: 0,
    availableForRent: 0,
    bothAvailable: 0,
  };

  let recentImports: (IImportHistory & { _id: string })[] = [];
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "919876543210";

  try {
    await connectToDatabase();
    const [statsData, importsData] = await Promise.all([
      BookService.getInventoryStats(),
      ImportHistory.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    stats = statsData;
    recentImports = importsData;
  } catch (err) {
    console.error("Dashboard data load error:", err);
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Inventory & Operations Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time bookstore analytics, stock availability, and batch import monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Upload New Excel</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Books */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Books
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalBooks}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Across all categories in database
          </p>
        </div>

        {/* Active Books */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active on Store
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.activeBooks}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {stats.inactiveBooks} inactive / archived
          </p>
        </div>

        {/* Available to Buy */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available to Buy
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {stats.availableForBuy}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            With purchase pricing configured
          </p>
        </div>

        {/* Available to Rent */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available to Rent
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {stats.availableForRent}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            With rental fees configured
          </p>
        </div>
      </div>

      {/* Quick Status & Configuration */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 cols: Recent Imports */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>Recent Batch Imports</span>
            </div>
            <Link
              href="/admin/history"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              View Full History →
            </Link>
          </div>

          {recentImports.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No Excel imports recorded yet.{" "}
              <Link
                href="/admin/import"
                className="font-bold text-emerald-600 underline"
              >
                Upload your first sheet
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentImports.map((item) => (
                <div
                  key={String(item._id)}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {item.fileName}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Mode: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.importMode}</span> •{" "}
                      {new Date(item.startedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {item.status}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {item.successfulRows} / {item.totalRows} rows
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 col: System Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>Environment Health</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Database className="h-4 w-4 text-emerald-600" />
                <span>MongoDB Atlas</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <PhoneCall className="h-4 w-4 text-teal-600" />
                <span>WhatsApp Target</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                +{whatsappNumber}
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/books"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                <span>Manage Inventory Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
