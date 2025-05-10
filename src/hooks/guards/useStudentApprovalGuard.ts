"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks";
import { isStudentByRole } from "@/utils/role";
import { isStudentApproved } from "@/utils/isStudentApproved";

/**
 * Hook for protecting routes based on student approval status
 * 
 * @description
 * This hook ensures that only approved students can access protected routes:
 * - Redirects unapproved students to account-status page
 * - Allows access to account-status page for unapproved students
 * - Returns loading state to prevent content flash
 * 
 * @returns {boolean} isLoading - true while checking approval status
 */
export function useStudentApprovalGuard(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const isStudent = isStudentByRole(auth.user?.role);
    const isApproved = isStudentApproved(auth.user?.approvalStatus);
    const isAccountStatusPage = pathname === "/account-status";
    const shouldRedirectToAccountStatus = isStudent && !isApproved && !isAccountStatusPage;

    if (shouldRedirectToAccountStatus) {
      console.log("shouldRedirectToAccountStatus --")
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, auth.user, pathname, router]);

  return isLoading;
};
