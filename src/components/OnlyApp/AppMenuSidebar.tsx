"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useCurrentUserInfo } from "@/hooks";
import {
  Tags,
  UserCheck,
  SquarePlus,
  UserCog,
  UserPlus,
  X,
  Home,
  Bookmark,
  PenSquare,
  User,
} from "lucide-react";
import Divider from "@/components/Divider";
import { isAdminOrSuperAdminByRole, isSuperAdminByRole } from "@/utils/role";

interface AppMenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function AppMenuSidebar({ isOpen, onClose }: AppMenuSidebarProps) {
  const pathname = usePathname();
  const { auth } = useAuth();
  const { username } = useCurrentUserInfo()

  const generalLinks = [
    {
      label: "الرئيسية",
      href: "/",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "ابدأ مناقشة",
      href: "/discussions/new",
      icon: <PenSquare className="w-5 h-5" />,
    },
    {
      label: "المحفوظات",
      href: "/discussions/bookmarked",
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      label: "التصنيفات",
      href: "/categories",
      icon: <Tags className="w-5 h-5" />,
    },
    {
      label: "الملف الشخصي",
      href: `/${username}`,
      icon: <User className="w-5 h-5" />,
    },
  ];

  const roleSpecificLinks = [
    // Admin and Super Admin Links
    ...(isAdminOrSuperAdminByRole(auth?.user?.role)
      ? [
        {
          label: "أضف تصنيف",
          href: "/admin/categories/new",
          icon: <SquarePlus className="w-5 h-5" />,
        },
        {
          label: "الطلاب",
          href: "/admin/students",
          icon: <UserCheck className="w-5 h-5" />,
        },
      ]
      : []),

    // Super Admin Only Links
    ...(isSuperAdminByRole(auth?.user?.role)
      ? [
        {
          label: "المشرفين",
          href: "/admins",
          icon: <UserCog className="w-5 h-5" />,
        },
        {
          label: "إنشاء مُشرف",
          href: "/admin/new",
          icon: <UserPlus className="w-5 h-5" />,
        },
      ]
      : []),
  ];

  const renderLinks = (links: typeof generalLinks) => (
    links.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
          pathname === item.href
            ? "text-primary hover:bg-gray-100/80"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        {item.icon}
        {item.label}
      </Link>
    ))
  );

  const sidebarContent = (
    <div className="pt-12 pb-8 md:pt-24 md:pb-12 px-4 flex flex-col gap-6">
      <div className="space-y-2">
        {renderLinks(generalLinks)}
      </div>

      {roleSpecificLinks.length > 0 && (
        <>
          <Divider label="" borderColor="gray-200" />
          <div className="space-y-2">
            {renderLinks(roleSpecificLinks)}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 w-[280px] h-screen bg-white border-l shadow-md z-50 transform transition-transform duration-300 lg:hidden flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end p-3">
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sidebarContent}
        </div>
      </div>

      <aside className="fixed top-14 right-0 w-[280px] h-[calc(100vh-3.5rem)] hidden lg:block border-l bg-[#fafafa]">
        <div className="h-full overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}

export default AppMenuSidebar;
