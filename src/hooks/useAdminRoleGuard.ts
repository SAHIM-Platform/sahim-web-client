"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAdminRoleGuard = (userRole?: string): void => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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
