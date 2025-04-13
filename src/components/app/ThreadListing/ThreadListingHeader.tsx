import Divider from "@/components/Divider"
import DiscussionsBadge from "../Badge/DiscussionsBadge"
import Button from "@/components/Button"
import { ArrowUpDown, MessageSquare } from "lucide-react"
import { CategoryBadgeProps } from "../Badge/CategoryBadge"
import { Thread } from "@/types/thread"
import Select from "@/components/Select"
import SearchField from "../SearchField"
import { useEffect, useState } from "react"
import { fetchCategories, searchThreads } from "@/services/threadService"
import LoadingSpinner from "@/components/LoadingSpinner"

interface ThreadListingHeaderProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  processedThreads: Thread[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  sortOrder: "recent" | "oldest";
  setSortOrder: (sortOrder: "recent" | "oldest") => void;
}

function ThreadListingHeader({
  processedThreads,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ThreadListingHeaderProps) {
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            جميع المناقشات
          </h1>
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
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchField
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="w-48">
            {isLoading ? (
              <div className="flex items-center justify-center h-10">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <Select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                placeholder="جميع التصنيفات"
                options={[
                  { value: "", label: "جميع التصنيفات" },
                  ...categories.map(cat => ({
                    value: cat.name,
                    label: cat.name
                  }))
                ]}
              />
            )}
          </div>
        </div>

        <Divider className="mt-6 border-gray-100" label="" borderColor="gray-200" />

        {/* Sort Order */}
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
            onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}
            className="text-[13px] text-gray-600"
            icon={<ArrowUpDown className="w-4 h-4" />}
          >
            {sortOrder === "recent" ? "الأحدث أولاً" : "الأقدم أولاً"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ThreadListingHeader;

