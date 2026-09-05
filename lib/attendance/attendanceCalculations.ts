/**
 * Class attendance aggregation and subject compliance calculations.
 */

import type { ClassSessionItem, SubjectClassStats } from "@/lib/types/attendance";
import { calculateAttendancePercentage } from "@/lib/utils/calculations";

/**
 * Aggregates lecture sessions into subject-wise attendance statistics.
 *
 * @param sessions - List of student class sessions.
 * @returns Array of SubjectClassStats containing attended count, total conducted, and percentage.
 */
export function calculateSubjectClassStats(
  sessions: ClassSessionItem[]
): SubjectClassStats[] {
  const subjectMap = new Map<
    string,
    { code: string; name: string; attended: number; total: number }
  >();

  sessions.forEach((session) => {
    const key = session.courseCode;
    if (!subjectMap.has(key)) {
      subjectMap.set(key, {
        code: session.courseCode,
        name: session.courseName,
        attended: 0,
        total: 0,
      });
    }
    const current = subjectMap.get(key)!;
    current.total += 1;
    if (session.status === "Present") {
      current.attended += 1;
    }
  });

  return Array.from(subjectMap.values()).map((sub) => ({
    courseCode: sub.code,
    courseName: sub.name,
    attended: sub.attended,
    total: sub.total,
    percentage: calculateAttendancePercentage(sub.attended, sub.total),
  }));
}

/**
 * Aggregates overall counts and percentage across all student class sessions.
 *
 * @param sessions - List of student class sessions.
 * @returns Object with present, absent, excused, total counts, and overall attendance percentage.
 */
export function aggregateAttendanceCounts(sessions: ClassSessionItem[]): {
  present: number;
  absent: number;
  excused: number;
  total: number;
  percentage: number;
} {
  const present = sessions.filter((s) => s.status === "Present").length;
  const absent = sessions.filter((s) => s.status === "Absent").length;
  const excused = sessions.filter((s) => s.status === "Excused").length;
  const total = sessions.length;
  const percentage = calculateAttendancePercentage(present, total);

  return { present, absent, excused, total, percentage };
}
