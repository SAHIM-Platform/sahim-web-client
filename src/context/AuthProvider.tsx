'use client';

import { createContext, useState, useMemo, useEffect } from "react";
import axios from '@/api/axios';
import { AuthState, AuthContextType, AuthResponse } from '@/types/api/auth';
import LoadingSpinner from "@/components/LoadingSpinner";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    accessToken: undefined,
    user: undefined
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Checking authentication state...');
        const response = await axios.post<AuthResponse>('/auth/refresh');
        const { accessToken, user } = response.data;

        console.log('Refresh token successful:', {
          isAuthenticated: true,
          user: { ...user }
        });

        setAuth({
          accessToken,
          user: {
            ...user,
            approvalStatus: user.role === 'STUDENT' ? user.approvalStatus : undefined
          },
          loading: false
        });
      } catch (error) {
        console.log('Not authenticated:', {
          isAuthenticated: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!auth.loading) {
      console.log('Current auth state:', {
        isAuthenticated: !!auth.accessToken,
        accessToken: auth.accessToken ? 'present' : 'none',
        user: auth.user ? {
          id: auth.user.id,
          name: auth.user.name,
          username: auth.user.username,
          role: auth.user.role,
          photoPath: auth.user.photoPath,
          approvalStatus: auth.user.approvalStatus
        } : 'none'
      });
    }
  }, [auth]);

  const contextValue = useMemo(() => {
    return { auth, setAuth };
  }, [auth]);

  if (auth.loading) {
    return (
      <LoadingSpinner size="xl" color="primary" fullScreen={true} />
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};