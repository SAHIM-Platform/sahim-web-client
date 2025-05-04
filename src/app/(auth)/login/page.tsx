'use client';

import LoginForm from '@/components/Auth/LoginForm';
import AuthCard from '@/components/App/AuthCard';
import { FormDataHeading } from '@/types';

const formData: FormDataHeading = {
  title: {
    text: "مرحباً بك مجدداً في ساهم"
  },
  description: "من فضلك، أدخل بيانات حسابك لتسجيل الدخول"
};

export default function LoginPage() {
  return (
    <AuthCard 
      title={formData.title.text}
      description={formData.description}
    >
      <LoginForm />
    </AuthCard>
  );
}
