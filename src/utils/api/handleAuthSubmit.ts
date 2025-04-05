import { AuthResult, LoginCredentials } from "@/types/auth";
import { handleAuthError } from "./handleAuthError";

export interface AuthSubmitConfig {
  values: Record<string, string>;
  authFunction: (data: LoginCredentials) => Promise<AuthResult>;
  setFieldErrors: (errors: Record<string, string>) => void;
  setGeneralError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  router: { push: (path: string) => void };
  validateFunction?: (values: Record<string, string>) => Record<string, string>;
  redirectPath?: string;
}

async function handleAuthSubmit(config: AuthSubmitConfig): Promise<void> {
  const {
    values,
    authFunction,
    setFieldErrors,
    setGeneralError,
    setIsLoading,
    router,
    validateFunction,
    redirectPath = "/explore"
  } = config;

  try {
    setFieldErrors({});
    setGeneralError(null);

    if (validateFunction) {
      const validationErrors = validateFunction(values);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        return;
      }
    }

    setIsLoading(true);

    const authData = {
      email: values.email?.trim(),
      password: values.password?.trim()
    };

    console.log('Attempting login with:', authData);
    const response = await authFunction(authData);
    console.log('Login response:', { success: response.success, hasError: !!response.error });

    if (response.success) {
      router.push(redirectPath);
      return;
    }

    handleAuthError(response.error, setGeneralError, setFieldErrors);
  } catch (error) {
    console.error('Login error details:', error);
    setGeneralError(
      `حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة.`
    );
  } finally {
    setIsLoading(false);
  }
}

export default handleAuthSubmit;