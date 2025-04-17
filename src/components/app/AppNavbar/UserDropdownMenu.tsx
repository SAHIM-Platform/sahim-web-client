import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import UserInfo from "../UserInfo";
import { currentUser } from "@/data/mock-api";
import useLogout from "@/hooks/useLogout";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import Divider from "@/components/Divider";
import useAuth from "@/hooks/useAuth";

function UserDropdownMenu() {
  const { logout, error, isLoading } = useLogout();
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user information from auth state
  const userName = auth.user?.name || "مستخدم";

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
          photoPath={auth.user?.photoPath}
          name={userName}
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
          "absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md transition-all duration-200 transform origin-top",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div>
          <Link
            href="/profile"
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
          <p className="px-4 pb-2 text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

export default UserDropdownMenu;