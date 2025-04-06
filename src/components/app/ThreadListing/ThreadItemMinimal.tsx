import { MessageSquare } from "lucide-react";
import Link from "next/link";
import DateBadge from "../Badge/DateBadge";
import { ThreadMinimal } from "@/types/thread";

type ThreadItemMinimalProps = ThreadMinimal;

function ThreadItemMinimal({
  thread_id,
  title,
  commentsCount,
  created_at
}: ThreadItemMinimalProps) {
  return (
    <Link
      href={`/discussions/${thread_id}`}
      className="w-full block px-3 py-2 rounded-lg transition-colors hover:bg-gray-100/80"
    >
      <h4 className="text-sm font-medium line-clamp-2 text-gray-700">
        {title}
      </h4>
      <div className="flex items-center gap-2 text-xs mt-1 text-gray-500">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{commentsCount} ردود</span>
        </div>
        <span>•</span>
        <DateBadge label={created_at} />
      </div>
    </Link>
  );
}

export default ThreadItemMinimal;