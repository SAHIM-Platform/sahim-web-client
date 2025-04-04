import { cn } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";
import UserInfo from "../UserInfo";
import Excerpt from "@/components/Excerpt";
import Button from "@/components/Button";
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from "lucide-react";
import CategoryBadge from "../Badge/CategoryBadge";
import Image from "next/image";
import { CommentItemProps } from "../Comment/CommentItem";

export interface ThreadItemProps {
  id: string;
  title?: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  thumbnail?: string;
  timestamp: string;
  votesCount: number;
  repliesCount: number;
  category: string;
  userVote?: "upvote" | "downvote" | null;
  // onLike?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  className?: string;
  showFullContent?: boolean;
  comments?: CommentItemProps[];
}

const ThreadItem = ({
  id,
  title,
  author,
  content,
  thumbnail,
  timestamp,
  votesCount,
  repliesCount,
  category,
  userVote,
  onUpvote,
  onDownvote,
  onReply,
  onShare,
  className,
  showFullContent = false,
}: ThreadItemProps) => {
  const [localVoteCount, setlocalVoteCount]= useState(votesCount);
  const [localUserVote, setlocalUserVote]= useState<"upvote" | "downvote" | null>(userVote ?? null);
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if(localUserVote === "upvote") {
      setlocalUserVote(null);
      setlocalVoteCount(prev => prev - 1);
    } else {
      setlocalUserVote("upvote");
      setlocalVoteCount(prev => prev + (localUserVote === "downvote" ? 2 : 1) );
    }
    onUpvote?.();
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if(localUserVote === "downvote") {
      setlocalUserVote(null);
      setlocalVoteCount(prev => prev + 1);
    } else {
      setlocalUserVote("downvote");
      setlocalVoteCount(prev => prev - (localUserVote === "upvote" ? 2 : 1) );
    }
    onDownvote?.();
  };

  return (
    <Link
      href={`/discussions/${id}`}
      className={cn(
        "block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="px-6 pt-6 pb-3 space-y-6">
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
          {showFullContent ? (
            <p className="text-xs sm:text-sm text-gray-600 leading-[2] sm:leading-[2] line-clamp-3">{content}</p>
          ) : (
            <Excerpt content={content} className="text-gray-600" />
          )}
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
          onClick={handleUpvote}
          variant='ghost'
          size="sm"
          color="secondary"
          icon={<ArrowUp className={cn("w-[18px] h-[18px]", localUserVote === "upvote" && "fill-primary text-primary")}/>}
          ></Button>

          <span className="text-sm m-1">{localVoteCount}</span>

          <Button
          onClick={handleDownvote}
          variant='ghost'
          size="sm"
          color="secondary"
          icon={<ArrowDown className={cn("w-[18px] h-[18px]", localUserVote === "downvote" && "fill-primary text-primary")}/>}
          ></Button>
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