import { cn } from "@/utils/utils";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import UserInfo from "../UserInfo";
import Excerpt from "@/components/Excerpt";
import Button from "@/components/Button";
import { ArrowUp, ArrowDown, MessageSquare, Share2, Loader2, Ellipsis, Edit, Trash2 } from "lucide-react";
import CategoryBadge from "../Badge/CategoryBadge";
import { CommentItemProps } from "../Comment/CommentItem";
import BookmarkToggle from "@/components/BookmarkToggle";
import { voteThread } from "@/services/threadService";
import toast from "react-hot-toast";
import { Thread } from "@/types/thread";
import Divider from "@/components/Divider";
import EditThreadModal from "../../Modal/EditThreadModal";
import useAuth from "@/hooks/useAuth";

export interface ThreadItemProps extends Omit<Thread, 'title' | 'comments'> {
  title: string;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReply?: () => void;
  onShare?: () => void;
  onEdit?: (updatedThread: Thread) => void;
  onDelete?: () => void;
  className?: string;
  showFullContent?: boolean;
  comments?: Thread['comments'];
  hideTitle?: boolean;
  thumbnail_url?: string;
}

const ThreadItem = ({
  thread_id,
  bookmarked,
  title: initialTitle,
  author,
  content: initialContent,
  created_at,
  category: initialCategory,
  votes,
  _count,
  thumbnail_url,
  onUpvote,
  onDownvote,
  onReply,
  onShare,
  onEdit,
  onDelete,
  className,
  showFullContent = false,
  hideTitle = false,
}: ThreadItemProps) => {
  const { auth } = useAuth();
  const isOwner = auth.user?.id?.toString() === author.id.toString();

  // Use refs to store the initial values
  const initialVoteCount = useRef(votes.score ?? 0);
  const initialUserVote = useRef(votes.user_vote);

  // State for current values
  const [localVoteCount, setLocalVoteCount] = useState(initialVoteCount.current);
  const [localUserVote, setLocalUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote.current ?? null);
  const [isVoting, setIsVoting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const lastVoteTime = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State for thread data that can be updated
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);

  // Update initial values when props change
  useEffect(() => {
    initialVoteCount.current = votes.score ?? 0;
    initialUserVote.current = votes.user_vote;
    setLocalVoteCount(votes.score ?? 0);
    setLocalUserVote(votes.user_vote ?? null);
  }, [votes.score, votes.user_vote]);

  // Update thread data when props change
  useEffect(() => {
    setTitle(initialTitle || "");
    setContent(initialContent);
    setCategory(initialCategory);
  }, [initialTitle, initialContent, initialCategory]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVote = useCallback(async (voteType: "UP" | "DOWN", e: React.MouseEvent) => {
    e.preventDefault();

    // Prevent rapid voting (debounce)
    const now = Date.now();
    if (now - lastVoteTime.current < 500) return;
    lastVoteTime.current = now;

    if (isVoting) return;

    const previousVote = localUserVote;
    const previousCount = localVoteCount;

    try {
      setIsVoting(true);

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

      // Make API call
      const response = await voteThread(thread_id, voteType);

      // Verify the response is valid
      if (!response.success) {
        throw new Error('Vote update failed');
      }

      // Update with server response
      setLocalVoteCount(response.votesCount);
      setLocalUserVote(response.userVote);

      // Update initial values to match server state
      initialVoteCount.current = response.votesCount;
      initialUserVote.current = response.userVote;

      // Call parent handlers
      if (voteType === "UP" && onUpvote) onUpvote();
      if (voteType === "DOWN" && onDownvote) onDownvote();
    } catch (error) {
      // Revert to previous state
      setLocalUserVote(previousVote);
      setLocalVoteCount(previousCount);

      // Show error message
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('حدث خطأ أثناء التصويت. حاول مرة أخرى.');
      }
    } finally {
      setIsVoting(false);
    }
  }, [thread_id, localUserVote, localVoteCount, isVoting, onUpvote, onDownvote]);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onDelete?.();
  };

  const handleEditSuccess = (updatedThread: Thread) => {
    // Update the local state with the new thread data
    if (updatedThread) {
      // Update the title if it exists in the updated thread
      if (updatedThread.title) {
        setTitle(updatedThread.title);
      }

      // Update the content
      setContent(updatedThread.content);

      // Update the category
      if (updatedThread.category) {
        setCategory(updatedThread.category);
      }
    }

    // Call the parent handler
    onEdit?.(updatedThread);
    toast.success('تم تحديث المناقشة بنجاح');
  };

  return (
    <>
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
              photoPath={author.photoPath}
              date={created_at}
            />
            <div className="flex items-center gap-2">
              <CategoryBadge name={category.name} />
              {isOwner && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleDropdownToggle}
                    className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Ellipsis className="w-6 h-6 text-gray-500" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-10 transition-all duration-200 transform origin-top">
                      <Button
                        onClick={handleEdit}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-start"
                        icon={<Edit className="w-4 h-4" />}
                      >
                        تعديل المناقشة
                      </Button>
                      <Divider label="" />
                      <Button
                        onClick={handleDelete}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 justify-start"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        حذف المناقشة
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              {!hideTitle && (
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

            {thumbnail_url && (
              <div className="relative w-full aspect-[6/4] rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={thumbnail_url}
                  alt={title || 'Discussion thumbnail'}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="flex items-center pt-4 border-t border-gray-200">
            <Button
              onClick={(e) => handleVote("UP", e)}
              variant='ghost'
              size="sm"
              color="secondary"
              disabled={isVoting}
              icon={isVoting ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> :
                <ArrowUp className={cn(
                  "w-[18px] h-[18px] transition-colors duration-200",
                  localUserVote === "UP" && "text-primary",
                  isVoting && "opacity-50"
                )} />}
            />

            <span className={cn(
              "text-sm m-1 transition-all duration-200",
              isVoting && "opacity-50"
            )}>{localVoteCount}</span>

            <Button
              onClick={(e) => handleVote("DOWN", e)}
              variant='ghost'
              size="sm"
              color="secondary"
              disabled={isVoting}
              icon={isVoting ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> :
                <ArrowDown className={cn(
                  "w-[18px] h-[18px] transition-colors duration-200",
                  localUserVote === "DOWN" && "text-primary",
                  isVoting && "opacity-50"
                )} />}
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
              {_count?.comments ?? 0}
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
            <BookmarkToggle threadId={thread_id} initiallyBookmarked={bookmarked === true} />
          </div>
        </div>
      </Link>

      <EditThreadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        thread={{
          thread_id,
          title: title,
          content,
          category_id: category.category_id,
          author_user_id: author.id,
          author,
          created_at,
          category,
          votes,
          thumbnail_url,
          _count,
        }}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default ThreadItem;