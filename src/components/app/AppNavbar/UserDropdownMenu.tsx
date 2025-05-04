import { ChevronDown, User, LogOut, MessageSquare } from "lucide-react";
import UserInfo from "../UserInfo";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import Divider from "@/components/Divider";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { FrontendRoutes } from "@/data/routes";
import { useCurrentUserInfo, useLogout } from "@/hooks";

function UserDropdownMenu() {
  const { logout, error, isLoading } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { photoPath, username, role } = useCurrentUserInfo();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <UserInfo
          role={role}
          photoPath={photoPath}
          name={username}
          hideDetailsOnSmallScreens={true}
        >
          <ChevronDown className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </UserInfo>
      </button>

      <div
        className={cn(
          "absolute top-full right-0 mt-2 w-44 md:w-48 bg-white border border-gray-200 shadow-lg rounded-md transition-all duration-200 transform origin-top",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div>
          <Link
            href={FrontendRoutes.MY_DISCUSSIONS}
            onClick={handleItemClick}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            <MessageSquare className="w-4 h-4" />
            مناقشاتي
          </Link>
        </div>
        <div>
          <Link
            href={FrontendRoutes.PROFILE}
            onClick={handleItemClick}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4" />
            الملف الشخصي
          </Link>
        </div>
        <Divider label="" />
        <button
          onClick={() => {
            handleItemClick();
            logout();
          }}
          disabled={isLoading}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          {isLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
        </button>
        {error && (
          <p className="px-4 pb-2 text-xs text-red-600">{RESPONSE_MESSAGES.logout.DEFAULT}</p>
        )}
      </div>
    </div>
  );
}

export default UserDropdownMenu;