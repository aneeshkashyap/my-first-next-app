"use client";

import { useState, useEffect, useCallback } from "react";
import { StudentProfile } from "@/lib/mockData";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";

export type ProfileDataSource = "supabase" | "fallback" | "loading";

/**
 * Normalizes and extracts student profile data from Supabase `profiles` table row
 */
function normalizeSupabaseProfile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  fallbackUserEmail?: string,
  fallbackUserName?: string,
  fallbackStudentId?: string
): StudentProfile {
  const email = data.email || fallbackUserEmail || "";
  const name =
    data.name ||
    data.full_name ||
    data.student_name ||
    fallbackUserName ||
    (email ? email.split("@")[0] : "Student");

  const studentId =
    data.student_id ||
    data.studentId ||
    data.roll_no ||
    data.roll_number ||
    fallbackStudentId ||
    (email ? email.split("@")[0].toUpperCase() : "STU-2024");

  const department =
    data.department ||
    data.dept ||
    data.major ||
    "Computer Science & Engineering";

  const semester =
    data.semester ||
    data.current_semester ||
    "6th Semester (Spring 2026)";

  const year =
    data.year ||
    data.academic_year ||
    "3rd Year";

  const phone =
    data.phone ||
    data.phone_number ||
    data.mobile ||
    "+91 98765 43210";

  const batch =
    data.batch ||
    data.academic_batch ||
    "2024 - 2028";

  const cgpa =
    data.cgpa !== undefined && data.cgpa !== null ? String(data.cgpa) : "8.5";

  const attendance =
    data.attendance !== undefined && data.attendance !== null
      ? (String(data.attendance).includes("%") ? String(data.attendance) : `${data.attendance}%`)
      : "85%";

  const parsedPercent = parseFloat(attendance.replace("%", ""));
  const attendancePercent =
    typeof data.attendance_percent === "number"
      ? data.attendance_percent
      : typeof data.attendancePercent === "number"
      ? data.attendancePercent
      : isNaN(parsedPercent)
      ? 85
      : parsedPercent;

  return {
    name,
    studentId,
    department,
    semester,
    year,
    email,
    phone,
    batch,
    cgpa,
    attendance,
    attendancePercent,
  };
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile>(() => ({
    name: user?.name || "Student",
    studentId: user?.studentId || "STU-2024",
    department: "Computer Science & Engineering",
    semester: "6th Semester (Spring 2026)",
    year: "3rd Year",
    email: user?.email || "",
    phone: "+91 98765 43210",
    batch: "2024 - 2028",
    cgpa: "8.5",
    attendance: "85%",
    attendancePercent: 85,
  }));

  const [dataSource, setDataSource] = useState<ProfileDataSource>("loading");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Retrieve student profile directly from Supabase profiles table using auth.uid() (user.id)
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function fetchSupabaseProfile() {
      if (!user) {
        if (isMounted) {
          setDataSource("fallback");
          setIsLoaded(true);
        }
        return;
      }

      console.info(`[Supabase Auth] Querying 'profiles' table with auth.uid() == '${user.id}' (${user.email})...`);

      try {
        // Query Supabase profiles table using auth.uid()
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.warn("[Supabase Profiles Query Notice]:", error.message);
          setSupabaseError(error.message);
        }

        if (data) {
          console.info("[Supabase Profiles] Record found in database:", data);
          const normalized = normalizeSupabaseProfile(
            data,
            user.email,
            user.name,
            user.studentId
          );
          setProfile(normalized);
          setDataSource("supabase");
        } else {
          console.warn(
            `[Supabase Profiles] No row found in 'public.profiles' for auth.uid() = '${user.id}'. Using authenticated session defaults.`
          );
          setProfile({
            name: user.name || "Student",
            studentId: user.studentId || "STU-2024",
            department: "Computer Science & Engineering",
            semester: "6th Semester (Spring 2026)",
            year: "3rd Year",
            email: user.email || "",
            phone: "+91 98765 43210",
            batch: "2024 - 2028",
            cgpa: "8.5",
            attendance: "85%",
            attendancePercent: 85,
          });
          setDataSource("fallback");
        }
      } catch (err) {
        console.error("[Supabase Profiles] Error fetching profile row:", err);
        if (isMounted) {
          setDataSource("fallback");
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    fetchSupabaseProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateProfile = useCallback(
    async (
      updatedData: Partial<StudentProfile>
    ): Promise<{ success: boolean; errors?: Record<string, string> }> => {
      const errors: Record<string, string> = {};

      // Form Validations
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

      // Persist directly to Supabase profiles table using auth.uid()
      if (user?.id) {
        const supabase = createClient();
        try {
          const payload = {
            id: user.id,
            name: nextProfile.name,
            full_name: nextProfile.name,
            email: nextProfile.email,
            phone: nextProfile.phone,
            phone_number: nextProfile.phone,
            department: nextProfile.department,
            semester: nextProfile.semester,
            year: nextProfile.year,
            batch: nextProfile.batch,
            student_id: nextProfile.studentId,
            cgpa: nextProfile.cgpa,
            attendance: nextProfile.attendance,
            attendance_percent: nextProfile.attendancePercent,
            updated_at: new Date().toISOString(),
          };

          console.info("[Supabase Profiles] Upserting record for auth.uid():", user.id);
          const { error } = await supabase
            .from("profiles")
            .upsert(payload, { onConflict: "id" });

          if (error) {
            console.warn("[Supabase Profiles] Upsert notice:", error.message);
          } else {
            console.info("[Supabase Profiles] Profile upserted successfully.");
            setDataSource("supabase");
          }
        } catch (err) {
          console.error("[Supabase Profiles] Could not persist profile to Supabase:", err);
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

  return {
    profile,
    updateProfile,
    isLoaded,
    isSaving,
    dataSource,
    supabaseError,
  };
}
