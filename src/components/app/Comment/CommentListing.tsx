import { Reply } from "lucide-react";
import { Thread } from "@/types/thread";
import CommentItem from "./CommentItem";

interface CommentListingProps {
  thread: Thread;
}

function CommentListing({ thread }: CommentListingProps) {
  if (!thread.comments || thread.comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Reply className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500">لا توجد ردود</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {thread.comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          id={comment.comment_id.toString()}
          author={{
            name: comment.author.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.username)}&background=random`
          }}
          content={comment.content}
          timestamp={comment.created_at}
          votes={comment.votes}
        />
      ))}
    </div>
  )
}

export default CommentListing;