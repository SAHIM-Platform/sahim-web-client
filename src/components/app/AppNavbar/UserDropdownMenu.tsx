import { ChevronDown } from "lucide-react";
import UserInfo from "../UserInfo";
import { currentUser } from "@/data/mock-api";
import useLogout from "@/hooks/useLogout";

function UserDropdownMenu() {
  const logout = useLogout();

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
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </UserInfo>
    </div>
  )
}

export default UserDropdownMenu;