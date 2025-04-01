import { Clock, Hash } from "lucide-react";
import Divider from "../Divider";
import { categories } from "@/data/mock-api";
import Link from "next/link";

function AppInfoSidebar() {
  return (
    <div className="fixed top-14 left-0 w-[320px] h-[calc(100vh-3.5rem)] hidden xl:block overflow-y-auto border-r">
      <div className="h-full pt-24 pb-12 px-4 flex flex-col gap-10">
        {/* Categories */}
        <div>
          <span className="pr-4 text-sm font-semibold text-gray-900 mb-3 block">التصنيفات</span>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href="#"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-100/80"
              >
                <Hash className="w-4 h-4 text-gray-500" />
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <Divider label="" />

        {/* Active Topics */}
        <div>
          <span className="pr-4 text-sm font-semibold text-gray-900 mb-3 block">آخر المناقشات</span>
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <a
                key={i}
                href="#"
                className="w-full block px-3 py-2 rounded-lg transition-colors hover:bg-gray-100/80"
              >
                <h4 className="text-sm font-medium line-clamp-2">
                  كيف يمكنني تحسين أداء تطبيق React؟
                </h4>
                <div className="flex items-center gap-2 text-sm mt-1 text-black/50">
                  <span>٢٥ مشاركة</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    منذ ساعتين
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppInfoSidebar;