/**
 * Form field validation helpers for student profile editing.
 */

import type { StudentProfile, ProfileValidationErrors } from "@/lib/types/profile";

/**
 * Validates updated student profile field values.
 *
 * @param data - Partial student profile fields to validate.
 * @returns Map of field validation error messages, empty if all fields are valid.
 */
export function validateProfileData(
  data: Partial<StudentProfile>
): ProfileValidationErrors {
  const errors: ProfileValidationErrors = {};

  if (data.name !== undefined && !data.name.trim()) {
    errors.name = "Student name is required.";
  }

  if (data.email !== undefined) {
    const emailTrimmed = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.email = "Please enter a valid email address.";
    }
  }

  if (data.phone !== undefined && !data.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (data.department !== undefined && !data.department.trim()) {
    errors.department = "Department is required.";
  }

  return errors;
}
