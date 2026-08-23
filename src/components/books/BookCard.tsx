"use client";

import Link from "next/link";
import { IBook } from "@/types/book";
import { formatPrice, truncateText } from "@/lib/utils";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingCart,
  CalendarDays,
  ExternalLink,
  BookMarked,
  Tag,
  Hash,
} from "lucide-react";

interface BookCardProps {
  book: IBook;
}

export function BookCard({ book }: BookCardProps) {
  const buyUrl = book.availableForBuy
    ? generateWhatsAppUrl({ book, action: "BUY" })
    : null;

  const rentUrl = book.availableForRent
    ? generateWhatsAppUrl({ book, action: "RENT" })
    : null;

  const isAvailable = book.availableForBuy || book.availableForRent;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Top Badges */}
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Hash className="h-3 w-3 text-slate-500" />
            <span>{book.bookId}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {book.category && (
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-950/80 dark:text-teal-300">
                <Tag className="h-3 w-3" />
                <span>{book.category}</span>
              </span>
            )}
            {!isAvailable && (
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                Out of stock
              </span>
            )}
          </div>
        </div>

        {/* Book Title & Author */}
        <div className="mb-3">
          <Link
            href={`/books/${encodeURIComponent(book.bookId)}`}
            className="group/title block"
          >
            <h3
              className="line-clamp-2 text-lg font-bold text-slate-900 group-hover/title:text-emerald-600 dark:text-white dark:group-hover/title:text-emerald-400 transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
            by <span className="text-slate-700 dark:text-slate-200">{book.author}</span>
          </p>
        </div>

        {/* Description snippet if present */}
        {book.description && (
          <p className="mb-4 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {truncateText(book.description, 100)}
          </p>
        )}

        {/* Price display grid */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Buy Price
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatPrice(book.buyPrice, book.currency)}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rent Price
            </span>
            <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
              {book.availableForRent && book.rentPrice !== undefined
                ? formatPrice(book.rentPrice, book.currency)
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Buy Button */}
          {book.availableForBuy && buyUrl ? (
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 shadow-emerald-600/20"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Buy</span>
            </a>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-600"
            >
              Buy N/A
            </button>
          )}

          {/* Rent Button */}
          {book.availableForRent && rentUrl ? (
            <a
              href={rentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95 shadow-teal-600/20"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Rent</span>
            </a>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-600"
            >
              Rent N/A
            </button>
          )}
        </div>

        {/* View Details Link */}
        <Link
          href={`/books/${encodeURIComponent(book.bookId)}`}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <BookMarked className="h-3.5 w-3.5 text-slate-400" />
          <span>View Details</span>
          <ExternalLink className="h-3 w-3 ml-0.5 text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
