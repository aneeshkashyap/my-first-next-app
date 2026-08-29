"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Assignment } from "@/components/AssignmentList";
import { initialMockAssignments } from "@/lib/mockData";

const STORAGE_KEY = "student_portal_assignments_v1";

const assignmentListeners = new Set<() => void>();

function notifyAssignmentListeners() {
  assignmentListeners.forEach((listener) => listener());
}

function subscribeAssignments(callback: () => void) {
  assignmentListeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    assignmentListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

let cachedAssignmentsJson = "";
let cachedAssignments: Assignment[] = initialMockAssignments;

/**
 * Safely parses and loads assignments from localStorage,
 * gracefully falling back to initialMockAssignments on errors or missing data.
 */
function getAssignmentsSnapshot(): Assignment[] {
  if (typeof window === "undefined") {
    return initialMockAssignments;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialMockAssignments;
    }

    if (raw === cachedAssignmentsJson) {
      return cachedAssignments;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return initialMockAssignments;
    }

    // Merge saved data with initialMockAssignments to guarantee structural and type safety
    const result = initialMockAssignments.map((mockItem) => {
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

    cachedAssignmentsJson = raw;
    cachedAssignments = result;
    return cachedAssignments;
  } catch (error) {
    console.warn("Failed to retrieve or parse assignments from localStorage:", error);
    return initialMockAssignments;
  }
}

function getServerAssignmentsSnapshot(): Assignment[] {
  return initialMockAssignments;
}

/**
 * Safely persists assignments to localStorage
 */
function saveAssignmentsToStorage(assignments: Assignment[]): void {
  if (typeof window === "undefined") return;

  try {
    const json = JSON.stringify(assignments);
    localStorage.setItem(STORAGE_KEY, json);
    cachedAssignmentsJson = json;
    cachedAssignments = assignments;
    notifyAssignmentListeners();
  } catch (error) {
    console.warn("Failed to save assignments to localStorage:", error);
  }
}

export function useAssignments() {
  const assignments = useSyncExternalStore(
    subscribeAssignments,
    getAssignmentsSnapshot,
    getServerAssignmentsSnapshot
  );

  const completeAssignment = useCallback(
    (id: string | number) => {
      const updated = assignments.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      );
      saveAssignmentsToStorage(updated);
    },
    [assignments]
  );

  const completeOne = useCallback(() => {
    const firstPending = assignments.find(
      (a) => a.status.toLowerCase() !== "completed"
    );
    if (!firstPending) return;

    const updated = assignments.map((item) =>
      item.id === firstPending.id ? { ...item, status: "Completed" } : item
    );
    saveAssignmentsToStorage(updated);
  }, [assignments]);

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
    isLoaded: true,
  };
}
