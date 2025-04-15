'use client';

import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState, useEffect } from "react";
import { fetchThreads, deleteThread, searchThreads } from "@/services/threadService";
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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [deletingThreadId, setDeletingThreadId] = useState<number | null>(null);

  const loadThreads = async (filters?: { category_id?: number; query?: string }) => {
    try {
      setIsLoading(true);
      setIsFiltering(!!filters);
      setError(null);
      
      let result;
      if (filters?.category_id || filters?.query) {
        result = await searchThreads(filters);
        if (!result || !Array.isArray(result.data)) {
          throw new Error('Invalid response format from search');
        }
        setThreads(result.data);
      } else {
        result = await fetchThreads();
        if (result.success && result.data) {
          setThreads(Array.isArray(result.data.data) ? result.data.data : [result.data.data]);
        } else {
          throw new Error(result.error?.message || 'Failed to fetch threads');
        }
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
      setIsFiltering(false);
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

  const handleSearch = (filters: { category_id?: number; query?: string }) => {
    loadThreads(filters);
  };

  return (
    <div className="space-y-5">
      <ThreadListingHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        processedThreads={threads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onSearch={handleSearch}
      />

      {error ? (
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
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      ) : isFiltering ? (
        <div className="flex items-center justify-center py-6">
          <LoadingSpinner size="md" color="primary" />
          <span className="mr-2 text-sm text-gray-600">جاري البحث...</span>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {threads
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
