'use client';

import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState, useEffect } from "react";
import { fetchThreads, deleteThread } from "@/services/threadService";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { Thread, ThreadResult } from "@/types/thread";
import ErrorAlert from "@/components/Form/ErrorAlert";
import Button from "@/components/Button";
import { RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ThreadListingProps {
  onReply?: (threadId: number) => void;
  onShare?: (threadId: number) => void;
  emptyMessage?: string;
}

const ThreadListing = ({
  onReply,
  onShare,
  emptyMessage = "لا توجد مناقشات حالياً"
}: ThreadListingProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [deletingThreadId, setDeletingThreadId] = useState<number | null>(null);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchThreads();

      if (result.success && result.data) {
        setThreads(Array.isArray(result.data.data) ? result.data.data : [result.data.data]);
      } else {
        const errorMessage = result.error?.message || 'حدث خطأ أثناء تحميل المناقشات';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Thread loading error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المناقشات';
      setError(`${errorMessage}. حاول مرة أخرى.`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const handleRetry = () => {
    loadThreads();
  };

  const handleDeleteThread = async (threadId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المناقشة؟')) {
      try {
        setDeletingThreadId(threadId);
        const result = await deleteThread(threadId);
        
        if (result.success) {
          toast.success('تم حذف المناقشة بنجاح');
          loadThreads();
        } else {
          toast.error(result.error?.message || 'حدث خطأ أثناء حذف المناقشة');
        }
      } catch (err) {
        console.error('Error deleting thread:', err);
        toast.error('حدث خطأ أثناء حذف المناقشة');
      } finally {
        setDeletingThreadId(null);
      }
    }
  };

  const processedThreads = threads.filter(
    (thread) =>
      (!selectedCategory || thread.category.name === selectedCategory) &&
      (!searchQuery || (thread.title && thread.title.includes(searchQuery)))
  );

  if (isLoading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error} />
        <Button
          onClick={handleRetry}
          variant="outline"
          icon={<RefreshCw className="w-4" />}
          color="secondary"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ThreadListingHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        processedThreads={processedThreads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {processedThreads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {processedThreads
            .sort((a, b) => {
              const dateA = new Date(a.created_at).getTime();
              const dateB = new Date(b.created_at).getTime();
              return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
            })
            .map((thread) => (
              <ThreadItem
                key={thread.thread_id}
                {...thread}
                onReply={() => onReply?.(thread.thread_id)}
                onShare={() => onShare?.(thread.thread_id)}
                onDelete={() => handleDeleteThread(thread.thread_id)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ThreadListing;
