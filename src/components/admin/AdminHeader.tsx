"use client";

import { useRouter } from "next/navigation";
import { AdminSession } from "@/types/admin";
import { LogOut, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminHeaderProps {
  session: AdminSession;
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            Admin Console
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {session.role}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <span>View Public Store</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {session.name}
          </p>
          <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
            {session.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 dark:border-slate-800 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-950 transition-all disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isLoggingOut ? "Exiting..." : "Log Out"}</span>
        </button>
      </div>
    </header>
  );
}
