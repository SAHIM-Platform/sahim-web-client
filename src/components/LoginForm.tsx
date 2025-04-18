"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import validateLoginForm from '@/utils/api/login/validateLoginForm';
import ErrorAlert from './Form/ErrorAlert';
import Logo from './Logo';
import Divider from './Divider';
import Button from './Button';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import Input from './Input';
import Link from 'next/link';
import { FormData } from '@/types';

const formData: FormData = {
  title: {
    text: "مرحباً بك مجدداً في ساهم"
  },
  description: "من فضلك، أدخل بيانات حسابك لتسجيل الدخول",
  fields: [
    {
      id: "email",
      label: "البريد الإلكتروني",
      type: "email",
      required: true,
      placeholder: "أدخل بريدك الإلكتروني",
      autoComplete: "email"
    },
    {
      id: "password",
      label: "كلمة المرور",
      type: "password",
      required: true,
      placeholder: "أدخل كلمة المرور",
      autoComplete: "current-password"
    }
  ],
  submitButton: {
    text: "تسجيل الدخول"
  }
};

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form values
  useEffect(() => {
    const initialValues = formData.fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: ''
    }), {});
    setValues(initialValues);
  }, [formData.fields]);

  const handleChange = (id: string, value: string) => {
    setValues(prev => {
      const newValues = { ...prev, [id]: value };
      return newValues;
    });

    // Clear error for the changed field
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Validate the field
    const validationErrors = validateLoginForm({ ...values, [id]: value });
    if (validationErrors[id]) {
      setErrors(prev => ({ ...prev, [id]: validationErrors[id] }));
    }
  };

  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    const validationErrors = validateLoginForm(values);
    if (validationErrors[id]) {
      setErrors(prev => ({ ...prev, [id]: validationErrors[id] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    const validationErrors = validateLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting login submission...');
      const result = await login({
        email: values.email,
        password: values.password
      });

      console.log('Login result:', result);

      if (!result.success) {
        console.log('Login failed:', result.error);
        if (result.error?.fields) {
          setErrors(result.error.fields.reduce<Record<string, string>>((acc, field) => ({
            ...acc,
            [field]: result.error?.message || ''
          }), {}));
        }
        setFormError(result.error?.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldIcon = (fieldId: string) => {
    switch (fieldId) {
      case 'email':
        return <Mail className="w-[18px] h-[18px]" />;
      case 'password':
        return <Lock className="w-[18px] h-[18px]" />;
      default:
        return undefined;
    }
  };

  return (
    <div className="w-full max-w-[420px] flex flex-col justify-center items-center text-right gap-5 sm:gap-8 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-3 sm:space-y-5 text-right w-full">
        <Logo className="mx-auto" />
        <div className="space-y-1.5 sm:space-y-2 text-center">
          <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-800 tracking-tight">{formData.title.text}</h1>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 font-normal break-words">{formData.description}</p>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-4 w-full">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-3 w-full">
            {formData.fields.map((field) => (
              <Input
                key={field.id}
                id={field.id}
                type={field.id === 'password' ? (showPassword ? "text" : "password") : field.type}
                placeholder={field.placeholder}
                label={field.label}
                value={values[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={() => handleBlur(field.id)}
                error={touched[field.id] ? errors[field.id] : undefined}
                required={field.required}
                startIcon={getFieldIcon(field.id)}
                endIcon={field.id === 'password' ? (
                  showPassword ? (
                    <Eye
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(false);
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(true);
                      }}
                    />
                  )
                ) : undefined}
              />
            ))}

            {formError && <ErrorAlert message={formError} />}

            <div className="pt-1 sm:pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading || Object.keys(errors).length > 0}
                fullWidth
                icon={<ChevronLeft className="w-4 h-4" />}
                iconPosition="end"
              >
                {formData.submitButton.text}
              </Button>
            </div>

            <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 text-center">
              ليس لديك حساب؟{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline hover:underline-offset-4 transition-all">
                أنشئ حساب
              </Link>
            </p>
          </form>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <Divider />
          <Button variant="outline" fullWidth>
            <Image
              src="/icons8-google.svg"
              className="w-4 h-4 sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5 inline-block me-2 opacity-80"
              alt="Google Icon"
              width={20}
              height={20}
            />
            سجل الدخول بواسطة جوجل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;