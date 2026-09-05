/**
 * Types and interfaces for campus announcements and academic bulletins.
 */

/**
 * Normalized announcement bulletin item.
 */
export interface Announcement {
  /** Unique bulletin record identifier. */
  id: number | string;
  /** Optional author or target student ID. */
  userId?: number | string;
  /** Notice title. */
  title: string;
  /** Full announcement body text or instructions. */
  body: string;
  /** Publication timestamp ISO string if available. */
  createdAt?: string | null;
}
