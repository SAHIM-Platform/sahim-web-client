'use client';

import { createContext, useState, useMemo, useEffect } from "react";
import axios from '@/api/axios';
import { AuthState, AuthContextType } from '@/types/auth';
import LoadingSpinner from "@/components/LoadingSpinner";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    accessToken: undefined
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Checking authentication state...');
        const response = await axios.post('/auth/refresh');
        console.log('Refresh token successful:', {
          isAuthenticated: true,
          user: response.data.user
        });
        setAuth({
          accessToken: response.data.accessToken,
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
        accessToken: auth.accessToken ? 'present' : 'none'
      });
    }
  }, [auth]);

  const contextValue = useMemo(() => {
    return { auth, setAuth };
  }, [auth]);

  if (auth.loading) {
    return (
      <LoadingSpinner size="xl" color="primary" />
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};