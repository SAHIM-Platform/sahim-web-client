"use client";

import { Search } from "lucide-react";
import Modal from "./Modal";
import { useState } from "react";
import SearchField from "../app/SearchField";
import Loader from "../Loader";
import ThreadItemMinimal from "../app/ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  repliesCount: number;
  timestamp: string;
}

interface SearchModalProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  searchResults?: SearchResult[];
  isLoading?: boolean;
}

function SearchModal({
  onClose,
  onSearch,
  searchResults = [],
  isLoading = false
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="mb-4">
        <SearchField
          searchQuery={searchQuery}
          setSearchQuery={(value) => {
            setSearchQuery(value);
            onSearch(value);
          }}
          placeholder="ابحث في المناقشات..."
          shortcut="ESC"
          autoFocus
          variant="modal"
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="space-y-2 px-1">
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <Loader />
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">لا توجد نتائج</p>
            </div>
          ) : !searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">ابدأ الكتابة للبحث في المناقشات</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {searchResults.map((result, index) => (
                <>
                  <div key={result.id}>
                    <ThreadItemMinimal
                      id={result.id}
                      title={result.title}
                      repliesCount={result.repliesCount}
                      timestamp={result.timestamp}
                    />
                  </div>
                  {index < searchResults.length - 1 && (
                    <Divider label="" className="my-1" borderColor="gray-100" />
                  )}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default SearchModal;