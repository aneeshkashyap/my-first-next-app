"use client";

/**
 * Academic Performance Overview KPI Card Component
 *
 * Displays cumulative CGPA, latest semester SGPA, total earned credits,
 * and current semester top-performing course.
 */

import React from "react";
import type { SemesterTrend, SubjectPerformance } from "@/lib/types/analytics";

export interface PerformanceOverviewProps {
  /** Current cumulative CGPA formatted string. */
  cgpa: string;
  /** Historical semester SGPA and CGPA trends. */
  semesterTrends: SemesterTrend[];
  /** Current semester course performances. */
  currentPerformance: SubjectPerformance[];
}

/**
 * Renders the top-level academic performance and CGPA summary card.
 *
 * @param props - Component configuration containing CGPA, trends, and current course records.
 * @returns Performance overview card element.
 */
export default function PerformanceOverview({
  cgpa,
  semesterTrends,
  currentPerformance,
}: PerformanceOverviewProps) {
  const currentSemester =
    semesterTrends[semesterTrends.length - 1] || {
      sgpa: 8.7,
      status: "Distinction",
    };

  const totalCredits = semesterTrends.reduce((acc, curr) => acc + curr.credits, 0);
  const currentCredits = currentPerformance.reduce((acc, curr) => acc + curr.credits, 0);
  const highestGradeSubject = [...currentPerformance].sort(
    (a, b) => b.totalMarks - a.totalMarks
  )[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Academic Performance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Cumulative Grade Point Average & credit progress
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
          </div>
        </div>

        {/* Prominent CGPA Display */}
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {cgpa}
          </span>
          <span className="text-sm font-medium text-slate-400">/ 10.0</span>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            First Class with Distinction
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Current semester SGPA: <strong className="text-slate-800 dark:text-slate-200">{currentSemester.sgpa}</strong> • Top 5% ranking
        </p>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Credits</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            {totalCredits}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Current Credits</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            {currentCredits}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Top Subject</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
            {highestGradeSubject ? `${highestGradeSubject.grade} (${highestGradeSubject.totalMarks})` : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
