"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import { X } from "lucide-react";
import ThumbnailPreview from "@/components/OnlyApp/ThumbnailPreview";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import validateThreadForm from "@/utils/api/thread/validateThreadForm";
import { FrontendRoutes } from "@/data/routes";
import { logger } from "@/utils/logger";
import RetryAgain from "@/components/OnlyApp/RetryAgain";
import { toast } from "react-hot-toast";
import { useAuth, useAuthRedirect, useAxios, useImageValidation } from "@/hooks";
import { fetchCategories } from "@/services/thread/categoryService";
import { createThread } from "@/services/thread/threadService";

export default function NewDiscussionPage() {
  const router = useRouter();
  useAxios(); // Keep for side effects
  const { auth } = useAuth();
  const isLoading = useAuthRedirect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content: "",
    thumbnail_url: "",
  });
  const { isImageValid, isImageLoading } = useImageValidation(formData.thumbnail_url);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.success && Array.isArray(response.data)) {
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
    };

    loadCategories();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate the changed field
    const errors = validateThreadForm({
      ...formData,
      [field]: value,
      category_id: field === 'category_id' ? value : formData.category_id,
      thumbnail_url: field === 'thumbnail_url' ? value : formData.thumbnail_url
    });

    // Only update the validation error for the changed field
    setValidationErrors((prev) => ({
      ...prev,
      [field === 'category_id' ? 'category_id' : field === 'thumbnail_url' ? 'thumbnail_url' : field]: errors[field === 'category_id' ? 'category_id' : field === 'thumbnail_url' ? 'thumbnail_url' : field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields on submit
    const errors = validateThreadForm({
      title: formData.title,
      content: formData.content,
      category_id: formData.category_id,
      thumbnail_url: formData.thumbnail_url
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        category_id: parseInt(formData.category_id),
        thumbnail_url: formData.thumbnail_url || null,
      };

      const result = await createThread(payload);
      
      if (result.success && result.data) {
        toast.success(RESPONSE_MESSAGES.thread.CREATE_SUCCESS);
        setIsRedirecting(true);
        router.push(`${FrontendRoutes.DISCUSSIONS}/${result.data.thread_id}`);
      } else if (!result.success) {
        setError(result.error.message || RESPONSE_MESSAGES.thread.DEFAULT);
      }
    } catch (err: unknown) {
      toast.error(RESPONSE_MESSAGES.thread.CREATE_FAILED);
      logger().error("Error creating thread:", err);
      const errorMessage = err instanceof Error ? err.message : RESPONSE_MESSAGES.thread.DEFAULT;
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearThumbnail = () => {
    handleChange("thumbnail_url", "");
  };

  const areAllRequiredFieldsFilled = formData.title && formData.category_id && formData.content;

  if (auth.loading || isLoading || isLoadingCategories || isRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (error && !isSubmitting) {
    return (
      <RetryAgain 
      error={error}
        handleRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ابدأ مناقشة</h1>
        <p className="mt-2 text-sm text-gray-600">
          شارك أفكارك وابدأ مناقشة جديدة مع المجتمع
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          value={formData.category_id}
          onChange={(e) => handleChange("category_id", e.target.value)}
          required
          options={[
            ...categories.map((category) => ({
              value: category.category_id.toString(),
              label: category.name,
            }))
          ]}
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
            value={formData.thumbnail_url}
            onChange={(e) => handleChange("thumbnail_url", e.target.value)}
            optional
            helperText="يمكنك إضافة رابط صورة لتظهر كصورة مصغرة للمناقشة. النسبة الموصى بها: 6:4 (مثال: 1200x800 بكسل) للحصول على أفضل تناسق بصري"
            endIcon={formData.thumbnail_url ? <X className="w-4 h-4 cursor-pointer" onClick={clearThumbnail} /> : undefined}
            error={validationErrors.thumbnail_url}
          />

          {formData.thumbnail_url && (
            <ThumbnailPreview
              clearThumbnail={clearThumbnail}
              thumbnailUrl={formData.thumbnail_url}
              isImageLoading={isImageLoading}
              isImageValid={isImageValid}
            />
          )}
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!areAllRequiredFieldsFilled || isSubmitting}
            isLoading={isSubmitting}
            loadingText="جاري الإنشاء..."
          >
            إنشاء المناقشة
          </Button>
        </div>
      </form>
    </>
  );
} 