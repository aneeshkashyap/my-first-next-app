import React from "react";

export interface Assignment {
  id: string | number;
  title: string;
  subject: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed" | string;
}

export interface AssignmentListProps {
  assignments: Assignment[];
}

/**
 * Helper function to return badge styles based on assignment status
 */
function getStatusBadgeStyle(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "in progress":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  }
}

export default function AssignmentList({ assignments }: AssignmentListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Assignments
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your ongoing course deliverables and deadlines
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
          {assignments.length} Total
        </span>
      </div>

      {/* Assignment Items List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
          >
            {/* Title & Subject */}
            <div className="space-y-1">
              <h3 className="font-medium text-slate-900 dark:text-white text-base">
                {assignment.title}
              </h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {assignment.subject}
                </span>
                <span>•</span>
                <span>Due {assignment.dueDate}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusBadgeStyle(
                  assignment.status
                )}`}
              >
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
