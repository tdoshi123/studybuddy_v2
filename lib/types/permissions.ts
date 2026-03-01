import { UserRole } from './user';

export interface RolePermissions {
  canViewGrades: boolean;
  canEditGrades: boolean;
  canManageUsers: boolean;
  canManageCourses: boolean;
  canViewAllStudents: boolean;
  canSendMessages: boolean;
  canCreateAssignments: boolean;
  canTakeAttendance: boolean;
  canViewReports: boolean;
  canManageSchedule: boolean;
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  student: {
    canViewGrades: true,
    canEditGrades: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewAllStudents: false,
    canSendMessages: true,
    canCreateAssignments: false,
    canTakeAttendance: false,
    canViewReports: false,
    canManageSchedule: false,
    canManageSettings: false,
  },
  parent: {
    canViewGrades: true, // For their children
    canEditGrades: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewAllStudents: false,
    canSendMessages: true, // To teachers
    canCreateAssignments: false,
    canTakeAttendance: false,
    canViewReports: true, // For their children
    canManageSchedule: false,
    canManageSettings: false,
  },
  teacher: {
    canViewGrades: true,
    canEditGrades: true,
    canManageUsers: false,
    canManageCourses: true, // Their courses
    canViewAllStudents: true, // Their students
    canSendMessages: true,
    canCreateAssignments: true,
    canTakeAttendance: true,
    canViewReports: true,
    canManageSchedule: true, // Their schedule
    canManageSettings: false,
  },
  admin: {
    canViewGrades: true,
    canEditGrades: true,
    canManageUsers: true,
    canManageCourses: true,
    canViewAllStudents: true,
    canSendMessages: true,
    canCreateAssignments: false,
    canTakeAttendance: false,
    canViewReports: true,
    canManageSchedule: true,
    canManageSettings: true,
  },
};

export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(
  role: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[role][permission];
}
