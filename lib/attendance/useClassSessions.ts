"use client";

/**
 * Hook for loading and managing authenticated student class tracking and lecture attendance.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type {
  AttendanceStatus,
  ClassSessionItem,
  SubjectClassStats,
  UseClassSessionsReturn,
} from "@/lib/types/attendance";
import {
  calculateSubjectClassStats,
  aggregateAttendanceCounts,
} from "./attendanceCalculations";

interface SupabaseCourseRelation {
  id: number;
  course_code: string;
  course_name: string;
}

interface SupabaseClassSessionRow {
  id: number;
  course_id: number;
  session_date: string;
  start_time: string;
  end_time: string;
  topic: string | null;
  courses: SupabaseCourseRelation | SupabaseCourseRelation[] | null;
}

interface SupabaseAttendanceRecordRow {
  id: number;
  session_id: number;
  student_id: string;
  status: AttendanceStatus;
}

/**
 * Loads and manages lecture sessions and attendance records for the authenticated student.
 *
 * @returns State containing student sessions, subject-level breakdowns, overall percentage, and refetch handler.
 */
export function useClassSessions(): UseClassSessionsReturn {
  const { user, isLoading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<ClassSessionItem[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectClassStats[]>([]);
  const [totalAttended, setTotalAttended] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [overallPercentage, setOverallPercentage] = useState<number>(0);
  const [presentCount, setPresentCount] = useState<number>(0);
  const [absentCount, setAbsentCount] = useState<number>(0);
  const [excusedCount, setExcusedCount] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  /**
   * Triggers a reload of class sessions and attendance records from Supabase.
   */
  const refetch = useCallback(() => {
    setIsDataLoading(true);
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (authLoading || !user?.id) {
      return;
    }

    const currentUser = user;
    let isMounted = true;
    const supabase = createClient();
    const studentId = currentUser.id;

    /**
     * Fetches class sessions and attendance records in parallel for the current student.
     */
    async function fetchClassAndAttendanceData() {
      try {
        // Query class sessions and attendance records.
        // Database RLS guarantees class_sessions only returns rows where
        // EXISTS (attendance_records with student_id = auth.uid()).
        const [sessionsRes, attendanceRes] = await Promise.all([
          supabase
            .from("class_sessions")
            .select(`
              id,
              course_id,
              session_date,
              start_time,
              end_time,
              topic,
              courses (
                id,
                course_code,
                course_name
              )
            `)
            .order("session_date", { ascending: false }),
          supabase
            .from("attendance_records")
            .select("id, session_id, student_id, status")
            .eq("student_id", studentId),
        ]);

        if (!isMounted) return;

        // Graceful handling if migration has not yet been executed in Supabase
        if (sessionsRes.error) {
          console.warn("[useClassSessions] class_sessions notice:", sessionsRes.error.message);
          setError(sessionsRes.error.message);
          setSessions([]);
          setSubjectStats([]);
          setTotalAttended(0);
          setTotalSessions(0);
          setOverallPercentage(0);
          return;
        }

        const sessionRows = (sessionsRes.data || []) as unknown as SupabaseClassSessionRow[];
        const attendanceRows = (!attendanceRes.error && attendanceRes.data
          ? (attendanceRes.data as unknown as SupabaseAttendanceRecordRow[])
          : []) as SupabaseAttendanceRecordRow[];

        // Map attendance status by session_id for the current student
        const attendanceMap = new Map<number, AttendanceStatus>();
        attendanceRows.forEach((rec) => {
          attendanceMap.set(rec.session_id, rec.status);
        });

        // Combine into unified ClassSessionItem array scoped strictly to the student
        const studentSessions: ClassSessionItem[] = sessionRows.map((row) => {
          let courseCode = "GEN";
          let courseName = "General";
          if (row.courses) {
            if (Array.isArray(row.courses) && row.courses.length > 0) {
              courseCode = row.courses[0].course_code;
              courseName = row.courses[0].course_name;
            } else if (!Array.isArray(row.courses)) {
              courseCode = row.courses.course_code;
              courseName = row.courses.course_name;
            }
          }

          const status = attendanceMap.get(row.id) || "Unrecorded";

          return {
            id: row.id,
            courseId: row.course_id,
            courseCode,
            courseName,
            sessionDate: row.session_date,
            startTime: row.start_time,
            endTime: row.end_time,
            topic: row.topic,
            status,
          };
        });

        const calculatedSubjectStats = calculateSubjectClassStats(studentSessions);
        const totals = aggregateAttendanceCounts(studentSessions);

        setSessions(studentSessions);
        setSubjectStats(calculatedSubjectStats);
        setTotalAttended(totals.present);
        setTotalSessions(totals.total);
        setOverallPercentage(totals.percentage);
        setPresentCount(totals.present);
        setAbsentCount(totals.absent);
        setExcusedCount(totals.excused);
        setError(null);
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load class sessions.";
          console.error("[useClassSessions Error]:", err);
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsDataLoading(false);
        }
      }
    }

    fetchClassAndAttendanceData();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, reloadTrigger]);

  const isLoading = authLoading || (!!user && isDataLoading);

  return {
    sessions,
    subjectStats,
    totalAttended,
    totalSessions,
    overallPercentage,
    presentCount,
    absentCount,
    excusedCount,
    isLoading,
    error,
    refetch,
  };
}
