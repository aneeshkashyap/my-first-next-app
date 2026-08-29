"use client";

import { useCallback, useSyncExternalStore } from "react";
import { StudentProfile, mockStudentProfile } from "@/lib/mockData";

const PROFILE_STORAGE_KEY = "student_portal_profile_v1";

const profileListeners = new Set<() => void>();

function notifyProfileListeners() {
  profileListeners.forEach((listener) => listener());
}

function subscribeProfile(callback: () => void) {
  profileListeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === PROFILE_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    profileListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

let cachedProfileJson = "";
let cachedProfile: StudentProfile = mockStudentProfile;

/**
 * Safely loads student profile from localStorage or falls back to mockStudentProfile
 */
function getProfileSnapshot(): StudentProfile {
  if (typeof window === "undefined") {
    return mockStudentProfile;
  }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return mockStudentProfile;
    }

    if (raw === cachedProfileJson) {
      return cachedProfile;
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return mockStudentProfile;
    }

    const merged: StudentProfile = {
      ...mockStudentProfile,
      ...parsed,
    };

    cachedProfileJson = raw;
    cachedProfile = merged;
    return cachedProfile;
  } catch (error) {
    console.warn("Failed to load student profile from localStorage:", error);
    return mockStudentProfile;
  }
}

function getServerProfileSnapshot(): StudentProfile {
  return mockStudentProfile;
}

/**
 * Safely persists student profile to localStorage
 */
function saveProfileToStorage(profile: StudentProfile): void {
  if (typeof window === "undefined") return;

  try {
    const json = JSON.stringify(profile);
    localStorage.setItem(PROFILE_STORAGE_KEY, json);
    cachedProfileJson = json;
    cachedProfile = profile;
    notifyProfileListeners();
  } catch (error) {
    console.warn("Failed to save student profile to localStorage:", error);
  }
}

export function useProfile() {
  const profile = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    getServerProfileSnapshot
  );

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

      saveProfileToStorage(nextProfile);
      return { success: true };
    },
    [profile]
  );

  const resetToDefault = useCallback(() => {
    saveProfileToStorage(mockStudentProfile);
  }, []);

  return {
    profile,
    updateProfile,
    resetToDefault,
    isLoaded: true,
  };
}
