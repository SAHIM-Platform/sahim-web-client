"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "./useAuth";
import { UserRole } from "@/types/api/auth";

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
const useStudentGuard = (): boolean => {
  const router = useRouter();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const isStudent = auth.user?.role === UserRole.STUDENT;
    if (!isStudent) {
      router.push("/explore");
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, auth.user, router]);

  return isLoading;
};

export default useStudentGuard; 