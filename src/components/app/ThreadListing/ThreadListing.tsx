'use client';

import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState, useEffect, useCallback } from "react";
import { fetchThreads, deleteThread } from "@/services/threadService";
import toast from "react-hot-toast";
import { Thread } from "@/types";
import ErrorAlert from "@/components/Form/ErrorAlert";
import { RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

interface ThreadListingProps {
  emptyMessage?: string;
}

const ThreadListing = ({
  emptyMessage = "لا توجد مناقشات حالياً"
}: ThreadListingProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchThreadsData = useCallback(async (isInitialLoad: boolean = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsUpdating(true);
    }
    setError(null);

    try {
      const result = await fetchThreads({
        sort: sortOrder,
        page: 1,
        category_id: selectedCategory ?? undefined,
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
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsUpdating(false);
      }
    }
  }, [sortOrder, selectedCategory]);

  const fetchMoreThreads = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const result = await fetchThreads({
        sort: sortOrder,
        page,
        category_id: selectedCategory ?? undefined,
      });

      if (result.success && result.data) {
        const newThreads = result.data.data;
        setThreads((prev) => [...prev, ...newThreads]);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage((prev) => prev + 1);
      } else {
        toast.error(result.error?.message || 'حدث خطأ أثناء تحميل المزيد من المناقشات');
      }
    } catch {
      toast.error("حدث خطأ أثناء تحميل المزيد من المناقشات");
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, sortOrder, selectedCategory, page]);

  // Initial load
  useEffect(() => {
    fetchThreadsData(true);
  }, [fetchThreadsData]);

  // Filter/sort updates
  useEffect(() => {
    if (!isLoading) { // Only run when not in initial load
      fetchThreadsData(false);
    }
  }, [sortOrder, selectedCategory, fetchThreadsData, isLoading]);

  const handleRetry = useCallback(() => {
    fetchThreadsData(true);
  }, [fetchThreadsData]);

  const handleDeleteThread = async (threadId: number) => {
    try {
      const result = await deleteThread(threadId);

      if (result.success) {
        toast.success('تم حذف المناقشة بنجاح');
        fetchThreadsData(false);
      } else {
        toast.error(result.error?.message || 'حدث خطأ أثناء حذف المناقشة');
      }
    } catch {
      toast.error('حدث خطأ أثناء حذف المناقشة');
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: fetchMoreThreads,
  });

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
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
        processedThreads={threads}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isFiltering={isUpdating}
      />

      <div className="relative min-h-[200px]">
        {isUpdating && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        )}

        {!isUpdating && threads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-[14px] sm:text-[15px]">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5">
              {threads
                .sort((a, b) => {
                  const dateA = new Date(a.created_at).getTime();
                  const dateB = new Date(b.created_at).getTime();
                  return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
                })
                .map((thread) => {
                  console.log('ThreadListing - Thread Author:', {
                    id: thread.author.id,
                    name: thread.author.name,
                    photoPath: thread.author.photoPath,
                    username: thread.author.username
                  });
                  return (
                    <ThreadItem
                      key={thread.thread_id}
                      {...thread}
                      onDelete={() => handleDeleteThread(thread.thread_id)}
                    />
                  );
                })}
            </div>

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="md" />
              </div>
            )}
          </>
        )}

        <div ref={loadMoreRef} className="h-1" />
      </div>
    </div>
  );
};

export default ThreadListing;
