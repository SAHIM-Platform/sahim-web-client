"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthRedirect from "./UseAuthRedirect";
import useAuth from "./useAuth";

const useAdminRoleGuard = (): boolean => {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // If user is not authenticated, redirect to login page
  useAuthRedirect();

  useEffect(() => {
    if (!auth.user || !['ADMIN', 'SUPER_ADMIN'].includes(auth?.user?.role)) {
      router.replace("/");
      return;
    }
    setIsLoading(false);
  }, [auth.user, router]);

  return isLoading;
};

export default useAdminRoleGuard;
