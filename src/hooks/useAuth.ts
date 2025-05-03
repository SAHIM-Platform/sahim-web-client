'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthProvider';
import { AuthResult, LoginCredentials, UserRole } from '@/types/api/auth';
import loginService from '@/services/auth/loginService';
import { SignupFormData } from '@/utils/api/signup/validateSignupForm';
import signupService from '@/services/auth/signupService';

const useAuth = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { auth, setAuth } = authContext;

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Starting login process...');
      const authData: AuthResult = await loginService(credentials);
      console.log('Login service response:', authData);

      if (authData.success && authData.data?.accessToken) {
        console.log('Login successful:', authData.data.message);
        console.log('Setting auth state with access token');

        setAuth({
          accessToken: authData.data.accessToken,
          user: {
            id: authData.data.user.id,
            name: authData.data.user.name,
            username: authData.data.user.username,
            role: authData.data.user.role as UserRole,
            photoPath: authData.data.user.photoPath,
            approvalStatus: authData.data.user.role === 'STUDENT' ? authData.data.user.approvalStatus : undefined
          },
          loading: false,
        });

        // Redirect based on role and approval status
        console.log('Checking user role and approval status for redirection...');
        console.log('User role:', authData.data.user.role);
        console.log('Approval status:', authData.data.user.approvalStatus);

        if (authData.data.user.role === 'STUDENT' && authData.data.user.approvalStatus !== 'APPROVED') {
          console.log('User is a student and not approved, redirecting to /account-status');
          router.push('/account-status');
        } else {
          console.log('User is either not a student or is approved, redirecting to /explore');
          router.push('/explore');
        }
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

  const signup = async (userData: SignupFormData) => {
    try {
      console.log('Starting signup process...');
      const authData: AuthResult = await signupService(userData);
      console.log('Signup service response:', authData);

      if (authData.success && authData.data?.accessToken) {
        console.log('Signup successful:', authData.data.message);
        console.log('Setting auth state with access token');

        setAuth({
          accessToken: authData.data.accessToken,
          user: {
            id: authData.data.user.id,
            name: authData.data.user.name,
            username: authData.data.user.username,
            role: authData.data.user.role as UserRole,
            photoPath: authData.data.user.photoPath,
            approvalStatus: authData.data.user.role === 'STUDENT' ? authData.data.user.approvalStatus : undefined
          },
          loading: false,
        });

        // Redirect based on role and approval status
        console.log('Checking user role and approval status for redirection...');
        console.log('User role:', authData.data.user.role);
        console.log('Approval status:', authData.data.user.approvalStatus);

        if (authData.data.user.role === 'STUDENT' && authData.data.user.approvalStatus !== 'APPROVED') {
          console.log('User is a student and not approved, redirecting to /account-status');
          router.push('/account-status');
        } else {
          console.log('User is either not a student or is approved, redirecting to /explore');
          router.push('/explore');
        }

        return authData;
      }

      console.log('Signup failed:', authData.error);
      return authData;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Signup failed',
          code: 'AUTH_FAILED'
        }
      };
    }
  };

  return {
    auth,
    login,
    signup,
    setAuth,
    isAuthenticated: !!auth.accessToken,
  };
};

export default useAuth;
