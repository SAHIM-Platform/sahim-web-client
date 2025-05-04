'use client';

import Button from "@/components/Button";
import { ArrowUpDown, MessageSquare } from "lucide-react";
import DiscussionsBadge from "../Badge/DiscussionsBadge";
import SearchField from "@/components/App/SearchField";
import { Thread } from "@/types";
import Divider from "@/components/Divider";
import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/threadService";
import LoadingSpinner from "@/components/LoadingSpinner";

interface MyDiscussionsHeaderProps {
  threads: Thread[];
  sortOrder: "latest" | "oldest" | "most_commented" | "most_voted";
  setSortOrder: (sortOrder: "latest" | "oldest" | "most_commented" | "most_voted") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  isLoading?: boolean;
}

function MyDiscussionsHeader({
  threads,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedCategory,
  setSelectedCategory,
  isLoading = false
}: MyDiscussionsHeaderProps) {
  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setError(null);
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          throw new Error("Invalid categories response format");
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setError("حدث خطأ أثناء تحميل التصنيفات");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCategory(value);
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'latest':
        return 'الأحدث أولاً';
      case 'oldest':
        return 'الأقدم أولاً';
      case 'most_commented':
        return 'الأكثر تعليقاً';
      case 'most_voted':
        return 'الأكثر تصويتاً';
      default:
        return 'الأحدث أولاً';
    }
  };

  const handleSortChange = () => {
    const sortOrders: ("latest" | "oldest" | "most_commented" | "most_voted")[] = [
      "latest",
      "oldest",
      "most_commented",
      "most_voted"
    ];
    const currentIndex = sortOrders.indexOf(sortOrder);
    const nextIndex = (currentIndex + 1) % sortOrders.length;
    setSortOrder(sortOrders[nextIndex]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">مناقشاتي</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
            عرض جميع المناقشات التي قمت بإنشائها
          </p>
        </div>
        <Button
          href="/discussions/new"
          variant="primary"
          size="sm"
          icon={<MessageSquare className="w-5 h-5" />}
          className="shadow-sm"
        >
          ابدأ مناقشة
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <SearchField
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            placeholder="ابحث في مناقشاتك..."
            className="flex-1"
          />
          <div className="w-48">
            {isLoadingCategories ? (
              <div className="flex items-center justify-center h-10">
                <LoadingSpinner size="sm" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-sm">{error}</div>
            ) : (
              <Select
                value={selectedCategory?.toString() || ""}
                onChange={handleCategoryChange}
                placeholder="جميع التصنيفات"
                options={[
                  { value: "", label: "جميع التصنيفات" },
                  ...categories.map((cat) => ({
                    value: cat.category_id.toString(),
                    label: cat.name,
                  })),
                ]}
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

        <div className="flex items-center justify-between pt-3 mt-3">
          <DiscussionsBadge>
            <span>
              {threads.length}
              {threads.length === 1 ? " مناقشة" : " مناقشات"}
            </span>
          </DiscussionsBadge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortChange}
            className="text-[13px] text-gray-600"
            icon={<ArrowUpDown className="w-4 h-4" />}
            disabled={isLoading}
          >
            {getSortLabel(sortOrder)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MyDiscussionsHeader; 