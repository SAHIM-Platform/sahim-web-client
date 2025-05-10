import { useSuperAdminRoleGuard } from "../guards";
import { useAuthLoading } from "./useAuthLoading";

/**
 * A hook that provides loading state for super admin role guard checks.
 * Combines authentication loading state with super admin role guard state.
 * 
 * @returns {boolean} Indicates if either authentication is loading/redirecting or super admin role guard check is active
 * 
 * @example
 * ```tsx
 * const isSuperAdminGuardLoading = useSuperAdminGuardLoading();
 * if (isSuperAdminGuardLoading) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */
export function useSuperAdminGuardLoading(): boolean {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const isSuperAdminRoleGuardActive = useSuperAdminRoleGuard();
  return isSuperAdminRoleGuardActive || isAuthLoadingOrRedirecting;
}