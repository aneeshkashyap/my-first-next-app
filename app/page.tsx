"use client";

/**
 * Student Portal Main Dashboard Page
 *
 * Serves as the primary entry/composition view displaying high-level KPI stat cards,
 * lecture tracking & attendance compliance, pending assignments list, and announcements feed.
 */

import React from "react";
import StatCard, { type StatCardProps } from "@/components/StatCard";
import AssignmentList from "@/components/AssignmentList";
import Announcements from "@/components/Announcements";
import ClassAttendanceSection from "@/components/ClassAttendanceSection";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAssignments } from "@/lib/assignments";
import { useProfile } from "@/lib/profile";
import { useAuth } from "@/components/AuthProvider";
import {
  resolveCgpaStanding,
  resolveAttendanceStanding,
} from "@/lib/utils/calculations";

/**
 * Main dashboard composition component for the authenticated student portal.
 *
 * @returns Dashboard page layout wrapped in ProtectedRoute.
 */
export default function Home() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { assignments, pendingCount, completeAssignment, completeOne } =
    useAssignments();

  const attendancePercent = profile.attendancePercent;
  const { status: attendanceStatus, statusColor: attendanceColor } =
    resolveAttendanceStanding(attendancePercent);

  const cgpaValue = profile.cgpa;
  const cgpaStatus = resolveCgpaStanding(cgpaValue);

  const cards: StatCardProps[] = [
    {
      title: "Attendance",
      value: profile.attendance,
      progress: attendancePercent,
      description: "Overall lecture and lab presence",
      status: attendanceStatus,
      statusColor: attendanceColor,
      icon: (
        <svg
          className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "CGPA",
      value: cgpaValue,
      description: "Cumulative Grade Point Average",
      status: cgpaStatus,
      statusColor:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
    },
    {
      title: "Assignments",
      value: `${pendingCount} Pending`,
      description: "Upcoming tasks to complete",
      status: pendingCount === 0 ? "All Done" : "In Progress",
      statusColor:
        pendingCount === 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
      icon: (
        <svg
          className="w-6 h-6 text-amber-600 dark:text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      action: (
        <button
          onClick={completeOne}
          disabled={pendingCount === 0}
          className="text-xs font-semibold px-3 py-1.5 bg-amber-50 hover:bg-amber-100 active:scale-[0.98] dark:bg-amber-950/50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-lg transition-all border border-amber-200/80 dark:border-amber-800/80 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        >
          Complete One
        </button>
      ),
    },
  ];

  const studentDisplayName =
    profile.name && profile.name.toLowerCase() !== "student"
      ? profile.name
      : user?.name && user.name.toLowerCase() !== "student"
      ? user.name
      : user?.email
      ? user.email.split("@")[0]
      : "Student";

  const currentSemester =
    profile.semester && profile.semester !== "Not Specified"
      ? profile.semester
      : "Spring 2026";

  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Material Institutional Welcome Surface */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Institutional Academic Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {studentDisplayName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Review your live attendance, active coursework deliverables, and institutional notices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <svg
                className="w-3.5 h-3.5 text-slate-500"
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
              {currentSemester}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Term
            </span>
          </div>
        </div>

        {/* Responsive Dashboard Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Class Attendance & Lecture Tracking Section */}
        <ClassAttendanceSection />

        {/* Recent Assignments Section */}
        <AssignmentList
          assignments={assignments}
          onComplete={completeAssignment}
        />

        {/* Recent Announcements Section */}
        <Announcements />
      </main>
    </ProtectedRoute>
  );
}
