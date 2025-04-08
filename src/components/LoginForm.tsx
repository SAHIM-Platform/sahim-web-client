"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Form from "./Form/Form";
import handleLoginSubmit from "@/utils/api/login/handleLoginSubmit";
import { FormData } from "@/types";

const loginFormData: FormData = {
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  return (
    <Form
      formData={loginFormData}
      onSubmit={(values) => handleLoginSubmit({
        values,
        login,
        setFieldErrors,
        setGeneralError,
        setIsLoading,
        router,
      })}
      isLoading={isLoading}
      errors={fieldErrors}
      setErrors={setFieldErrors}
      formType="login"
      formAlertMessage={generalError}
    />
  );
};

export default LoginForm;