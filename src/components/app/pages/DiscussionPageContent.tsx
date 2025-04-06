'use client';

import ThreadItem from "@/components/app/ThreadListing/ThreadItem";
import { notFound } from "next/navigation";
import SimilarThreads from "@/components/app/SimilarThreads";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useState, ChangeEvent, useEffect } from "react";
import { Thread } from "@/types/thread";
import { toast } from "react-hot-toast";
import { fetchThreadById, fetchThreads } from "@/services/threadService";
import ErrorAlert from "@/components/Form/ErrorAlert";
import LoadingSpinner from "@/components/LoadingSpinner";
import CommentListing from "@/components/app/Comment/CommentListing";

function DiscussionPageContent({ discussionId }: { discussionId: string }) {
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState<Thread | null>(null);
  const [similarThreads, setSimilarThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadThread = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const threadResult = await fetchThreadById(parseInt(discussionId));
        
        if (threadResult.success && threadResult.data) {
          setThread(threadResult.data);
          
          // Fot similar threads (have same category)
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
    };

    loadThread();
  }, [discussionId]);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    console.log("Submitting comment:", comment);
    setComment("");
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  if (isLoading) {
    return <LoadingSpinner />;
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

  const { title, ...restThread } = thread;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>

      <div className="space-y-6">
        <ThreadItem
          {...restThread}
          showFullContent={true}
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
            >
              إضافة تعليق
            </Button>
          </div>
        </div>

        <CommentListing thread={thread} />
      </div>

      <SimilarThreads
        threadPageId={parseInt(discussionId)}
        threads={similarThreads}
      />
    </>
  );
}

export default DiscussionPageContent;