"use client";

import { logoutService } from "@/services/auth/logoutService";
import useAuth from "./useAuth";
import { useRouter } from "next/navigation";
import useAxios from "./useAxios";
import { useState } from "react";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";

const useLogout = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxios();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await logoutService(axiosPrivate);

      if (!response.success) {
        setError(response.error?.message || ERROR_MESSAGES.logout.DEFAULT);
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
      setError(ERROR_MESSAGES.logout.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, error, isLoading };
};

export default useLogout;
