import { Reply, MessageSquare } from "lucide-react";
import { Thread } from "@/types/thread";
import CommentItem from "./CommentItem";
import { updateComment, deleteComment } from "@/services/threadService";
import toast from "react-hot-toast";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";

interface CommentListingProps {
  thread: Thread;
  refreshThread: () => Promise<void>;
}

function CommentListing({ thread, refreshThread }: CommentListingProps) {
  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await updateComment(thread.thread_id, commentId, newContent);
      await refreshThread();
      toast.success("تم تحديث التعليق بنجاح");
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error(
        error instanceof Error ? error.message : ERROR_MESSAGES.comment.UPDATE_FAILED
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
        error instanceof Error ? error.message : ERROR_MESSAGES.comment.DELETE_FAILED
      );
    }
  };

  if (!thread.comments || thread.comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">كن أول من يشارك في النقاش</p>
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
          onEdit={(newContent) => handleEditComment(comment.comment_id, newContent)}
          onDelete={() => handleDeleteComment(comment.comment_id)}
        />
      ))}
    </div>
  );
}

export default CommentListing;