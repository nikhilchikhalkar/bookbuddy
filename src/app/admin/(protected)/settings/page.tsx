import { getAdminSession } from "@/lib/auth";
import { Settings, Shield, Phone, Database, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  const whatsappNumber = process.env.WHATSAPP_NUMBER || "919876543210";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dbName = process.env.MONGODB_DB_NAME || "book_marketplace";

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Settings className="h-4 w-4" />
          <span>System & Configurations</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Settings & Environment
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Review active environment settings, WhatsApp endpoint, and administrative security
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Administrator Profile Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Active Administrator Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                Admin Name
              </span>
              <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                {session?.name}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                Admin Email
              </span>
              <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                {session?.email}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                Role
              </span>
              <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                {session?.role}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp & Integration Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            <Phone className="h-4 w-4 text-teal-600" />
            <span>WhatsApp Click-to-Chat Integration</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                  Connected WhatsApp Number
                </span>
                <p className="mt-0.5 font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                  +{whatsappNumber}
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live & Active
              </span>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                To modify this number, update the <code className="font-mono font-bold">WHATSAPP_NUMBER</code> variable in your server environment (<code className="font-mono">.env.local</code> / hosting dashboard) and restart the application.
              </span>
            </div>
          </div>
        </div>

        {/* Database & Infrastructure */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            <Database className="h-4 w-4 text-indigo-600" />
            <span>Database & Runtime</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                Database Target
              </span>
              <p className="mt-1 font-mono font-bold text-slate-800 dark:text-slate-200">
                {dbName}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px] font-semibold uppercase">
                Base URL
              </span>
              <p className="mt-1 font-mono font-bold text-slate-800 dark:text-slate-200">
                {appUrl}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
