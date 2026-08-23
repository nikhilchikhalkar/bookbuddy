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
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-emerald-900/10 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent pt-16 pb-20 dark:from-emerald-950/40 dark:via-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Direct WhatsApp Commerce • Zero Account Required</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Buy or Rent Books{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Instantly on WhatsApp
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Find your next favorite read, choose to <strong>Buy</strong> or <strong>Rent</strong>, and message us with a single click. We handle delivery and returns with zero hassle.
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <SearchBar placeholder="Search by book title, author, ID (e.g. BK-1001)..." />
            </div>

            {/* Quick Category Badges */}
            {categories.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Popular:</span>
                {categories.slice(0, 5).map((cat) => (
                  <Link
                    key={cat}
                    href={`/books?category=${encodeURIComponent(cat)}`}
                    className="rounded-lg bg-white/80 px-3 py-1 font-medium text-slate-700 shadow-sm border border-slate-200/80 hover:border-emerald-500 hover:text-emerald-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 transition-colors"
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
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            How It Works in 3 Simple Steps
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Frictionless book shopping with personal concierge on WhatsApp
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              1. Browse & Discover
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore our curated library with detailed prices, serial IDs, and availability tags for both purchasing and renting.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
              <div className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-bold">/</span>
                <CalendarDays className="h-4 w-4" />
              </div>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              2. Choose Buy or Rent
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Select whether you want to own the copy or rent it for a fraction of the cost. Everything is clearly priced.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              3. 1-Click WhatsApp Chat
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              WhatsApp opens automatically with pre-filled book details and your chosen action. Confirm payment & address right in chat!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Recent Arrivals</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Featured Books in Inventory
            </h2>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors group"
          >
            <span>View All Books</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <BookGrid books={books} />

        {books.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all active:scale-95"
            >
              <span>Explore Complete Inventory ({books.length}+ Available)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
              <h4 className="text-base font-bold">100% Genuine Books</h4>
              <p className="text-xs text-slate-300">
                Every title is verified by human-readable serial numbers and quality inspected.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <MessageCircle className="h-8 w-8 text-teal-400" />
              <h4 className="text-base font-bold">Instant Support</h4>
              <p className="text-xs text-slate-300">
                Direct real-time WhatsApp communication with our bookstore team.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <CalendarDays className="h-8 w-8 text-emerald-400" />
              <h4 className="text-base font-bold">Flexible Renting</h4>
              <p className="text-xs text-slate-300">
                Rent books for exams or leisure and return whenever you’re done.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
