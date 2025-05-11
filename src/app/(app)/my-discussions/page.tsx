'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useCurrentUserInfo } from '@/hooks';

export default function DiscussionsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { username } = useCurrentUserInfo();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(`/${username}`);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return null;
}
