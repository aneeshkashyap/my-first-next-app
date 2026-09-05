/**
 * Shared formatting and presentation utilities for dates, times, badges, and user labels.
 */

/**
 * Formats a date string (e.g. "2026-03-01") into a human-readable format ("March 1, 2026")
 * without causing timezone day-shifting.
 *
 * @param value - ISO date string in YYYY-MM-DD format or null.
 * @returns Formatted human-readable date string, or fallback message if null/empty.
 */
export function formatDueDate(value: string | null): string {
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
 * Formats a 24-hour time string (e.g. "09:30:00" or "14:15") into a 12-hour AM/PM string (e.g. "9:30 AM", "2:15 PM").
 *
 * @param timeStr - Time string in HH:MM or HH:MM:SS format.
 * @returns Formatted 12-hour time string with AM/PM indicator.
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (Number.isNaN(hour)) return timeStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${min} ${ampm}`;
}

/**
 * Returns a friendly relative date label ("Today") or a localized short date string.
 *
 * @param dateStr - Date string in YYYY-MM-DD format.
 * @returns "Today" if matching current local date, otherwise formatted short date.
 */
export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Today";

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, monthIndex, day);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
  return dateStr;
}

/**
 * Resolves Tailwind CSS classes for lecture attendance status badges.
 *
 * @param status - Attendance status string ("Present", "Absent", "Excused").
 * @returns Tailwind CSS style classes string.
 */
export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "present":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "absent":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800";
    case "excused":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

/**
 * Resolves Tailwind CSS classes for assignment deliverable status badges.
 *
 * @param status - Assignment status string ("Completed", "In Progress", "Pending").
 * @returns Tailwind CSS style classes string.
 */
export function getAssignmentBadgeStyle(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "in progress":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
  }
}

/**
 * Resolves Tailwind CSS classes for academic letter grades (A+, A, B+, B, etc.).
 *
 * @param grade - Letter grade string.
 * @returns Tailwind CSS style classes string.
 */
export function getGradeBadgeColor(grade: string): string {
  switch (grade) {
    case "A+":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "A":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "B+":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800";
    case "B":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

/**
 * Extracts student initials (e.g. "Aneesh Kashyap" -> "AK") for avatar display.
 *
 * @param name - Full display name of the student.
 * @returns Uppercase 1-2 letter student initials or "SD" fallback.
 */
export function getUserInitials(name?: string | null): string {
  if (!name || !name.trim()) {
    return "SD";
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "SD";
}
