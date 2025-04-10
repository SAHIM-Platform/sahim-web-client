"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useSuperAdminRoleGuard = (userRole?: string): boolean => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const hasSuperAdminRole = userRole === "super_admin";
      setIsSuperAdmin(hasSuperAdminRole);
      
      if (!hasSuperAdminRole) {
        router.replace("/explore/");
      }
    }
  }, [isMounted, userRole, router]);

  return isSuperAdmin;
};

export default useSuperAdminRoleGuard; 