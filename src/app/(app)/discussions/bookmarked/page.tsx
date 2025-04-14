'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthRedirect from '@/hooks/UseAuthRedirect';
import ThreadItem from '@/components/app/ThreadListing/ThreadItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/Form/ErrorAlert';
import Button from '@/components/Button';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Thread } from '@/types/thread';
import { fetchBookmarkedThreads, voteThread, deleteThread } from '@/services/threadService';

export default function BookmarkedDiscussionsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Thread[]>([]);
  const [deletingThreadId, setDeletingThreadId] = useState<number | null>(null);

  // Ensure user is authenticated
  useAuthRedirect();

  const fetchBookmarkedThreadsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchBookmarkedThreads();
      
      if (result.success && result.data) {
        // The data is now correctly extracted from the API response
        setBookmarkedThreads(result.data);
      } else {
        setError(result.error?.message || 'حدث خطأ أثناء تحميل المناقشات المحفوظة');
        toast.error(result.error?.message || 'حدث خطأ أثناء تحميل المناقشات المحفوظة');
        // Set empty array if no data
        setBookmarkedThreads([]);
      }
    } catch (err) {
      console.error('Error fetching bookmarked threads:', err);
      setError('حدث خطأ أثناء تحميل المناقشات المحفوظة');
      toast.error('حدث خطأ أثناء تحميل المناقشات المحفوظة');
      // Set empty array on error
      setBookmarkedThreads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedThreadsData();
  }, []);

  const handleRetry = () => {
    fetchBookmarkedThreadsData();
  };

  const handleUpvote = async (threadId: number) => {
    try {
      const result = await voteThread(threadId, "UP");
      
      if (result.success) {
        // Update the thread in the list with new vote counts
        setBookmarkedThreads(prevThreads => 
          prevThreads.map(thread => 
            thread.thread_id === threadId 
              ? {
                  ...thread,
                  votes: {
                    ...thread.votes,
                    score: result.votesCount,
                    user_vote: result.userVote,
                    counts: {
                      up: result.userVote === "UP" 
                        ? (thread.votes?.counts?.up || 0) + 1 
                        : (thread.votes?.counts?.up || 0),
                      down: result.userVote === "DOWN" 
                        ? (thread.votes?.counts?.down || 0) - 1 
                        : (thread.votes?.counts?.down || 0)
                    }
                  }
                }
              : thread
          )
        );
        toast.success('تم التصويت بنجاح');
      } else {
        toast.error('فشل التصويت');
      }
    } catch (err) {
      console.error('Error upvoting thread:', err);
      toast.error('حدث خطأ أثناء التصويت');
    }
  };

  const handleDownvote = async (threadId: number) => {
    try {
      const result = await voteThread(threadId, "DOWN");
      
      if (result.success) {
        // Update the thread in the list with new vote counts
        setBookmarkedThreads(prevThreads => 
          prevThreads.map(thread => 
            thread.thread_id === threadId 
              ? {
                  ...thread,
                  votes: {
                    ...thread.votes,
                    score: result.votesCount,
                    user_vote: result.userVote,
                    counts: {
                      up: result.userVote === "UP" 
                        ? (thread.votes?.counts?.up || 0) + 1 
                        : (thread.votes?.counts?.up || 0),
                      down: result.userVote === "DOWN" 
                        ? (thread.votes?.counts?.down || 0) + 1 
                        : (thread.votes?.counts?.down || 0)
                    }
                  }
                }
              : thread
          )
        );
        toast.success('تم التصويت بنجاح');
      } else {
        toast.error('فشل التصويت');
      }
    } catch (err) {
      console.error('Error downvoting thread:', err);
      toast.error('حدث خطأ أثناء التصويت');
    }
  };

  const handleReply = (threadId: number) => {
    router.push(`/discussions/${threadId}`);
  };

  const handleShare = (threadId: number) => {
    // Get the current URL
    const url = `${window.location.origin}/discussions/${threadId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('تم نسخ رابط المناقشة إلى الحافظة');
      })
      .catch(() => {
        toast.error('فشل نسخ الرابط');
      });
  };

  const handleEdit = (updatedThread: Thread) => {
    router.push(`/discussions/${updatedThread.thread_id}/edit`);
  };

  const handleDelete = async (threadId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المناقشة؟')) {
      try {
        setDeletingThreadId(threadId);
        const result = await deleteThread(threadId);
        
        if (result.success) {
          // Remove the deleted thread from the list
          setBookmarkedThreads(prevThreads => 
            prevThreads.filter(thread => thread.thread_id !== threadId)
          );
          toast.success('تم حذف المناقشة بنجاح');
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
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              المناقشات المحفوظة
            </h1>
            <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
              تصفح المناقشات التي قمت بحفظها
            </p>
          </div>
        </div>
      </div>

      {!Array.isArray(bookmarkedThreads) || bookmarkedThreads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            لا توجد مناقشات محفوظة حالياً.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {bookmarkedThreads.map((thread) => (
            <ThreadItem
              key={thread.thread_id}
              {...thread}
              onUpvote={() => handleUpvote(thread.thread_id)}
              onDownvote={() => handleDownvote(thread.thread_id)}
              onReply={() => handleReply(thread.thread_id)}
              onShare={() => handleShare(thread.thread_id)}
              onEdit={handleEdit}
              onDelete={() => handleDelete(thread.thread_id)}
              isDeleting={deletingThreadId === thread.thread_id}
            />
          ))}
        </div>
      )}
    </div>
  );
} 