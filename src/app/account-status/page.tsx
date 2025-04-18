"use client";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { ArrowLeft, Info, PartyPopper } from "lucide-react";
import Link from "next/link";
import useStudentGuard from "@/hooks/useStudentGuard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AccountStatusPage() {
  const isLoading = useStudentGuard();

  if (isLoading) {
    return (
      <LoadingSpinner size="xl" color="primary" fullScreen={true} />
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-center flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-auto">
        <Logo />
      </div>

      <div className="flex flex-col gap-8 items-center justify-center w-full">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 min-w-[800px] max-w-full shadow-sm">
          <div className="flex flex-col items-center space-y-4">
            <Info className="text-primary w-10 h-10" />
            <p className="text-gray-500 text-md">حالة الحساب</p>
            <div className="flex gap-2">
              <h1 className="text-xl font-semibold text-gray-800">تم قبول طلب تسجيل حسابك</h1>
              <PartyPopper />
            </div>
          </div>
        </div>
        <Button
          size="lg"
          icon={<ArrowLeft className="w-5 h-5" />}
          iconPosition="end"
          href="/explore"
        >
          المتابعة إلى الصفحة الرئيسية
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-2 mt-auto">
        <p className="text-sm text-gray-600">
          هل واجهتك مشكلة؟{' '}
          <Link href="/support" className="text-primary underline hover:decoration-transparent">
            تواصل مع الدعم الفني
          </Link>
        </p>
      </div>
    </div>
  );
}