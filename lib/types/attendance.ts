/**
 * Types and interfaces for lecture tracking and class attendance.
 */

/**
 * Valid attendance statuses recorded for a student in a class session.
 */
export type AttendanceStatus = "Present" | "Absent" | "Excused";

/**
 * Normalized representation of an individual lecture session with student attendance status.
 */
export interface ClassSessionItem {
  /** Primary identifier of the class session. */
  id: number;
  /** Course identifier associated with this session. */
  courseId: number;
  /** Course subject code (e.g. CS301). */
  courseCode: string;
  /** Full course name (e.g. Data Structures & Algorithms). */
  courseName: string;
  /** Session date in YYYY-MM-DD ISO format. */
  sessionDate: string;
  /** Class start time (HH:MM:SS or HH:MM). */
  startTime: string;
  /** Class end time (HH:MM:SS or HH:MM). */
  endTime: string;
  /** Lecture topic or syllabus unit covered. */
  topic: string | null;
  /** Attendance record status for the authenticated student. */
  status: AttendanceStatus | "Unrecorded";
}

/**
 * Aggregated attendance statistics for an enrolled subject.
 */
export interface SubjectClassStats {
  /** Course subject code. */
  courseCode: string;
  /** Full course name. */
  courseName: string;
  /** Number of lecture sessions attended by the student. */
  attended: number;
  /** Total number of conducted sessions for this subject. */
  total: number;
  /** Attendance compliance percentage (0 - 100). */
  percentage: number;
}

/**
 * Return shape for the useClassSessions hook.
 */
export interface UseClassSessionsReturn {
  /** Chronological list of class sessions for enrolled courses. */
  sessions: ClassSessionItem[];
  /** Breakdown of attendance percentages by subject. */
  subjectStats: SubjectClassStats[];
  /** Total count of sessions attended (Present). */
  totalAttended: number;
  /** Total count of lecture sessions conducted. */
  totalSessions: number;
  /** Overall portal-wide attendance percentage. */
  overallPercentage: number;
  /** Number of sessions marked as Present. */
  presentCount: number;
  /** Number of sessions marked as Absent. */
  absentCount: number;
  /** Number of sessions marked as Excused. */
  excusedCount: number;
  /** True when initial data is loading or refetching. */
  isLoading: boolean;
  /** Error message if query failed, otherwise null. */
  error: string | null;
  /** Refetches class sessions and attendance records from Supabase. */
  refetch: () => void;
}
