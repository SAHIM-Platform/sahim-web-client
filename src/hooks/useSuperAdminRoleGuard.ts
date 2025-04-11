"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthRedirect from "./UseAuthRedirect";
import useAuth from "./useAuth";

const useSuperAdminRoleGuard = (): void => {
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
      if (!auth.user || auth?.user?.role !== 'SUPER_ADMIN') {
        router.replace("/"); 
      }
    }
  }, [auth?.user, router, isMounted]);
};

export default useSuperAdminRoleGuard;
