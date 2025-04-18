"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "./useAuth";
import { UserRole } from "@/types/auth";

/**
 * Hook for handling authentication-based redirects
 * 
 * @description
 * This hook manages redirects based on authentication state and user role:
 * - Redirects authenticated users from login/signup to explore
 * - Redirects unauthenticated users from protected routes to login
 * - Redirects unapproved students to account-status page
 * - Allows access to account-status page only for unapproved students
 */
const useAuthRedirect = (): void => {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, auth } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const isStudent = auth.user?.role === UserRole.STUDENT;
      const isApproved = auth.user?.approvalStatus === 'APPROVED';
      const isAccountStatusPage = pathName === '/account-status';

      if (pathName === "/login" || pathName === "/signup") {
        router.push("/explore");
      } else if (isStudent && !isApproved && !isAccountStatusPage) {
        router.push("/account-status");
      }
    } else {
      if (pathName.startsWith("/explore") || 
          pathName.startsWith("/discussion") || 
          pathName === "/account-status") {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathName, router, auth.user]);
};

export default useAuthRedirect;
