import { Fragment, RefObject } from "react";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";
import { Thread } from "@/types/thread";
import LoadingSpinner from "../LoadingSpinner";

interface SimilarThreadsProps {
  threads: Thread[];
  threadPageId: number;
  lastElementRef?: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

function SimilarThreads({ 
  threads, 
  threadPageId, 
  lastElementRef,
  isLoading = false 
}: SimilarThreadsProps) {
  
  return (
    <div className="mt-20 pt-8 border-t">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          مناقشات ذات صلة
        </h2>

        <div className="grid gap-3 -mr-3">
          {threads.length > 0 ? (
            threads.map((thread, index, arr) => (
              <Fragment key={`similar-${thread.thread_id}-${index}`}>
                <div
                  ref={
                    index === arr.length - 1 && lastElementRef
                      ? lastElementRef
                      : undefined
                  }
                >
                  <ThreadItemMinimal
                    thread_id={thread.thread_id}
                    title={thread.title}
                    commentsCount={thread._count?.comments || 0}
                    created_at={thread.created_at}
                    authorName={thread.author?.name ?? "مستخدم"}
                    authorPhotoPath={thread.author?.photoPath}
                  />
                </div>

                {index < arr.length - 1 && (
                  <Divider label="" borderColor="gray-100" />
                )}
              </Fragment>
            ))
          ) : (
            !isLoading && (
              <p className="text-gray-500 text-center py-4">
                لا توجد مناقشات مشابهة
              </p>
            )
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SimilarThreads;