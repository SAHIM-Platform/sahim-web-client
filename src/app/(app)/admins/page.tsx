'use client';

import AdminsListing from "@/components/AdminsListing";
import useSuperAdminRoleGuard from "@/hooks/useSuperAdminRoleGuard";

export default function AdminAdminsPage() {
  const userRole = "super_admin"; // for testing purposes

  useSuperAdminRoleGuard(userRole);

  return (
    <AdminsListing />
  );
}