"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthRedirect from "./UseAuthRedirect";
import useAuth from "./useAuth";

const useAdminRoleGuard = (): void => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { auth } = useAuth();

  // If user is not authenticated, redirect to login page
  useAuthRedirect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!auth.user || !['ADMIN', 'SUPER_ADMIN'].includes(auth?.user?.role)) {
        router.replace("/"); 
      }
    }
  }, [router, isMounted, auth.user]);
};

export default useAdminRoleGuard;
