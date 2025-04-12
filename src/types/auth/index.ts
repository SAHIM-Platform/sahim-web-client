import { Dispatch, SetStateAction } from "react";
import { Department, Level, ApprovalStatus } from "..";

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  academicNumber: string;
  department: Department;
  level: Level;
  password: string;
}

export type Student = Pick<User, "id" | "name" | "academicNumber" | "department" | "level"> & {
  approvalStatus: ApprovalStatus;
};

export type Admin = Pick<User, "id" | "name" | "email" | "username"> & {
  created_at: string;
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export interface AuthState {
  accessToken?: string;
  user?: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
  };
  loading: boolean;
}

export interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: UserRole;
  };
}

export interface LogoutResponse {
  message: string;
}

export interface APIError {
  message: string;
  error: string;
  statusCode: number;
}

export interface AuthError {
  message: string;
  fields?: string[];
  code?: string;
}

export interface AuthResult<T = AuthResponse> {
  success: boolean;
  data?: T;
  error?: AuthError;
}