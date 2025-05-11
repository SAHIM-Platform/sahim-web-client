"use client";

import { Search } from "lucide-react";
import Modal from "./Modal";
import { Fragment, RefObject } from "react";
import SearchField from "../OnlyApp/SearchField";
import ThreadItemMinimal from "../OnlyApp/ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";
import { Thread } from "@/types";
import LoadingSpinner from "../LoadingSpinner";

interface SearchModalProps {
  onClose: () => void;
  onSearch: (filters: { category_id?: number; query?: string }) => void;
  searchResults?: Thread[];
  isLoading?: boolean;
  error?: string | null;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isFetchingMore?: boolean;
}

function SearchModal({
  onClose,
  onSearch,
  searchResults = [],
  isLoading = false,
  error = null,
  loadMoreRef,
  searchQuery,
  setSearchQuery,
  isFetchingMore = false,
}: SearchModalProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleThreadClick = () => {
    onClose(); 
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      onSearch({
        query: trimmedQuery
      });
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      onClose={handleClose}
      isOpen={true}
      size="lg"
    >
      <div className="mb-4">
        <SearchField
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          placeholder="ابحث في المناقشات..."
          shortcut="ESC"
          autoFocus
          variant="modal"
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-2 px-1">
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
          {isLoading && !searchResults.length ? (
            <LoadingSpinner />
          ) : searchQuery && searchResults.length === 0 && !error ? (
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
                    commentsCount={result._count?.comments || 0}
                    created_at={result.created_at}
                    onNavigate={handleThreadClick}
                    author={result.author}
                  />
                  {index < searchResults.length - 1 && (
                    <Divider label="" className="my-1" borderColor="gray-100" />
                  )}
                </Fragment>
              ))}
              {/* Trigger infinite scroll when user reaches the bottom */}
              <div ref={loadMoreRef} className="py-2">
                {isFetchingMore && <LoadingSpinner />}
              </div>
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
