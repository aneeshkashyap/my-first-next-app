import React, { useState } from "react";
import { SemesterTrend } from "@/lib/mockData";

export interface SemesterTrendChartProps {
  trends: SemesterTrend[];
}

export default function SemesterTrendChart({
  trends,
}: SemesterTrendChartProps) {
  const [hoveredSem, setHoveredSem] = useState<SemesterTrend | null>(null);

  // Maximum scale is 10.0
  const maxScale = 10.0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Semester GPA Performance Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Progression of Semester SGPA and Cumulative CGPA across academic terms
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-300">SGPA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-300">CGPA</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas / Columns */}
      <div className="pt-8 pb-4 px-2">
        <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-52 border-b border-slate-200 dark:border-slate-700 pb-2">
          {trends.map((item) => {
            const sgpaHeightPercent = (item.sgpa / maxScale) * 100;
            const cgpaHeightPercent = (item.cgpa / maxScale) * 100;
            const isHovered = hoveredSem?.semester === item.semester;

            return (
              <div
                key={item.semester}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredSem(item)}
                onMouseLeave={() => setHoveredSem(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-900 dark:bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none transition-all">
                    <div className="font-semibold text-indigo-300">{item.semester}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span>SGPA: <strong>{item.sgpa}</strong></span>
                      <span>•</span>
                      <span>CGPA: <strong>{item.cgpa}</strong></span>
                    </div>
                  </div>
                )}

                {/* Double Bar Container */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                  {/* SGPA Bar */}
                  <div
                    className="w-full max-w-[18px] sm:max-w-[24px] bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all duration-300 relative group"
                    style={{ height: `${sgpaHeightPercent}%` }}
                  >
                    <span className="opacity-0 sm:group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 pointer-events-none transition-opacity">
                      {item.sgpa}
                    </span>
                  </div>

                  {/* CGPA Bar */}
                  <div
                    className="w-full max-w-[18px] sm:max-w-[24px] bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300 relative group"
                    style={{ height: `${cgpaHeightPercent}%` }}
                  >
                    <span className="opacity-0 sm:group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pointer-events-none transition-opacity">
                      {item.cgpa}
                    </span>
                  </div>
                </div>

                {/* Semester Label */}
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full text-center">
                  Sem {item.semester.replace(/[^0-9]/g, "")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Scale Details */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Scale: 0.0 – 10.0</span>
          <span>Semester-over-semester growth: +0.40 CGPA gain</span>
        </div>
      </div>
    </div>
  );
}
