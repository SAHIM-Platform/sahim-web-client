"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAdminRoleGuard = (isAdmin: boolean, isSuperAdmin: boolean): void => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAdmin && !isSuperAdmin) {
      router.replace("/");
    }
  }, [isAdmin, isSuperAdmin, router, isMounted]);
};

export default useAdminRoleGuard;
