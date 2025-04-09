"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const useAdminRoleGuard = (isAdmin: boolean , isSuperAdmin: boolean): void => {
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isSuperAdmin, router]);
};

export default useAdminRoleGuard;
