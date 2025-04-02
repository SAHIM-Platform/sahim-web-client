import { Heart } from "lucide-react";
import UserInfo from "../UserInfo";
import { cn } from "@/utils/utils";
import Button from "@/components/Button";

export interface CommentItemProps {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likesCount: number;
  isLiked: boolean;
  onLike?: () => void;
}

function CommentItem({ author, content, timestamp, likesCount, isLiked, onLike }: CommentItemProps) {
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
          onClick={(e) => {
            e.preventDefault();
            onLike?.();
          }}
          variant='ghost'
          size="sm"
          color="secondary"
          className="mt-2"
          icon={<Heart className={cn("w-[18px] h-[18px]", isLiked && "fill-primary text-primary")} />}
        >
          {likesCount}
        </Button>
      </div>
    </div>
  )
}

export default CommentItem;