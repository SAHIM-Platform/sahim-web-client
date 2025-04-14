import { Loader2, ArrowDown, ArrowUp, Ellipsis, Edit, Trash2 } from "lucide-react";
import UserInfo from "../UserInfo";
import { cn } from "@/utils/utils";
import Button from "@/components/Button";
import { useRef, useState, useEffect } from "react";
import Divider from "@/components/Divider";
import Textarea from "@/components/Textarea";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";

export interface CommentItemProps {
  id: string;
  content: string;
  timestamp: string;
  votes: {
    score: number;
    user_vote: "UP" | "DOWN" | null;
  };
  onEdit?: (newContent: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function CommentItem({
  content,
  timestamp,
  votes,
  onEdit,
  onDelete
}: CommentItemProps) {
  const { auth } = useAuth();
  const isOwner = auth.user?.id?.toString() === auth.user?.id?.toString();

  // Voting state
  const initialVoteCount = useRef(votes.score ?? 0);
  const initialUserVote = useRef(votes.user_vote);
  const [localVoteCount, setLocalVoteCount] = useState(initialVoteCount.current);
  const [localUserVote, setLocalUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote.current ?? null);
  const [isVoting, setIsVoting] = useState(false);
  const lastVoteTime = useRef<number>(0);

  // Edit/Delete state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update initial values when props change
  useEffect(() => {
    initialVoteCount.current = votes.score ?? 0;
    initialUserVote.current = votes.user_vote;
    setLocalVoteCount(votes.score ?? 0);
    setLocalUserVote(votes.user_vote ?? null);
  }, [votes.score, votes.user_vote]);

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

  const handleVote = async (voteType: "UP" | "DOWN", e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastVoteTime.current < 500) return;
    lastVoteTime.current = now;
    if (isVoting) return;

    const previousVote = localUserVote;
    const previousCount = localVoteCount;

    try {
      setIsVoting(true);
      if (localUserVote === voteType) {
        setLocalUserVote(null);
        setLocalVoteCount(prev => prev + (voteType === "UP" ? -1 : 1));
      } else {
        setLocalUserVote(voteType);
        setLocalVoteCount(prev =>
          prev + (voteType === "UP" ? 1 : -1) + (previousVote ? (previousVote === "UP" ? -1 : 1) : 0)
        );
      }
    } catch {
      setLocalUserVote(previousVote);
      setLocalVoteCount(previousCount);
      toast.error(ERROR_MESSAGES.comment.DEFAULT);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOwner) {
      toast.error(ERROR_MESSAGES.comment.FORBIDDEN);
      return;
    }
    setIsDropdownOpen(false);
    setIsEditing(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOwner) {
      toast.error(ERROR_MESSAGES.comment.FORBIDDEN);
      return;
    }
    setIsDropdownOpen(false);

    try {
      if (onDelete) {
        await onDelete();
      }
    } catch {
      toast.error(ERROR_MESSAGES.comment.DELETE_FAILED);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true);
      if (onEdit) {
        await onEdit(editedContent);
        setIsEditing(false);
      }
    } catch {
      toast.error(ERROR_MESSAGES.comment.UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  return (
    <div className="flex gap-1 items-start">
      <div className="bg-white rounded-xl border border-gray-200 px-6 pt-6 pb-3 w-full relative">
        <div className="flex justify-between items-start">
          <UserInfo name={auth.user?.name} date={timestamp} />

          {isOwner && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Ellipsis className="w-6 h-6 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-10">
                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-start"
                    icon={<Edit className="w-4 h-4" />}
                  >
                    تعديل
                  </Button>
                  <Divider label="" />
                  <Button
                    onClick={handleDelete}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 justify-start"
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    حذف
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleCancelEdit}
                variant="secondary"
                size="sm"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
              >
                حفظ
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-xs text-gray-600 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
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
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        <div className="mt-4">
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
        </div>
      </div>
    </div>
  );
}

export default CommentItem;