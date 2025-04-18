'use client';

import { Hash, Edit, Trash2, Check, X } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Button from "../Button";
import Input from "../Input";
import { updateCategory, deleteCategory } from "@/services/admin/categoryService";
import { toast } from "react-hot-toast";
import ConfirmModal from "../Modal/ConfirmModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const isSuperAdmin = auth.user?.role === 'SUPER_ADMIN';
  const showManagementIcons = allowManagement && isSuperAdmin;

  const handleEditClick = (categoryId: number, currentName: string) => {
    setEditingCategory(categoryId);
    setEditValue(currentName);
  };

  const handleSaveEdit = async (categoryId: number) => {
    if (!editValue.trim()) {
      toast.error("لا يمكن أن يكون اسم التصنيف فارغاً");
      return;
    }

    try {
      const result = await updateCategory(categoryId, editValue.trim());
      
      if (result.success) {
        await onCategoriesChange(); 
        toast.success("تم تحديث التصنيف بنجاح");
      } else {
        toast.error(result.error?.message || "فشل في تحديث التصنيف");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث التصنيف");
    } finally {
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(categoryToDelete);
    try {
      const result = await deleteCategory(categoryToDelete);
      
      if (result.success) {
        await onCategoriesChange();
        toast.success("تم حذف التصنيف بنجاح");
      } else {
        toast.error(result.error?.message || "فشل في حذف التصنيف");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف التصنيف");
    } finally {
      setIsDeleting(null);
      setCategoryToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
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
                  placeholder="أدخل اسم التصنيف"
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف التصنيف"
        message="هل أنت متأكد من رغبتك في حذف هذا التصنيف؟"
        confirmText="حذف"
        cancelText="إلغاء"
        confirmButtonVariant="danger"
        isLoading={isDeleting !== null}
      />
    </div>
  );
}

export default CategoriesListing;
