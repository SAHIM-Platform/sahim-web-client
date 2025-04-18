"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "./useAuth";
import { ApprovalStatus } from "@/types";
import { UserRole } from "@/types";

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
const useStudentApprovalGuard = (): boolean => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const isStudent = auth.user?.role === UserRole.STUDENT;
    const isApproved = auth.user?.approvalStatus === ApprovalStatus.APPROVED;
    const isAccountStatusPage = pathname === "/account-status";

    if (isStudent && !isApproved && !isAccountStatusPage) {
      router.push("/account-status");
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, auth.user, pathname, router]);

  return isLoading;
};

export default useStudentApprovalGuard; 