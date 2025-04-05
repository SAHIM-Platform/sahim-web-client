'use client';

import { FormData } from '@/types';
import { useState, useEffect, FormEvent } from 'react';
import validateLoginForm from '@/utils/api/login/validateLoginForm';
import ErrorAlert from './ErrorAlert';
import Logo from '../Logo';
import Divider from '../Divider';
import Button from '../Button';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Input from '../Input';
import Link from 'next/link';

interface FormProps {
  formData: FormData;
  onSubmit: (values: Record<string, string>) => void;
  isLoading?: boolean;
  errors?: Record<string, string>;
  setErrors?: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  formType?: 'login' | 'signup';
  formAlertMessage?: string | null;
  validateForm?: (values: Record<string, string>) => Record<string, string>;
}

function Form({
  formData,
  onSubmit,
  isLoading = false,
  errors: externalErrors,
  setErrors: setExternalErrors,
  formType = 'login',
  formAlertMessage,
  validateForm = validateLoginForm
}: FormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const errors = externalErrors || internalErrors;
  const setErrors = setExternalErrors || setInternalErrors;

  // Initialize form values
  useEffect(() => {
    const initialValues = formData.fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: ''
    }), {});
    setValues(initialValues);
  }, [formData.fields]);

  // Handle API errors
  useEffect(() => {
    const apiErrors: Record<string, string> = {};
    formData.fields.forEach(field => {
      if (field.error) {
        apiErrors[field.id] = field.error;
        setTouched(prev => ({ ...prev, [field.id]: true }));
      }
    });

    if (Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors);
    }
  }, [formData.fields, setErrors]);

  const handleChange = (id: string, value: string) => {
    setValues(prev => {
      const newValues = { ...prev, [id]: value };
      return newValues;
    });
    if (touched[id] && errors[id]) {
      const validationErrors = validateForm({ ...values, [id]: value });
      setErrors(validationErrors);
    }
  };

  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    const validationErrors = validateForm(values);
    if (validationErrors[id]) {
      setErrors(prev => ({ ...prev, [id]: validationErrors[id] }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const allTouched = formData.fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: true
    }), {});
    setTouched(allTouched);

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
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

            {formAlertMessage && <ErrorAlert message={formAlertMessage} />}

            <div className="pt-1 sm:pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={Object.keys(errors).length > 0}
                fullWidth
              >
                {formData.submitButton.text}
              </Button>
            </div>

            {formType === 'login' && (
              <p className="text-[13px] sm:text-[14px] lg:text-[15px] text-gray-500 text-center">
                ليس لديك حساب؟{" "}
                <Link href="/signup" className="text-primary font-medium hover:underline hover:underline-offset-4 transition-all">
                  أنشئ حساب
                </Link>
              </p>
            )}
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
}

export default Form;