'use client';

import { useState, useEffect } from "react";
import CategoriesListing from "@/components/App/CategoriesListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { PlusCircle } from "lucide-react";
import { logger } from "@/utils/logger";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { isSuperAdminByRole } from "@/utils/role";
import { UserRole } from "@/types";
import { useAuthLoading } from "@/hooks";
import { fetchCategories } from "@/services/thread/categoryService";

export default function CategoriesPage() {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const loadCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const categoriesResponse = await fetchCategories();
      if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      } else {
        setError(RESPONSE_MESSAGES.category.DEFAULT);
      }
    } catch (error) {
      logger().error("Error loading categories:", error);
      setError(RESPONSE_MESSAGES.category.DEFAULT);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">جميع المناقشات</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
            تصفح جميع المناقشات المطروحة
          </p>
        </div>
        {isSuperAdminByRole(UserRole.SUPER_ADMIN) && (
          <Button
            href="admin/categories/new"
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-5 h-5" />}
            className="shadow-sm"
          >
            أضف تصنيف
          </Button>
        )}
      </div>

      <CategoriesListing
        allowManagement
        categories={categories}
        isLoading={isLoading}
        onCategoriesChange={loadCategories}
        error={error}
      />
    </div>
  );
}
