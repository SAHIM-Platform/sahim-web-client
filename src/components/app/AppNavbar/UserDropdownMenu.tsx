import { ChevronDown } from "lucide-react";
import UserInfo from "../UserInfo";
import { currentUser } from "@/data/mock-api";
import useLogout from "@/hooks/useLogout";

function UserDropdownMenu() {
  const { logout, error, isLoading } = useLogout();

  return (
    <div className="relative space-x-6">
      <UserInfo
        name={currentUser.name}
        photo={currentUser.avatar}
      >
        <ChevronDown className="w-4 h-4 text-gray-500" />
        <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md py-2">
          <button
            onClick={logout}
            disabled={isLoading}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
          {error && (
            <p className="px-4 py-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </UserInfo>
    </div>
  )
}

export default UserDropdownMenu;