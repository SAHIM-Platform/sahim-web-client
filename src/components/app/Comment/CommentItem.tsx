import { Loader2, ArrowDown, ArrowUp } from "lucide-react";
import UserInfo from "../UserInfo";
import { cn } from "@/utils/utils";
import Button from "@/components/Button";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Thread } from "@/types/thread";

export interface CommentItemProps {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  votes: {
    score: number;
    user_vote: "UP" | "DOWN" | null;
  };
}

function CommentItem({ author, content, timestamp, votes }: CommentItemProps) {
  // Use refs to store the initial values
  const initialVoteCount = useRef(votes.score ?? 0);
  const initialUserVote = useRef(votes.user_vote);

  // State for current values
  const [localVoteCount, setLocalVoteCount] = useState(initialVoteCount.current);
  const [localUserVote, setLocalUserVote] = useState<"UP" | "DOWN" | null>(initialUserVote.current ?? null);
  const [isVoting, setIsVoting] = useState(false);
  const lastVoteTime = useRef<number>(0);

  // Update initial values when props change
  useEffect(() => {
    initialVoteCount.current = votes.score ?? 0;
    initialUserVote.current = votes.user_vote;
    setLocalVoteCount(votes.score ?? 0);
    setLocalUserVote(votes.user_vote ?? null);
  }, [votes.score, votes.user_vote]);

  const handleVote = async (voteType: "UP" | "DOWN", e: React.MouseEvent) => {
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
    } catch (error) {
      // Revert to previous state
      setLocalUserVote(previousVote);
      setLocalVoteCount(previousCount);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex gap-1 items-start">
      <UserInfo
        photo={author.avatar}
        photoAlt={author.name}
      />
      <div className="bg-white rounded-xl border border-gray-200 px-6 pt-6 pb-3 w-full">
        <UserInfo
          name={author.name}
          date={timestamp}
        />
        <p className="mt-4 text-xs text-gray-600 leading-relaxed">
          {content}
        </p>

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
  )
}

export default CommentItem;