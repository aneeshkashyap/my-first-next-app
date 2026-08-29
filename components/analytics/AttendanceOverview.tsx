import React from "react";
import ProgressBar from "@/components/ProgressBar";
import { SubjectAttendance } from "@/lib/mockData";

export interface AttendanceOverviewProps {
  attendanceData: SubjectAttendance[];
}

export default function AttendanceOverview({
  attendanceData,
}: AttendanceOverviewProps) {
  const totalAttended = attendanceData.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage =
    totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  const lowAttendanceCount = attendanceData.filter((item) => item.percentage < 75).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Overall Attendance Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Combined presence across all {attendanceData.length} registered courses
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
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
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
            overallPercentage >= 85
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
              : overallPercentage >= 75
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
          }`}
        >
          {overallPercentage >= 75 ? "Good Standing" : "Shortage Warning"}
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar percentage={overallPercentage} />

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Attended</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            {totalAttended} / {totalClasses}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">Requirement</span>
          <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            75% Min
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block">At Risk (&lt;75%)</span>
          <span
            className={`text-base font-bold mt-0.5 block ${
              lowAttendanceCount > 0
                ? "text-red-600 dark:text-red-400"
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
