'use client';

import SignupForm from "@/components/Auth/SignupForm";
import AuthCard from '@/components/app/AuthCard';

export default function SignupPage() {
  return (
    <AuthCard 
      title="إنشاء حساب جديد"
      description="قم بإنشاء حساب جديد للوصول إلى المنصة"
    >
      <SignupForm />
    </AuthCard>
  );
}
