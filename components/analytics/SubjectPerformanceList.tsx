"use client";

/**
 * Subject-wise Academic Performance Breakdown Component
 *
 * Lists enrolled courses with internal assessment scores, semester final marks,
 * total marks out of 100, earned grade points, and letter grade badges.
 */

import React from "react";
import type { SubjectPerformance } from "@/lib/types/analytics";
import { getGradeBadgeColor } from "@/lib/utils/formatters";

export interface SubjectPerformanceListProps {
  /** Array of course performance evaluations. */
  performanceData: SubjectPerformance[];
}

/**
 * Renders the breakdown of internal, external, and letter grades across all enrolled subjects.
 *
 * @param props - Component configuration containing course performance records.
 * @returns Subject performance list container element.
 */
export default function SubjectPerformanceList({
  performanceData,
}: SubjectPerformanceListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Subject-wise Academic Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Internal assessments, semester finals, and letter grades
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
          {performanceData.length} Evaluated
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {performanceData.map((item) => (
          <div
            key={item.code}
            className="p-5 sm:px-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.code}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                    {item.subject}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Credits: {item.credits}</span>
                  <span>•</span>
                  <span>Internal: {item.internalMarks}/50</span>
                  <span>•</span>
                  <span>External: {item.externalMarks}/50</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Total: {item.totalMarks}/100</span>
                </div>
              </div>

              {/* Grade Badge and Points */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.gradePoints} GP
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Grade Point</span>
                </div>
                <span
                  className={`text-sm px-3.5 py-1 rounded-xl font-bold border shadow-xs ${getGradeBadgeColor(
                    item.grade
                  )}`}
                >
                  {item.grade}
                </span>
              </div>
            </div>

            {/* Visual Performance Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  item.totalMarks >= 90
                    ? "bg-emerald-500"
                    : item.totalMarks >= 80
                    ? "bg-blue-600"
                    : item.totalMarks >= 70
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${item.totalMarks}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
