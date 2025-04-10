"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthRedirect from "./UseAuthRedirect";

const useAdminRoleGuard = (userRole?: string): void => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // If user is not authenticated, redirect to login page
  useAuthRedirect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const isAdmin = userRole === "admin";
      const isSuperAdmin = userRole === "super_admin";

      if (!isAdmin && !isSuperAdmin) {
        router.replace("/");
      }
    }
  }, [userRole, router, isMounted]);
};

export default useAdminRoleGuard;
