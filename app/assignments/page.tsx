"use client";

/**
 * Student Assignments Page
 *
 * Dedicated route allowing students to review, track, and complete all semester course deliverables.
 */

import React from "react";
import AssignmentList from "@/components/AssignmentList";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAssignments } from "@/lib/assignments";

/**
 * Renders the semester assignments management view with pending and completed counters.
 *
 * @returns Assignments page layout wrapped in ProtectedRoute.
 */
export default function AssignmentsPage() {
  const { assignments, pendingCount, completedCount, completeAssignment } =
    useAssignments();

  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Page Header Surface */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Coursework Deliverables
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assignments
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              View, track, and complete your semester course deliverables and lab submissions.
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {pendingCount} Pending
            </span>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {completedCount} Completed
            </span>
          </div>
        </div>

        {/* Assignment List Component */}
        <AssignmentList
          assignments={assignments}
          onComplete={completeAssignment}
        />
      </main>
    </ProtectedRoute>
  );
}
