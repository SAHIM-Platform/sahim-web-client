import { ChevronDown } from "lucide-react";
import UserInfo from "../UserInfo";
import { currentUser } from "@/data/mock-api";

function UserDropdownMenu() {
  return (
    <div className="relative space-x-6">
      <UserInfo
        name={currentUser.name}
        photo={currentUser.avatar}
      >
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </UserInfo>
    </div>
  )
}

export default UserDropdownMenu;