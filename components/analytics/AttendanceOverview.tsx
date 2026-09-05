"use client";

/**
 * Attendance Overview KPI Card Component
 *
 * Displays aggregated student attendance metrics across all registered courses,
 * compliance status badge, visual progress bar, and at-risk count.
 */

import React from "react";
import ProgressBar from "@/components/ProgressBar";
import type { SubjectAttendance } from "@/lib/types/analytics";
import { calculateAttendancePercentage } from "@/lib/utils/calculations";

export interface AttendanceOverviewProps {
  /** Array of subject attendance records. */
  attendanceData: SubjectAttendance[];
}

/**
 * Renders the top-level attendance summary card for the academic analytics dashboard.
 *
 * @param props - Component configuration with subject attendance records.
 * @returns Formatted attendance overview card element.
 */
export default function AttendanceOverview({
  attendanceData,
}: AttendanceOverviewProps) {
  const totalAttended = attendanceData.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = calculateAttendancePercentage(totalAttended, totalClasses);
  const lowAttendanceCount = attendanceData.filter((item) => item.percentage < 75).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Overall Attendance Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Combined presence across all {attendanceData.length} registered courses
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Metric */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {overallPercentage}%
          </span>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium border inline-flex items-center gap-1.5 ${
              overallPercentage >= 85
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                : overallPercentage >= 75
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
            <span>{overallPercentage >= 75 ? "Good Standing" : "Shortage Warning"}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="my-3">
          <ProgressBar percentage={overallPercentage} />
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Attended</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            {totalAttended} / {totalClasses}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Requirement</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            75% Min
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">At Risk (&lt;75%)</span>
          <span
            className={`text-base font-bold mt-0.5 block ${
              lowAttendanceCount > 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {lowAttendanceCount} {lowAttendanceCount === 1 ? "Subject" : "Subjects"}
          </span>
        </div>
      </div>
    </div>
  );
}
