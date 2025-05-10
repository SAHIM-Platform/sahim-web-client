"use client";

import NewAdminForm from "@/components/App/Form/NewAdminForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSuperAdminGuardLoading, useSuperAdminRoleGuard } from "@/hooks";

export default function NewAdminPage() {
  useSuperAdminRoleGuard();

  if (useSuperAdminGuardLoading()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب مشرف جديد</h1>
        <p className="mt-2 text-sm text-gray-600">
          أضف مشرفاً جديداً للنظام
        </p>
      </div>

      <NewAdminForm />
    </>
  );
} 