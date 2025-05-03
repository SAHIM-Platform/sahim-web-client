import { Loader2, ArrowDown, ArrowUp, Ellipsis, Edit, Trash2 } from "lucide-react";
import UserInfo from "../UserInfo";
import { cn } from "@/utils/utils";
import Button from "@/components/Button";
import { useRef, useState, useEffect } from "react";
import Divider from "@/components/Divider";
import Textarea from "@/components/Textarea";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import ERROR_MESSAGES from "@/utils/constants/ERROR_MESSAGES";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { voteComment } from "@/services/threadService";
import MarkdownRenderer from '@/components/app/MarkdownRenderer';

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
  threadId: number;
}

function CommentItem({ 
  id, 
  content, 
  timestamp, 
  votes, 
  onEdit,
  onDelete,
  threadId
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
      const result = await voteComment(threadId, parseInt(id), voteType);
      
      if (result.success) {
        setLocalVoteCount(result.votesCount);
        setLocalUserVote(result.userVote);
      } else {
        throw new Error(ERROR_MESSAGES.comment.DEFAULT);
      }
    } catch (error) {
      setLocalUserVote(previousVote);
      setLocalVoteCount(previousCount);
      toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.comment.DEFAULT);
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
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete();
      }
    } catch {
      toast.error(ERROR_MESSAGES.comment.DELETE_FAILED);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
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
    <div className="flex gap-1 items-start" data-comment-id={id}>
      <div className="bg-white rounded-xl border border-gray-200 px-6 pt-6 pb-3 w-full relative transition-all duration-200">
        <div className="flex justify-between items-start">
          <UserInfo name={auth.user?.name} date={timestamp} photoPath={auth.user?.photoPath} />
          
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
            <MarkdownRenderer content={content} />
          </div>
        )}

        <div className="flex items-center gap-1 mt-4">
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف التعليق"
        message="هل أنت متأكد من حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        confirmButtonVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default CommentItem;