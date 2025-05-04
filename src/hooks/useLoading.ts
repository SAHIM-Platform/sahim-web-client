import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";
import useStudentApprovalGuard from "@/hooks/useStudentApprovalGuard";
import useSuperAdminRoleGuard from "@/hooks/useSuperAdminRoleGuard";

/**
 * A hook that provides various loading states related to authentication and role guards.
 * 
 * @returns {Object} An object containing various loading state flags
 * @property {boolean} isAuthLoading - True if authentication is in progress
 * @property {boolean} isAuthLoadingOrRedirecting - True if authentication is loading or redirecting
 * @property {boolean} isStudentGuardLoading - True if student role guard is active
 * @property {boolean} isAdminGuardLoading - True if admin role guard is active
 * @property {boolean} isSuperAdminGuardLoading - True if super admin role guard is active
 */
export function useLoading() {
  const { auth } = useAuth();
  const isRedirecting = useAuthRedirect();
  const isStudentRoleGuardActive = useStudentApprovalGuard();
  const isAdminRoleGuardActive = useAdminRoleGuard();
  const isSuperAdminRoleGuardActive = useSuperAdminRoleGuard();

  const isAuthLoading = auth.loading;
  const isAuthLoadingOrRedirecting = auth.loading || isRedirecting;

  return {
    isAuthLoading,
    isAuthLoadingOrRedirecting,
    isStudentGuardLoading: isAuthLoadingOrRedirecting || isStudentRoleGuardActive,
    isAdminGuardLoading: isAuthLoadingOrRedirecting || isAdminRoleGuardActive,
    isSuperAdminGuardLoading: isAuthLoadingOrRedirecting || isSuperAdminRoleGuardActive,
  };
} 