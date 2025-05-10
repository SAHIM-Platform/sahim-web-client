import { MessageSquareIcon } from "lucide-react";
import { CreateCommentPayload, Thread } from "@/types";
import CommentItem from "./CommentItem";
import toast from "react-hot-toast";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { deleteComment, updateComment } from "@/services/thread/commentService";

interface CommentListingProps {
  thread: Thread;
  refreshThread: () => Promise<void>;
}

function CommentListing({ thread, refreshThread }: CommentListingProps) {
  const handleEditComment = async (commentId: number, newContent: CreateCommentPayload) => {
    try {
      await updateComment(thread.thread_id, commentId, newContent);
      await refreshThread();
      toast.success("تم تحديث التعليق بنجاح");
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error(
        error instanceof Error ? error.message : RESPONSE_MESSAGES.comment.UPDATE_FAILED
      );
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const { success } = await deleteComment(thread.thread_id, commentId);
      if (success) {
        await refreshThread();
        toast.success("تم حذف التعليق بنجاح");
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error(
        error instanceof Error ? error.message : RESPONSE_MESSAGES.comment.DELETE_FAILED
      );
    }
  };

  if (!thread.comments || thread.comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquareIcon className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500">لا توجد ردود</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {thread.comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          id={comment.comment_id.toString()}
          content={comment.content}
          timestamp={comment.created_at}
          votes={comment.votes}
          onEdit={(newContent: CreateCommentPayload) => handleEditComment(comment.comment_id, newContent)}
          onDelete={() => handleDeleteComment(comment.comment_id)}
          threadId={thread.thread_id}
          author={comment.author}
        />
      ))}
    </div>
  );
}

export default CommentListing;

