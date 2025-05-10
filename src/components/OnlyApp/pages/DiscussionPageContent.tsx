'use client';

import ThreadItem from "@/components/OnlyApp/ThreadListing/ThreadItem";
import { useRouter } from "next/navigation";
import SimilarThreads from "@/components/OnlyApp/SimilarThreads";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Thread } from "@/types";
import { toast } from "react-hot-toast";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import CommentListing from "@/components/OnlyApp/Comment/CommentListing";
import { RefreshCw } from "lucide-react";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import ItemNotFound from "../NotFound/ItemNotFound";
import { useAuth, useInfiniteScroll } from "@/hooks";
import { deleteThread, fetchThreadById, fetchThreads } from "@/services/thread/threadService";
import { createComment } from "@/services/thread/commentService";

function DiscussionPageContent({ discussionId }: { discussionId: string }) {
  const router = useRouter();
  const { auth } = useAuth();
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

      if (threadResult.success) {
        const threadData = {
          ...threadResult.data,
          author: {
            ...threadResult.data.author,
          },
        };
        setThread(threadData);
      } else {
        setError(threadResult.error.message || 'حدث خطأ أثناء تحميل المناقشة');
        toast.error(threadResult.error.message || 'حدث خطأ أثناء تحميل المناقشة');
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

      if (threadsResult.success) {
        const filtered = threadsResult.data.filter(t => t.thread_id !== thread.thread_id);
        setSimilarThreads(filtered);
        setHasMore(threadsResult.meta ? threadsResult.meta.page < threadsResult.meta.totalPages : false);
        setPage(2);
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

      if (threadsResult.success) {
        const newThreads = threadsResult.data.filter(t => t.thread_id !== thread.thread_id);
        setSimilarThreads(prev => [...prev, ...newThreads]);
        setHasMore(threadsResult.meta ? threadsResult.meta.page < threadsResult.meta.totalPages : false);
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
      const result = await createComment(thread.thread_id, { content: comment });
  
      if (result.success) {
        const refreshResult = await fetchThreadById(thread.thread_id);
        if (refreshResult.success) {
          setThread(prev => ({
            ...prev!,
            comments: refreshResult.data.comments,
          }));
  
          const newCommentElement = document.querySelector(`[data-comment-id="${result.data.comment_id}"]`);
          if (newCommentElement) {
            newCommentElement.classList.add('border-primary', 'shadow-lg');
            setTimeout(() => {
              newCommentElement.classList.remove('border-primary', 'shadow-lg');
            }, 2000);
          }
  
          toast.success("تم إضافة تعليقك بنجاح");
          setComment("");
        } else {
          toast.error(refreshResult.error.message || RESPONSE_MESSAGES.comment.DEFAULT);
        }
      } else {
        toast.error(result.error.message || RESPONSE_MESSAGES.comment.DEFAULT);
      }
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
        toast.error(result.error.message || 'حدث خطأ أثناء حذف المناقشة');
      }      
    } catch {
      toast.error('حدث خطأ أثناء حذف المناقشة');
    }
  };

  const refreshThread = async () => {
    if (!thread) return;
    const result = await fetchThreadById(thread.thread_id);
    if (result.success) {
      setThread(result.data);
    } else {
      toast.error(result.error.message || RESPONSE_MESSAGES.thread.DEFAULT);
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
          thumbnail_url={thread.thumbnail_url || undefined}
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