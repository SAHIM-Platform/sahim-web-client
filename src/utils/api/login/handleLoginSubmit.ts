import { AuthError, LoginCredentials } from '@/types/api/auth';
import validateLoginForm from './validateLoginForm';
import handleAuthSubmit from '../handleAuthSubmit';

interface LoginParams {
  values: Record<string, string>;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: AuthError }>;
  setFieldErrors: (errors: Record<string, string>) => void;
  setGeneralError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  router: { push: (path: string) => void };
}

/**
 * Handles the login form submission
 * @param params - Login parameters
 * @returns A promise that resolves when the login process is complete
 */
async function handleLoginSubmit({
  values,
  login,
  setFieldErrors,
  setGeneralError,
  setIsLoading,
  router,
}: LoginParams): Promise<void> {
  handleAuthSubmit({
    values,
    authFunction: login,
    setFieldErrors,
    setGeneralError,
    setIsLoading,
    router,
    validateFunction: validateLoginForm,
    redirectPath: '/explore',
  });
}

export default handleLoginSubmit;
