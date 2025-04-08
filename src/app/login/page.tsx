'use client';

import Container from '@/components/Container';
import LoginForm from '@/components/LoginForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import useAuth from '@/hooks/useAuth';
import useAuthRedirect from '@/hooks/UseRedirect';

export default function Home() {
  const { isAuthenticated, auth } = useAuth();

  useAuthRedirect(isAuthenticated);

  if (auth.loading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen overflow-x-hidden">
        <Container>
          <div className='flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8'>
            <LoginForm />
          </div>
        </Container>
      </main>
    );
  }

  return null;
}
