"use client";

import { Search } from "lucide-react";
import Modal from "./Modal";
import { Fragment, useState } from "react";
import SearchField from "../app/SearchField";
import Loader from "../Loader";
import ThreadItemMinimal from "../app/ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";
import { SearchResult } from "@/types/thread";

interface SearchModalProps {
  onClose: () => void;
  onSearch: (query: string) => void;
  searchResults?: SearchResult[];
  isLoading?: boolean;
  error?: string | null;
}

function SearchModal({
  onClose,
  onSearch,
  searchResults = [],
  isLoading = false,
  error = null,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleThreadClick = () => {
    onClose(); 
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={true}
      size="lg"
    >
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
          ) : searchQuery && searchResults.length === 0 && !error? (
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
                <Fragment key={result.id}>
                <ThreadItemMinimal
                  thread_id={parseInt(result.id)}
                  title={result.title}
                  authorName={result.authorName}
                  commentsCount={result.repliesCount}
                  created_at={result.timestamp}
                  onNavigate={handleThreadClick}
                />
                  {index < searchResults.length - 1 && (
                    <Divider label="" className="my-1" borderColor="gray-100" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
        {error && (
            <div className="bg-red-100 text-red-600 p-4 text-center rounded-md mt-2">
              {error}
            </div>
          )}
        
      </div>
      
    </Modal>
  );
}

export default SearchModal;