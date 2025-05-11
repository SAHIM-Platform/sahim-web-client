'use client';

import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Thread } from "@/types";
import ErrorAlert from "@/components/Form/ErrorAlert";
import { RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { useInfiniteScroll } from "@/hooks";
import { deleteThread, fetchThreads } from "@/services/thread/threadService";
import { userService } from "@/services/userService";
import { ApiSuccess } from "@/types";

interface ThreadListingProps {
  emptyMessage?: string;
  displayHeader?: boolean;
  username?: string;
}

const ThreadListing = ({
  emptyMessage = "لا توجد مناقشات حالياً",
  displayHeader = true,
  username
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
      if (username) {
        // Fetch user-specific threads
        const result = await userService.getUserProfileByUsername(username, {
          sort: sortOrder,
          page: 1,
          limit: 10,
          category_id: selectedCategory ?? undefined,
          includeThreads: true
        });

        if (result.success && result.data?.threads) {
          setThreads(result.data.threads);
          setHasMore(result.data.threadsMeta ? result.data.threadsMeta.page < result.data.threadsMeta.totalPages : false);
        } else {
          throw new Error(result.error?.message || 'حدث خطأ أثناء تحميل المناقشات');
        }
      } else {
        // Fetch all threads
        const result = await fetchThreads({
          sort: sortOrder,
          page: 1,
          category_id: selectedCategory ?? undefined,
        });

        if (result.success) {
          const successResult = result as ApiSuccess<Thread[]>;
          setThreads(successResult.data);
          setHasMore(successResult.meta ? successResult.meta.page < successResult.meta.totalPages : false);
        } else {
          throw new Error(result.error?.message || 'حدث خطأ أثناء تحميل المناقشات');
        }
      }
      
      setPage(2);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المناقشات';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      } else {
        setIsUpdating(false);
      }
    }
  }, [sortOrder, selectedCategory, username]);

  const fetchMoreThreads = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      if (username) {
        // Fetch more user-specific threads
        const result = await userService.getUserProfileByUsername(username, {
          sort: sortOrder,
          page,
          limit: 10,
          category_id: selectedCategory ?? undefined,
          includeThreads: true
        });

        if (result.success && result.data?.threads) {
          const newThreads = result.data.threads;
          if (Array.isArray(newThreads)) {
            setThreads((prev) => [...prev, ...newThreads]);
            setHasMore(result.data.threadsMeta ? result.data.threadsMeta.page < result.data.threadsMeta.totalPages : false);
          }
        } else {
          throw new Error(result.error?.message || 'حدث خطأ أثناء تحميل المزيد من المناقشات');
        }
      } else {
        // Fetch more general threads
        const result = await fetchThreads({
          sort: sortOrder,
          page,
          category_id: selectedCategory ?? undefined,
        });

        if (result.success) {
          const successResult = result as ApiSuccess<Thread[]>;
          setThreads((prev) => [...prev, ...successResult.data]);
          setHasMore(successResult.meta ? successResult.meta.page < successResult.meta.totalPages : false);
        } else {
          throw new Error(result.error?.message || 'حدث خطأ أثناء تحميل المزيد من المناقشات');
        }
      }
      
      setPage((prev) => prev + 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المزيد من المناقشات';
      toast.error(errorMessage);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, sortOrder, selectedCategory, page, username]);

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
      {displayHeader && (
        <ThreadListingHeader
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          processedThreads={threads}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isFiltering={isUpdating}
        />
      )}

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
                .map((thread) => (
                  <ThreadItem
                    key={thread.thread_id}
                    {...thread}
                    onDelete={() => handleDeleteThread(thread.thread_id)}
                  />
                ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="h-10" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ThreadListing;
