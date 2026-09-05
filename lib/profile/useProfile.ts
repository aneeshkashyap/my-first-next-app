"use client";

/**
 * Hook for loading, managing, and updating the authenticated student's profile data.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type {
  StudentProfile,
  ProfileDataSource,
  UseProfileReturn,
  ProfileUpdateResult,
} from "@/lib/types/profile";
import { validateProfileData } from "./profileValidation";

interface SupabaseProfileRow {
  id: string;
  student_id: string;
  full_name: string;
  department: string;
  year: string;
  semester: string;
  batch: string;
  phone: string;
  institutional_email: string;
  avatar_url: string | null;
  created_at: string;
}

interface SupabaseAttendanceRow {
  attended: number;
  total: number;
}

interface SupabaseSemesterTrendRow {
  semester: string;
  semester_order: number;
  sgpa: number;
  cgpa: number;
  credits: number;
  status: string;
}

/**
 * Custom hook to manage student profile data, fetching from Supabase with fallback to auth session.
 *
 * @returns State containing profile data, updateProfile mutator, loading status, and persistence status.
 */
export function useProfile(): UseProfileReturn {
  const { user, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const email = user?.email || "";
    const studentId = user?.studentId || "";
    const initialName = user?.name || "Student";

    return {
      name: initialName,
      studentId,
      department: "Not Specified",
      semester: "Not Specified",
      year: "Not Specified",
      email,
      phone: "",
      batch: "",
      cgpa: "—",
      attendance: "—",
      attendancePercent: 0,
      avatarUrl: null,
    };
  });

  const [dataSource, setDataSource] = useState<ProfileDataSource>("loading");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user?.id) {
      return;
    }

    const currentUser = user;
    let isMounted = true;
    const supabase = createClient();
    const userId = currentUser.id;

    /**
     * Fetches profile demographic record, attendance aggregates, and latest CGPA trend in parallel.
     */
    async function fetchSupabaseProfileData() {
      try {
        const [profileRes, attendanceRes, trendRes] = await Promise.all([
          supabase
            .from("profiles")
            .select(
              "id, student_id, full_name, department, year, semester, batch, phone, institutional_email, avatar_url, created_at"
            )
            .eq("id", userId)
            .maybeSingle(),
          supabase
            .from("subject_attendance")
            .select("attended, total")
            .eq("user_id", userId),
          supabase
            .from("semester_trends")
            .select("semester, semester_order, sgpa, cgpa, credits, status")
            .eq("user_id", userId)
            .order("semester_order", { ascending: false })
            .limit(1),
        ]);

        if (!isMounted) return;

        if (profileRes.error) {
          console.warn("[Supabase Profiles Notice]:", profileRes.error.message);
          setSupabaseError(profileRes.error.message);
        }

        // 1. Calculate live attendance from subject_attendance
        let attendanceStr = "—";
        let attendancePct = 0;
        if (!attendanceRes.error && attendanceRes.data && attendanceRes.data.length > 0) {
          const rows = attendanceRes.data as SupabaseAttendanceRow[];
          const sumAttended = rows.reduce((sum, r) => sum + (r.attended || 0), 0);
          const sumTotal = rows.reduce((sum, r) => sum + (r.total || 0), 0);
          if (sumTotal > 0) {
            attendancePct = Math.round((sumAttended / sumTotal) * 100);
            attendanceStr = `${attendancePct}%`;
          }
        }

        // 2. Determine latest CGPA from semester_trends
        let cgpaStr = "—";
        if (!trendRes.error && trendRes.data && trendRes.data.length > 0) {
          const latestTrend = trendRes.data[0] as SupabaseSemesterTrendRow;
          const parsedCgpa = parseFloat(String(latestTrend.cgpa));
          if (!Number.isNaN(parsedCgpa)) {
            cgpaStr = parsedCgpa.toString();
          }
        }

        // 3. Map profile identity fields from public.profiles
        if (profileRes.data) {
          const data = profileRes.data as SupabaseProfileRow;
          const normalized: StudentProfile = {
            id: data.id,
            name: data.full_name || currentUser.name || "Student",
            studentId: data.student_id || currentUser.studentId || "N/A",
            department: data.department || "Not Specified",
            semester: data.semester || "Not Specified",
            year: data.year || "Not Specified",
            batch: data.batch || "Not Specified",
            phone: data.phone || "",
            email: data.institutional_email || currentUser.email || "",
            avatarUrl: data.avatar_url || null,
            cgpa: cgpaStr,
            attendance: attendanceStr,
            attendancePercent: attendancePct,
          };

          setProfile(normalized);
          setDataSource("supabase");
          setSupabaseError(null);
        } else {
          // If no profile row found, fallback using authenticated session metadata
          setProfile((prev) => ({
            ...prev,
            name: currentUser.name || prev.name,
            studentId: currentUser.studentId || prev.studentId,
            email: currentUser.email || prev.email,
            department: "Not Specified",
            semester: "Not Specified",
            year: "Not Specified",
            batch: "Not Specified",
            phone: "",
            cgpa: cgpaStr,
            attendance: attendanceStr,
            attendancePercent: attendancePct,
          }));
          setDataSource("fallback");
        }
      } catch (err) {
        console.error("[Supabase Profiles] Error fetching profile data:", err);
        if (isMounted) {
          setDataSource("fallback");
        }
      } finally {
        if (isMounted) {
          setDataLoaded(true);
        }
      }
    }

    fetchSupabaseProfileData();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  /**
   * Updates student profile fields, validates inputs, and persists changes to public.profiles.
   *
   * @param updatedData - Partial profile updates.
   * @returns ProfileUpdateResult indicating success or validation error map.
   */
  const updateProfile = useCallback(
    async (
      updatedData: Partial<StudentProfile>
    ): Promise<ProfileUpdateResult> => {
      const errors = validateProfileData(updatedData);

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      const nextProfile: StudentProfile = {
        ...profile,
        ...updatedData,
      };

      setIsSaving(true);
      setProfile(nextProfile);

      // Persist only verified columns to public.profiles scoped to auth.uid() (user.id)
      if (user?.id) {
        const supabase = createClient();
        try {
          const payload = {
            full_name: nextProfile.name,
            phone: nextProfile.phone,
            department: nextProfile.department,
            year: nextProfile.year,
            semester: nextProfile.semester,
            batch: nextProfile.batch,
            student_id: nextProfile.studentId,
            institutional_email: nextProfile.email,
          };

          const { error } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              ...payload,
            });

          if (error) {
            console.warn("[Supabase Profiles] Update notice:", error.message);
          } else {
            setDataSource("supabase");
          }
        } catch (err) {
          console.error("[Supabase Profiles] Could not persist profile update:", err);
        } finally {
          setIsSaving(false);
        }
      } else {
        setIsSaving(false);
      }

      return { success: true };
    },
    [profile, user]
  );

  const isLoaded = !authLoading && (!user || dataLoaded);

  return {
    profile,
    updateProfile,
    isLoaded,
    isSaving,
    dataSource,
    supabaseError,
  };
}
