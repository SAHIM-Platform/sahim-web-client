import { useState } from "react";
import { cn } from "@/utils/utils";
import { Search } from "lucide-react";
import SearchModal from "../Modal/SearchModal";
import { discussionThreads } from "@/data/mock-api";

interface SearchButtonProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (value: boolean) => void;
  placeholder?: string;
  useKeyboardShortcuts?: boolean;
  fullWidth?: boolean;
}

function SearchButton({
  isSearchFocused,
  setIsSearchFocused,
  placeholder = "ابحث في المناقشات ...",
  fullWidth
}: SearchButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof discussionThreads>([]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const results = discussionThreads.filter(thread => 
        (thread.title && thread.title.toLowerCase().includes(query.toLowerCase())) ||
        thread.content.toLowerCase().includes(query.toLowerCase()) ||
        thread.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      'flex-1',
      fullWidth ? 'w-full' : 'max-w-xl min-w-[24px] sm:min-w-[240px] md:min-w-[300px] lg:min-w-[400px]'
    )}>
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
          <kbd className="py-0.5 px-1.5 rounded bg-white font-medium text-gray-500 shadow-sm border border-gray-100">/</kbd>
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
        />
      )}
    </div>
  );
}

export default SearchButton;