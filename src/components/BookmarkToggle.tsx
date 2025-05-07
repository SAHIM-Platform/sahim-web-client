import { useState, useCallback } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/utils/utils";
import toast from "react-hot-toast";
import { bookmarkThread, unbookmarkThread } from "@/services/thread/bookmarkService";

interface BookmarkToggleProps {
  threadId: number;
  initiallyBookmarked?: boolean;
  className?: string;
}

const BookmarkToggle: React.FC<BookmarkToggleProps> = ({
  threadId,
  initiallyBookmarked = false,
  className = "",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isBookmarked) {
        const res = await unbookmarkThread(threadId);
        if (res.success) {
          setIsBookmarked(false);
          toast.success("تم إزالة الموضوع من المحفوظات بنجاح");
        } else {
          toast.error("فشل في إزالة الموضوع من المحفوظات");
        }
      } else {
        const res = await bookmarkThread(threadId);
        if (res.success) {
          setIsBookmarked(true);
          toast.success("تم إضافة الموضوع إلى المحفوظات بنجاح");
        } else {
          toast.error("فشل في إضافة الموضوع إلى المحفوظات");
        }
      }
    } catch {
      toast.error("حدث خطأ أثناء تحديث المحفوظات");
    } finally {
      setLoading(false);
    }
  }, [isBookmarked, threadId, loading]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleToggle();
      }}
      disabled={loading}
      className={cn("transition-colors", className)}
      aria-label={isBookmarked ? "إزالة من المحفوظات" : "إضافة إلى المحفوظات"}
    >
      <Bookmark
        className={cn(
          "w-5 h-5",
          isBookmarked && "text-primary fill-primary",
          loading && "opacity-50 pointer-events-none"
        )}
      />
    </button>
  );
};

export default BookmarkToggle;
