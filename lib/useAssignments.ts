"use client";

import { useState, useEffect, useCallback } from "react";
import { Assignment } from "@/components/AssignmentList";
import { initialMockAssignments } from "@/lib/mockData";

const STORAGE_KEY = "student_portal_assignments_v1";

/**
 * Safely parses and loads assignments from localStorage,
 * gracefully falling back to initialMockAssignments on errors or missing data.
 */
function loadAssignmentsFromStorage(): Assignment[] {
  if (typeof window === "undefined") {
    return initialMockAssignments;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialMockAssignments;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initialMockAssignments;
    }

    // Merge saved data with initialMockAssignments to guarantee structural and type safety
    return initialMockAssignments.map((mockItem) => {
      const savedItem = parsed.find(
        (item: unknown) =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          (item as Assignment).id === mockItem.id
      );

      if (savedItem && typeof savedItem.status === "string") {
        return {
          ...mockItem,
          status: savedItem.status,
        };
      }
      return mockItem;
    });
  } catch (error) {
    console.warn("Failed to retrieve or parse assignments from localStorage:", error);
    return initialMockAssignments;
  }
}

/**
 * Safely persists assignments to localStorage
 */
function saveAssignmentsToStorage(assignments: Assignment[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.warn("Failed to save assignments to localStorage:", error);
  }
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialMockAssignments);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore completed assignments on initial client mount to avoid SSR hydration mismatch
  useEffect(() => {
    const saved = loadAssignmentsFromStorage();
    setAssignments(saved);
    setIsLoaded(true);
  }, []);

  // Listen to window storage events to sync across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = loadAssignmentsFromStorage();
          setAssignments(updated);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const completeAssignment = useCallback((id: string | number) => {
    setAssignments((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      );
      saveAssignmentsToStorage(updated);
      return updated;
    });
  }, []);

  const completeOne = useCallback(() => {
    setAssignments((prev) => {
      const firstPending = prev.find(
        (a) => a.status.toLowerCase() !== "completed"
      );
      if (!firstPending) return prev;

      const updated = prev.map((item) =>
        item.id === firstPending.id ? { ...item, status: "Completed" } : item
      );
      saveAssignmentsToStorage(updated);
      return updated;
    });
  }, []);

  const totalCount = assignments.length;
  const completedCount = assignments.filter(
    (a) => a.status.toLowerCase() === "completed"
  ).length;
  const pendingCount = assignments.filter(
    (a) => a.status.toLowerCase() !== "completed"
  ).length;

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
