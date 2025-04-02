'use client';

import { categories, discussionThreads } from "@/data/mock-api";
import ThreadItem from "./ThreadItem";
import ThreadListingHeader from "./ThreadListingHeader";
import { useState } from "react";

interface ThreadListingProps {
  onLike?: (threadId: string) => void;
  onReply?: (threadId: string) => void;
  onShare?: (threadId: string) => void;
  emptyMessage?: string;
}

const ThreadListing = ({
  onLike,
  onReply,
  onShare,
  emptyMessage = "لا توجد مناقشات حالياً"
}: ThreadListingProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const processedThreads = discussionThreads.filter(
    (thread) =>
      (!selectedCategory || thread.category === selectedCategory) &&
      (!searchQuery || (thread?.title && thread?.title.includes(searchQuery)))
  );

  return (
    <div className="space-y-5">
      <ThreadListingHeader
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        processedThreads={processedThreads}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {processedThreads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            {emptyMessage}
          </p>
        </div>
      ) : (
        <>
          {processedThreads.map((thread, index) => (
            <ThreadItem
              key={index}
              {...thread}
              onLike={() => onLike?.(thread.id)}
              onReply={() => onReply?.(thread.id)}
              onShare={() => onShare?.(thread.id)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ThreadListing;
