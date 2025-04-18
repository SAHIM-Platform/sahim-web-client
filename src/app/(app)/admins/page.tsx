'use client';

import AdminsListing from "@/components/AdminsListing";
import useSuperAdminRoleGuard from "@/hooks/useSuperAdminRoleGuard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminAdminsPage() {
  const isLoading = useSuperAdminRoleGuard();

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <AdminsListing />
  );
}