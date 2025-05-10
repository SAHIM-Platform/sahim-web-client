import { unreadNotifications } from "@/data/mock-api";
import { Bell } from "lucide-react";

function NotificationsBadge() {
  return (
    <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
      <Bell className="w-5 h-5" />
      {unreadNotifications > 0 && (
        <span className="absolute top-1 left-1 w-4 h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
          {unreadNotifications > 99 ? "99+" : unreadNotifications}
        </span>
      )}
    </button>
  )
}

export default NotificationsBadge;
