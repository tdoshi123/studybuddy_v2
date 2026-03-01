"use client";

import { NotificationCounts } from "@/lib/types/navigation";

/**
 * Hook to get notification counts for navigation badges
 * TODO: Replace with actual API calls when backend is ready
 */
export function useNotifications(): NotificationCounts {
  // Mock data - replace with actual API calls later
  return {
    inbox: 5,
    grades: 3,
    calendar: 0,
  };
}
