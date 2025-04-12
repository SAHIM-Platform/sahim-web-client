'use client';

import { Hash, Edit, Trash2, Check, X } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Button from "../Button";
import Input from "../Input";
import { updateCategory, deleteCategory } from "@/services/admin/categoryService";
import { toast } from "react-hot-toast";

interface CategoriesListingProps {
  allowManagement?: boolean;
  categories: { category_id: number; name: string; }[];
  isLoading: boolean;
  onCategoriesChange: () => Promise<void>;
}

function CategoriesListing({ 
  allowManagement = false,
  categories,
  isLoading,
  onCategoriesChange
}: CategoriesListingProps) {
  const { auth } = useAuth();
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const isSuperAdmin = auth.user?.role === 'SUPER_ADMIN';
  const showManagementIcons = allowManagement && isSuperAdmin;

  const handleEditClick = (categoryId: number, currentName: string) => {
    setEditingCategory(categoryId);
    setEditValue(currentName);
  };

  const handleSaveEdit = async (categoryId: number) => {
    if (!editValue.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const result = await updateCategory(categoryId, editValue.trim());
      
      if (result.success) {
        await onCategoriesChange();
        toast.success("Category updated successfully");
      } else {
        toast.error(result.error?.message || "Failed to update category");
      }
    } catch (error) {
      toast.error("An error occurred while updating the category");
    } finally {
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleDeleteClick = async (categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsDeleting(categoryId);
    try {
      const result = await deleteCategory(categoryId);
      
      if (result.success) {
        await onCategoriesChange();
        toast.success("Category deleted successfully");
      } else {
        toast.error(result.error?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the category");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-1">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" color="primary" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-500 px-3 py-2">لا توجد تصنيفات متاحة</p>
      ) : (
        categories.map((category) => (
          <div
            key={category.category_id}
            className="flex items-center justify-start gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 group"
          >
            <Hash className="w-4 h-4 text-gray-500" />
            
            {editingCategory === category.category_id ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  className=""
                  icon={<Check className="w-4 h-4 text-white" />}
                  onClick={() => handleSaveEdit(category.category_id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-red-50"
                  icon={<X className="w-4 h-4 text-red-500" />}
                  onClick={handleCancelEdit}
                />
              </div>
            ) : (
              <>
                <span className="flex-1">{category.name}</span>

                {showManagementIcons && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 rounded-full"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => handleEditClick(category.category_id, category.name)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 hover:bg-red-50 rounded-full"
                      icon={<Trash2 className="w-4 h-4 text-red-500" />}
                      onClick={() => handleDeleteClick(category.category_id)}
                      disabled={isDeleting === category.category_id}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default CategoriesListing;
