import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";

/**
 * Checks if the authentication process is currently loading.
 * 
 * @returns {boolean} True if authentication is loading, false otherwise.
 */
export function checkAuthLoading(): boolean {
  const { auth } = useAuth();

  return auth.loading;
}

/**
 * Checks if the authentication process is currently loading or if a redirect is in progress.
 * 
 * @returns {boolean} True if authentication is loading or a redirect is in progress, false otherwise.
 */
export function checkAuthLoadingWithRedirect(): boolean {
  const { auth } = useAuth();
  const isLoading = useAuthRedirect();

  return auth.loading || isLoading;
}