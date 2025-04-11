'use client';

import AdminsListing from "@/components/AdminsListing";
import useSuperAdminRoleGuard from "@/hooks/useSuperAdminRoleGuard";

export default function AdminAdminsPage() {

  useSuperAdminRoleGuard();

  return (
    <AdminsListing />
  );
}