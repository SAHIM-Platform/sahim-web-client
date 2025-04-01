import { cn } from "@/utils/utils";
import Link from "next/link";
import UserInfo from "../UserInfo";
import Excerpt from "@/components/Excerpt";
import Button from "@/components/Button";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import CategoryBadge from "../Badge/CategoryBadge";
import Image from "next/image";

export interface ThreadItemProps {
  id: string;
  title?: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  thumbnail?: string;  // Add this line
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
  thumbnail, // Add this line
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
        "block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <UserInfo
            photo={author.avatar}
            name={author.name}
            date={timestamp}
          />

          <CategoryBadge name={category} />
        </div>

        <div className="space-y-3">
          {title && (
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
          )}
          <Excerpt content={content} className="text-gray-600" />
        </div>

        {thumbnail && (
          <div className="relative w-full aspect-[6/4] rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={thumbnail}
              alt={title || 'Discussion thumbnail'}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex items-center pt-4 border-t border-gray-200">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onLike?.();
            }}
            variant='ghost'
            size="sm"
            color="secondary"
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
            size="sm"
            color="secondary"
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
            size="sm"
            color="secondary"
            className="mr-auto"
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