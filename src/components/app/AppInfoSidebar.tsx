"use client";

import { Hash, X } from "lucide-react";
import Divider from "../Divider";
import { categories } from "@/data/mock-api";
import Link from "next/link";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { fetchThreads } from "@/services/threadService";
import { Thread } from "@/types/thread";

interface AppInfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function AppInfoSidebar({ isOpen, onClose }: AppInfoSidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 w-[320px] h-full bg-white border-r shadow-md z-50 transform transition-transform duration-300 xl:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <SidebarContent />
      </div>

      <div className="hidden xl:block fixed top-14 left-0 w-[320px] h-[calc(100vh-3.5rem)] overflow-y-auto border-r bg-white">
        <SidebarContent />
      </div>
    </>
  );
}

function SidebarContent() {
  const [latestDiscussions, setLatestDiscussions] = useState<Thread[]>([]);

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const result = await fetchThreads();
        if (result.success && result.data) {
          const threads = result.data.data;
          const sortedThreads = threads
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setLatestDiscussions(sortedThreads);
        }
      } catch (error) {
        console.error('Error loading latest discussions:', error);
      }
    };

    loadThreads();
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 flex flex-col gap-10">
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
            <Fragment key={thread.thread_id}>
              <ThreadItemMinimal
                thread_id={thread.thread_id}
                title={thread.title}
                commentsCount={thread._count.comments}
                created_at={thread.created_at}
              />
              {index < latestDiscussions.length - 1 && (
                <Divider label="" className="my-1" borderColor="gray-100" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppInfoSidebar;
