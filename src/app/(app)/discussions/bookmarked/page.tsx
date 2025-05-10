'use client';

import { useEffect, useState, useCallback } from 'react';
import { Thread } from "@/types";
import LoadingSpinner from '@/components/LoadingSpinner';
import ThreadItem from '@/components/App/ThreadListing/ThreadItem';
import { logger } from '@/utils/logger';
import RESPONSE_MESSAGES from '@/utils/constants/RESPONSE_MESSAGES';
import toast from 'react-hot-toast';
import RetryAgain from '@/components/App/RetryAgain';
import ItemNotFound from '@/components/App/NotFound/ItemNotFound';
import { useInfiniteScroll, useAuthLoading } from '@/hooks';
import { fetchBookmarkedThreads } from '@/services/thread/bookmarkService';
import { deleteThread } from '@/services/thread/threadService';

const BookmarksPageContent = () => {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoading = isAuthLoadingOrRedirecting;

  const fetchInitialBookmarks = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
    setError(null);

    try {
      const result = await fetchBookmarkedThreads({ page: 1, limit });

      if (result.success) {
        setBookmarkedThreads(result.data);
        setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
        setPage(2);
      } else {
        setError(result.error.message || RESPONSE_MESSAGES.BOOKMARK.DEFAULT);
      }
    } catch (error) {
      logger().error("Error loading bookmarks:", error);
      setError(RESPONSE_MESSAGES.BOOKMARK.DEFAULT);
    } finally {
      setIsInitialLoading(false);
    }
  }, [limit]);

  const fetchMoreBookmarks = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);

    try {
      const result = await fetchBookmarkedThreads({ page, limit });

      if (result.success) {
        setBookmarkedThreads((prev) => [...prev, ...result.data]);
        setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
        setPage((prev) => prev + 1);
      } else {
        setError(result.error.message || RESPONSE_MESSAGES.BOOKMARK.DEFAULT);
      }
    } catch (error) {
      logger().error("Error loading more bookmarks:", error);
      setError(RESPONSE_MESSAGES.BOOKMARK.DEFAULT);
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
        toast.success(RESPONSE_MESSAGES.BOOKMARK.DELETE_SUCCESS);
        setBookmarkedThreads(prev => prev.filter(thread => thread.thread_id !== threadId));
      } else {
        toast.error(RESPONSE_MESSAGES.BOOKMARK.NOT_FOUND);
      }
    } catch {
      logger().error("Error deleting thread:", error);
      toast.error(RESPONSE_MESSAGES.BOOKMARK.NOT_FOUND);
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
        <ItemNotFound description={RESPONSE_MESSAGES.BOOKMARK.NOT_FOUND} />
      ) : (
        <>
          <div className="flex flex-col gap-5">
            {bookmarkedThreads.map((thread) => (
              <ThreadItem
                key={thread.thread_id}
                {...thread}
                thumbnail_url={thread.thumbnail_url || undefined}
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