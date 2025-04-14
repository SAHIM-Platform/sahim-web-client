import { UserRole } from './auth';

export * from './auth';
export * from './form';

export enum Department {
  IT = "IT",        // تقنية معلومات
  SE = "SE",       // هندسة برمجيات
  COM = "COM",   // هندسة اتصالات
  IMSE = "IMSE",   // هندسة صناعية
  CND = "CND",   // هندسة شبكات
  MRE = "MRE"    // هندسة ميكاترونكس
}

export const departmentLabels: Record<Department, string> = {
  [Department.IT]: "تقنية معلومات",
  [Department.SE]: "هندسة برمجيات",
  [Department.COM]: "هندسة اتصالات",
  [Department.IMSE]: "هندسة صناعية",
  [Department.CND]: "هندسة شبكات",
  [Department.MRE]: "هندسة ميكاترونكس"
};

export interface Category {
  id: string;
  name: string;
}

export enum Level {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  academicNumber?: string;
  department?: Department;
  level?: Level;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "مدير النظام",
  [UserRole.ADMIN]: "مُشرف",
  [UserRole.STUDENT]: "طالب"
};
