"use client";

/**
 * Hook for managing student assignments, querying Supabase deliverables,
 * and performing optimistic completion updates.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { formatDueDate } from "@/lib/utils/formatters";
import type {
  Assignment,
  UseAssignmentsReturn,
} from "@/lib/types/assignments";

interface SupabaseAssignmentCourse {
  course_code: string;
  course_name: string;
}

interface SupabaseAssignmentRow {
  id: number;
  student_id: string;
  course_id: number | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string | null;
  created_at: string | null;
  courses: SupabaseAssignmentCourse | SupabaseAssignmentCourse[] | null;
}

/**
 * Extracts course_name from Supabase relational course object or array.
 *
 * @param courses - Course relation record, array of records, or null.
 * @returns Human-readable course name or "General" fallback.
 */
function extractCourseName(
  courses: SupabaseAssignmentCourse | SupabaseAssignmentCourse[] | null
): string {
  if (!courses) return "General";
  if (Array.isArray(courses)) {
    return courses[0]?.course_name || "General";
  }
  return courses.course_name || "General";
}

/**
 * Maps a raw Supabase assignment record to the application's Assignment model.
 *
 * @param row - Supabase relational assignment record.
 * @returns Standardized Assignment object.
 */
function mapToAssignment(row: SupabaseAssignmentRow): Assignment {
  return {
    id: row.id,
    title: row.title || "Untitled Assignment",
    subject: extractCourseName(row.courses),
    dueDate: formatDueDate(row.due_date),
    status: row.status || "Pending",
  };
}

/**
 * Custom hook to fetch and manage assignment tasks for the authenticated student.
 *
 * @returns Assignment data list, status counters, completion actions, and loading status.
 */
export function useAssignments(): UseAssignmentsReturn {
  const { user, isLoading: authLoading } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  /**
   * Refetches assignments from Supabase.
   */
  const refetch = useCallback(() => {
    setDataLoaded(false);
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
     * Queries assignments for the authenticated student ordered by ID.
     */
    async function fetchAssignments() {
      try {
        const { data, error: queryError } = await supabase
          .from("assignments")
          .select(`
            id,
            student_id,
            course_id,
            title,
            description,
            due_date,
            status,
            created_at,
            courses (
              course_code,
              course_name
            )
          `)
          .eq("student_id", studentId)
          .order("id", { ascending: true });

        if (!isMounted) return;

        if (queryError) {
          console.error("Failed to load assignments:", queryError.message);
          setError(queryError.message);
          setAssignments([]);
        } else {
          const rows = (data || []) as unknown as SupabaseAssignmentRow[];
          setAssignments(rows.map(mapToAssignment));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load assignments.";
          console.error("Failed to load assignments:", err);
          setError(msg);
          setAssignments([]);
        }
      } finally {
        if (isMounted) {
          setDataLoaded(true);
        }
      }
    }

    fetchAssignments();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, reloadTrigger]);

  /**
   * Optimistically marks an assignment as completed and synchronizes with Supabase.
   *
   * @param id - Numeric or string assignment ID.
   */
  const completeAssignment = useCallback(
    async (id: string | number) => {
      if (!user?.id) return;

      const numericId = typeof id === "number" ? id : parseInt(String(id), 10);
      if (Number.isNaN(numericId)) return;

      // Optimistically update matching assignment to Completed in local state
      setAssignments((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: "Completed" }
            : item
        )
      );

      try {
        const supabase = createClient();
        const { error: updateError } = await supabase
          .from("assignments")
          .update({
            status: "Completed",
          })
          .eq("id", numericId)
          .eq("student_id", user.id);

        if (updateError) {
          console.error("Failed to complete assignment:", updateError.message);
          setError(updateError.message);
          // Reload from Supabase to restore actual database state
          setReloadTrigger((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error in completeAssignment:", err);
        setReloadTrigger((prev) => prev + 1);
      }
    },
    [user]
  );

  /**
   * Completes the first pending assignment in the current list.
   */
  const completeOne = useCallback(async () => {
    if (!user?.id) return;

    const firstPending = assignments.find(
      (a) => (a.status || "").toLowerCase() !== "completed"
    );

    if (!firstPending) return;

    await completeAssignment(firstPending.id);
  }, [user, assignments, completeAssignment]);

  const totalCount = assignments.length;
  const completedCount = assignments.filter(
    (a) => (a.status || "").toLowerCase() === "completed"
  ).length;
  const pendingCount = assignments.filter(
    (a) => (a.status || "").toLowerCase() !== "completed"
  ).length;

  const isLoaded = !authLoading && (!user || dataLoaded);
  const isLoading = authLoading || (!!user && !dataLoaded);

  return {
    assignments,
    pendingCount,
    completedCount,
    totalCount,
    completeAssignment,
    completeOne,
    isLoaded,
    isLoading,
    error,
    refetch,
  };
}
