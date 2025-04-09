import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/utils";
import { Search } from "lucide-react";
import SearchModal from "../Modal/SearchModal";
import { searchThreads } from "@/services/threadService";
import { ApiSearchResult, SearchResult } from "@/types/thread";
import toast from "react-hot-toast";

interface SearchButtonProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  placeholder?: string;
  useKeyboardShortcuts?: boolean;
  fullWidth?: boolean;
}

const mapApiToSearchResult = (apiResult: ApiSearchResult): SearchResult => ({
  id: apiResult.id.toString(),
  title: apiResult.title,
  timestamp: apiResult.createdAt,
  authorName: apiResult.author.name,
  repliesCount: apiResult.commentsCount,
});

function SearchButton({
  isSearchFocused,
  setIsSearchFocused,
  placeholder = "ابحث في المناقشات ...",
  fullWidth,
}: SearchButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    setIsLoading(true);
    setError(null);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const apiResults = await searchThreads(query);
        setSearchResults(apiResults.map(mapApiToSearchResult));
      } catch (err) {
        setError("فشل تحميل نتائج البحث");
        setSearchResults([]);
        toast.error("فشل تحميل نتائج البحث");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Add cleanup:
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

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
          onClose={() => {
            setIsSearchFocused(false);
            setSearchResults([]);
          }}
          onSearch={handleSearch}
          searchResults={searchResults}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default SearchButton;
