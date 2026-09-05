/**
 * Types and interfaces for student academic performance, attendance analytics, and GPA trends.
 */

/**
 * Attendance summary metrics for a specific subject course.
 */
export interface SubjectAttendance {
  /** Course identifier code (e.g. CS301). */
  code: string;
  /** Full course name. */
  subject: string;
  /** Number of lecture sessions attended. */
  attended: number;
  /** Total number of lecture sessions conducted. */
  total: number;
  /** Calculated attendance percentage (0 - 100). */
  percentage: number;
  /** Course faculty instructor name. */
  faculty: string;
}

/**
 * Academic grade and marks breakdown for an individual enrolled subject.
 */
export interface SubjectPerformance {
  /** Course identifier code (e.g. CS301). */
  code: string;
  /** Full course name. */
  subject: string;
  /** Course credit value. */
  credits: number;
  /** Marks obtained in internal assessments (out of 50). */
  internalMarks: number;
  /** Marks obtained in external semester exams (out of 50). */
  externalMarks: number;
  /** Total combined course marks (out of 100). */
  totalMarks: number;
  /** Awarded letter grade (e.g. A+, A, B+). */
  grade: string;
  /** Grade points corresponding to the awarded letter grade (e.g. 10, 9, 8). */
  gradePoints: number;
}

/**
 * Historical semester progression tracking SGPA and CGPA.
 */
export interface SemesterTrend {
  /** Semester label (e.g. "Semester 1", "Sem 6"). */
  semester: string;
  /** Semester Grade Point Average. */
  sgpa: number;
  /** Cumulative Grade Point Average up to this semester. */
  cgpa: number;
  /** Total credits earned during the semester. */
  credits: number;
  /** Academic honor or standing (e.g. "Distinction", "First Class"). */
  status: string;
}

/**
 * Return shape for the useAnalytics hook.
 */
export interface AnalyticsDataState {
  /** Subject-wise attendance records for current semester. */
  attendanceData: SubjectAttendance[];
  /** Detailed marks and grade points by subject. */
  performanceData: SubjectPerformance[];
  /** Multi-semester SGPA and CGPA trends. */
  semesterTrends: SemesterTrend[];
  /** Cumulative CGPA string representation or placeholder. */
  cgpa: string;
  /** True while analytics data is actively being queried. */
  isLoading: boolean;
  /** Error message if analytics query failed, otherwise null. */
  error: string | null;
  /** Refetches all analytics tables from Supabase. */
  refetch: () => void;
}
