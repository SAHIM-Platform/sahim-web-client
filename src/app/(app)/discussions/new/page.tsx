"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import { X } from "lucide-react";
import { categories } from "@/data/mock-api";
import { Category } from "@/types";
import ThumbnailPreview from "@/app/ThumbnailPreview";
import { useImageValidation } from "@/hooks/useImageValidation";
import useAxios from "@/hooks/useAxios";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";
import ErrorAlert from "@/components/Form/ErrorAlert";

export default function NewDiscussionPage() {
  const router = useRouter();
  const axios = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    thumbnailUrl: "",
  });
  const { isImageValid, isImageLoading } = useImageValidation(formData.thumbnailUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      content: formData.content,
      category_id: parseInt(formData.category), // Convert to number
    };

    try {
      
      console.log(payload);
      const response = await axios.post("/threads",  payload);

      router.push(`/discussions/${response.data.thread_id}`);
    } catch (error: any) {
      if (error.response?.status === 500) {
        setError(ERROR_MESSAGES.thread.SERVER_ERROR);
      } else {
        setError(ERROR_MESSAGES.thread.DEFAULT);
      }
      console.error("Error creating thread:", error);
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
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">إنشاء مناقشة جديدة</h1>
        <p className="mt-2 text-sm text-gray-600">
          شارك أفكارك وابدأ مناقشة جديدة مع المجتمع
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="عنوان المناقشة"
          placeholder="اكتب عنواناً يوضّح موضوع مناقشتك"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          fullWidth
        />

        <Select
          label="التصنيف"
          placeholder="اختر تصنيف المناقشة"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          required
          options={categories.map((category: Category) => ({
            value: category.id,
            label: category.name,
          }))}
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
          {error && <ErrorAlert message={error}/>}
      </form>
    </>
  );
} 