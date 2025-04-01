import { cn } from "@/utils/utils";
import Link from "next/link";
import UserInfo from "../UserInfo";
import Excerpt from "@/components/Excerpt";
import Button from "@/components/Button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import CategoryBadge from "../Badge/CategoryBadge";

export interface ThreadItemProps {
  id: string;
  title?: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  category: string;
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  className?: string;
}

const ThreadItem = ({
  id,
  title,
  author,
  content,
  timestamp,
  likesCount,
  repliesCount,
  category,
  isLiked,
  onLike,
  onReply,
  onShare,
  className,
}: ThreadItemProps) => {
  return (
    <Link
      href={`/discussions/${id}`}
      className={cn(
        "block bg-white rounded-xl border hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <UserInfo
            photo={author.avatar}
            name={author.name}
            date={timestamp}
          />

          <CategoryBadge name={category} />
        </div>

        <div className="space-y-2">
          {title && (
            <h4 className="text-sm sm:text-base font-medium text-gray-800">
              {title}
            </h4>
          )}
          <Excerpt content={content} />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onLike?.();
            }}
            variant='ghost'
            icon={<Heart className={cn("w-[18px] h-[18px]", isLiked && "fill-primary text-primary")} />}
          >
            {likesCount}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onReply?.();
            }}
            variant='ghost'
            icon={<MessageSquare className="w-[18px] h-[18px]" />}
          >
            {repliesCount}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onShare?.();
            }}
            variant='ghost'
            icon={<Share2 className="w-[18px] h-[18px]" />}
          >
            مشاركة
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ThreadItem; 