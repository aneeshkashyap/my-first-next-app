"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";

export interface DashboardStats {
  attendance: string;
  attendancePercent: number;
  attendanceStatus: string;
  cgpa: string;
  cgpaStatus: string;
  semester: string;
  totalAttended: number;
  totalClasses: number;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const { user, isLoading: authLoading } = useAuth();

  const [attendance, setAttendance] = useState<string>("84%");
  const [attendancePercent, setAttendancePercent] = useState<number>(84);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("Good Standing");
  const [cgpa, setCgpa] = useState<string>("8.5");
  const [cgpaStatus, setCgpaStatus] = useState<string>("Distinction");
  const [semester, setSemester] = useState<string>("6th Semester (Spring 2026)");
  const [totalAttended, setTotalAttended] = useState<number>(157);
  const [totalClasses, setTotalClasses] = useState<number>(187);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let isMounted = true;
    const supabase = createClient();
    const userId = user.id;

    async function fetchDashboardStats() {
      try {
        const [attendanceRes, trendRes, profileRes] = await Promise.all([
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
          supabase
            .from("profiles")
            .select("semester")
            .eq("id", userId)
            .maybeSingle(),
        ]);

        if (!isMounted) return;

        if (attendanceRes.error) {
          throw new Error(`Subject Attendance: ${attendanceRes.error.message}`);
        }
        if (trendRes.error) {
          throw new Error(`Semester Trends: ${trendRes.error.message}`);
        }

        // 1. Calculate live attendance: SUM(attended) / SUM(total) * 100
        const attendanceRows = attendanceRes.data || [];
        const attendedSum = attendanceRows.reduce((acc, row) => acc + (row.attended || 0), 0);
        const totalSum = attendanceRows.reduce((acc, row) => acc + (row.total || 0), 0);
        const calculatedPercent =
          totalSum > 0 ? Math.round((attendedSum / totalSum) * 100) : 0;

        setTotalAttended(attendedSum);
        setTotalClasses(totalSum);
        setAttendancePercent(calculatedPercent);
        setAttendance(`${calculatedPercent}%`);
        setAttendanceStatus(calculatedPercent >= 75 ? "Good Standing" : "Low Attendance");

        // 2. Extract latest CGPA from semester_trends
        const trendRows = trendRes.data || [];
        if (trendRows.length > 0) {
          const latestTrend = trendRows[0];
          const parsedCgpa = parseFloat(String(latestTrend.cgpa));
          const cgpaFormatted = !Number.isNaN(parsedCgpa) ? parsedCgpa.toString() : "8.5";
          setCgpa(cgpaFormatted);
          setCgpaStatus(
            parsedCgpa >= 8.0 ? latestTrend.status || "Distinction" : "First Class"
          );
        }

        // 3. Resolve semester information
        if (profileRes.data?.semester) {
          setSemester(profileRes.data.semester);
        } else if (trendRows.length > 0 && trendRows[0].semester) {
          setSemester("6th Semester (Spring 2026)");
        }

        setError(null);
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load dashboard statistics from Supabase.";
          console.error("[useDashboardStats Error]:", err);
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    }

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user]);

  const isLoading = authLoading || (!!user && isDataLoading);

  return {
    attendance,
    attendancePercent,
    attendanceStatus,
    cgpa,
    cgpaStatus,
    semester,
    totalAttended,
    totalClasses,
    isLoading,
    error,
  };
}
