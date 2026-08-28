"use client";

import { useState } from "react";
import Header from "@/components/Header";
import StatCard, { StatCardProps } from "@/components/StatCard";
import AssignmentList, { Assignment } from "@/components/AssignmentList";
import Announcements from "@/components/Announcements";

export default function Home() {
  const [pendingAssignments, setPendingAssignments] = useState(12);

  const handleCompleteAssignment = () => {
    setPendingAssignments((prev) => Math.max(0, prev - 1));
  };

  const mockAssignments: Assignment[] = [
    {
      id: 1,
      title: "Data Structures Lab Report",
      subject: "Computer Science",
      dueDate: "March 1, 2026",
      status: "Pending",
    },
    {
      id: 2,
      title: "Calculus Problem Set 4",
      subject: "Mathematics",
      dueDate: "March 3, 2026",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Operating Systems Essay",
      subject: "Computer Science",
      dueDate: "March 5, 2026",
      status: "Pending",
    },
    {
      id: 4,
      title: "Physics Circuit Simulation",
      subject: "Physics",
      dueDate: "February 25, 2026",
      status: "Completed",
    },
  ];

  const cards: StatCardProps[] = [
    {
      title: "Attendance",
      value: "85%",
      progress: 85,
      description: "Overall lecture and lab presence",
      status: "Good Standing",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
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
      value: "8.5",
      description: "Cumulative Grade Point Average",
      status: "Distinction",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
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
      value: `${pendingAssignments} Pending`,
      description: "Upcoming tasks to complete",
      status: pendingAssignments === 0 ? "All Done" : "In Progress",
      statusColor:
        pendingAssignments === 0
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
          onClick={handleCompleteAssignment}
          disabled={pendingAssignments === 0}
          className="text-xs font-medium px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-md transition-colors border border-amber-200 dark:border-amber-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Complete One
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Header / Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title and Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Welcome to your academic workspace
          </p>
        </div>

        {/* Responsive Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Recent Assignments Section */}
        <div className="mt-10">
          <AssignmentList assignments={mockAssignments} />
        </div>

        {/* Recent Announcements Section */}
        <div className="mt-10">
          <Announcements />
        </div>
      </main>
    </div>
  );
}
