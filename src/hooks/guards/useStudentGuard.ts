"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { isStudentByRole } from "@/utils/role";

/**
 * Hook for protecting routes that should only be accessible to students
 * 
 * @description
 * This hook ensures that only authenticated students can access the protected route:
 * - Redirects unauthenticated users to login page
 * - Redirects non-student users to explore page
 * - Allows access only to authenticated students
 * - Returns loading state to prevent unauthorized content flash
 * 
 * @returns {boolean} isLoading - true while checking authentication and role
 */
export function useStudentGuard(): boolean {
  const router = useRouter();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isStudentByRole(auth.user?.role)) {
      router.push("/explore");
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, auth.user, router]);

  return isLoading;
};
