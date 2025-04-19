"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  Tags,
  UserCheck,
  SquarePlus,
  UserCog,
  UserPlus,
  X,
  Home,
  MessageSquare,
  Bookmark,
  PenSquare,
} from "lucide-react";
import { UserRole } from "@/types/auth";
import Divider from "@/components/Divider";

interface AppMenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function AppMenuSidebar({ isOpen, onClose }: AppMenuSidebarProps) {
  const pathname = usePathname();
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === UserRole.ADMIN;
  const isSuperAdmin = auth?.user?.role === UserRole.SUPER_ADMIN;

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
      label: "مناقشاتي",
      href: "/my-discussions",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "المحفوظات",
      href: "/bookmarks",
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      label: "التصنيفات",
      href: "/categories",
      icon: <Tags className="w-5 h-5" />,
    },
  ];

  const roleSpecificLinks = [
    // Admin and Super Admin Links
    ...(isAdmin || isSuperAdmin
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
    ...(isSuperAdmin
      ? [
          {
            label: "المشرفين",
            href: "/admin/admins",
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
    <div className="h-full overflow-y-auto pt-24 pb-12 px-4 flex flex-col gap-8">
      <div className="space-y-3">
        {renderLinks(generalLinks)}
      </div>
      
      {roleSpecificLinks.length > 0 && (
        <>
          <Divider label="" borderColor="gray-200" />
          <div className="space-y-3">
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
          "fixed top-0 right-0 w-[280px] h-full bg-white border-l shadow-md z-50 transform transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {sidebarContent}
      </div>

      <aside className="fixed top-14 right-0 w-[280px] h-[calc(100vh-3.5rem)] hidden lg:block border-l overflow-y-auto bg-[#fafafa]">
        {sidebarContent}
      </aside>
    </>
  );
}

export default AppMenuSidebar;
