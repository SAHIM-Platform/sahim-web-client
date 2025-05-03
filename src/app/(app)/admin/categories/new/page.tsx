"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import { createCategory } from "@/services/admin/categoryService";
import toast from "react-hot-toast";
import { isAuthOrAdminRoleGuardLoading } from "@/utils/loading";
import { logger } from "@/utils/logger";
import ERROR_MESSAGES from "@/utils/constants/ERROR_MESSAGES";
import { FrontendRoutes } from "@/data/routes";

export default function NewCategoryPage() {
  const router = useRouter();
  
  useAdminRoleGuard();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
  });

  if (isAuthOrAdminRoleGuardLoading()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const result = await createCategory(formData.name.trim());

      if (result.success) {
        toast.success(ERROR_MESSAGES.category.CREATED_SUCCESSFULLY);
        router.push(FrontendRoutes.CATEGORIES);
      } else {
        setError(result.error?.message || ERROR_MESSAGES.category.CREATE_FAILED);
      }
    } catch (error) {
      logger().error("Error creating category:", error);
      setError(ERROR_MESSAGES.category.CREATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = formData.name.trim() !== "";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إنشاء تصنيف جديد</h1>
        <p className="mt-2 text-sm text-gray-600">
          أضف تصنيفاً جديداً للمناقشات
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          label="اسم التصنيف"
          placeholder="اكتب اسم التصنيف"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          fullWidth
        />

        {error && <ErrorAlert message={error} />}

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