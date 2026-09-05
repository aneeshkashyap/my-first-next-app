"use client";

/**
 * Announcements Page
 *
 * Dedicated route providing access to official campus notices, academic circulars,
 * and live search filtering.
 */

import React from "react";
import Announcements from "@/components/Announcements";
import ProtectedRoute from "@/components/ProtectedRoute";

/**
 * Renders the announcements page view wrapped in student session protection.
 *
 * @returns Announcements page layout wrapped in ProtectedRoute.
 */
export default function AnnouncementsPage() {
  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Page Header Surface */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Official Campus Bulletins
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Announcements
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Stay updated with verified academic notices, departmental circulars, and campus events.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Institutional Feed
            </span>
          </div>
        </div>

        {/* Announcements Component with Live Search */}
        <Announcements />
      </main>
    </ProtectedRoute>
  );
}
