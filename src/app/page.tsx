import Link from "next/link";
import { BookService } from "@/services/book.service";
import { IBook } from "@/types/book";
import { SearchBar } from "@/components/books/SearchBar";
import { BookGrid } from "@/components/books/BookGrid";
import {
  Sparkles,
  ShoppingBag,
  CalendarDays,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let books: IBook[] = [];
  let categories: string[] = [];

  try {
    const result = await BookService.getBooks({ limit: 6, sortBy: "newest" });
    books = result.books;
    categories = await BookService.getCategories();
  } catch (err) {
    console.error("Error fetching homepage books:", err);
  }

  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent pt-20 pb-24 dark:from-emerald-950/40 dark:via-slate-900/20">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold text-emerald-800 backdrop-blur-md dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Direct WhatsApp Commerce • Zero Account Required</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
              Buy or Rent Books{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Instantly on WhatsApp
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Find your next favorite read, choose to <strong>Buy</strong> or <strong>Rent</strong>, and connect with us in 1-click. Frictionless book delivery directly to your door.
            </p>

            {/* Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <SearchBar placeholder="Search by book title, author, ID (e.g. BK-1001)..." />
            </div>

            {/* Quick Category Badges */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">
                  Popular Categories:
                </span>
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat}
                    href={`/books?category=${encodeURIComponent(cat)}`}
                    className="rounded-xl bg-white/90 px-3.5 py-1.5 font-semibold text-slate-700 shadow-sm border border-slate-200/80 hover:border-emerald-500 hover:text-emerald-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 transition-all hover:scale-105"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            <span>Frictionless Ordering</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            How It Works in 3 Easy Steps
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Skip cart checkout forms — order through our dedicated WhatsApp concierge
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
              1. Browse & Select
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore our curated library with verified serial IDs, pricing, and availability tags.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <div className="flex items-center gap-1">
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs font-extrabold">/</span>
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
              2. Choose Buy or Rent
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Buy for your permanent collection or rent for exam prep & leisure reading.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">
              3. Instant WhatsApp Order
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              WhatsApp opens automatically with pre-filled book details and your chosen action. Confirm in chat!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Current Stock</span>
            </div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Featured Books in Catalog
            </h2>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 transition-colors group"
          >
            <span>Explore All Books</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <BookGrid books={books} />

        {books.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all active:scale-95 hover:scale-105"
            >
              <span>Explore Complete Inventory Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 p-8 sm:p-14 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold">100% Verified Copies</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every single title is tracked by unique serial numbers and quality inspected.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold">Human WhatsApp Support</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct real-time communication with our team for quick address confirmation and delivery updates.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold">Flexible Rent Returns</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rent books for semesters, courses, or reading goals and return easily when finished.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
