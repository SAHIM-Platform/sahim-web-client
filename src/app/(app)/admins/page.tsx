'use client';

import AdminsListing from "@/components/AdminsListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSuperAdminRoleGuard } from "@/hooks";

export default function AdminAdminsPage() {
  const isLoading = useSuperAdminRoleGuard();

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <AdminsListing />
  );
}