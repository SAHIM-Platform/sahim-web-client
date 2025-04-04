'use client';

import ThreadItem from "@/components/app/ThreadListing/ThreadItem";
import { discussionThreads } from "@/data/mock-api";
import { notFound } from "next/navigation";
import SimilarThreads from "@/components/app/SimilarThreads";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import { useState, ChangeEvent } from "react";
import CommentListing from "@/components/app/Comment/CommentListing";

function DiscussionPageContent({ discussionId }: { discussionId: string }) {
  const [comment, setComment] = useState("");

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    console.log("Submitting comment:", comment);
    setComment("");
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const thread = discussionThreads.find(t => t.id === discussionId);

  if (!thread) {
    notFound();
  }

  const { title, ...restThread } = thread;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{title}</h1>

      <div className="space-y-6">
        <ThreadItem
          {...restThread}
          showFullContent={true}
          votesCount={0}
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
        threadPageId={discussionId}
        threads={discussionThreads}
      />
    </>
  );
}

export default DiscussionPageContent;