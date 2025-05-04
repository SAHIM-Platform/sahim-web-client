'use client';

import { useEffect, useState, useCallback } from 'react';
import { Thread } from "@/types";
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchBookmarkedThreads, deleteThread } from '@/services/threadService';
import ThreadItem from '@/components/App/ThreadListing/ThreadItem';
import { isAuthLoadingOrRedirecting } from '@/utils/loading';
import { logger } from '@/utils/logger';
import ERROR_MESSAGES from '@/utils/constants/ERROR_MESSAGES';
import toast from 'react-hot-toast';
import RetryAgain from '@/components/App/RetryAgain';
import ItemNotFound from '@/components/App/NotFound/ItemNotFound';

const BookmarksPageContent = () => {
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoading = isAuthLoadingOrRedirecting();

  const fetchInitialBookmarks = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
    setError(null);

    try {
      const result = await fetchBookmarkedThreads({ page: 1, limit });

      if (result.success && result.data) {
        const processedThreads = result.data.data.map(thread => ({
          ...thread,
          author: {
            ...thread.author,
            photoPath: thread.author.photoPath
          }
        }));
        setBookmarkedThreads(processedThreads);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage(2);
      } else {
        setError(ERROR_MESSAGES.BOOKMARK.DEFAULT);
      }
    } catch (error) {
      logger().error("Error loading bookmarks:", error);
      setError(ERROR_MESSAGES.BOOKMARK.DEFAULT);
    } finally {
      setIsInitialLoading(false);
    }
  }, [limit]);

  const fetchMoreBookmarks = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);

    try {
      const result = await fetchBookmarkedThreads({ page, limit });

      if (result.success && result.data) {
        const newBookmarkedThreads = result.data.data.map(thread => ({
          ...thread,
          author: {
            ...thread.author,
            photoPath: thread.author.photoPath
          }
        }));
        setBookmarkedThreads((prev) => [...prev, ...newBookmarkedThreads]);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage((prev) => prev + 1);
      } else {
        setError(ERROR_MESSAGES.BOOKMARK.DEFAULT);
      }
    } catch (error) {
      logger().error("Error loading more bookmarks:", error);
      setError(ERROR_MESSAGES.BOOKMARK.DEFAULT);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleRetry = () => {
    fetchInitialBookmarks();
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: fetchMoreBookmarks,
  });

  const handleDeleteThread = async (threadId: number) => {
    try {
      const result = await deleteThread(threadId);

      if (result.success) {
        toast.success(ERROR_MESSAGES.BOOKMARK.DELETE_SUCCESS);
        setBookmarkedThreads(prev => prev.filter(thread => thread.thread_id !== threadId));
      } else {
        toast.error(ERROR_MESSAGES.BOOKMARK.NOT_FOUND);
      }
    } catch {
      logger().error("Error deleting thread:", error);
      toast.error(ERROR_MESSAGES.BOOKMARK.NOT_FOUND);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchInitialBookmarks();
    }
  }, [isLoading, fetchInitialBookmarks]);

  if (isLoading || isInitialLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (error) {
    return (
      <RetryAgain
        error={error}
        handleRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-5">
      {bookmarkedThreads.length === 0 ? (
        <ItemNotFound description={ERROR_MESSAGES.BOOKMARK.NOT_FOUND} />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {bookmarkedThreads.map((thread) => (
              <ThreadItem
                key={thread.thread_id}
                {...thread}
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

      {/* Scroll detection element */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  );
};

export default BookmarksPageContent;