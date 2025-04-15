'use client';

import useAuth from '@/hooks/useAuth';
import Button from '@/components/Button';

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="max-w-sm w-full p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            الصفحة غير موجودة
          </h2>
          <p className="text-sm text-gray-500">
            {isAuthenticated ?
              "عذراً، الصفحة التي تبحث عنها غير موجودة"
              :
              "عذراً، الصفحة التي تبحث عنها غير موجودة، جرّب أن تقوم بتسجيل الدخول لحسابك."
            }
          </p>
        </div>
        <Button
          href={isAuthenticated ? "/explore" : "/login"}
          fullWidth
          variant="primary"
        >
          {isAuthenticated ? "عُد إلى الصفحة الرئيسية" : "تسجيل الدخول"}
        </Button>
      </div>
    </div>
  );
} 