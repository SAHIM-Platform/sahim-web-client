import { MessageSquare } from "lucide-react";

interface DiscussionsBadgeProps {
  children: React.ReactNode;
}

function DiscussionsBadge({ children }: DiscussionsBadgeProps) {
  return (
    <span className="flex items-center gap-1 text-gray-700 text-sm">
      <MessageSquare className="w-4 h-4" />
      {children}
    </span>
  )
}

export default DiscussionsBadge;
