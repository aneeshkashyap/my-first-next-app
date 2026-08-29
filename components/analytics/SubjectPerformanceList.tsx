import React from "react";
import { SubjectPerformance } from "@/lib/mockData";

export interface SubjectPerformanceListProps {
  performanceData: SubjectPerformance[];
}

function getGradeBadgeColor(grade: string): string {
  switch (grade) {
    case "A+":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "A":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "B+":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800";
    case "B":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

export default function SubjectPerformanceList({
  performanceData,
}: SubjectPerformanceListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Subject-wise Academic Performance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Internal assessments, semester finals, and letter grades
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
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
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.code}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                    {item.subject}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>Credits: {item.credits}</span>
                  <span>•</span>
                  <span>Internal: {item.internalMarks}/50</span>
                  <span>•</span>
                  <span>External: {item.externalMarks}/50</span>
                  <span>•</span>
                  <span>Total: {item.totalMarks}/100</span>
                </div>
              </div>

              {/* Grade Badge and Points */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.gradePoints} GP
                  </span>
                  <span className="text-xs text-slate-400 block">Grade Point</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-lg font-bold border ${getGradeBadgeColor(
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
                    ? "bg-blue-500"
                    : item.totalMarks >= 70
                    ? "bg-indigo-500"
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
