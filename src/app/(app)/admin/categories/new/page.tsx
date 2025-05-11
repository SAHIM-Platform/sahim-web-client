"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import { createCategory } from "@/services/admin/categoryService";
import toast from "react-hot-toast";
import { logger } from "@/utils/logger";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { FrontendRoutes } from "@/data/routes";
import { useAdminRoleGuard, useAdminGuardLoading } from "@/hooks";
import validateCategoryForm from "@/utils/api/categories/validateCategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();
  
  useAdminRoleGuard();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
  });

  if (useAdminGuardLoading() || isRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    const validationErrors = validateCategoryForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCategory(formData.name.trim());      
      if (result.success) {
        toast.success(RESPONSE_MESSAGES.category.CREATED_SUCCESSFULLY);
        setIsRedirecting(true);
        router.push(FrontendRoutes.CATEGORIES);
      } else {
        setError(result.error?.message || RESPONSE_MESSAGES.category.CREATE_FAILED);
      }
    } catch (error) {
      logger().error("Error creating category:", error);
      setError(RESPONSE_MESSAGES.category.CREATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Run validation on input change
    const validationErrors = validateCategoryForm({ [field]: value });
    setFormErrors(prev => ({
      ...prev,
      [field]: validationErrors[field] || ""
    }));
  };

  const isFormValid = !formErrors.name;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إنشاء تصنيف جديد</h1>
        <p className="mt-2 text-sm text-gray-600">
          أضف تصنيفاً جديداً للمناقشات
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <Input
            label="اسم التصنيف"
            placeholder="اكتب اسم التصنيف"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={(e) => handleChange("name", e.target.value)}
            required
            fullWidth
            error={formErrors.name}
          />
          {error && <ErrorAlert message={error} />}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            loadingText="جاري الإنشاء..."
          >
            إنشاء التصنيف
          </Button>
        </div>
      </form>
    </>
  );
}