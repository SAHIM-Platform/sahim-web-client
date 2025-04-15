"use client";

import { Search } from "lucide-react";
import Modal from "./Modal";
import { Fragment, useState } from "react";
import SearchField from "../app/SearchField";
import Loader from "../Loader";
import ThreadItemMinimal from "../app/ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";
import { Thread } from "@/types/thread";

interface SearchModalProps {
  onClose: () => void;
  onSearch: (filters: { category_id?: number; query?: string }) => void;
  searchResults?: Thread[];
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch({
      query: value || undefined
    });
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
          setSearchQuery={handleSearch}
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
                <Fragment key={result.thread_id}>
                <ThreadItemMinimal
                  thread_id={result.thread_id}
                  title={result.title}
                  authorName={result.author.name}
                  commentsCount={result._count.comments}
                  created_at={result.created_at}
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