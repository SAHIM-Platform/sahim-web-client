"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorAlert from "@/components/Form/ErrorAlert";
import { Eye, EyeOff, Lock } from "lucide-react";
import validateCreateAdminForm, { AdminFormData } from "@/utils/api/admin/validateCreateAdminForm";
import createAdminService from "@/services/admin/createAdminService";
import { logger } from "@/utils/logger";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { FrontendRoutes } from "@/data/routes";
import { clearFieldError } from "@/utils/formUtils";

function NewAdminForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<AdminFormData>>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);
    
    // Validate form
    const validationErrors = validateCreateAdminForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      logger().info('Starting admin creation submission...');
      const result = await createAdminService(formData as AdminFormData);

      logger().info('Admin creation result:', result);

      if (result.success) {
        logger().info('Admin creation successful, redirecting...');
        router.push(FrontendRoutes.ADMINS);
      } else {
        logger().error('Admin creation failed:', result.error);
        setError(result.error?.message || RESPONSE_MESSAGES.admin.CREATION_ERROR);
      }
    } catch (error) {
      logger().error("Admin creation error:", error);
      setError(RESPONSE_MESSAGES.admin.CREATION_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof AdminFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear field error when user types
    if (fieldErrors[field]) {
      setFieldErrors(prev => clearFieldError(prev, field));
    }
  };

  const areAllRequiredFieldsFilled = 
    formData.name && 
    formData.username && 
    formData.email && 
    formData.password && 
    formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="الاسم"
        placeholder="اكتب اسم المشرف"
        value={formData.name || ''}
        onChange={(e) => handleChange("name", e.target.value)}
        required
        fullWidth
        error={fieldErrors.name}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="اسم المستخدم"
          placeholder="اكتب اسم المستخدم"
          value={formData.username || ''}
          onChange={(e) => handleChange("username", e.target.value)}
          required
          fullWidth
          error={fieldErrors.username}
        />
        <Input
          label="البريد الإلكتروني"
          placeholder="اكتب البريد الإلكتروني"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleChange("email", e.target.value)}
          required
          fullWidth
          error={fieldErrors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="كلمة المرور"
          placeholder="اكتب كلمة المرور"
          type={showPassword ? "text" : "password"}
          value={formData.password || ''}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          fullWidth
          error={fieldErrors.password}
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
          label="تأكيد كلمة المرور"
          placeholder="أعد كتابة كلمة المرور"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword || ''}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          required
          fullWidth
          error={fieldErrors.confirmPassword}
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

      {error && <ErrorAlert message={error} />}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!areAllRequiredFieldsFilled || isSubmitting}
          isLoading={isSubmitting}
          loadingText="جاري الإنشاء..."
        >
          إنشاء حساب المشرف
        </Button>
      </div>
    </form>
  );
}

export default NewAdminForm;