import { ReactNode } from "react";
import ProgressBar from "./ProgressBar";

export interface StatCardProps {
  title: string;
  value: string;
  description: string;
  status: string;
  statusColor: string;
  icon: ReactNode;
  progress?: number;
  action?: ReactNode;
}

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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header: Title and Icon */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </h2>
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
          {icon}
        </div>
      </div>

      {/* Card Main Metric */}
      <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        {value}
      </div>

      {/* Optional Progress Bar */}
      {progress !== undefined && <ProgressBar percentage={progress} />}

      {/* Card Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {description}
      </p>

      {/* Card Footer Badge & Action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${statusColor}`}
        >
          {status}
        </span>
        {action ? (
          action
        ) : (
          <span className="text-xs text-slate-400">Current Term</span>
        )}
      </div>
    </div>
  );
}
