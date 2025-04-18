"use client";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { ArrowLeft, Info, PartyPopper, Clock, AlertCircle, RefreshCw, MessageCircle, LogOut } from "lucide-react";
import Link from "next/link";
import useStudentGuard from "@/hooks/useStudentGuard";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { ApprovalStatus } from "@/types";
import useLogout from "@/hooks/useLogout";

export default function AccountStatusPage() {
  const isLoading = useStudentGuard();
  const { auth } = useAuth();
  const { logout, error: logoutError, isLoading: isLoggingOut } = useLogout();
  const router = useRouter();

  if (isLoading) {
    return (
      <LoadingSpinner size="xl" color="primary" fullScreen={true} />
    );
  }

  const isApproved = auth.user?.approvalStatus === ApprovalStatus.APPROVED;
  const isPending = auth.user?.approvalStatus === ApprovalStatus.PENDING;
  const isRejected = auth.user?.approvalStatus === ApprovalStatus.REJECTED;

  const handleRefresh = () => {
    router.refresh();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Logo widthSize="sm" />
              <Link href="/" className="text-lg font-bold text-secondary">ساهم</Link>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                icon={<LogOut className="w-4 h-4" />}
                iconPosition="end"
              >
                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Container narrow>
          <div className="flex flex-col gap-8 items-center justify-center w-full">
            <div className={`rounded-xl border p-8 w-full shadow-sm ${isApproved ? "border-blue-200 bg-blue-50" :
                isPending ? "border-amber-200 bg-amber-50" :
                  "border-red-200 bg-red-50"
              }`}>
              <div className="flex flex-col items-center space-y-4">
                {isApproved ? (
                  <>
                    <Info className="text-primary w-10 h-10" />
                    <p className="text-gray-500 text-md">حالة الحساب</p>
                    <div className="flex gap-2">
                      <h1 className="text-xl font-semibold text-gray-800">تم قبول طلب تسجيل حسابك</h1>
                      <PartyPopper />
                    </div>
                  </>
                ) : isPending ? (
                  <>
                    <Clock className="text-amber-500 w-10 h-10" />
                    <p className="text-gray-500 text-md">حالة الحساب</p>
                    <div className="flex gap-2">
                      <h1 className="text-xl font-semibold text-gray-800">طلب تسجيل حسابك قيد المراجعة</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                      قد تستغرق عملية التحقق بعض الوقت. يمكنك الضغط على زر التحديث للتحقق من حالة طلبك، أو العودة لاحقاً.
                      <br />
                      للاستفسار عن تفاصيل عملية التحقق، يرجى التواصل مع الدعم الفني.
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="text-red-500 w-10 h-10" />
                    <p className="text-gray-500 text-md">حالة الحساب</p>
                    <div className="flex gap-2">
                      <h1 className="text-xl font-semibold text-gray-800">تم رفض طلب تسجيل حسابك</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                      يمكنك الضغط على زر التحديث للتحقق من حالة طلبك، أو العودة لاحقاً.
                      <br />
                      للاستفسار عن أسباب الرفض وتفاصيل عملية التحقق، يرجى التواصل مع الدعم الفني.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
              {!isApproved && (
                <Button
                  size="lg"
                  variant="outline"
                  icon={<RefreshCw className="w-5 h-5" />}
                  iconPosition="end"
                  onClick={handleRefresh}
                  className="w-full md:w-auto"
                >
                  تحديث حالة الحساب
                </Button>
              )}

              {isApproved ? (
                <Button
                  size="lg"
                  icon={<ArrowLeft className="w-5 h-5" />}
                  iconPosition="end"
                  href="/explore"
                  className="w-full md:w-auto"
                >
                  المتابعة إلى الصفحة الرئيسية
                </Button>
              ) : (
                <Button
                  size="lg"
                  icon={<MessageCircle className="w-5 h-5" />}
                  iconPosition="end"
                  href="/support"
                  className="w-full md:w-auto"
                >
                  التواصل مع الدعم الفني
                </Button>
              )}
            </div>
          </div>
        </Container>

        <div className="flex flex-col items-center space-y-2 mt-8">
          <p className="text-sm text-gray-600">
            هل واجهتك مشكلة؟{' '}
            <Link href="/support" className="text-primary underline hover:decoration-transparent">
              تواصل مع الدعم الفني
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}