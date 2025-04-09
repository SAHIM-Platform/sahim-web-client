"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";

export default function NewCategoryPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const isAdmin = true;
  const isSuperAdmin = true;
  
  // Apply admin role guard
  useAdminRoleGuard(isAdmin, isSuperAdmin);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
  });

  if (auth.loading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // This is just a placeholder for the API call
    // No actual API integration in this task
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to categories list page after successful creation
      router.push("/admin/categories");
    } catch (error: any) {
      setError("حدث خطأ أثناء إنشاء التصنيف. يرجى المحاولة مرة أخرى.");
      console.error("Error creating category:", error);
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