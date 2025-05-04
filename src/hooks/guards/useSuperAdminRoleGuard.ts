"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useAuthRedirect } from "@/hooks";

export function useSuperAdminRoleGuard(): boolean {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // If user is not authenticated, redirect to login page
  useAuthRedirect();

  useEffect(() => {
    if (!auth.user || auth?.user?.role !== 'SUPER_ADMIN') {
      router.replace("/");
      return;
    }
    setIsLoading(false);
  }, [auth.user, router]);

  return isLoading;
};
