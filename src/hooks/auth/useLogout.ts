"use client";

import { logoutService } from "@/services/auth/logoutService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { useAuth, useAxios } from "@/hooks";

export function useLogout() {
  const { setAuth } = useAuth();
  useAxios();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await logoutService();

      if (!response.success) {
        setError(response.error?.message || RESPONSE_MESSAGES.logout.DEFAULT);
        return;
      }

      setAuth({
        accessToken: undefined,
        loading: false,
        user: undefined
      });
      router.push("/login");

    } catch (error) {
      console.error("Logout failed:", error);
      setError(RESPONSE_MESSAGES.logout.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, error, isLoading };
};
