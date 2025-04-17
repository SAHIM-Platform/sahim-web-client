import Divider from "@/components/Divider";
import DiscussionsBadge from "../Badge/DiscussionsBadge";
import Button from "@/components/Button";
import { ArrowUpDown, MessageSquare } from "lucide-react";
import { Thread } from "@/types/thread";
import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { CategoryBadgeProps } from "../Badge/CategoryBadge";
import { fetchCategories } from "@/services/threadService";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ThreadListingHeaderProps {
  processedThreads: Thread[];
  sortOrder: "latest" | "oldest";
  setSortOrder: (sortOrder: "latest" | "oldest") => void;
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  isFiltering?: boolean;
}

function ThreadListingHeader({
  processedThreads,
  sortOrder,
  setSortOrder,
  selectedCategory,
  setSelectedCategory,
  isFiltering = false,
}: ThreadListingHeaderProps) {
  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCategory(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">جميع المناقشات</h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-500">
            تصفح جميع المناقشات المطروحة
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
        <div className="flex justify-end">
          <div className="w-48">
            {isLoading ? (
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
                disabled={isFiltering}
              />
            )}
          </div>
        </div>

        <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

        <div className="flex items-center justify-between pt-3 mt-3">
          <DiscussionsBadge>
            <span>
              {processedThreads.length}
              {processedThreads.length === 1 ? " مناقشة" : " مناقشات"}
            </span>
          </DiscussionsBadge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
            className="text-[13px] text-gray-600"
            icon={<ArrowUpDown className="w-4 h-4" />}
            disabled={isFiltering}
          >
            {sortOrder === "latest" ? "الأحدث أولاً" : "الأقدم أولاً"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ThreadListingHeader;
