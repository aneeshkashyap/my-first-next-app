"use client";

import React from "react";
import AttendanceOverview from "@/components/analytics/AttendanceOverview";
import SubjectAttendanceList from "@/components/analytics/SubjectAttendanceList";
import PerformanceOverview from "@/components/analytics/PerformanceOverview";
import SubjectPerformanceList from "@/components/analytics/SubjectPerformanceList";
import SemesterTrendChart from "@/components/analytics/SemesterTrendChart";
import {
  mockSubjectAttendance,
  mockSubjectPerformance,
  mockSemesterTrends,
  mockStudentProfile,
} from "@/lib/mockData";

export default function AnalyticsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Analytics
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Spring 2026
          </span>
        </div>
        <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          In-depth insights into your attendance eligibility, subject marks, and semester grade trends
        </p>
      </div>

      {/* Top Overview Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceOverview
          cgpa={mockStudentProfile.cgpa}
          semesterTrends={mockSemesterTrends}
          currentPerformance={mockSubjectPerformance}
        />
        <AttendanceOverview attendanceData={mockSubjectAttendance} />
      </div>

      {/* Semester Trend Chart */}
      <div>
        <SemesterTrendChart trends={mockSemesterTrends} />
      </div>

      {/* Subject Breakdown Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Attendance Breakdown */}
        <SubjectAttendanceList attendanceData={mockSubjectAttendance} />

        {/* Subject Academic Performance Breakdown */}
        <SubjectPerformanceList performanceData={mockSubjectPerformance} />
      </div>
    </main>
  );
}
