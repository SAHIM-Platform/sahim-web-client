'use client';

import { useState, useEffect } from "react";
import CategoriesListing from "@/components/app/CategoriesListing";
import { fetchCategories } from "@/services/threadService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesResponse = await fetchCategories();
      if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
          جميع التصنيفات
        </h1>
        <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
          تصفّح جميع تصنيفات المناقشات المتاحة
        </p>
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
