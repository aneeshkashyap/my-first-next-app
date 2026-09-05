/**
 * Metric Stat Card Component
 *
 * Renders individual KPI metrics (e.g. Attendance, CGPA, Pending Assignments)
 * with status indicators, optional progress bar, and interactive quick-actions.
 */

import React, { ReactNode } from "react";
import ProgressBar from "@/components/ProgressBar";

export interface StatCardProps {
  /** Metric label / category title. */
  title: string;
  /** Primary metric value display string (e.g. "88%", "9.2", "3 Pending"). */
  value: string;
  /** Explanatory description text beneath the main metric. */
  description: string;
  /** Status badge label (e.g. "Good Standing", "Distinction"). */
  status: string;
  /** Tailwind CSS styling classes for the status badge. */
  statusColor: string;
  /** Category icon SVG element. */
  icon: ReactNode;
  /** Optional numeric percentage (0 - 100) to render a progress bar. */
  progress?: number;
  /** Optional action button or accessory element in the footer. */
  action?: ReactNode;
}

/**
 * Displays an individual metric card with title, icon, value, optional progress bar, and status badge.
 *
 * @param props - Metric card configuration properties.
 * @returns Formatted dashboard card element.
 */
export default function StatCard({
  title,
  value,
  description,
  status,
  statusColor,
  icon,
  progress,
  action,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Header: Title and Tonal Icon Container */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 shadow-xs">
            {icon}
          </div>
        </div>

        {/* Card Main Metric */}
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          {value}
        </div>

        {/* Optional Progress Bar */}
        {progress !== undefined && (
          <div className="my-2.5">
            <ProgressBar percentage={progress} />
          </div>
        )}

        {/* Card Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Card Footer Badge & Action */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium border inline-flex items-center gap-1.5 ${statusColor}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
          <span>{status}</span>
        </span>
        {action ? (
          action
        ) : (
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Current Term
          </span>
        )}
      </div>
    </div>
  );
}
