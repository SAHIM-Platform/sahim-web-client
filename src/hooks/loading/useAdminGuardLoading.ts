import { useAdminRoleGuard } from "../guards";
import { useAuthLoading } from "./useAuthLoading";

/**
 * A hook that provides loading state for admin role guard checks.
 * Combines authentication loading state with admin role guard state.
 * 
 * @returns {boolean} Indicates if either authentication is loading/redirecting or admin role guard check is active
 * 
 * @example
 * ```tsx
 * const isAdminGuardLoading = useAdminGuardLoading();
 * if (isAdminGuardLoading) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */
export function useAdminGuardLoading(): boolean {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const isAdminRoleGuardActive = useAdminRoleGuard();

  return isAuthLoadingOrRedirecting || isAdminRoleGuardActive;
} 