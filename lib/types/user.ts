export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends BaseUser {
  role: 'student';
  studentId: string;
  gradeLevel: string;
  enrollmentDate: Date;
  parentIds: string[];
  homeroom?: string;
}

export interface Parent extends BaseUser {
  role: 'parent';
  phone: string;
  childrenIds: string[]; // Array of student IDs
  emergencyContact: boolean;
}

export interface Teacher extends BaseUser {
  role: 'teacher';
  employeeId: string;
  department: string;
  subjects: string[];
  hireDate: Date;
  phone?: string;
}

export interface Admin extends BaseUser {
  role: 'admin';
  employeeId: string;
  permissions: AdminPermission[];
  department?: string;
}

export type AdminPermission = 
  | 'manage_users'
  | 'manage_courses'
  | 'manage_schedule'
  | 'view_reports'
  | 'manage_announcements'
  | 'manage_settings'
  | 'manage_grades';

export type User = Student | Parent | Teacher | Admin;
