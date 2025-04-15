'use client';

import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState, useEffect } from "react";
import { fetchThreads, deleteThread } from "@/services/threadService";
import toast from "react-hot-toast";
import { Thread } from "@/types/thread";
import ErrorAlert from "@/components/Form/ErrorAlert";
import { RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

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
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [deletingThreadId, setDeletingThreadId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchInitialThreads = async () => {
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchThreads({
        sort: sortOrder,
        page: 1,
        category_id: selectedCategory ? Number(selectedCategory) : undefined,
      });

      if (result.success && result.data) {
        setThreads(result.data.data);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage(2);
      } else {
        const errorMessage = result.error?.message || 'حدث خطأ أثناء تحميل المناقشات';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المناقشات';
      setError(`${errorMessage}. حاول مرة أخرى.`);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  const fetchMoreThreads = async () => {
    if (isFetchingMore || !hasMore) return;
    
    setIsFetchingMore(true);
    try {
      const result = await fetchThreads({
        sort: sortOrder,
        page,
        category_id: selectedCategory ? Number(selectedCategory) : undefined,
      });

      if (result.success && result.data) {
        const newThreads = result.data.data;
        setThreads((prev) => [...prev, ...newThreads]);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage((prev) => prev + 1);
      } else {
        toast.error(result.error?.message || 'حدث خطأ أثناء تحميل المزيد من المناقشات');
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل المزيد من المناقشات");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleRetry = () => {
    fetchInitialThreads();
  };

  const handleDeleteThread = async (threadId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المناقشة؟')) {
      try {
        setDeletingThreadId(threadId);
        const result = await deleteThread(threadId);

        if (result.success) {
          toast.success('تم حذف المناقشة بنجاح');
          fetchInitialThreads();
        } else {
          toast.error(result.error?.message || 'حدث خطأ أثناء حذف المناقشة');
        }
      } catch (err) {
        toast.error('حدث خطأ أثناء حذف المناقشة');
      } finally {
        setDeletingThreadId(null);
      }
    }
  };

  const processedThreads = threads.filter(
    (thread) =>
      (!selectedCategory || thread.category.category_id === Number(selectedCategory)) &&
      (!searchQuery || (thread.title && thread.title.includes(searchQuery)))
  );

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: fetchMoreThreads,
  });

  useEffect(() => {
    fetchInitialThreads();
  }, [sortOrder, selectedCategory]);

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
        categories={categories}
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
        <>
          <div className="flex flex-col gap-5">
            {processedThreads
              .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
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

          {isFetchingMore && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
          )}
        </>
      )}

      {/* Used by the hook to detect when to load more */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default ThreadListing;