"use client";

/**
 * Student Profile Page
 *
 * Provides a dedicated route for students to review their academic demographics,
 * contact details, and toggle edit mode to update profile fields.
 */

import React, { useState } from "react";
import ProfileView from "@/components/profile/ProfileView";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProfile } from "@/lib/profile";
import type { StudentProfile, ProfileUpdateResult } from "@/lib/types/profile";

/**
 * Renders the student profile page with toggleable view and edit forms.
 *
 * @returns Profile page view wrapped in ProtectedRoute.
 */
export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Saves updated profile fields to Supabase and manages success banner notification.
   *
   * @param updated - Partial student profile updates.
   * @returns Profile update result with success status or validation errors.
   */
  const handleSave = async (
    updated: Partial<StudentProfile>
  ): Promise<ProfileUpdateResult> => {
    const result = await updateProfile(updated);
    if (result.success) {
      setIsEditing(false);
      setSuccessMessage("Profile information updated and saved successfully!");
      // Auto dismiss success alert after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
    return result;
  };

  return (
    <ProtectedRoute>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Page Header Surface */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Institutional Student Record
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Student Profile
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Academic identity, personal credentials, cohort demographics, and account security.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
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
                  d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Success Notification Alert Banner */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-medium">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer"
              aria-label="Dismiss alert"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Profile Content View / Edit Form */}
        {isEditing ? (
          <ProfileEditForm
            initialProfile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        )}
      </main>
    </ProtectedRoute>
  );
}
