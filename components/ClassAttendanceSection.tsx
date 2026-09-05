"use client";

/**
 * Class Attendance and Lecture Tracking Section Component
 *
 * Displays a live session-by-session log of attended, absent, and excused classes
 * alongside subject-wise percentage compliance cards and status badges.
 */

import React from "react";
import {
  useClassSessions,
  type ClassSessionItem,
  type SubjectClassStats,
} from "@/lib/attendance";
import {
  formatTime,
  formatDateLabel,
  getStatusBadgeClass,
} from "@/lib/utils/formatters";

/**
 * Renders the student's class attendance feed with overall compliance statistics
 * and a breakdown by enrolled subject.
 *
 * @returns Class attendance tracking section element.
 */
export default function ClassAttendanceSection() {
  const {
    sessions,
    subjectStats,
    overallPercentage,
    presentCount,
    absentCount,
    excusedCount,
    totalSessions,
    isLoading,
    error,
    refetch,
  } = useClassSessions();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header & Overall Summary */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Class Attendance & Lecture Tracking
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Session-by-session lecture presence, class timings, and subject compliance
          </p>
        </div>

        {/* Overall Percentage and Counts Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {totalSessions > 0 ? `${overallPercentage}%` : "—"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 font-medium">
              Present: {presentCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 font-medium">
              Absent: {absentCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 font-medium">
              Excused: {excusedCount}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium">
              Total: {totalSessions}
            </span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 mx-6 my-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={refetch}
            className="font-semibold underline hover:text-rose-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 space-y-3">
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-56 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
          No class sessions recorded yet for your enrolled courses.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Recent Class Sessions (2 Columns) */}
          <div className="lg:col-span-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {sessions.map((session: ClassSessionItem) => {
              const timeDisplay =
                session.startTime && session.endTime
                  ? `${formatTime(session.startTime)} – ${formatTime(session.endTime)}`
                  : "";
              const dateDisplay = formatDateLabel(session.sessionDate);

              return (
                <div
                  key={session.id}
                  className="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {session.courseCode}
                      </span>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {session.courseName}
                      </h3>
                    </div>

                    {session.topic && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {session.topic}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>{dateDisplay}</span>
                      {timeDisplay && <span>•</span>}
                      {timeDisplay && <span>{timeDisplay}</span>}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border inline-flex items-center gap-1.5 ${getStatusBadgeClass(
                        session.status
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
                      <span>{session.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject-Wise Attendance Summary (1 Column) */}
          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Subject-Wise Breakdown
            </h3>

            {subjectStats.length === 0 ? (
              <p className="text-xs text-slate-400">No subject attendance data.</p>
            ) : (
              <div className="space-y-4">
                {subjectStats.map((stat: SubjectClassStats) => (
                  <div key={stat.courseCode} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {stat.courseCode}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 ml-1.5 truncate max-w-[130px] inline-block align-bottom">
                          {stat.courseName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          {stat.attended} / {stat.total}
                        </span>
                        <span
                          className={`font-bold ${
                            stat.percentage >= 75
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stat.percentage >= 75 ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
