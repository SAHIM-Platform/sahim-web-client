'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';

export default function DiscussionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/explore');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return null;
}
