"use client";

import Link from "next/link";
import { BookOpen, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/10 bg-white/90 backdrop-blur-md dark:border-emerald-500/10 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-900 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              BookBuddy
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Buy & Rent
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href="/books"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Explore Catalog</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <ShieldCheck className="h-4 w-4 text-slate-500" />
            <span className="hidden md:inline">Admin Portal</span>
          </Link>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all shadow-emerald-600/20 active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Support</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
