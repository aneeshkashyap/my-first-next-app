"use client";

/**
 * Hook for loading student academic analytics, attendance compliance,
 * subject-wise examination performance, and semester GPA trends.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { calculateAttendancePercentage } from "@/lib/utils/calculations";
import type {
  SubjectAttendance,
  SubjectPerformance,
  SemesterTrend,
  AnalyticsDataState,
} from "@/lib/types/analytics";

/**
 * Custom hook to load and manage student academic performance and attendance analytics from Supabase.
 *
 * @returns State containing subject attendance, subject performance, semester trends, CGPA, and refetch handler.
 */
export function useAnalytics(): AnalyticsDataState {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [attendanceData, setAttendanceData] = useState<SubjectAttendance[]>([]);
  const [performanceData, setPerformanceData] = useState<SubjectPerformance[]>([]);
  const [semesterTrends, setSemesterTrends] = useState<SemesterTrend[]>([]);
  const [cgpa, setCgpa] = useState<string>("—");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  /**
   * Triggers a reload of all analytics datasets from Supabase.
   */
  const refetch = useCallback(() => {
    setIsDataLoading(true);
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user.id;
    let isMounted = true;
    const supabase = createClient();

    /**
     * Queries subject attendance, subject performance, and semester trends in parallel for the student.
     */
    async function fetchAnalyticsData() {
      try {
        // Query all 3 relational tables in parallel using auth.uid() (user.id)
        const [attRes, perfRes, trendsRes] = await Promise.all([
          supabase
            .from("subject_attendance")
            .select("code, subject, attended, total, faculty")
            .eq("user_id", userId)
            .order("code", { ascending: true }),
          supabase
            .from("subject_performance")
            .select("code, subject, credits, internal_marks, external_marks, total_marks, grade, grade_points")
            .eq("user_id", userId)
            .order("code", { ascending: true }),
          supabase
            .from("semester_trends")
            .select("semester, semester_order, sgpa, cgpa, credits, status")
            .eq("user_id", userId)
            .order("semester_order", { ascending: true }),
        ]);

        if (!isMounted) return;

        if (attRes.error) {
          throw new Error(`Subject Attendance: ${attRes.error.message}`);
        }
        if (perfRes.error) {
          throw new Error(`Subject Performance: ${perfRes.error.message}`);
        }
        if (trendsRes.error) {
          throw new Error(`Semester Trends: ${trendsRes.error.message}`);
        }

        // Map subject attendance and dynamically calculate attendance percentage
        const mappedAttendance: SubjectAttendance[] = (attRes.data || []).map((row) => ({
          code: row.code,
          subject: row.subject,
          attended: row.attended,
          total: row.total,
          percentage: calculateAttendancePercentage(row.attended, row.total),
          faculty: row.faculty,
        }));

        // Map subject performance
        const mappedPerformance: SubjectPerformance[] = (perfRes.data || []).map((row) => ({
          code: row.code,
          subject: row.subject,
          credits: row.credits,
          internalMarks: row.internal_marks,
          externalMarks: row.external_marks,
          totalMarks: row.total_marks,
          grade: row.grade,
          gradePoints: row.grade_points,
        }));

        // Map semester progression trends
        const mappedTrends: SemesterTrend[] = (trendsRes.data || []).map((row) => ({
          semester: row.semester,
          sgpa: Number(row.sgpa),
          cgpa: Number(row.cgpa),
          credits: row.credits,
          status: row.status || "Distinction",
        }));

        // Resolve current CGPA from latest semester trend
        const latestTrend =
          mappedTrends.length > 0 ? mappedTrends[mappedTrends.length - 1] : null;
        const resolvedCgpa = latestTrend ? String(latestTrend.cgpa) : "—";

        setAttendanceData(mappedAttendance);
        setPerformanceData(mappedPerformance);
        setSemesterTrends(mappedTrends);
        setCgpa(resolvedCgpa);
        setError(null);
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while loading analytics from Supabase.";
          console.error("[useAnalytics Error]:", err);
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    }

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, [user, reloadTrigger]);

  const isLoading = isAuthLoading || (!!user && isDataLoading);

  return {
    attendanceData,
    performanceData,
    semesterTrends,
    cgpa,
    isLoading,
    error,
    refetch,
  };
}
