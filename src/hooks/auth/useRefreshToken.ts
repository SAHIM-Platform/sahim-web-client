'use client'

import axios from '@/api/axios';
import { useAuth } from '@/hooks';
import { AuthResponse, UserRole } from "@/types";

export function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.post<AuthResponse>('/auth/refresh');
      const { accessToken, user } = response.data.data;

      if (!user) {
        throw new Error('No user data in refresh response');
      }

      setAuth({
        accessToken,
        user: {
          ...user,
          approvalStatus: user.role === UserRole.STUDENT ? user.approvalStatus : undefined
        },
        loading: false,
      });

      console.log('Refresh token successful:', {
        accessToken: !!accessToken,
        user: {
          ...user,
          approvalStatus: user.role === UserRole.STUDENT ? user.approvalStatus : undefined
        }
      });

      return { accessToken, user };
    } catch (error) {
      setAuth({
        accessToken: undefined,
        user: undefined,
        loading: false,
      });
      throw error;
    }
  };

  return refresh;
};
