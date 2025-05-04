'use client';

import Container from '@/components/Container';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth, useAuthRedirect } from '@/hooks';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAuth();
  const isLoading = useAuthRedirect();

  if (auth.loading || isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <main className="bg-[url('/login-bg.jpg')] bg-no-repeat bg-fixed bg-cover bg-center min-h-screen overflow-x-hidden">
      <Container>
        <div className='flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8'>
          {children}
        </div>
      </Container>
    </main>
  );
} 