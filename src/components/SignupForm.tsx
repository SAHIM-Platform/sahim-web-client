"use client";

import { useState, FormEvent } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Logo from "./Logo";
import Divider from "./Divider";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building2, GraduationCap as GraduationCap2, ChevronLeft, ChevronRight, Check, CheckCircle, UserCheck } from "lucide-react";
import { departmentLabels, Level } from "@/types";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import validateSignupForm, { SignupFormData } from "@/utils/api/signup/validateSignupForm";
import ErrorAlert from "./Form/ErrorAlert";

const steps = [
  {
    title: "المعلومات الشخصية",
    description: "أدخل معلوماتك الشخصية الأساسية",
    fields: ['name', 'username', 'email']
  },
  {
    title: "كلمة المرور",
    description: "قم بإنشاء كلمة مرور آمنة",
    fields: ['password', 'confirmPassword']
  },
  {
    title: "المعلومات الأكاديمية",
    description: "أدخل معلوماتك الأكاديمية",
    fields: ['academicNumber', 'department', 'studyLevel']
  }
];

const SignupForm = () => {
  const { signup } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for the changed field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate the current step fields
    const currentFields = steps[currentStep].fields;
    const validationErrors = validateSignupForm({ ...formData, [field]: value });
    const stepErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([key]) => currentFields.includes(key))
    );

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
    }
  };

  const validateCurrentStep = () => {
    const currentFields = steps[currentStep].fields;
    const validationErrors = validateSignupForm(formData);
    const stepErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([key]) => currentFields.includes(key))
    );

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
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
        );
      case 1:
        return (
          <div className="space-y-4">
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
        );
      case 2:
        return (
          <div className="space-y-4">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[520px] flex flex-col justify-center items-center text-right gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 rounded-lg sm:rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/20 box-border" dir="rtl">
      <div className="space-y-4 sm:space-y-5 text-right w-full">
        <Logo className="mx-auto" />
        <div className="space-y-2 sm:space-y-3 text-center">
          <h1 className="font-semibold text-xl sm:text-2xl lg:text-3xl text-gray-800 tracking-tight">إنشاء حساب جديد</h1>
          <p className="text-sm sm:text-base text-gray-500 font-normal break-words">{steps[currentStep].description}</p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'} transition-colors duration-200`}>
                  {index + 1}
                </div>
                <span className={`text-xs mt-2 ${index <= currentStep ? 'text-primary font-medium' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-gray-100 rounded-full mt-4">
            <div 
              className="absolute top-0 right-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 w-full">
          <div className="space-y-5 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
              {renderStepContent()}

              {formError && <ErrorAlert message={formError} />}

              <div className="flex gap-3 pt-2">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={handlePrevious}
                    disabled={isLoading}
                    icon={<ChevronRight className="w-4 h-4" />}
                    iconPosition="start"
                  >
                    السابق
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={handleNext}
                    disabled={isLoading || Object.keys(errors).length > 0}
                    icon={<ChevronLeft className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                    disabled={isLoading || Object.keys(errors).length > 0}
                    icon={<UserCheck className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    إنشاء حساب
                  </Button>
                )}
              </div>
            </form>

            <p className="text-sm sm:text-base text-gray-500 text-center">
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
    </div>
  );
};

export default SignupForm;
