import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import { Thread } from "@/types/thread";
import ThumbnailPreview from "@/app/ThumbnailPreview";
import { useImageValidation } from "@/hooks/useImageValidation";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";
import ErrorAlert from "@/components/Form/ErrorAlert";
import Modal from "@/components/Modal/Modal";
import { X } from "lucide-react";
import { fetchCategories, updateThread } from "@/services/threadService";
import Loader from "@/components/Loader";

interface EditThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: Thread;
  onSuccess?: (updatedThread: Thread) => void;
}

export default function EditThreadModal({ isOpen, onClose, thread, onSuccess }: EditThreadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
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
        thumbnailUrl: "",
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
            setError(ERROR_MESSAGES.thread.DEFAULT);
            setCategories([]);
          }
        } catch (error) {
          setError(ERROR_MESSAGES.thread.DEFAULT);
          setCategories([]);
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const threadData = {
      title: formData.title,
      content: formData.content,
      category_id: parseInt(formData.category),
      // thumbnail_url: formData.thumbnailUrl || null,
    };

    try {
      const result = await updateThread(thread.thread_id, threadData);
      
      if (result.success && result.data) {
        onSuccess?.(result.data);
        onClose();
      } else {
        setError(result.error?.message || ERROR_MESSAGES.thread.DEFAULT);
      }
    } catch (error: any) {
      console.error("Error updating thread:", error);
      setError(ERROR_MESSAGES.thread.DEFAULT);
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
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="عنوان المناقشة"
            placeholder="اكتب عنواناً يوضّح موضوع مناقشتك"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && areAllRequiredFieldsFilled && !isSubmitting) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            required
            fullWidth
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
          />

          <Textarea
            label="المحتوى"
            placeholder="اكتب المحتوى هنا (يدعم تنسيق Markdown)"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            onKeyDown={(e) => {
              // Allow Ctrl+Enter or Command+Enter to submit
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (areAllRequiredFieldsFilled && !isSubmitting) {
                  handleSubmit(e as any);
                }
              }
            }}
            required
            fullWidth
            textareaSize="lg"
            helperText="يدعم تنسيق Markdown. اضغط Ctrl+Enter أو Command+Enter للحفظ"
          />

          <div className="space-y-2">
            <Input
              label="رابط الصورة المصغرة"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
              optional
              helperText="يمكنك إضافة رابط صورة لتظهر كصورة مصغرة للمناقشة"
              endIcon={formData.thumbnailUrl ? <X className="w-4 h-4 cursor-pointer" onClick={clearThumbnail} /> : undefined}
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