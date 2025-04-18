'use client';

import { useEffect, useState } from 'react';
import { Thread } from '@/types/thread';
import toast from 'react-hot-toast';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import ErrorAlert from '@/components/Form/ErrorAlert';
import Button from '@/components/Button';
import { RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchBookmarkedThreads, deleteThread } from '@/services/threadService';
import ThreadItem from '@/components/app/ThreadListing/ThreadItem';
import useAuthRedirect from '@/hooks/UseAuthRedirect';

const BookmarksPageContent = () => {
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoading = useAuthRedirect();

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  const fetchInitialBookmarks = async () => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoading(true);
    setError(null);

    try {
      const result = await fetchBookmarkedThreads({ page: 1, limit });

      if (result.success && result.data) {
        setBookmarkedThreads(result.data.data);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage(2);
      } else {
        const errorMessage = 'حدث خطأ أثناء تحميل المحفوظات. يرجى المحاولة مرة أخرى';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch {
      const errorMessage = 'حدث خطأ أثناء تحميل المحفوظات. يرجى المحاولة مرة أخرى';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchMoreBookmarks = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);

    try {
      const result = await fetchBookmarkedThreads({ page, limit });

      if (result.success && result.data) {
        const newBookmarkedThreads = result.data.data;
        setBookmarkedThreads((prev) => [...prev, ...newBookmarkedThreads]);
        setHasMore(result.data.meta.page < result.data.meta.totalPages);
        setPage((prev) => prev + 1);
      } else {
        toast.error('حدث خطأ أثناء تحميل المزيد من المحفوظات. يرجى المحاولة مرة أخرى');
      }
    } catch {
      toast.error('حدث خطأ أثناء تحميل المزيد من المحفوظات. يرجى المحاولة مرة أخرى');
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
        toast.success('تم حذف المناقشة بنجاح');
        setBookmarkedThreads(prev => prev.filter(thread => thread.thread_id !== threadId));
      } else {
        toast.error('حدث خطأ أثناء حذف المناقشة. يرجى المحاولة مرة أخرى');
      }
    } catch {
      toast.error('حدث خطأ أثناء حذف المناقشة. يرجى المحاولة مرة أخرى');
    }
  };

  useEffect(() => {
    fetchInitialBookmarks();
  }, []);

  if (isInitialLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen />;
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
      {bookmarkedThreads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            لا توجد مواضيع محفوظة حالياً
          </p>
        </div>
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