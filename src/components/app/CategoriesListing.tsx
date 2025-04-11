'use client';

import { categories } from "@/data/mock-api";
import { Hash } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import { fetchCategories } from "@/services/threadService";

interface CategoriesListingProps {

}

function CategoriesListing({ }: CategoriesListingProps) {
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          setCategoriesError("Failed to load categories");
          setCategories([]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategoriesError("Failed to load categories");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await fetchCategories();
    }
  }, []);

  return (
    <div className="space-y-1">
      {isLoadingCategories ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" color="primary" />
        </div>
      ) : categoriesError ? (
        <p className="text-sm text-red-500 px-3 py-2">{categoriesError}</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-500 px-3 py-2">لا توجد تصنيفات متاحة</p>
      ) : (
        categories.map((category) => (
          <div
            key={category.category_id}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          >
            <Hash className="w-4 h-4 text-gray-500" />
            {category.name}
          </div>
        ))
      )}
    </div>
  );
}

export default CategoriesListing;

