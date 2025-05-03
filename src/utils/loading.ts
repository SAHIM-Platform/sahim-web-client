import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";
import useSuperAdminRoleGuard from "@/hooks/useSuperAdminRoleGuard";

/**
 * Determines if the authentication process is currently in progress.
 * 
 * @returns {boolean} True if authentication is in progress, false otherwise.
 */
export function isAuthLoading(): boolean {
  const { auth } = useAuth();

  return auth.loading;
}

/**
 * Determines if the authentication process is currently in progress or if a redirect is underway.
 * 
 * @returns {boolean} True if authentication is in progress or a redirect is underway, false otherwise.
 */
export function isAuthLoadingOrRedirecting(): boolean {
  const { auth } = useAuth();
  const isRedirecting = useAuthRedirect();

  return auth.loading || isRedirecting;
}

/**
 * Determines if the authentication process is currently in progress, or if a redirect is underway, or if an admin role guard is active.
 * 
 * @returns {boolean} True if authentication is in progress, or a redirect is underway, or an admin role guard is active, false otherwise.
 */
export function isAuthOrAdminRoleGuardLoading(): boolean {
  const isRedirectingOrLoading = isAuthLoadingOrRedirecting();
  const isAdminRoleGuardActive = useAdminRoleGuard();

  return isRedirectingOrLoading || isAdminRoleGuardActive;
}

/**
 * Determines if the authentication process is currently in progress, or if a redirect is underway, or if a super admin role guard is active.
 * 
 * @returns {boolean} True if authentication is in progress, or a redirect is underway, or a super admin role guard is active, false otherwise.
 */
export function isAuthOrSuperAdminRoleGuardLoading(): boolean {
  const isRedirectingOrLoading = isAuthLoadingOrRedirecting();
  const isSuperAdminRoleGuardActive = useSuperAdminRoleGuard();

  return isRedirectingOrLoading || isSuperAdminRoleGuardActive;
}

