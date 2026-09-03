"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";

export interface StudentProfile {
  id?: string;
  name: string;
  studentId: string;
  department: string;
  semester: string;
  year: string;
  email: string;
  phone: string;
  batch: string;
  cgpa: string;
  attendance: string;
  attendancePercent: number;
  avatarUrl?: string | null;
}

export type ProfileDataSource = "supabase" | "fallback" | "loading";

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

export function useProfile() {
  const { user, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const email = user?.email || "";
    const studentId = user?.studentId || "2024CS0905";
    const initialName =
      user?.name &&
      user.name.toLowerCase() !== "student" &&
      user.name.toLowerCase() !== studentId.toLowerCase()
        ? user.name
        : "Aneesh Kashyap K S";

    return {
      name: initialName,
      studentId,
      department: "Computer Science & Engineering",
      semester: "6th Semester (Spring 2026)",
      year: "3rd Year",
      email,
      phone: "+91 98765 43210",
      batch: "2024 - 2028",
      cgpa: "8.5",
      attendance: "84%",
      attendancePercent: 84,
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
        let attendanceStr = "84%";
        let attendancePct = 84;
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
        let cgpaStr = "8.5";
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
            name: data.full_name || currentUser.name || "Aneesh Kashyap K S",
            studentId: data.student_id || currentUser.studentId || "2024CS0905",
            department: data.department || "Computer Science & Engineering",
            semester: data.semester || "6th Semester (Spring 2026)",
            year: data.year || "3rd Year",
            batch: data.batch || "2024 - 2028",
            phone: data.phone || "+91 98765 43210",
            email: data.institutional_email || currentUser.email || "2024cs0905@svce.ac.in",
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

  const updateProfile = useCallback(
    async (
      updatedData: Partial<StudentProfile>
    ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
      const errors: Record<string, string> = {};

      if (updatedData.name !== undefined && !updatedData.name.trim()) {
        errors.name = "Student name is required.";
      }

      if (updatedData.email !== undefined) {
        const emailTrimmed = updatedData.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailTrimmed) {
          errors.email = "Email address is required.";
        } else if (!emailRegex.test(emailTrimmed)) {
          errors.email = "Please enter a valid email address.";
        }
      }

      if (updatedData.phone !== undefined && !updatedData.phone.trim()) {
        errors.phone = "Phone number is required.";
      }

      if (updatedData.department !== undefined && !updatedData.department.trim()) {
        errors.department = "Department is required.";
      }

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
            .update(payload)
            .eq("id", user.id);

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
