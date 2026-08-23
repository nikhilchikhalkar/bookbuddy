import { notFound } from "next/navigation";
import Link from "next/link";
import { BookService } from "@/services/book.service";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingCart,
  CalendarDays,
  ArrowLeft,
  BookOpen,
  Hash,
  Tag,
  Building2,
  Calendar,
  Barcode,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BookDetailsPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export async function generateMetadata({
  params,
}: BookDetailsPageProps): Promise<Metadata> {
  const { bookId } = await params;
  const decodedId = decodeURIComponent(bookId);
  const book = await BookService.getBookByBookId(decodedId);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book was not found in our catalog.",
    };
  }

  return {
    title: `${book.title} by ${book.author} (ID: ${book.bookId})`,
    description:
      book.description ||
      `Buy or Rent ${book.title} by ${book.author}. Buy Price: ${formatPrice(book.buyPrice, book.currency)}. Order via WhatsApp.`,
    openGraph: {
      title: `${book.title} • Buy & Rent on BookBuddy`,
      description: `Buy Price: ${formatPrice(book.buyPrice, book.currency)} | Rent Price: ${formatPrice(book.rentPrice, book.currency)}`,
      type: "article",
    },
  };
}

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { bookId } = await params;
  const decodedId = decodeURIComponent(bookId);
  const book = await BookService.getBookByBookId(decodedId);

  if (!book) {
    notFound();
  }

  const buyUrl = book.availableForBuy
    ? generateWhatsAppUrl({ book, action: "BUY" })
    : null;

  const rentUrl = book.availableForRent
    ? generateWhatsAppUrl({ book, action: "RENT" })
    : null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    isbn: book.isbn,
    publisher: book.publisher,
    datePublished: book.publishedYear?.toString(),
    description: book.description,
    offers: {
      "@type": "Offer",
      price: book.buyPrice,
      priceCurrency: book.currency || "INR",
      availability: book.availableForBuy
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to Catalog Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link
          href="/books"
          className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Books</span>
        </Link>
        <span>/</span>
        {book.category && (
          <>
            <Link
              href={`/books?category=${encodeURIComponent(book.category)}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {book.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate max-w-[200px] text-slate-900 dark:text-white font-semibold">
          {book.title}
        </span>
      </nav>

      {/* Main Book Detail Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Decorative/Cover Column */}
          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Hash className="h-3 w-3" />
                  <span>{book.bookId}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-teal-200">
                  <span>Sr #{book.serialNumber}</span>
                </span>
              </div>

              <div className="space-y-3 pt-6">
                <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 shadow-inner">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {book.title}
                </h1>
                <p className="text-emerald-200/90 text-base font-medium">
                  by <span className="text-white font-bold">{book.author}</span>
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 text-xs text-emerald-200/80 flex items-center justify-between">
              <span>Authentic Copy</span>
              <span className="font-semibold text-white">Verified Inventory</span>
            </div>
          </div>

          {/* Right Details & Actions Column */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category & Status */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {book.category && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <Tag className="h-3.5 w-3.5" />
                      <span>{book.category}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {book.availableForBuy ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Available for Buy</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <XCircle className="h-4 w-4" />
                      <span>Buy Unavailable</span>
                    </span>
                  )}

                  {book.availableForRent ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Available for Rent</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <XCircle className="h-4 w-4" />
                      <span>Rent Unavailable</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Price Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Purchase Price (Buy)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatPrice(book.buyPrice, book.currency)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">One-time purchase</span>
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Rental Price (Rent)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                      {book.availableForRent && book.rentPrice !== undefined
                        ? formatPrice(book.rentPrice, book.currency)
                        : "N/A"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Flexible duration</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    About this book
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Book Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <Hash className="h-3 w-3" />
                    <span>Book ID</span>
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {book.bookId}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <Barcode className="h-3 w-3" />
                    <span>Serial Number</span>
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {book.serialNumber}
                  </p>
                </div>

                {book.isbn && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Barcode className="h-3 w-3" />
                      <span>ISBN</span>
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {book.isbn}
                    </p>
                  </div>
                )}

                {book.publisher && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Building2 className="h-3 w-3" />
                      <span>Publisher</span>
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {book.publisher}
                    </p>
                  </div>
                )}

                {book.publishedYear && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Calendar className="h-3 w-3" />
                      <span>Published Year</span>
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {book.publishedYear}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Direct WhatsApp Call to Actions */}
            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Buy Action */}
                {book.availableForBuy && buyUrl ? (
                  <a
                    href={buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all shadow-emerald-600/20"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Buy Now on WhatsApp ({formatPrice(book.buyPrice, book.currency)})</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="cursor-not-allowed rounded-2xl bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-400 dark:bg-slate-800"
                  >
                    Not Available to Buy
                  </button>
                )}

                {/* Rent Action */}
                {book.availableForRent && rentUrl ? (
                  <a
                    href={rentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-sm font-bold text-white shadow-md hover:bg-teal-700 active:scale-95 transition-all shadow-teal-600/20"
                  >
                    <CalendarDays className="h-5 w-5" />
                    <span>Rent Now on WhatsApp ({formatPrice(book.rentPrice, book.currency)})</span>
                  </a>
                ) : (
                  <button
                    disabled
                    className="cursor-not-allowed rounded-2xl bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-400 dark:bg-slate-800"
                  >
                    Not Available to Rent
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2">
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Orders and queries are confirmed immediately with our team on WhatsApp.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
