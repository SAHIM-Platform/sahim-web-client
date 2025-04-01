import { Hash } from "lucide-react";
import Divider from "../Divider";
import { categories, discussionThreads } from "@/data/mock-api";
import Link from "next/link";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";

function AppInfoSidebar() {
  // Get the latest 3 discussions
  const latestDiscussions = discussionThreads
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <div className="fixed top-14 left-0 w-[320px] h-[calc(100vh-3.5rem)] hidden xl:block overflow-y-auto border-r">
      <div className="h-full pt-24 pb-12 px-4 flex flex-col gap-10">
        <div>
          <span className="pr-4 text-sm font-semibold text-gray-900 mb-3 block">التصنيفات</span>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-gray-100/80"
              >
                <Hash className="w-4 h-4 text-gray-500" />
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <Divider label="" />

        <div>
          <span className="pr-4 text-sm font-semibold text-gray-900 mb-3 block">آخر المناقشات</span>
          <div className="flex flex-col gap-1">
            {latestDiscussions.map((thread, index) => (
              <>
                <ThreadItemMinimal
                  key={thread.id}
                  id={thread.id}
                  title={thread.title}
                  repliesCount={thread.repliesCount}
                  timestamp={thread.timestamp}
                />
                {index < latestDiscussions.length - 1 && (
                  <Divider label="" className="my-1" borderColor="gray-100" />
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppInfoSidebar;