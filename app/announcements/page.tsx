"use client";

import React from "react";
import Announcements from "@/components/Announcements";

export default function AnnouncementsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Announcements
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Stay updated with official academic notices, departmental news, and campus events
        </p>
      </div>

      {/* Announcements Component with Live Search */}
      <Announcements />
    </main>
  );
}
