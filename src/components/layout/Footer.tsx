import Link from "next/link";
import { BookOpen, MessageCircle, Heart, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                BookBuddy
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Your instant, frictionless bookstore. Discover books, choose to Buy or Rent, and connect directly via WhatsApp for lightning-fast order fulfillment.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 w-fit">
              <MessageCircle className="h-4 w-4" />
              <span>Instant WhatsApp Concierge • Zero Signup Required</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/books?availability=buy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Buy Books
                </Link>
              </li>
              <li>
                <Link href="/books?availability=rent" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Rent Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Administration
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Login</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Inventory Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/import" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Excel Batch Import
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BookBuddy Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
