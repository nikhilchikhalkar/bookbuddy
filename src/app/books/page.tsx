import { BookService } from "@/services/book.service";
import { PaginatedBooksResult } from "@/types/book";
import { SearchBar } from "@/components/books/SearchBar";
import { FilterPanel } from "@/components/books/FilterPanel";
import { BookGrid } from "@/components/books/BookGrid";
import { Pagination } from "@/components/books/Pagination";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BooksPageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    availability?: "all" | "buy" | "rent" | "both";
    sortBy?: "title" | "author" | "buyPrice" | "rentPrice" | "newest";
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BooksPageProps): Promise<Metadata> {
  const params = await searchParams;
  const titleParts = ["Browse Books Catalog"];
  if (params.query) titleParts.unshift(`"${params.query}"`);
  if (params.category && params.category !== "All")
    titleParts.unshift(params.category);

  return {
    title: titleParts.join(" • "),
    description:
      "Explore our bookstore inventory to buy or rent books. Instant WhatsApp order checkout.",
  };
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const category = params.category || "All";
  const availability = params.availability || "all";
  const sortBy = params.sortBy || "newest";
  const page = parseInt(params.page || "1", 10) || 1;
  const limit = 12;

  let result: PaginatedBooksResult = {
    books: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  let categories: string[] = [];

  try {
    const [booksData, categoriesData] = await Promise.all([
      BookService.getBooks({
        query,
        category,
        availability,
        sortBy,
        page,
        limit,
      }),
      BookService.getCategories(),
    ]);

    result = booksData;
    categories = categoriesData;
  } catch (err) {
    console.error("Error loading books catalog:", err);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Page Heading & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Bookstore Catalog</span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Browse All Books
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {result.total} {result.total === 1 ? "book" : "books"} available for immediate purchase or rent
          </p>
        </div>

        <div className="w-full md:max-w-md">
          <SearchBar placeholder="Search by title, author, or ID..." />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <FilterPanel categories={categories} />
          </div>
        </aside>

        {/* Right Books Grid & Pagination */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Tags */}
          {(query || (category && category !== "All") || availability !== "all") && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>
              {query && (
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Search: &ldquo;{query}&rdquo;
                </span>
              )}
              {category !== "All" && (
                <span className="rounded-lg bg-teal-50 px-2.5 py-1 font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  Category: {category}
                </span>
              )}
              {availability !== "all" && (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                  {availability}
                </span>
              )}
            </div>
          )}

          <BookGrid books={result.books} />

          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            totalItems={result.total}
            limit={result.limit}
          />
        </main>
      </div>
    </div>
  );
}
