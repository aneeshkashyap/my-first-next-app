/**
 * Types and interfaces for student profile management, demographics, and validation.
 */

/**
 * Normalized student profile entity model.
 */
export interface StudentProfile {
  /** Optional profile database ID (matching auth.uid()). */
  id?: string;
  /** Full legal or registered name of the student. */
  name: string;
  /** Unique student registration number / roll number. */
  studentId: string;
  /** Academic department or major program. */
  department: string;
  /** Current enrolled semester. */
  semester: string;
  /** Enrolled academic year of study. */
  year: string;
  /** Contact email address. */
  email: string;
  /** Contact phone number. */
  phone: string;
  /** Academic cohort batch (e.g. 2023 - 2027). */
  batch: string;
  /** Current cumulative CGPA formatted string. */
  cgpa: string;
  /** Overall attendance percentage formatted string (e.g. "88%"). */
  attendance: string;
  /** Numeric attendance percentage for progress indicators (0 - 100). */
  attendancePercent: number;
  /** Optional URL to avatar profile picture. */
  avatarUrl?: string | null;
}

/**
 * Data resolution origin indicating whether profile was loaded from Supabase or session fallback.
 */
export type ProfileDataSource = "supabase" | "fallback" | "loading";

/**
 * Field-level validation error map for student profile edit form.
 */
export type ProfileValidationErrors = Record<string, string>;

/**
 * Result shape returned by profile update mutations.
 */
export interface ProfileUpdateResult {
  /** True when the profile update was successfully applied and saved. */
  success: boolean;
  /** Validation errors encountered if update was rejected. */
  errors?: ProfileValidationErrors;
}

/**
 * Return shape for the useProfile hook.
 */
export interface UseProfileReturn {
  /** Current loaded student profile state. */
  profile: StudentProfile;
  /**
   * Updates student profile fields, validates inputs, and persists changes to Supabase.
   *
   * @param updatedData - Partial profile fields to update.
   * @returns Result indicating success or field errors.
   */
  updateProfile: (
    updatedData: Partial<StudentProfile>
  ) => Promise<ProfileUpdateResult>;
  /** True when initial data load from Supabase has completed. */
  isLoaded: boolean;
  /** True while changes are being written to the database. */
  isSaving: boolean;
  /** Indicates whether data is loaded from Supabase, session fallback, or still loading. */
  dataSource: ProfileDataSource;
  /** Error message if Supabase query encountered an issue, or null. */
  supabaseError: string | null;
}
