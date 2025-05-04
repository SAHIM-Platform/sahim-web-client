"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useAuthRedirect } from "@/hooks";

export function useAdminRoleGuard(): boolean {
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
