/**
 * Types and interfaces for student assignments and deliverables.
 */

/**
 * Valid assignment completion statuses.
 */
export type AssignmentStatus = "Pending" | "In Progress" | "Completed" | string;

/**
 * Normalized assignment object displayed across dashboard and assignments list.
 */
export interface Assignment {
  /** Unique assignment record identifier. */
  id: string | number;
  /** Assignment title or deliverable description. */
  title: string;
  /** Course name or subject code. */
  subject: string;
  /** Formatted human-readable due date (e.g. "March 15, 2026"). */
  dueDate: string;
  /** Current progress or completion status. */
  status: AssignmentStatus;
}

/**
 * Return shape for the useAssignments hook.
 */
export interface UseAssignmentsReturn {
  /** List of assignments assigned to the authenticated student. */
  assignments: Assignment[];
  /** Count of assignments that are not yet marked completed. */
  pendingCount: number;
  /** Count of completed assignments. */
  completedCount: number;
  /** Total count of assignments. */
  totalCount: number;
  /**
   * Marks a specific assignment as completed both optimistically and in Supabase.
   *
   * @param id - Assignment record ID.
   */
  completeAssignment: (id: string | number) => Promise<void>;
  /**
   * Completes the first pending assignment in the list.
   */
  completeOne: () => Promise<void>;
  /** True when initial data load has finished. */
  isLoaded: boolean;
  /** True while data is actively fetching. */
  isLoading: boolean;
  /** Error message if query failed, otherwise null. */
  error: string | null;
  /** Refetches assignments from Supabase. */
  refetch: () => void;
}
