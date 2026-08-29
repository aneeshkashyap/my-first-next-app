import React from "react";
import ProgressBar from "@/components/ProgressBar";
import { StudentProfile } from "@/lib/mockData";

export interface ProfileViewProps {
  profile: StudentProfile;
  onEdit: () => void;
}

export default function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Student Identity Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center relative">
        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 flex items-center gap-1.5 text-xs font-medium"
          aria-label="Edit student profile"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="hidden sm:inline">Edit</span>
        </button>

        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-2xl font-bold shadow-md ring-4 ring-indigo-50 dark:ring-indigo-950/50 mb-4">
          {profile.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {profile.name}
        </h2>
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
          {profile.studentId}
        </p>

        <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Active Student
        </span>

        {/* Quick Identity Breakdown */}
        <div className="w-full mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Department</span>
            <span className="font-medium text-slate-900 dark:text-slate-100 text-right text-xs sm:text-sm">
              {profile.department}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Year / Semester</span>
            <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {profile.year} • {profile.semester}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Batch</span>
            <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {profile.batch}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Email</span>
            <span className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[150px] sm:max-w-[180px] text-xs sm:text-sm">
              {profile.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Phone</span>
            <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {profile.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column (2 cols): Academic Metrics & Detailed Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Academic Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* CGPA Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Current CGPA
              </span>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {profile.cgpa}
              <span className="text-base font-normal text-slate-400 ml-1">/ 10.0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Ranked in top 5% of department cohort
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-blue-700 dark:text-blue-400 font-medium px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                Distinction
              </span>
              <span className="text-xs text-slate-400">Scale: 10.0</span>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Overall Attendance
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              {profile.attendance}
            </div>
            <ProgressBar percentage={profile.attendancePercent} />
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                Good Standing
              </span>
              <span className="text-xs text-slate-400">Minimum: 75%</span>
            </div>
          </div>
        </div>

        {/* Detailed Academic & Contact Information Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Academic Credentials & Contact Details
            </h3>
            <button
              onClick={onEdit}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Student Name</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.name}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Student ID</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.studentId}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Department</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.department}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Year / Semester</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.year} • {profile.semester}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Academic Batch</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.batch}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Phone Number</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.phone}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Institutional Email</span>
              <span className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5 block">
                {profile.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
