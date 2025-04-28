'use client';

import Container from '@/components/Container';
import SignupForm from "@/components/SignupForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";

export default function SignupPage() {
  const { auth } = useAuth();
  const isLoading = useAuthRedirect();

  if (auth.loading || isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen overflow-x-hidden">
      <Container>
        <div className='flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8'>
          <SignupForm />
        </div>
      </Container>
    </main>
  );
}
