import Link from "next/link";
import { BookX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <BookX className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
        Page or Book Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The book or page you are looking for might have been moved, deactivated, or does not exist in our catalog.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Book Catalog</span>
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
