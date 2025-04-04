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

export interface AuthError {
  message: string;
  fields?: string[];
  code?: string;
}

export interface AuthResult {
  success: boolean;
  data?: AuthResponse;
  error?: AuthError;
}