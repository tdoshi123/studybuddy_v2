"use client";

import { useUser } from "@clerk/nextjs";
import { UserRole } from "@/lib/types/user";

export function useClerkRole() {
  const { user, isLoaded } = useUser();
  
  const role = (user?.unsafeMetadata?.role as UserRole) || null;
  
  return {
    user,
    role,
    isLoaded,
    isStudent: role === "student",
    isParent: role === "parent",
    isTeacher: role === "teacher",
    isAdmin: role === "admin",
  };
}
