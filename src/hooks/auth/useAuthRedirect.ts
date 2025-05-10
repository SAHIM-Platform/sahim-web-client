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
 * - Redirects authenticated users from login/signup to explore
 * - Redirects unauthenticated users from protected routes to login
 * - Redirects unapproved students to account-status page
 * - Allows access to account-status page only for unapproved students
 * - Returns loading state to prevent content flash
 * 
 * @returns {boolean} isLoading - true while checking authentication and redirects
 */
export function useAuthRedirect(): boolean {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const isStudent = auth.user?.role === UserRole.STUDENT;
      const isApproved = auth.user?.approvalStatus === 'APPROVED';
      const isAccountStatusPage = pathName === '/account-status';
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
      const isProtectedRoute = !pathName.startsWith("/login") && !pathName.startsWith("/signup")git ;
      if (isProtectedRoute) {
        router.push("/login");
        return;
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, pathName, router, auth.user]);

  return isLoading;
};
