"use client";

import { FrontendRoutes } from '@/data/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSuperAdminGuardLoading, useSuperAdminRoleGuard } from '@/hooks';

export default function AdminPage() {
  const router = useRouter();
  useSuperAdminRoleGuard();

  useEffect(() => {
    router.push(FrontendRoutes.ADMINS);
  }, [router]);

  if (useSuperAdminGuardLoading()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return null;
}