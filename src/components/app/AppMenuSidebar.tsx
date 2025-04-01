import { cn } from "@/utils/utils";
import { Book, Bookmark, HelpCircle, Home, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routesData } from "@/data/routes";

const appMenuSidebarData = [
  {
    name: routesData[0].name,
    href: routesData[0].path,
    icon: Home,
  },
  {
    name: routesData[1].name,
    href: routesData[1].path,
    icon: MessageSquare,
  },
  {
    name: routesData[2].name,
    href: routesData[2].path,
    icon: Bookmark,
  },
  {
    name: routesData[3].name,
    href: routesData[3].path,
    icon: Book,
  },
  {
    name: routesData[4].name,
    href: routesData[4].path,
    icon: HelpCircle,
  },
];

function AppMenuSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 right-0 w-[280px] h-[calc(100vh-3.5rem)] hidden lg:block border-l-2 overflow-y-auto">
      <div className="h-full overflow-y-auto py-12 px-4 space-y-3">
        {appMenuSidebarData.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
              pathname === item.href
                ? "text-primary hover:bg-gray-100/80"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default AppMenuSidebar;