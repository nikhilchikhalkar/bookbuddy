import { BookService } from "@/services/book.service";
import { AdminBookTable } from "@/components/admin/AdminBookTable";
import { IBook } from "@/types/book";
import Link from "next/link";
import { BookMarked, FileSpreadsheet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  let books: IBook[] = [];
  let categories: string[] = [];

  try {
    const [booksResult, categoriesResult] = await Promise.all([
      BookService.getBooks({ limit: 500, includeInactive: true }),
      BookService.getCategories(),
    ]);
    books = booksResult.books;
    categories = categoriesResult;
  } catch (err) {
    console.error("Failed to load admin books:", err);
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <BookMarked className="h-4 w-4" />
            <span>Inventory Management</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Books & Pricing Catalog
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View, edit prices, toggle availability, and activate/deactivate individual book records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Import from Excel</span>
          </Link>
        </div>
      </div>

      {/* Book Table */}
      <AdminBookTable initialBooks={books} categories={categories} />
    </div>
  );
}
