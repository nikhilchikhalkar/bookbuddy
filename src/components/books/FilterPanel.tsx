"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  categories: string[];
}

export function FilterPanel({ categories }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "All";
  const activeAvailability = searchParams.get("availability") || "all";
  const activeSort = searchParams.get("sortBy") || "newest";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All" || value === "all" || (key === "sortBy" && value === "newest")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("query");
    if (query) params.set("query", query);
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters =
    activeCategory !== "All" ||
    activeAvailability !== "all" ||
    activeSort !== "newest";

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <span>Filters & Sorting</span>
        </div>

        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Availability Filter */}
        <div>
          <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Availability
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "all", label: "All Available" },
              { id: "buy", label: "Buy Only" },
              { id: "rent", label: "Rent Only" },
              { id: "both", label: "Buy & Rent" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateParam("availability", item.id)}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  activeAvailability === item.id
                    ? "bg-emerald-600 font-bold text-white shadow-sm shadow-emerald-600/20"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sort Order
          </label>
          <select
            value={activeSort}
            onChange={(e) => updateParam("sortBy", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="buyPrice">Buy Price: Low to High</option>
            <option value="rentPrice">Rent Price: Low to High</option>
            <option value="title">Title: A to Z</option>
            <option value="author">Author: A to Z</option>
          </select>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Categories
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateParam("category", "All")}
                className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                  activeCategory === "All"
                    ? "bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => updateParam("category", cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                    activeCategory === cat
                      ? "bg-slate-900 font-bold text-white dark:bg-white dark:text-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
