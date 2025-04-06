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
import { CommentItemProps } from "../Comment/CommentItem";
import { Thread } from "@/types/thread";

export interface ThreadItemProps extends Omit<Thread, 'title'> {
  title?: string;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  className?: string;
  showFullContent?: boolean;
  comments?: CommentItemProps[];
}

const ThreadItem = ({
  thread_id,
  title,
  author,
  content,
  created_at,
  category,
  votes,
  _count,
  onUpvote,
  onDownvote,
  onReply,
  onShare,
  className,
  showFullContent = false,
}: ThreadItemProps) => {
  const [localVoteCount, setlocalVoteCount] = useState(votes.score ?? 0);
  const [localUserVote, setlocalUserVote] = useState<"up" | "down" | null>(votes.user_vote ?? null);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (localUserVote === "up") {
      setlocalUserVote(null);
      setlocalVoteCount(prev => prev - 1);
    } else {
      setlocalUserVote("up");
      setlocalVoteCount(prev => prev + (localUserVote === "down" ? 2 : 1));
    }
    onUpvote?.();
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (localUserVote === "down") {
      setlocalUserVote(null);
      setlocalVoteCount(prev => prev + 1);
    } else {
      setlocalUserVote("down");
      setlocalVoteCount(prev => prev - (localUserVote === "up" ? 2 : 1));
    }
    onDownvote?.();
  };

  return (
    <Link
      href={`/discussions/${thread_id}`}
      className={cn(
        "block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="px-6 pt-6 pb-3 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <UserInfo
            name={author.name}
            date={created_at}
          />

          <CategoryBadge name={category.name} />
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

        <div className="flex items-center pt-4 border-t border-gray-200">
          <Button
            onClick={handleUpvote}
            variant='ghost'
            size="sm"
            color="secondary"
            icon={<ArrowUp className={cn("w-[18px] h-[18px]", localUserVote === "up" && "text-primary")} />}
          ></Button>

          <span className="text-sm m-1">{localVoteCount}</span>

          <Button
            onClick={handleDownvote}
            variant='ghost'
            size="sm"
            color="secondary"
            icon={<ArrowDown className={cn("w-[18px] h-[18px]", localUserVote === "down" && "text-primary")} />}
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
            {_count.comments}
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