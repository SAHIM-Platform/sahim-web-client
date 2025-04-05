import { Dispatch, SetStateAction } from "react";
import { Department, Level } from "..";

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

export interface AuthState {
  accessToken?: string;
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