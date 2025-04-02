import { Reply } from "lucide-react";
import { ThreadItemProps } from "../ThreadListing/ThreadItem";
import CommentItem from "./CommentItem";

interface CommentListingProps {
  thread: ThreadItemProps;
}

function CommentListing({ thread }: CommentListingProps) {
  if (!thread.comments) {
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
          key={comment.id}
          {...comment}
        />
      ))}
    </div>
  )
}

export default CommentListing;