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

function DiscussionPageContent({ discussionId }: { discussionId: string }) {
  const router = useRouter();
  const { auth } = useAuth();
  useAuthRedirect();
  
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [similarThreads, setSimilarThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadThread = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const threadResult = await fetchThreadById(parseInt(discussionId));

      if (threadResult.success && threadResult.data) {
        setThread(threadResult.data);

        // Fetch similar threads (have same category)
        const threadsResult = await fetchThreads();
        if (threadsResult.success && threadsResult.data) {
          const threadsData = threadsResult.data.data;
          const currentThread = threadResult.data;
          if (Array.isArray(threadsData)) {
            const similarThreads = threadsData
              .filter((t: Thread) => t.category_id === currentThread.category_id && t.thread_id !== currentThread.thread_id)
              .slice(0, 3);
            setSimilarThreads(similarThreads);
          }
        }
      } else {
        setError(threadResult.error?.message || 'حدث خطأ أثناء تحميل المناقشة');
        toast.error(threadResult.error?.message || 'حدث خطأ أثناء تحميل المناقشة');
      }
    } catch (err) {
      console.error('Thread loading error:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل المناقشة';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [discussionId]);

  useEffect(() => {
    loadThread();
  }, [discussionId, loadThread]);

  if (auth.loading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  const refreshThread = async () => {
    if (!thread) return;
    const result = await fetchThreadById(thread?.thread_id);
    if (result.success && result.data) {
      setThread(result.data);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("الرجاء إدخال تعليق");
      return;
    }
    if (!thread) return;

    try {
      setIsSubmittingComment(true);

      await createComment(thread.thread_id, comment);

      await loadThread();

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
    if (!thread || !window.confirm('هل أنت متأكد من حذف هذه المناقشة؟')) return;

    try {
      setIsDeleting(true);
      const result = await deleteThread(thread.thread_id);

      if (result.success) {
        toast.success('تم حذف المناقشة بنجاح');
        router.push('/explore');
      } else {
        toast.error(result.error?.message || 'حدث خطأ أثناء حذف المناقشة');
      }
    } catch (err) {
      console.error('Error deleting thread:', err);
      toast.error('حدث خطأ أثناء حذف المناقشة');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error} />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="space-y-4">
        <ErrorAlert message="لم يتم العثور على المناقشة المطلوبة" />
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{thread?.title}</h1>

      <div className="flex flex-col gap-6">
        <ThreadItem
          {...thread}
          showFullContent={true}
          hideTitle
          onEdit={handleThreadUpdate}
          onDelete={handleThreadDelete}
          isDeleting={isDeleting}
        />

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <Textarea
            textareaSize="sm"
            value={comment}
            onChange={handleCommentChange}
            placeholder="شارك في النقاش... (يدعم تنسيق Markdown)"
            helperText="يدعم تنسيق Markdown"
          />
          <div className="-mt-6 flex justify-end">
            <Button
              onClick={handleSubmitComment}
              variant="primary"
              size="sm"
              isLoading={isSubmittingComment}
              loadingText="جاري الإرسال..."
            >
              إضافة تعليق
            </Button>
          </div>
        </div>

        <CommentListing thread={thread} refreshThread={refreshThread}/>
      </div>

      <SimilarThreads
        threadPageId={parseInt(discussionId)}
        threads={similarThreads}
      />
    </>
  );
}

export default DiscussionPageContent;