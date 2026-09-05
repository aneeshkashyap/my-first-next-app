/**
 * Linear Progress Bar Indicator Component
 *
 * Renders an animated horizontal progress indicator for percentages (0 - 100).
 */

import React from "react";

export interface ProgressBarProps {
  /** Numeric percentage representing progress (0 to 100). */
  percentage: number;
  /** Optional custom fill color class (defaults to threshold-based coloring). */
  colorClass?: string;
  /** Optional height class (defaults to "h-2"). */
  heightClass?: string;
}

/**
 * Displays an accessible Material-style horizontal progress indicator reflecting a numeric percentage.
 *
 * @param props - Component props containing the completion percentage and optional styling overrides.
 * @returns Progress bar element.
 */
export default function ProgressBar({
  percentage,
  colorClass,
  heightClass = "h-2",
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(Number.isFinite(percentage) ? percentage : 0, 0), 100);

  // Material academic threshold palette: >=75% emerald, 65-74% amber, <65% rose
  const defaultFill =
    clamped >= 75
      ? "bg-emerald-600 dark:bg-emerald-500"
      : clamped >= 65
      ? "bg-amber-500 dark:bg-amber-400"
      : "bg-rose-600 dark:bg-rose-500";

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full ${heightClass} mb-3 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10`}
    >
      <div
        className={`${colorClass || defaultFill} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
