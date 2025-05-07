'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ThreadItem from '@/components/App/ThreadListing/ThreadItem';
import { Thread } from "@/types";
import Button from '@/components/Button';
import MyDiscussionsHeader from '@/components/App/pages/MyDiscussionsHeader';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import RetryAgain from '@/components/App/RetryAgain';
import { useInfiniteScroll, useLoading } from '@/hooks';
import { fetchUserThreads } from '@/services/thread/threadService';

export default function MyDiscussionsPage() {
  const router = useRouter();
  const { isAuthLoadingOrRedirecting } = useLoading();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest' | 'most_commented' | 'most_voted'>('latest');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchThreadsData = useCallback(async (isInitialLoad: boolean = false) => {
    if (isInitialLoad) {
      setIsLoadingThreads(true);
    } else {
      setIsUpdating(true);
    }
    setError(null);

    try {
      const result = await fetchUserThreads({
        sort: sortOrder,
        page: 1,
        query: debouncedSearchQuery || undefined,
        category_id: selectedCategory ?? undefined,
      });

      if (result.success) {
        setThreads(result.data);
        setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
        setPage(2);
      } else {
        setError(result.error.message || RESPONSE_MESSAGES.thread.DEFAULT);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : RESPONSE_MESSAGES.thread.DEFAULT;
      setError(`${errorMessage}. ${RESPONSE_MESSAGES.GLOBAL.TRY_AGAIN}`);
    } finally {
      if (isInitialLoad) {
        setIsLoadingThreads(false);
      } else {
        setIsUpdating(false);
      }
    }
  }, [sortOrder, selectedCategory, debouncedSearchQuery]);

  const fetchMoreThreads = useCallback(async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      const result = await fetchUserThreads({
        sort: sortOrder,
        page,
        query: debouncedSearchQuery || undefined,
        category_id: selectedCategory ?? undefined,
      });

      if (result.success) {
        setThreads((prev) => [...prev, ...result.data]);
        setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
        setPage((prev) => prev + 1);
      } else {
        setError(result.error.message || RESPONSE_MESSAGES.thread.DEFAULT);
      }
    } catch {
      setError(RESPONSE_MESSAGES.thread.LOADING_MORE);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, sortOrder, selectedCategory, page, debouncedSearchQuery]);

  // Initial load
  useEffect(() => {
    fetchThreadsData(true);
  }, [fetchThreadsData]);

  // Filter/sort updates
  useEffect(() => {
    if (!isLoadingThreads) { // Only run when not in initial load
      fetchThreadsData(false);
    }
  }, [sortOrder, selectedCategory, debouncedSearchQuery, fetchThreadsData, isLoadingThreads]);

  const handleRetry = useCallback(() => {
    fetchThreadsData(true);
  }, [fetchThreadsData]);

  const lastElementRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: fetchMoreThreads,
  });
  
  if (isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" fullScreen={true} />;
  }

  if (error && threads.length === 0) {
    return (
      <RetryAgain error={error} handleRetry={handleRetry} />
    );
  }

  return (
    <div className="space-y-6">
      <MyDiscussionsHeader
        threads={threads}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={() => {}}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isLoading={isUpdating}
      />

      <div className="relative min-h-[200px]">
        {isUpdating && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        )}

        {!isUpdating && threads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchQuery || selectedCategory
                ? 'لم يتم العثور على أي مناقشات تطابق معايير البحث'
                : 'لم تقم بإنشاء أي مناقشات بعد'}
            </p>
            <Button
              onClick={() => router.push('/discussions/new')}
              variant="outline"
              className="mt-4"
            >
              ابدأ مناقشة
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {threads.map((thread, index) => (
              <div
                key={thread.thread_id}
                ref={index === threads.length - 1 ? lastElementRef : undefined}
              >
                <ThreadItem
                  {...thread}
                  thumbnail_url={thread.thumbnail_url || undefined}
                  onEdit={() => router.push(`/discussions/${thread.thread_id}/edit`)}
                  onDelete={() => router.push(`/discussions/${thread.thread_id}`)}
                />
              </div>
            ))}

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="md" color="primary" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 