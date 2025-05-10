import { useStudentApprovalGuard } from "@/hooks";
import { useAuthLoading } from "./useAuthLoading";

/**
 * A hook that provides loading state for student approval guard checks.
 * Combines authentication loading state with student approval guard state.
 * 
 * @returns {boolean} Indicates if either authentication is loading/redirecting or student approval guard check is active
 * 
 * @example
 * ```tsx
 * const isStudentGuardLoading = useStudentGuardLoading();
 * if (isStudentGuardLoading) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */
export function useStudentGuardLoading(): boolean {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const isStudentRoleGuardActive = useStudentApprovalGuard();

  return isAuthLoadingOrRedirecting || isStudentRoleGuardActive;
} 