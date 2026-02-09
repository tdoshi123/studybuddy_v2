"use client";

import { NotificationCounts } from "@/lib/types/navigation";

/**
 * Hook to get notification counts for navigation badges
 * TODO: Replace with actual API calls when backend is ready
 */
export function useNotifications(): NotificationCounts {
  // Mock data - replace with actual API calls later
  return {
    messages: 12, // Unread messages across all conversations
    inbox: 5,     // Unread announcements and teacher messages
    grades: 3,    // New unchecked grades
    calendar: 0,  // No badge on calendar - removed for clarity
  };
}
