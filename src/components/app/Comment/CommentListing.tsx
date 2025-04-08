import { Reply } from "lucide-react";
import { Thread } from "@/types/thread";
import CommentItem from "./CommentItem";
import { updateComment, deleteComment } from "@/services/threadService";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

interface CommentListingProps {
  thread: Thread;
  refreshThread: () => Promise<void>;
}

function CommentListing({ thread, refreshThread }: CommentListingProps) {
  const { auth } = useAuth();

  // TODO: Currently only accessToken is available in auth context
  // Will be updated when we implement full user data storage:
  // const currentUserId = auth?.user?.id || '0';
  // For now using hardcoded value for development
  const currentUserId = '1';

  const handleEditComment = async (commentId: number, newContent: string) => {
    try {
      await updateComment(thread.thread_id, commentId, newContent);
      await refreshThread();
      toast.success("تم تحديث التعليق بنجاح");
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء تحديث التعليق"
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
        error instanceof Error ? error.message : "حدث خطأ أثناء حذف التعليق"
      );
    }
  };

  if (!thread.comments || thread.comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Reply className="w-12 h-12 text-gray-300 mb-3" />
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
          author={{
            name: comment.author.name || comment.author.username,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              comment.author.username
            )}&background=random`,
            id: comment.author.id.toString(),
          }}
          content={comment.content}
          timestamp={comment.created_at}
          votes={comment.votes}
          currentUserId={currentUserId}
          onEdit={(newContent) => handleEditComment(comment.comment_id, newContent)}
          onDelete={() => handleDeleteComment(comment.comment_id)}
        />
      ))}
    </div>
  );
}

export default CommentListing;