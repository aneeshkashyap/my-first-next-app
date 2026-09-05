"use client";

/**
 * Profile Edit Form Component
 *
 * Allows students to edit their personal contact details and academic identity fields,
 * with real-time field validation, error indicators, and saving state handling.
 */

import React, { useState } from "react";
import type { StudentProfile, ProfileUpdateResult } from "@/lib/types/profile";

export interface ProfileEditFormProps {
  /** Initial profile values to populate the form. */
  initialProfile: StudentProfile;
  /** Callback triggered when the student submits the form. */
  onSave: (
    updated: Partial<StudentProfile>
  ) => Promise<ProfileUpdateResult> | ProfileUpdateResult;
  /** Callback triggered when the student cancels editing. */
  onCancel: () => void;
}

/**
 * Renders the editable profile form with inline validation and submission state controls.
 *
 * @param props - Form configuration including initial values, onSave, and onCancel.
 * @returns Form element layout.
 */
export default function ProfileEditForm({
  initialProfile,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    name: initialProfile.name,
    email: initialProfile.email,
    phone: initialProfile.phone,
    department: initialProfile.department,
    semester: initialProfile.semester,
    year: initialProfile.year,
    batch: initialProfile.batch,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles user text input changes, updating local form state and clearing prior field errors.
   *
   * @param e - Input or select change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  /**
   * Submits the form data to onSave and reflects validation errors if save fails.
   *
   * @param e - Form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await onSave(formData);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Edit Student Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update your personal contact details and academic identity information
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full">
          {initialProfile.studentId}
        </span>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Full Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Aneesh Kashyap"
              className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.name
                  ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-blue-600/20 focus:border-blue-600"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Institutional Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. student@university.edu"
              className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-blue-600/20 focus:border-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
              className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.phone
                  ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-blue-600/20 focus:border-blue-600"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Department / Major <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science & Engineering"
              className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.department
                  ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500"
                  : "border-slate-200 dark:border-slate-700 focus:ring-blue-600/20 focus:border-blue-600"
              }`}
            />
            {errors.department && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                {errors.department}
              </p>
            )}
          </div>

          {/* Academic Batch */}
          <div>
            <label
              htmlFor="batch"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Academic Batch
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="e.g. 2023 - 2027"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
            />
          </div>

          {/* Year & Semester */}
          <div>
            <label
              htmlFor="semester"
              className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
            >
              Current Semester
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              placeholder="e.g. 6th Semester (Spring 2026)"
              className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Read-Only Academic Notice */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <svg
            className="w-4 h-4 shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Student ID, Cumulative CGPA, and Attendance records are system-managed by the registrar and cannot be modified manually.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
