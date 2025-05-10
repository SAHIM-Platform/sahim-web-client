"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/utils";
import SearchModal from "../Modal/SearchModal";
import { Thread } from "@/types";
import toast from "react-hot-toast";
import { THREADS_LIMIT } from "@/utils/constants/ITEMS_LIMITS";
import { useInfiniteScroll } from "@/hooks";
import { searchThreads } from "@/services/thread/threadService";

interface SearchButtonProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

function SearchButton({
  isSearchFocused,
  setIsSearchFocused,
  placeholder = "ابحث في المناقشات ...",
  fullWidth,
}: SearchButtonProps) {
  const [searchResults, setSearchResults] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async () => {
    if (!searchQuery?.trim()) {
      setSearchResults([]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    setIsLoading(true);
    setError(null);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const result = await searchThreads({
          query: searchQuery,
          page: 1,
          limit: 3, 
        });

        if (result.success) {
          setSearchResults(result.data);
          setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
          setPage(2);
        } else {
          console.error("Search error:", result.error.message);
          setError("فشل تحميل نتائج البحث");
          setSearchResults([]);
          toast.error("فشل تحميل نتائج البحث");
        }
      } catch (err) {
        console.error("Unexpected search error:", err);
        setError("فشل تحميل نتائج البحث");
        setSearchResults([]);
        toast.error("فشل تحميل نتائج البحث");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const fetchMoreSearchResults = async () => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);

    try {
      const result = await searchThreads({
        query: searchQuery,
        page,
        limit: THREADS_LIMIT,
      });

      if (result.success) {
        setSearchResults((prev) => [...prev, ...result.data]);
        setHasMore(result.meta ? result.meta.page < result.meta.totalPages : false);
        setPage((prev) => prev + 1);
      } else {
        console.error("Load more search error:", result.error.message);
        toast.error("حدث خطأ أثناء تحميل المزيد من النتائج");
      }
    } catch {
      toast.error("حدث خطأ أثناء تحميل المزيد من النتائج");
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (isSearchFocused) {
      setSearchResults([]);
    }
  }, [isSearchFocused]);

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: fetchMoreSearchResults,
  });

  return (
    <div
      className={cn(
        "flex-1",
        fullWidth
          ? "w-full"
          : "max-w-xl min-w-[24px] sm:min-w-[240px] md:min-w-[300px] lg:min-w-[400px]"
      )}
    >
      <button
        onClick={() => setIsSearchFocused(true)}
        className={cn(
          "flex items-center gap-3 justify-center",
          "hover:text-primary transition-colors",
          "text-gray-500",
          "sm:bg-white sm:px-4 sm:h-10 sm:rounded-lg sm:border",
          isSearchFocused ? "sm:border-primary" : "sm:border-gray-200",
          "w-6 sm:w-56 md:w-full"
        )}
        aria-label="Search discussions"
      >
        <Search className="w-5 h-5" />
        <span className="flex-1 text-right hidden sm:block">{placeholder}</span>
        <div className="flex items-center gap-1 text-xs text-gray-400 hidden md:block">
          <kbd className="py-0.5 px-1.5 rounded bg-white font-medium text-gray-500 shadow-sm border border-gray-100">
            /
          </kbd>
          للبحث السريع
        </div>
      </button>

      {isSearchFocused && (
        <SearchModal
          onClose={() => setIsSearchFocused(false)}
          onSearch={handleSearch}
          searchResults={searchResults}
          isLoading={isLoading}
          error={error}
          loadMoreRef={loadMoreRef} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFetchingMore={isFetchingMore}
        />
      )}
    </div>
  );
}

export default SearchButton;
