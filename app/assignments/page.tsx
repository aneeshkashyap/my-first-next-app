"use client";

import React, { useState } from "react";
import AssignmentList, { Assignment } from "@/components/AssignmentList";
import { initialMockAssignments } from "@/lib/mockData";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialMockAssignments);

  const handleCompleteAssignment = (id: string | number) => {
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      )
    );
  };

  const totalCount = assignments.length;
  const completedCount = assignments.filter(
    (a) => a.status.toLowerCase() === "completed"
  ).length;
  const pendingCount = totalCount - completedCount;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assignments
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            View, track, and complete your semester course deliverables
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {pendingCount} Pending
          </span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {completedCount} Completed
          </span>
        </div>
      </div>

      {/* Assignment List Component */}
      <AssignmentList
        assignments={assignments}
        onComplete={handleCompleteAssignment}
      />
    </main>
  );
}
