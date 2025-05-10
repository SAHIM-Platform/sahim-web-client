import { ApprovalStatus, Department, Level } from ".";
import { AuthMethod } from "..";

export type Student = {
  id: number;
  name: string;
  email?: string;
  student?: {
    id: string;
    userId: string;
    academicNumber: string;
    department: Department;
    studyLevel: Level;
    approvalStatus: ApprovalStatus;
    approvalUpdatedByUserId: string;
  };
};

export interface Admin {
  id: number;
  email?: string;
  username: string;
  name: string;
  created_at: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STUDENT = "STUDENT"
}

export interface Profile {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  academicNumber?: string;
  department?: Department;
  level?: Level;
  photoPath?: string;
  authMethod?: AuthMethod;
}

export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "مدير النظام",
  [UserRole.ADMIN]: "مُشرف",
  [UserRole.STUDENT]: "طالب"
};
