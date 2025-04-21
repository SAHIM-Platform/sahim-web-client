"use client";

import useAdminRoleGuard from '@/hooks/useAdminRoleGuard';

export default function AdminPage() {
  useAdminRoleGuard();

  return (
    <div>
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">لوحة التحكم</h1>
      <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
        قريباً...
      </p>
    </div>
  );
} 