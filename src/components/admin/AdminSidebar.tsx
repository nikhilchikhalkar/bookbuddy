"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookMarked,
  FileSpreadsheet,
  History,
  Settings,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Inventory Management",
      href: "/admin/books",
      icon: BookMarked,
    },
    {
      label: "Excel Batch Import",
      href: "/admin/import",
      icon: FileSpreadsheet,
    },
    {
      label: "Import Logs & History",
      href: "/admin/history",
      icon: History,
    },
    {
      label: "Settings & System",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
