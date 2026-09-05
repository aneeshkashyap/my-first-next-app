/**
 * Mathematical calculations and domain metric resolvers for academic standing and attendance.
 */

/**
 * Calculates rounded attendance percentage from attended count and total count.
 *
 * @param attended - Number of classes attended.
 * @param total - Total number of conducted classes.
 * @returns Rounded percentage from 0 to 100.
 */
export function calculateAttendancePercentage(attended: number, total: number): number {
  if (total <= 0 || attended < 0) return 0;
  return Math.round((attended / total) * 100);
}

/**
 * Calculates the number of consecutive classes a student must attend to reach the target threshold.
 * Formula: (attended + x) / (total + x) >= threshold => x >= (threshold * total - attended) / (1 - threshold)
 *
 * @param attended - Number of classes currently attended.
 * @param total - Total number of conducted classes.
 * @param targetThreshold - Decimal threshold (defaults to 0.75 for 75%).
 * @returns Minimum positive integer of classes needed, or 0 if already eligible.
 */
export function calculateNeededClasses(
  attended: number,
  total: number,
  targetThreshold: number = 0.75
): number {
  if (total <= 0) return 0;
  const currentRatio = attended / total;
  if (currentRatio >= targetThreshold) return 0;

  const needed = Math.ceil(
    (targetThreshold * total - attended) / (1 - targetThreshold)
  );
  return Math.max(1, needed);
}

/**
 * Resolves academic standing classification based on cumulative CGPA.
 *
 * @param cgpa - Numerical or string CGPA value.
 * @returns "Distinction" if CGPA >= 8.0, otherwise "First Class".
 */
export function resolveCgpaStanding(cgpa: string | number): string {
  const parsed = typeof cgpa === "number" ? cgpa : parseFloat(cgpa);
  if (Number.isNaN(parsed)) return "Academic Workspace";
  return parsed >= 8.0 ? "Distinction" : "First Class";
}

/**
 * Resolves attendance status and corresponding badge styling.
 *
 * @param percentage - Attendance percentage (0 - 100).
 * @returns Object containing status label and Tailwind CSS color classes.
 */
export function resolveAttendanceStanding(percentage: number): {
  status: string;
  statusColor: string;
} {
  const isGood = percentage >= 75;
  return {
    status: isGood ? "Good Standing" : "Low Attendance",
    statusColor: isGood
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
  };
}
