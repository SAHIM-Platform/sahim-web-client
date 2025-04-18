'use client';

import { useState, useEffect } from "react";
import CategoriesListing from "@/components/app/CategoriesListing";
import { fetchCategories } from "@/services/threadService";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";
import Button from "@/components/Button";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { auth } = useAuth();
  const isLoadingAuth = useAuthRedirect();
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesResponse = await fetchCategories();
      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      } else {
        toast.error('حدث خطأ أثناء تحميل التصنيفات. يرجى المحاولة مرة أخرى');
      }
    } catch {
      toast.error('حدث خطأ أثناء تحميل التصنيفات. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (auth.loading || isLoadingAuth) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  const isSuperAdmin = auth.user?.role === 'SUPER_ADMIN';

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">جميع المناقشات</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
            تصفح جميع المناقشات المطروحة
          </p>
        </div>
        {isSuperAdmin && (
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
      />
    </div>
  );
}
