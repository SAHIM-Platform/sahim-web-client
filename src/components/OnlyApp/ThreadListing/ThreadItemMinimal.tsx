import { MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { ThreadMinimal } from "@/types";
import UserInfo from "../UserInfo";
import { isUserDeleted } from '@/utils/utils';

interface ThreadItemMinimalProps extends ThreadMinimal {
  onNavigate?: () => void;
}

function ThreadItemMinimal({
  thread_id,
  title,
  commentsCount,
  created_at,
  onNavigate,
  author
}: ThreadItemMinimalProps) {
  const isDeleted = isUserDeleted({ isDeleted: author.isDeleted, name: author.name, username: author.username });
  return (
    <Link
      href={`/discussions/${thread_id}`}
      className="w-full block px-3 py-2 rounded-lg transition-colors hover:bg-gray-100/80"
      onClick={onNavigate} 
    >
      <h4 className="text-sm font-medium line-clamp-2 text-gray-700 mb-1">
        {title}
      </h4>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <UserInfo
          name={isDeleted ? "مستخدم محذوف" : author.name}
          photoPath={isDeleted ? undefined : author.photoPath}
          photoAlt={author.name}
          hideDetailsOnSmallScreens={true}
          date={created_at}
          size="sm"
        >
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{commentsCount} ردود</span>
          </div>
        </UserInfo>
      </div>
    </Link>
  );
}

export default ThreadItemMinimal;