import  useAuth  from "@/hooks/useAuth";

export const useGoogleLogin = () => {
  const { setAuth } = useAuth();

  const handleGoogleSubmit = () => {
    // Clear any existing auth state
    setAuth({
        accessToken: undefined,
        user: undefined,
        loading: true
        }
    );
    // Start Google auth flow
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
  };

  return { handleGoogleSubmit };
};