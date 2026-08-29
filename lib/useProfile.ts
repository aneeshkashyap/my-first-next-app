"use client";

import { useState, useEffect, useCallback } from "react";
import { StudentProfile, mockStudentProfile } from "@/lib/mockData";

const PROFILE_STORAGE_KEY = "student_portal_profile_v1";

/**
 * Safely loads student profile from localStorage or falls back to mockStudentProfile
 */
function loadProfileFromStorage(): StudentProfile {
  if (typeof window === "undefined") {
    return mockStudentProfile;
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return mockStudentProfile;
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return mockStudentProfile;
    }

    // Merge saved data with mockStudentProfile to ensure all properties exist
    return {
      ...mockStudentProfile,
      ...parsed,
    };
  } catch (error) {
    console.warn("Failed to load student profile from localStorage:", error);
    return mockStudentProfile;
  }
}

/**
 * Safely persists student profile to localStorage
 */
function saveProfileToStorage(profile: StudentProfile): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn("Failed to save student profile to localStorage:", error);
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile>(mockStudentProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore saved profile on mount without hydration mismatch
  useEffect(() => {
    const saved = loadProfileFromStorage();
    setProfile(saved);
    setIsLoaded(true);
  }, []);

  // Listen to window storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROFILE_STORAGE_KEY && e.newValue) {
        try {
          const updated = loadProfileFromStorage();
          setProfile(updated);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateProfile = useCallback(
    (
      updatedData: Partial<StudentProfile>
    ): { success: boolean; errors?: Record<string, string> } => {
      const errors: Record<string, string> = {};

      // Validation
      if (updatedData.name !== undefined && !updatedData.name.trim()) {
        errors.name = "Student name is required.";
      }

      if (updatedData.email !== undefined) {
        const emailTrimmed = updatedData.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailTrimmed) {
          errors.email = "Email address is required.";
        } else if (!emailRegex.test(emailTrimmed)) {
          errors.email = "Please enter a valid email address.";
        }
      }

      if (updatedData.phone !== undefined && !updatedData.phone.trim()) {
        errors.phone = "Phone number is required.";
      }

      if (updatedData.department !== undefined && !updatedData.department.trim()) {
        errors.department = "Department is required.";
      }

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      const nextProfile: StudentProfile = {
        ...profile,
        ...updatedData,
      };

      setProfile(nextProfile);
      saveProfileToStorage(nextProfile);
      return { success: true };
    },
    [profile]
  );

  const resetToDefault = useCallback(() => {
    setProfile(mockStudentProfile);
    saveProfileToStorage(mockStudentProfile);
  }, []);

  return {
    profile,
    updateProfile,
    resetToDefault,
    isLoaded,
  };
}
