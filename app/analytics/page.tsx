"use client";

/**
 * Academic Analytics and Performance Page
 *
 * Provides a dedicated route rendering detailed attendance eligibility breakdown,
 * subject-wise examination marks, grade points, and semester GPA trends.
 */

import React from "react";
import AttendanceOverview from "@/components/analytics/AttendanceOverview";
import SubjectAttendanceList from "@/components/analytics/SubjectAttendanceList";
import PerformanceOverview from "@/components/analytics/PerformanceOverview";
import SubjectPerformanceList from "@/components/analytics/SubjectPerformanceList";
import SemesterTrendChart from "@/components/analytics/SemesterTrendChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAnalytics } from "@/lib/analytics";

/**
 * Renders the academic analytics dashboard page with charts and course metrics.
 *
 * @returns Analytics page layout wrapped in ProtectedRoute.
 */
export default function AnalyticsPage() {
  const {
    attendanceData,
    performanceData,
    semesterTrends,
    cgpa,
    isLoading,
    error,
    refetch,
  } = useAnalytics();

  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Academic Analytics Hero Surface */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Academic Evaluation & Progress
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Academic Analytics
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              In-depth evaluation of your attendance compliance, subject marks, and semester grade trends.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              Spring 2026 Term
            </span>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs sm:text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 rounded-xl hover:bg-rose-200 dark:hover:bg-rose-900 transition-all cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
              <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            </div>
            <div className="h-72 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
              <div className="h-96 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Top Overview Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceOverview
                cgpa={cgpa}
                semesterTrends={semesterTrends}
                currentPerformance={performanceData}
              />
              <AttendanceOverview attendanceData={attendanceData} />
            </div>

            {/* Semester Trend Chart */}
            <div>
              <SemesterTrendChart trends={semesterTrends} />
            </div>

            {/* Subject Breakdown Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Attendance Breakdown */}
              <SubjectAttendanceList attendanceData={attendanceData} />

              {/* Subject Academic Performance Breakdown */}
              <SubjectPerformanceList performanceData={performanceData} />
            </div>
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
