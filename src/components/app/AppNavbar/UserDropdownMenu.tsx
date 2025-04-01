import { currentUser } from "@/data/mock-api";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

function UserDropdownMenu() {
  return (
    <div className="relative space-x-6">
      <button
        className="flex items-center gap-2 pr-2 pl-1 h-9 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Image
          src={currentUser.avatar}
          alt={currentUser.name}
          width={32}
          height={32}
          objectFit="cover"
          className="rounded-full ring-2 ring-white"
        />
        <span className="text-[14px] font-medium text-gray-700">{currentUser.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}

export default UserDropdownMenu;