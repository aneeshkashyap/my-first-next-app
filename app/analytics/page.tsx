"use client";

import React from "react";
import AttendanceOverview from "@/components/analytics/AttendanceOverview";
import SubjectAttendanceList from "@/components/analytics/SubjectAttendanceList";
import PerformanceOverview from "@/components/analytics/PerformanceOverview";
import SubjectPerformanceList from "@/components/analytics/SubjectPerformanceList";
import SemesterTrendChart from "@/components/analytics/SemesterTrendChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAnalytics } from "@/lib/useAnalytics";

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Academic Analytics
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Spring 2026
            </span>
          </div>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            In-depth insights into your attendance eligibility, subject marks, and semester grade trends
          </p>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
              <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            </div>
            <div className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
              <div className="h-96 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
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
