"use client";

import { Hash, X } from "lucide-react";
import Divider from "../Divider";
import Link from "next/link";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { fetchThreads, fetchCategories } from "@/services/threadService";
import { Thread } from "@/types/thread";
import LoadingSpinner from "@/components/LoadingSpinner";

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

      <div className="hidden xl:block fixed top-14 left-0 w-[320px] h-[calc(100vh-3.5rem)] overflow-y-auto border-r bg-[#fafafa]">
        <SidebarContent />
      </div>
    </>
  );
}

function SidebarContent() {
  const [latestDiscussions, setLatestDiscussions] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          setCategoriesError("Failed to load categories");
          setCategories([]);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategoriesError("Failed to load categories");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }

      try {
        // Load latest discussions
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

    loadData();
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 flex flex-col gap-10">
      <div>
        <span className="pr-4 text-sm font-semibold text-gray-900 mb-3 block">التصنيفات</span>
        <div className="space-y-1">
          {isLoadingCategories ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" color="primary" />
            </div>
          ) : categoriesError ? (
            <p className="text-sm text-red-500 px-3 py-2">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500 px-3 py-2">لا توجد تصنيفات متاحة</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.category_id}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              >
                <Hash className="w-4 h-4 text-gray-500" />
                {category.name}
              </div>
            ))
          )}
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
                authorName={thread.author?.name ?? "مستخدم"}
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
