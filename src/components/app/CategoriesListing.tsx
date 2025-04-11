'use client';

import { Hash, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useState, useEffect } from "react";
import { fetchCategories } from "@/services/threadService";
import useAuth from "@/hooks/useAuth";
import Button from "../Button";

interface CategoriesListingProps {
  allowManagement?: boolean;
}

function CategoriesListing({ allowManagement = false }: CategoriesListingProps) {
  const { auth } = useAuth();
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const isSuperAdmin = auth.user?.role === 'SUPER_ADMIN';
  const showManagementIcons = allowManagement && isSuperAdmin;

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
            className="flex items-center justify-start gap-8 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 group"
          >
            <Hash className="w-4 h-4 text-gray-500" />
            <span>{category.name}</span>

            {showManagementIcons && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100 rounded-full"
                  icon={<Edit className="w-4 h-4 text-gray-500" />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-gray-100 rounded-full"
                  icon={<Trash2 className="w-4 h-4 text-red-500" />}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CategoriesListing;

