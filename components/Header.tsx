"use client";

/**
 * Top Navigation Header Component
 *
 * Provides branding, desktop navigation links, active page indicators,
 * mobile drawer toggle, student profile preview, and session logout actions.
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/profile";
import { getUserInitials } from "@/lib/utils/formatters";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/" },
  { name: "Assignments", href: "/assignments" },
  { name: "Analytics", href: "/analytics" },
  { name: "Announcements", href: "/announcements" },
  { name: "Profile", href: "/profile" },
];

/**
 * Renders the global top navigation bar with branding, links, student identity, and sign-out controls.
 *
 * @returns Header navigation bar element, or null when viewing the login page.
 */
export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { profile } = useProfile();

  // Hide the navigation header completely on the login page
  if (pathname === "/login") {
    return null;
  }

  const displayName =
    profile.name && profile.name.toLowerCase() !== "student"
      ? profile.name
      : user?.name && user.name.toLowerCase() !== "student"
      ? user.name
      : "Aneesh Kashyap K S";
  const displayId = profile.studentId || user?.studentId || "2024CS0905";
  const userInitials = getUserInitials(displayName);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
            aria-label="Student Portal Home"
          >
            {/* Academic Crest Icon */}
            <div className="h-9 w-9 rounded-lg bg-blue-700 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-blue-800 dark:group-hover:bg-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white block leading-tight">
                Student Portal
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block tracking-wider uppercase">
                Academic Workspace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Material M3 Pills) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-800/80 shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Section: Term Chip, Student Profile, and Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200/80 dark:border-slate-700">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Spring 2026
          </span>

          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800 shadow-2xs">
                  {userInitials}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate max-w-[130px]">
                    {displayName}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                    {displayId}
                  </span>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Sign out"
                aria-label="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
          {/* Mobile User Identity Box */}
          <div className="p-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
                {userInitials}
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                  {user?.email}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Online
            </span>
          </div>

          {/* Links */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-800/60"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Mobile Logout Button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
