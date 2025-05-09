"use client";

import { X } from "lucide-react";
import Divider from "../Divider";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import { Fragment, useState, useEffect } from "react";
import { cn } from "@/utils/utils";
import { Thread } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoriesListing from "./CategoriesListing";
import Link from "next/link";
import { LATEST_THREADS_LIMIT } from "@/utils/constants/ITEMS_LIMITS";
import { fetchThreads } from "@/services/thread/threadService";
import { fetchCategories } from "@/services/thread/categoryService";

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
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load latest discussions
        const result = await fetchThreads({ page: 1, limit: LATEST_THREADS_LIMIT});
        if (result.success && result.data) {
          setLatestDiscussions(result.data);
        }

        // Load categories
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingCategories(false);
      }
    };

    loadData();
  }, []);

  const handleCategoriesChange = async () => {
    setIsLoadingCategories(true);
    try {
      const categoriesResponse = await fetchCategories();
      if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Error reloading categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  return (
    <div className="pt-12 pb-8 md:pt-24 md:pb-12 px-4 flex flex-col gap-6">
      <div>
        <span className="pr-4 text-sm font-semibold text-gray-900 mb-2 block">التصنيفات</span>
        <CategoriesListing 
          categories={categories}
          isLoading={isLoadingCategories}
          onCategoriesChange={handleCategoriesChange}
          maxChars={15}
        />
        <div className="mt-1 text-center">
          <Link
            href="/categories"
            className="text-blue-500 text-sm font-semibold hover:underline">
            عرض الكل
          </Link>
        </div>
      </div>

      <Divider label="" />

      <div>
        <span className="pr-4 text-sm font-semibold text-gray-900 mb-2 block">آخر المناقشات</span>
        {isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingSpinner size="sm" color="primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {latestDiscussions.map((thread, index) => (
              <Fragment key={thread.thread_id}>
                <ThreadItemMinimal
                  thread_id={thread.thread_id}
                  title={thread.title}
                  commentsCount={thread._count?.comments || 0}
                  created_at={thread.created_at}
                  authorName={thread.author?.name ?? "مستخدم"}
                  authorPhotoPath={thread.author?.photoPath}
                />
                {index < latestDiscussions.length - 1 && (
                  <Divider label="" className="my-0.5" borderColor="gray-100" />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppInfoSidebar;