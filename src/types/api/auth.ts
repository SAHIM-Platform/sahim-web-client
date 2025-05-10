import { Dispatch, SetStateAction } from "react";
import { UserRole } from "./user";
import { ApprovalStatus } from ".";

export interface AuthState {
  accessToken?: string;
  user?: {
    id: number;
    name: string;
    username: string;
    role: UserRole;
    photoPath: string;
    approvalStatus?: ApprovalStatus;
  };
  loading: boolean;
}

export interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  data: {
    accessToken: string;
    user: {
      id: number;
      name: string;
      username: string;
      role: UserRole;
      photoPath: string;
      approvalStatus?: ApprovalStatus;
    };
  };
}

export interface LogoutResponse { 
  success: boolean;
  data?: {
    message: string;
  };
  error?: AuthError;
}

export interface AuthError {
  message: string;
  fields?: string[];
  code?: string;
}

export interface AuthResult {
  success: boolean;
  data?: {
    message: string;
    accessToken: string;
    user: {
      id: number;
      name: string;
      username: string;
      role: UserRole;
      photoPath: string;
      approvalStatus?: ApprovalStatus;
    };
  };
  error?: AuthError;
}

export enum AuthMethod {
  EMAIL_PASSWORD = "EMAIL_PASSWORD",
  OAUTH_GOOGLE = "OAUTH_GOOGLE",
}
