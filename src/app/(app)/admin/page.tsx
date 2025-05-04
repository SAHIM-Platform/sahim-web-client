"use client";

import { FrontendRoutes } from '@/data/routes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLoading } from '@/hooks/useLoading';
import LoadingSpinner from '@/components/LoadingSpinner';
import useSuperAdminRoleGuard from '@/hooks/useSuperAdminRoleGuard';

export default function AdminPage() {
  const router = useRouter();
  const { isSuperAdminGuardLoading } = useLoading();
  useSuperAdminRoleGuard();

  useEffect(() => {
    router.push(FrontendRoutes.ADMINS);
  }, [router]);

  if (isSuperAdminGuardLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return null;
}