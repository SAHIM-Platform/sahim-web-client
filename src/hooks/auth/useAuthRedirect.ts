"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { UserRole } from "@/types";

/**
 * Hook for handling authentication-based redirects
 *
 * @description
 * This hook manages redirects based on authentication state and user role:
 *
 * - Redirects authenticated users from login/signup to explore
 * - Redirects unauthenticated users from protected routes to login
 * - Redirects unapproved students to account-status page
 * - Allows access to account-status page only for unapproved students
 * - Always allows access to public routes like /about
 * - Returns loading state to prevent content flash during redirect
 *
 * @returns {boolean} isLoading - `true` while checking authentication and redirects
 */
export function useAuthRedirect(): boolean {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isPublicRoute = pathName === "/about";

    if (isPublicRoute) {
      setIsLoading(false);
      return;
    }

    if (isAuthenticated) {
      const isStudent = auth.user?.role === UserRole.STUDENT;
      const isApproved = auth.user?.approvalStatus === "APPROVED";
      const isAccountStatusPage = pathName === "/account-status";
      const isAuthRoute = pathName === "/login" || pathName === "/signup";
      const isStudentAndNotApproved = isStudent && !isApproved;

      if (isAuthRoute) {
        router.push("/explore");
        return;
      } else if (isStudentAndNotApproved && !isAccountStatusPage) {
        router.push("/account-status");
        return;
      }
    } else {
      const isProtectedRoute =
        !pathName.startsWith("/login") &&
        !pathName.startsWith("/signup") &&
        !pathName.startsWith("/complete-signup") &&
        pathName !== "/about";

      if (isProtectedRoute) {
        router.push("/login");
        return;
      }
    }

    setIsLoading(false);
  }, [isAuthenticated, pathName, router, auth.user]);

  return isLoading;
}
