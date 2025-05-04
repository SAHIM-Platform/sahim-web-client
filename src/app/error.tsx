'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks';
import Button from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="max-w-sm w-full p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            حدث خطأ ما
          </h2>
          <p className="text-sm text-gray-500">
            {isAuthenticated
              ? "عذراً، حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية."
              : "عذراً، حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو تسجيل الدخول."}
          </p>
        </div>
        <div className="space-y-2">
          <Button
            onClick={reset}
            fullWidth
            variant="primary"
          >
            المحاولة مرة أخرى
          </Button>
          <Button
            href={isAuthenticated ? "/explore" : "/login"}
            fullWidth
            variant="outline"
          >
            {isAuthenticated ? "عُد إلى الصفحة الرئيسية" : "تسجيل الدخول"}
          </Button>
        </div>
      </div>
    </div>
  );
} 