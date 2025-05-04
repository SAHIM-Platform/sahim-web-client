import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import { Thread } from "@/types";
import ThumbnailPreview from "@/components/App/ThumbnailPreview";
import { useImageValidation } from "@/hooks";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import ErrorAlert from "@/components/Form/ErrorAlert";
import Modal from "@/components/Modal/Modal";
import { X } from "lucide-react";
import { fetchCategories, updateThread } from "@/services/threadService";
import validateThreadForm from "@/utils/api/thread/validateThreadForm";
import LoadingSpinner from "../LoadingSpinner";

interface EditThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: Thread;
  onSuccess?: (updatedThread: Thread) => void;
}

export default function EditThreadModal({ isOpen, onClose, thread, onSuccess }: EditThreadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    thumbnailUrl: "",
  });
  const { isImageValid, isImageLoading } = useImageValidation(formData.thumbnailUrl);

  // Initialize form data when thread prop changes
  useEffect(() => {
    if (thread) {
      setFormData({
        title: thread.title || "",
        category: thread.category?.category_id?.toString() || "",
        content: thread.content || "",
        thumbnailUrl: thread.thumbnail_url || "",
      });
    }
  }, [thread]);

  // Fetch categories when modal opens
  useEffect(() => {
    const loadCategories = async () => {
      if (isOpen) {
        try {
          setIsLoadingCategories(true);
          const response = await fetchCategories();
          if (response.data && Array.isArray(response.data)) {
            setCategories(response.data);
          } else {
            setError(RESPONSE_MESSAGES.thread.DEFAULT);
            setCategories([]);
          }
        } catch {
          setError(RESPONSE_MESSAGES.thread.DEFAULT);
          setCategories([]);
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate the changed field
    const errors = validateThreadForm({
      ...formData,
      [field]: value,
      category_id: field === 'category' ? value : formData.category,
      thumbnail_url: field === 'thumbnailUrl' ? value : formData.thumbnailUrl
    });

    // Only update the validation error for the changed field
    setValidationErrors((prev) => ({
      ...prev,
      [field === 'category' ? 'category_id' : field === 'thumbnailUrl' ? 'thumbnail_url' : field]: errors[field === 'category' ? 'category_id' : field === 'thumbnailUrl' ? 'thumbnail_url' : field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields on submit
    const errors = validateThreadForm({
      title: formData.title,
      content: formData.content,
      category_id: formData.category,
      thumbnail_url: formData.thumbnailUrl
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const threadData = {
      title: formData.title,
      content: formData.content,
      category_id: parseInt(formData.category),
      thumbnail_url: formData.thumbnailUrl || null,
    };

    try {
      const result = await updateThread(thread.thread_id, threadData);
      
      if (result.success && result.data) {
        onSuccess?.(result.data);
        onClose();
      } else {
        setError(result.error?.message || RESPONSE_MESSAGES.thread.DEFAULT);
      }
    } catch (err: unknown) {
      console.error("Error updating thread:", err);
      const errorMessage = err instanceof Error ? err.message : RESPONSE_MESSAGES.thread.DEFAULT;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearThumbnail = () => {
    handleChange("thumbnailUrl", "");
  };

  const areAllRequiredFieldsFilled = formData.title && formData.category && formData.content;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل المناقشة"
      size="lg"
    >
      {isLoadingCategories ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="عنوان المناقشة"
            placeholder="اكتب عنواناً يوضّح موضوع مناقشتك"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            fullWidth
            error={validationErrors.title}
          />

          <Select
            label="التصنيف"
            placeholder="اختر تصنيف المناقشة"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
            options={categories.map((category) => ({
              value: category.category_id.toString(),
              label: category.name,
            }))}
            error={validationErrors.category_id}
          />

          <Textarea
            label="المحتوى"
            placeholder="اكتب المحتوى هنا (يدعم تنسيق Markdown)"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            required
            fullWidth
            textareaSize="lg"
            helperText="يدعم تنسيق Markdown"
            error={validationErrors.content}
          />

          <div className="space-y-2">
            <Input
              label="رابط الصورة المصغرة"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
              optional
              helperText="يمكنك إضافة رابط صورة لتظهر كصورة مصغرة للمناقشة. النسبة الموصى بها: 6:4 (مثال: 1200x800 بكسل) للحصول على أفضل تناسق بصري"
              endIcon={formData.thumbnailUrl ? <X className="w-4 h-4 cursor-pointer" onClick={clearThumbnail} /> : undefined}
              error={validationErrors.thumbnail_url}
            />

            {formData.thumbnailUrl && (
              <ThumbnailPreview
                clearThumbnail={clearThumbnail}
                thumbnailUrl={formData.thumbnailUrl}
                isImageLoading={isImageLoading}
                isImageValid={isImageValid}
              />
            )}
          </div>

          {error && <ErrorAlert message={error} />}

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={!areAllRequiredFieldsFilled || isSubmitting}
              isLoading={isSubmitting}
              loadingText="جاري الحفظ..."
            >
              حفظ التغييرات
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
} 