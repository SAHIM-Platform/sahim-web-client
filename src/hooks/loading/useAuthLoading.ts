import {
  useAuth,
  useAuthRedirect,
} from "@/hooks";

/**
 * A hook that provides loading states related to authentication.
 * 
 * @returns {Object} An object containing authentication loading states
 * @returns {boolean} returns.isAuthLoading - Indicates if the authentication process is currently loading
 * @returns {boolean} returns.isAuthLoadingOrRedirecting - Indicates if either authentication is loading or a redirect is in progress
 * 
 * @example
 * ```tsx
 * const { isAuthLoadingOrRedirecting } = useAuthLoading();
 * if (isAuthLoadingOrRedirecting) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */
export function useAuthLoading(): {isAuthLoading: boolean, isAuthLoadingOrRedirecting: boolean} {
  const { auth } = useAuth();
  const isRedirecting = useAuthRedirect();
  const isAuthLoading = auth.loading;
  const isAuthLoadingOrRedirecting = auth.loading || isRedirecting;

  return {
    isAuthLoading,
    isAuthLoadingOrRedirecting,
  };
} 