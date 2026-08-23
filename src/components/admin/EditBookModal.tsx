"use client";

import { useState } from "react";
import { IBook } from "@/types/book";
import { X, Loader2, Save } from "lucide-react";

interface EditBookModalProps {
  book: IBook | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: IBook) => void;
}

export function EditBookModal({
  book,
  isOpen,
  onClose,
  onSuccess,
}: EditBookModalProps) {
  const [formData, setFormData] = useState<Partial<IBook>>({
    title: book?.title || "",
    author: book?.author || "",
    buyPrice: book?.buyPrice ?? 0,
    rentPrice: book?.rentPrice ?? undefined,
    category: book?.category || "General",
    description: book?.description || "",
    isbn: book?.isbn || "",
    publisher: book?.publisher || "",
    publishedYear: book?.publishedYear || undefined,
    availableForBuy: book?.availableForBuy ?? true,
    availableForRent: book?.availableForRent ?? false,
    isActive: book?.isActive ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/books/${encodeURIComponent(book.bookId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      onSuccess(data.book);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving changes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Edit Book Details
            </h2>
            <p className="text-xs text-slate-400">
              Book ID: <span className="font-bold text-slate-700 dark:text-slate-300">{book.bookId}</span> (Sr #{book.serialNumber})
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Author */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Buy Price */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Buy Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={formData.buyPrice}
                onChange={(e) =>
                  setFormData({ ...formData, buyPrice: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Rent Price */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Rent Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.rentPrice ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rentPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="Leave blank if not for rent"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* ISBN */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn || ""}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Publisher */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Publisher
              </label>
              <input
                type="text"
                value={formData.publisher || ""}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableForBuy}
                onChange={(e) =>
                  setFormData({ ...formData, availableForBuy: e.target.checked })
                }
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Available for Buy</span>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableForRent}
                onChange={(e) =>
                  setFormData({ ...formData, availableForRent: e.target.checked })
                }
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Available for Rent</span>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Active on Store</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
