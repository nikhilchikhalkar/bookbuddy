"use client";

import { useState } from "react";
import { IBook } from "@/types/book";
import { formatPrice } from "@/lib/utils";
import { EditBookModal } from "./EditBookModal";
import {
  Search,
  Edit2,
  Power,
  CheckCircle2,
  XCircle,
  Hash,
  Barcode,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface AdminBookTableProps {
  initialBooks: IBook[];
  categories: string[];
}

export function AdminBookTable({
  initialBooks,
  categories,
}: AdminBookTableProps) {
  const [books, setBooks] = useState<IBook[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingBook, setEditingBook] = useState<IBook | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.bookId.toLowerCase().includes(search.toLowerCase()) ||
      b.serialNumber.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || b.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? b.isActive
        : !b.isActive;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (book: IBook) => {
    const confirmMsg = book.isActive
      ? `Are you sure you want to deactivate "${book.title}"? It will no longer appear on the public storefront.`
      : `Reactivate "${book.title}" so it becomes visible on the store?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(book.bookId);
    try {
      const res = await fetch(
        `/api/admin/books/${encodeURIComponent(book.bookId)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setBooks((prev) =>
        prev.map((item) =>
          item.bookId === book.bookId ? { ...item, isActive: data.isActive } : item
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBookUpdated = (updated: IBook) => {
    setBooks((prev) =>
      prev.map((item) => (item.bookId === updated.bookId ? updated : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, ID, or serial..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3.5">Book ID / Serial</th>
                <th className="px-4 py-3.5">Title & Author</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Buy Price</th>
                <th className="px-4 py-3.5">Rent Price</th>
                <th className="px-4 py-3.5">Availability</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No books match the current search/filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book.bookId}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                      !book.isActive ? "opacity-60 bg-slate-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                        <Hash className="h-3 w-3 text-slate-400" />
                        <span>{book.bookId}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Barcode className="h-3 w-3" />
                        <span>Sr #{book.serialNumber}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[220px]">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-500">by {book.author}</p>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {book.category || "General"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatPrice(book.buyPrice, book.currency)}
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-teal-600 dark:text-teal-400 whitespace-nowrap">
                      {book.rentPrice !== undefined
                        ? formatPrice(book.rentPrice, book.currency)
                        : "—"}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap space-x-1">
                      {book.availableForBuy && (
                        <span className="inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Buy
                        </span>
                      )}
                      {book.availableForRent && (
                        <span className="inline-flex rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                          Rent
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {book.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/books/${encodeURIComponent(book.bookId)}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                          title="View on store"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => setEditingBook(book)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-colors"
                          title="Edit Book"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(book)}
                          disabled={actionLoadingId === book.bookId}
                          className={`rounded-lg p-1.5 transition-colors ${
                            book.isActive
                              ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={book.isActive ? "Deactivate Book" : "Reactivate Book"}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between">
          <span>Showing {filteredBooks.length} of {books.length} books</span>
          <span className="text-[11px] text-slate-400">Deactivated books are preserved in database</span>
        </div>
      </div>

      {/* Edit Modal */}
      <EditBookModal
        book={editingBook}
        isOpen={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        onSuccess={handleBookUpdated}
      />
    </div>
  );
}
