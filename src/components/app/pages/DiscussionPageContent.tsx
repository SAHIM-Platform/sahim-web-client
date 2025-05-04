'use client';

import ThreadItem from "@/components/App/ThreadListing/ThreadItem";
import { useRouter } from "next/navigation";
import SimilarThreads from "@/components/App/SimilarThreads";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Thread } from "@/types";
import { toast } from "react-hot-toast";
import { createComment, fetchThreadById, fetchThreads, deleteThread } from "@/services/threadService";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import CommentListing from "@/components/App/Comment/CommentListing";
import { RefreshCw } from "lucide-react";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import ItemNotFound from "../NotFound/ItemNotFound";
import { useAuth, useAuthRedirect, useInfiniteScroll } from "@/hooks";

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
      console.log('DiscussionPageContent - API Response:', threadResult);

      if (threadResult.success && threadResult.data) {
        console.log('DiscussionPageContent - Thread Data:', threadResult.data);
        // Ensure author data is properly structured
        const threadData = {
          ...threadResult.data,
          author: {
            ...threadResult.data.author,
            photoPath: threadResult.data.author.photoPath || '/public/avatars/defaults/super-admin.webp'
          }
        };
        setThread(threadData);
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
    return <ItemNotFound description={RESPONSE_MESSAGES.thread.NOT_FOUND} />;
  }

  console.log('DiscussionPageContent - Thread Author:', {
    id: thread.author.id,
    name: thread.author.name,
    photoPath: thread.author.photoPath,
    username: thread.author.username
  });

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

        <div id="comments">
          <CommentListing thread={thread} refreshThread={refreshThread} />
        </div>
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