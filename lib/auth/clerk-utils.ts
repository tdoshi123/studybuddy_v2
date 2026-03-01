import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@/lib/types/user";

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  
  if (!user) return null;
  
  // Get role from user's unsafe metadata
  const role = user.unsafeMetadata?.role as UserRole | undefined;
  
  return role || null;
}

export async function requireAuth() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  const role = user.unsafeMetadata?.role as UserRole | undefined;
  
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Forbidden");
  }
  
  return { user, role };
}
