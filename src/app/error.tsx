"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
        An unexpected error occurred while loading this page. Please try again or contact support.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
