"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAdminRoleGuard from "@/hooks/useAdminRoleGuard";
import { createCategory } from "@/services/adminService";
import toast from "react-hot-toast";

export default function NewCategoryPage() {
  const router = useRouter();
  const { auth } = useAuth();
  
  // Apply admin role guard
  useAdminRoleGuard('admin');
  
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
    
    try {
      await createCategory(formData.name);
      setFormData({ name: "" });
      
      toast.success("تم إنشاء التصنيف بنجاح!");
      // Redirect to categories list page after successful creation
      router.push("/admin/categories");
    } catch (error: any) {
      setError(error.message);  
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