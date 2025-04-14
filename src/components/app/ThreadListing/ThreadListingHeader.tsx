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
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  sortOrder: "recent" | "oldest";
  setSortOrder: (sortOrder: "recent" | "oldest") => void;
  onSearch: (filters: { category_id?: number; query?: string }) => void;
}

function ThreadListingHeader({
  processedThreads,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearch,
}: ThreadListingHeaderProps) {
  const [categories, setCategories] = useState<{ category_id: number; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          throw new Error('Invalid categories response format');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('حدث خطأ أثناء تحميل التصنيفات');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const validateSearchQuery = (query: string): boolean => {
    if (!query.trim()) {
      setSearchError('يرجى إدخال كلمة البحث');
      return false;
    }
    if (query.trim().length < 2) {
      setSearchError('يجب أن تكون كلمة البحث على الأقل حرفين');
      return false;
    }
    setSearchError(null);
    return true;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedCategory(value);
    // Only trigger search if we have a valid category or clearing the selection
    if (value !== null || selectedCategory !== null) {
      onSearch({
        category_id: value || undefined,
        query: searchQuery.trim() || undefined
      });
    }
  };

  const handleSearch = () => {
    setSearchError(null);
    const trimmedQuery = searchQuery.trim();
    
    // If we have a search query, validate it
    if (trimmedQuery && !validateSearchQuery(trimmedQuery)) {
      return;
    }

    // Only trigger search if we have a valid query or category
    if (trimmedQuery || selectedCategory !== null) {
      onSearch({
        category_id: selectedCategory || undefined,
        query: trimmedQuery || undefined
      });
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    // Clear search error when user starts typing
    if (searchError) {
      setSearchError(null);
    }
  };

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
          <div className="flex-1">
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={handleSearchInputChange}
              onSearch={handleSearch}
              error={searchError}
            />
          </div>

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
                  ...categories.map(cat => ({
                    value: cat.category_id.toString(),
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

