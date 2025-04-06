import { cn } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import UserInfo from "../UserInfo";
import Excerpt from "@/components/Excerpt";
import Button from "@/components/Button";
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from "lucide-react";
import CategoryBadge from "../Badge/CategoryBadge";
import Image from "next/image";
import { CommentItemProps } from "../Comment/CommentItem";
import { voteThread } from "@/services/threadService";
import toast from "react-hot-toast";

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
  userVote?: "UP" | "DOWN" | null;
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
  userVote: initialUserVote,
  onReply,
  onShare,
  className,
  showFullContent = false,
}: ThreadItemProps) => {
  const [localVoteCount, setLocalVoteCount] = useState(votesCount);
  const [localUserVote, setLocalUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote ?? null);
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async (voteType: "UP" | "DOWN", e: React.MouseEvent) => {
    e.preventDefault();
    if (isVoting) return;

    const previousVote = localUserVote;
    const previousCount = localVoteCount;

    // Optimistic update
    if (localUserVote === voteType) {
      setLocalUserVote(null);
      setLocalVoteCount(prev => prev + (voteType === "UP" ? -1 : 1));
    } else {
      setLocalUserVote(voteType);
      setLocalVoteCount(prev => 
        prev + (voteType === "UP" ? 1 : -1) + (previousVote ? (previousVote === "UP" ? -1 : 1) : 0)
      );
    }

    try {
      setIsVoting(true);
      const response = await voteThread(id, voteType);
      
      // Update with actual server response
      setLocalVoteCount(response.votesCount);
      setLocalUserVote(response.userVote);
    } catch (error) {
      // Revert on error
      setLocalUserVote(previousVote);
      setLocalVoteCount(previousCount);
      toast.error('حدث خطأ أثناء التصويت. حاول مرة أخرى.');
    } finally {
      setIsVoting(false);
    }
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
            <div className="text-xs sm:text-sm text-gray-600 leading-[2] sm:leading-[2] ">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                children={content}
                components={{
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className='text-blue-400 hover:text-blue-300 underline'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => (
                    <p className='text-2xl font-bold mb-4'>{children}</p>
                  ),
                  h2: ({ children }) => (
                    <p className='text-xl font-bold mb-4 mt-4'>{children}</p>
                  ),
                  h3: ({ children }) => (
                    <p className='text-lg font-semibold mb-2 mt-2'>{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className='list-disc pl-2 mb-4 space-y-1'>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className='list-decimal pl-6 mb-4 space-y-1'>{children}</ol>
                  ),
                  p: ({ children }) => (
                    <p className='leading-8 mb-2 font-light'>{children}</p>
                  ),
                  li: ({ children }) => (
                    <li className='leading-7 pl-2 marker:text-gray-400 [&>strong]:mt-0 [&>strong]:inline'>{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className='font-semibold '>{children}</strong>
                  ),
                  code: ({ children }) => (
                    <div className="bg-gray-100 text-xs p-2 rounded-lg font-semibold" dir="ltr">
                      <code>{children}</code>
                    </div>
                  ),
                }}
              />
            </div>
            
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
            onClick={(e) => handleVote("UP", e)}
            variant='ghost'
            size="sm"
            color="secondary"
            disabled={isVoting}
            icon={<ArrowUp className={cn(
              "w-[18px] h-[18px]",
              localUserVote === "UP" && "text-primary",
              isVoting && "opacity-50"
            )}/>}
          />

          <span className="text-sm m-1">{localVoteCount}</span>

          <Button
            onClick={(e) => handleVote("DOWN", e)}
            variant='ghost'
            size="sm"
            color="secondary"
            disabled={isVoting}
            icon={<ArrowDown className={cn(
              "w-[18px] h-[18px]",
              localUserVote === "DOWN" && "text-primary",
              isVoting && "opacity-50"
            )}/>}
          />

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