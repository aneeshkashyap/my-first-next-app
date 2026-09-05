"use client";

/**
 * Assignment List Component
 *
 * Displays active semester coursework, course names, deadlines, completion statuses,
 * and handles interactive deliverable completion triggers.
 */

import React from "react";
import type { Assignment } from "@/lib/types/assignments";
import { getAssignmentBadgeStyle } from "@/lib/utils/formatters";

export type { Assignment };

export interface AssignmentListProps {
  /** Array of student assignments to display. */
  assignments: Assignment[];
  /** Optional callback triggered when the student marks an assignment complete. */
  onComplete?: (id: string | number) => void;
}

/**
 * Renders a list of course assignments with status indicators and completion buttons.
 *
 * @param props - Component configuration containing assignments and completion handler.
 * @returns Assignment list container element.
 */
export default function AssignmentList({
  assignments,
  onComplete,
}: AssignmentListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Assignments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your ongoing course deliverables and deadlines
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
          {assignments.length} Total
        </span>
      </div>

      {/* Empty State */}
      {assignments.length === 0 ? (
        <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
          No assignments scheduled for this semester.
        </div>
      ) : (
        /* Assignment Items List */
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {assignments.map((assignment) => {
            const isCompleted =
              (assignment.status || "").toLowerCase() === "completed";

            return (
              <div
                key={assignment.id}
                className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Title & Subject */}
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                    {assignment.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs">
                      {assignment.subject}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Due {assignment.dueDate}
                    </span>
                  </div>
                </div>

                {/* Status Badge & Action */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium border inline-flex items-center gap-1.5 ${getAssignmentBadgeStyle(
                      assignment.status
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
                    <span>{assignment.status}</span>
                  </span>

                  {onComplete && (
                    <button
                      type="button"
                      onClick={() => onComplete(assignment.id)}
                      disabled={isCompleted}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border flex items-center gap-1.5 shadow-xs ${
                        isCompleted
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75"
                          : "bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-200/80 dark:border-emerald-800/80 cursor-pointer"
                      }`}
                      aria-label={
                        isCompleted
                          ? `${assignment.title} is completed`
                          : `Mark ${assignment.title} as completed`
                      }
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
