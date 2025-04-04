'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthProvider';
import { AuthResult, LoginCredentials, User } from '@/types/auth';
import loginService from '@/services/auth/loginService';

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { auth, setAuth } = authContext;

  const login = async (credentials: LoginCredentials) => {
    try {
      const authData: AuthResult = await loginService(credentials);
      console.log('Login service response:', authData);
      
      if (authData.success && authData.data?.accessToken) {
        console.log('Login successful:', authData.data.message);
        console.log('Setting auth state with access token');
        
        setAuth({
          accessToken: authData.data.accessToken,
          loading: false,
        });
        
        router.push('/explore');
        return authData;
      }
      
      console.log('Login failed:', authData.error);
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Login failed',
          code: 'AUTH_FAILED'
        }
      };
    }
  };

  return {
    auth,
    login,
    setAuth,
    isAuthenticated: !!auth.accessToken,
  };
};

export default useAuth;
