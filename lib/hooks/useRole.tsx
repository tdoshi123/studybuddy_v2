"use client";

import { createContext, useContext, ReactNode } from "react";
import { UserRole, User } from "@/lib/types/user";

interface RoleContextType {
  user: User | null;
  role: UserRole | null;
  isStudent: boolean;
  isParent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  user: User | null;
}

export function RoleProvider({ children, user }: RoleProviderProps) {
  const role = user?.role || null;

  const contextValue: RoleContextType = {
    user,
    role,
    isStudent: role === "student",
    isParent: role === "parent",
    isTeacher: role === "teacher",
    isAdmin: role === "admin",
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
