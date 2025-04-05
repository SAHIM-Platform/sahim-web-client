"use client";

import { logoutService } from "@/services/auth/logoutService";
import useAuth from "./useAuth";
import { useRouter } from "next/navigation";
import useAxios from "./useAxios";

const useLogout = () => {
  const { setAuth } = useAuth();
  const axiosPrivate = useAxios();
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutService(axiosPrivate);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAuth({
        accessToken: undefined,
        loading: false,
      });
      router.push("/");
    }
  };

  return logout;
};

export default useLogout;
