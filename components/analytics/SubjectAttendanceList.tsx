import React from "react";
import { SubjectAttendance } from "@/lib/useAnalytics";

export interface SubjectAttendanceListProps {
  attendanceData: SubjectAttendance[];
}

export default function SubjectAttendanceList({
  attendanceData,
}: SubjectAttendanceListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Subject-wise Attendance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Detailed lecture and laboratory presence by course
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
          {attendanceData.length} Subjects
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {attendanceData.map((item) => {
          const isWarning = item.percentage < 75;
          // Calculate needed classes: (attended + x) / (total + x) >= 0.75 => x >= (0.75*total - attended) / 0.25
          const neededClasses = isWarning
            ? Math.max(1, Math.ceil((0.75 * item.total - item.attended) / 0.25))
            : 0;

          return (
            <div
              key={item.code}
              className={`p-5 sm:px-6 transition-colors ${
                isWarning
                  ? "bg-red-50/40 dark:bg-red-950/20 hover:bg-red-50/70 dark:hover:bg-red-950/30"
                  : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
              }`}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Faculty: {item.faculty} • {item.attended} of {item.total} lectures attended
                  </p>
                </div>

                {/* Percentage & Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`text-xl font-bold ${
                        isWarning
                          ? "text-red-600 dark:text-red-400"
                          : item.percentage >= 85
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${
                      isWarning
                        ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800"
                        : item.percentage >= 85
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800"
                    }`}
                  >
                    {isWarning ? "Shortage Warning" : "Eligible"}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isWarning
                      ? "bg-red-500"
                      : item.percentage >= 85
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Warning Alert Note */}
              {isWarning && (
                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs border border-red-200 dark:border-red-900/60">
                  <svg
                    className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    <strong>Attendance below 75% threshold!</strong> Attend at least{" "}
                    <strong>{neededClasses}</strong> more consecutive classes to regain eligibility.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
