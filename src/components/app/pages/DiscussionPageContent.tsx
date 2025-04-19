'use client';

import ThreadItem from "@/components/app/ThreadListing/ThreadItem";
import { useRouter } from "next/navigation";
import SimilarThreads from "@/components/app/SimilarThreads";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Thread } from "@/types/thread";
import { toast } from "react-hot-toast";
import { createComment, fetchThreadById, fetchThreads, deleteThread } from "@/services/threadService";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import CommentListing from "@/components/app/Comment/CommentListing";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { RefreshCw } from "lucide-react";

function DiscussionPageContent({ discussionId }: { discussionId: string }) {
  const router = useRouter();
  const { auth } = useAuth();
  useAuthRedirect();

  // State management
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [similarThreads, setSimilarThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state for similar threads
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);

  const loadThread = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const threadResult = await fetchThreadById(parseInt(discussionId));

      if (threadResult.success && threadResult.data) {
        setThread(threadResult.data);
        // Reset similar threads when main thread changes
        setSimilarThreads([]);
        setPage(1);
        setHasMore(true);
      } else {
        setError(threadResult.error?.message || 'حدث خطأ أثناء تحميل المناقشة');
        toast.error(threadResult.error?.message || 'حدث خطأ أثناء تحميل المناقشة');
      }
    } catch {
      const errorMessage = 'حدث خطأ أثناء تحميل المناقشة';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [discussionId]);

  const fetchInitialSimilarThreads = useCallback(async () => {
    if (!thread) return;
    
    setIsLoadingSimilar(true);
    setError(null);

    try {
      const threadsResult = await fetchThreads({ 
        page: 1, 
        category_id: thread.category_id 
      });

      if (threadsResult.success && threadsResult.data) {
        const filtered = threadsResult.data.data.filter(
          (t: Thread) => t.thread_id !== thread.thread_id
        );
        setSimilarThreads(filtered);
        setHasMore(threadsResult.data.meta.page < threadsResult.data.meta.totalPages);
        setPage(2); // Prepare for next page
      }
    } catch {
      toast.error("حدث خطأ أثناء تحميل المناقشات المشابهة");
    } finally {
      setIsLoadingSimilar(false);
    }
  }, [thread]);

  // Load more similar threads
  const fetchMoreSimilarThreads = async () => {
    if (!thread || isLoadingSimilar || !hasMore) return;
    
    setIsLoadingSimilar(true);
    try {
      const threadsResult = await fetchThreads({ 
        page, 
        category_id: thread.category_id 
      });

      if (threadsResult.success && threadsResult.data) {
        const newThreads = threadsResult.data.data.filter(
          (t: Thread) => t.thread_id !== thread.thread_id
        );
        
        setSimilarThreads(prev => [...prev, ...newThreads]);
        setHasMore(threadsResult.data.meta.page < threadsResult.data.meta.totalPages);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error loading more threads:", err);
      toast.error("حدث خطأ أثناء تحميل المزيد من المناقشات");
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  const lastElementRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingSimilar,
    onLoadMore: fetchMoreSimilarThreads,
  });

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("الرجاء إدخال تعليق");
      return;
    }
    if (!thread) return;

    try {
      setIsSubmittingComment(true);
      const newComment = await createComment(thread.thread_id, comment);
      
      // Instead of loadThread(), just refresh the comments
      const result = await fetchThreadById(thread.thread_id);
      if (result.success && result.data) {
        setThread(prev => ({
          ...prev!,
          comments: result.data!.comments
        }));
        
        // Add highlight class to the new comment
        const newCommentElement = document.querySelector(`[data-comment-id="${newComment.id}"]`);
        if (newCommentElement) {
          newCommentElement.classList.add('border-primary', 'shadow-lg');
          setTimeout(() => {
            newCommentElement.classList.remove('border-primary', 'shadow-lg');
          }, 2000);
        }
      }
      
      toast.success("تم إضافة تعليقك بنجاح");
      setComment("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة التعليق';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleThreadUpdate = (updatedThread: Thread) => {
    if (thread && thread.comments) {
      updatedThread.comments = thread.comments;
    }
    setThread(updatedThread);
  };

  const handleThreadDelete = async () => {
    if (!thread) return;
    
    try {
      const result = await deleteThread(thread.thread_id);

      if (result.success) {
        toast.success('تم حذف المناقشة بنجاح');
        router.push('/explore');
      } else {
        toast.error(result.error?.message || 'حدث خطأ أثناء حذف المناقشة');
      }
    } catch {
      toast.error('حدث خطأ أثناء حذف المناقشة');
    }
  };

  const refreshThread = async () => {
    if (!thread) return;
    const result = await fetchThreadById(thread.thread_id);
    if (result.success && result.data) {
      setThread(result.data);
    }
  };

  useEffect(() => {
    loadThread();
  }, [discussionId, loadThread]);

  useEffect(() => {
    if (thread) {
      fetchInitialSimilarThreads();
    }
  }, [thread, fetchInitialSimilarThreads]);

  if (auth.loading || isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error} />
        <Button
          onClick={loadThread}
          variant="outline"
          icon={<RefreshCw className="w-4" />}
          color="secondary"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!thread) {
    return <ErrorAlert message="لم يتم العثور على المناقشة المطلوبة" />;
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{thread.title}</h1>

      <div className="flex flex-col gap-6">
        <ThreadItem
          {...thread}
          showFullContent={true}
          hideTitle
          onEdit={handleThreadUpdate}
          onDelete={handleThreadDelete}
        />

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <Textarea
            textareaSize="sm"
            value={comment}
            onChange={handleCommentChange}
            placeholder="شارك في النقاش... (يدعم تنسيق Markdown)"
            helperText="يدعم تنسيق Markdown"
            disabled={isSubmittingComment}
          />
          <div className="-mt-6 flex justify-end">
            <Button
              onClick={handleSubmitComment}
              variant="primary"
              size="sm"
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? 'جاري الإرسال...' : 'إضافة تعليق'}
            </Button>
          </div>
        </div>

        <CommentListing thread={thread} refreshThread={refreshThread} />
      </div>

      <SimilarThreads
        threadPageId={parseInt(discussionId)}
        threads={similarThreads}
        lastElementRef={lastElementRef}
        isLoading={isLoadingSimilar}
      />
    </>
  );
}

export default DiscussionPageContent;