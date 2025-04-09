import { User } from "lucide-react";

interface UsersBadgeProps {
  children: React.ReactNode;
}

function UsersBadge({ children }: UsersBadgeProps) {
  return (
    <span className="flex items-center gap-1 text-gray-700 text-sm">
      <User className="w-4 h-4" />
      {children}
    </span>
  )
}

export default UsersBadge;
