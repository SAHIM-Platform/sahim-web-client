'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from '@/components/app/AuthCard';
import CompleteSignupForm from '@/components/Auth/CompleteSignupForm';

interface UserParams {
  email: string;
  username: string;
  name: string;
  picture?: string;
}

export default function CompleteSignupPage() {
  const router = useRouter();
  const [userParams, setUserParams] = useState<UserParams | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('email') && searchParams.has('username')) {
      setUserParams({
        email: searchParams.get('email')!,
        username: searchParams.get('username')!,
        name: searchParams.get('name')!,
        picture: searchParams.get('picture') || undefined
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!userParams) {
    return null;
  }

  return (
    <AuthCard 
      title="إكمال معلومات الحساب"
      description="أدخل معلوماتك الأكاديمية لإكمال عملية التسجيل"
    >
      <CompleteSignupForm userParams={userParams} />
    </AuthCard>
  );
} 