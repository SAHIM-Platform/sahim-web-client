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
} from "lucide-react";
import { UserRole } from "@/types/auth";

interface AppMenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function AppMenuSidebar({ isOpen, onClose }: AppMenuSidebarProps) {
  const pathname = usePathname();

  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === UserRole.ADMIN;
  const isSuperAdmin = auth?.user?.role === UserRole.SUPER_ADMIN;

  const sidebarLinks = [
    // Visible to All Users
    {
      label: "التصنيفات",
      href: "/categories",
      icon: <Tags />,
    },

    // Visible to Admins and Super Admins
    ...(isAdmin || isSuperAdmin
      ? [
          {
            label: "الطلاب",
            href: "/admin/students",
            icon: <UserCheck />,
          },
          {
            label: "أضف تصنيف",
            href: "/admin/categories/new",
            icon: <SquarePlus />,
          },
        ]
      : []),

    // Visible to Super Admin Only
    ...(isSuperAdmin
      ? [
          {
            label: "المشرفين",
            href: "/admin/admins",
            icon: <UserCog />,
          },
          {
            label: "إنشاء مُشرف",
            href: "/admin/new",
            icon: <UserPlus />,
          },
        ]
      : []),
  ];

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

        <div className="h-full overflow-y-auto pt-24 pb-12 px-4 space-y-3">
          {sidebarLinks.map((item) => (
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
              <span className="w-5 h-5">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <aside className="fixed top-14 right-0 w-[280px] h-[calc(100vh-3.5rem)] hidden lg:block border-l overflow-y-auto bg-[#fafafa]">
        <div className="h-full overflow-y-auto pt-24 pb-12 px-4 space-y-3">
          {sidebarLinks.map((item) => (
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
              <span className="w-5 h-5">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}

export default AppMenuSidebar;
