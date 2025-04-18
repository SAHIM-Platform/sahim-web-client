"use client";

import { useState, FormEvent } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Logo from "./Logo";
import Divider from "./Divider";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building2, GraduationCap as GraduationCap2 } from "lucide-react";
import { departmentLabels, Level } from "@/types";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import validateSignupForm, { SignupFormData } from "@/utils/api/signup/validateSignupForm";
import ErrorAlert from "./Form/ErrorAlert";

const SignupForm = () => {
  const { signup } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
    // Validate form
    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting signup submission...');
      const result = await signup(formData as SignupFormData);

      console.log('Signup result:', result);

      if (!result.success) {
        console.log('Signup failed:', result.error);
        if (result.error?.fields) {
          setErrors(result.error.fields.reduce<Record<string, string>>((acc, field) => ({
            ...acc,
            [field]: result.error?.message || ''
          }), {}));
        }
        setFormError(result.error?.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setFormError("حدث خطأ غير متوقع أثناء إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] flex flex-col justify-center items-center text-right gap-5 sm:gap-8 p-6 sm:p-8 lg:p-10 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-3 sm:space-y-5 text-right w-full">
        <Logo className="mx-auto" />
        <div className="space-y-1.5 sm:space-y-2 text-center">
          <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-800 tracking-tight">إنشاء حساب جديد</h1>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 font-normal break-words">من فضلك، أدخل بياناتك لإنشاء حساب جديد</p>
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="space-y-4 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="الاسم"
                label="الاسم"
                required
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                startIcon={<User className="w-[18px] h-[18px]" />}
              />
              <Input
                type="text"
                placeholder="الرقم الأكاديمي"
                label="الرقم الأكاديمي"
                required
                value={formData.academicNumber || ''}
                onChange={(e) => handleChange('academicNumber', e.target.value)}
                error={errors.academicNumber}
                startIcon={<GraduationCap className="w-[18px] h-[18px]" />}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="اسم المستخدم"
                label="اسم المستخدم"
                required
                value={formData.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                error={errors.username}
                startIcon={<User className="w-[18px] h-[18px]" />}
              />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                label="البريد الإلكتروني"
                required
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                startIcon={<Mail className="w-[18px] h-[18px]" />}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                label="كلمة المرور"
                required
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                startIcon={<Lock className="w-[18px] h-[18px]" />}
                endIcon={
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
                }
              />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                label="تأكيد كلمة المرور"
                required
                value={formData.confirmPassword || ''}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                startIcon={<Lock className="w-[18px] h-[18px]" />}
                endIcon={
                  showConfirmPassword ? (
                    <Eye
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(false);
                      }}
                    />
                  ) : (
                    <EyeOff
                      className="w-[18px] h-[18px]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(true);
                      }}
                    />
                  )
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                options={Object.entries(departmentLabels).map(([value, label]) => ({
                  value,
                  label
                }))}
                placeholder="اختر القسم"
                label="القسم"
                required
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                error={errors.department}
                startIcon={<Building2 className="w-[18px] h-[18px]" />}
              />
              <Select
                options={Object.values(Level)
                  .filter((v): v is number => typeof v === "number")
                  .map((level) => ({
                    value: level.toString(),
                    label: `المستوى ${level}`
                  }))}
                placeholder="اختر المستوى"
                label="المستوى الدراسي"
                required
                value={formData.studyLevel?.toString() || ''}
                onChange={(e) => handleChange('studyLevel', e.target.value)}
                error={errors.studyLevel}
                startIcon={<GraduationCap2 className="w-[18px] h-[18px]" />}
              />
            </div>

            {formError && <ErrorAlert message={formError} />}

            <div className="pt-1 sm:pt-2">
              <Button
                type="submit"
                fullWidth
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading || Object.keys(errors).length > 0}
              >
                إنشاء حساب
              </Button>
            </div>
          </form>

          <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 text-center">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-primary font-medium hover:underline hover:underline-offset-4 transition-all">
              سجل الدخول
            </Link>
          </p>
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
            أنشئ حساب بواسطة جوجل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
