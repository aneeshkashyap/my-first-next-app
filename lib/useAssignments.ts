"use client";

import { useState, useEffect, useCallback } from "react";
import { Assignment } from "@/components/AssignmentList";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";

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
  status: string;
  created_at: string | null;
  courses: SupabaseAssignmentCourse | SupabaseAssignmentCourse[] | null;
}

/**
 * Formats a date string (e.g. "2026-03-01") into human-readable format ("March 1, 2026")
 * without timezone day-shifting.
 */
function formatDueDate(value: string | null): string {
  if (!value) return "No due date";

  const parts = value.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, monthIndex, day);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  const fallbackDate = new Date(value);
  if (!Number.isNaN(fallbackDate.getTime())) {
    return fallbackDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return value;
}

/**
 * Extracts course_name from Supabase relational course object or array.
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
 * Maps database row to UI Assignment object.
 */
function mapToAssignment(row: SupabaseAssignmentRow): Assignment {
  return {
    id: row.id,
    title: row.title,
    subject: extractCourseName(row.courses),
    dueDate: formatDueDate(row.due_date),
    status: row.status,
  };
}

export function useAssignments() {
  const { user, isLoading: authLoading } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let isMounted = true;
    const supabase = createClient();
    const studentId = user.id;

    async function fetchAssignments() {
      try {
        const { data, error } = await supabase
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

        if (error) {
          console.error("Failed to load assignments:", error.message);
          setAssignments([]);
        } else {
          const rows = (data || []) as unknown as SupabaseAssignmentRow[];
          setAssignments(rows.map(mapToAssignment));
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load assignments:", err);
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

  const completeAssignment = useCallback(
    async (id: string | number) => {
      if (!user) return;

      // Optimistically update matching assignment to Completed in local state
      setAssignments((current) =>
        current.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: "Completed" }
            : item
        )
      );

      const supabase = createClient();
      const { error } = await supabase
        .from("assignments")
        .update({
          status: "Completed",
        })
        .eq("id", Number(id))
        .eq("student_id", user.id);

      if (error) {
        console.error("Failed to complete assignment:", error.message);
        // Reload from Supabase to restore actual database state
        setReloadTrigger((prev) => prev + 1);
      }
    },
    [user]
  );

  const completeOne = useCallback(async () => {
    if (!user) return;

    const firstPending = assignments.find(
      (a) => a.status.toLowerCase() !== "completed"
    );

    if (!firstPending) return;

    await completeAssignment(firstPending.id);
  }, [user, assignments, completeAssignment]);

  const totalCount = assignments.length;
  const completedCount = assignments.filter(
    (a) => a.status.toLowerCase() === "completed"
  ).length;
  const pendingCount = assignments.filter(
    (a) => a.status.toLowerCase() !== "completed"
  ).length;

  const isLoaded = !authLoading && (!user || dataLoaded);

  return {
    assignments,
    pendingCount,
    completedCount,
    totalCount,
    completeAssignment,
    completeOne,
    isLoaded,
  };
}
