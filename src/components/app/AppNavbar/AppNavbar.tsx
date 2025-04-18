import { Menu, MessageSquare } from "lucide-react";
import Logo from "../../Logo";
import Button from "../../Button";
import UserDropdownMenu from "./UserDropdownMenu";
// import NotificationsBadge from "../Badge/NotificationsBadge";
import SearchButton from "../SearchButton";
import { routesData } from "@/data/routes";
import Link from "next/link";

interface AppNavbarProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  onToggleMenuSidebar: () => void;
  onToggleInfoSidebar: () => void;
}

function AppNavbar({ 
  isSearchFocused, 
  setIsSearchFocused,
  onToggleMenuSidebar,
  onToggleInfoSidebar,
}: AppNavbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 border-b-2 border z-50 bg-[#fafafa]">
      <div className="h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMenuSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-2">
            <Logo widthSize="sm" />
            <Link href="/" className="text-xl font-bold text-secondary">ساهم</Link>
          </div>

          <SearchButton
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
          />
        </div>

        <div className="flex items-center gap-4">
          {/* <NotificationsBadge /> */}

          <UserDropdownMenu />

          <Button
            href={routesData[1].path}
            variant='primary'
            size='sm'
            icon={<MessageSquare className="w-4 h-4 hidden md:block" />}
          >
            ابدأ مناقشة
          </Button>

          <button
            onClick={onToggleInfoSidebar}
            className="xl:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppNavbar;