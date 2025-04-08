import { Fragment } from "react";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";
import { Thread } from "@/types/thread";

interface SimilarThreadsProps {
  threads: Thread[];
  threadPageId: number;
}

function SimilarThreads({ threads, threadPageId }: SimilarThreadsProps) {
  return (
    <div className="mt-20 pt-8 border-t">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          مناقشات ذات صلة
        </h2>

        <div className="grid gap-3 -mr-3">
          {threads
            .filter(t => t.thread_id !== threadPageId)
            .map((thread, index) => (
              <Fragment key={thread.thread_id}>
                <ThreadItemMinimal
                  thread_id={thread.thread_id}
                  title={thread.title}
                  commentsCount={thread._count.comments}
                  created_at={thread.created_at}
                />
                {index < threads.length - 1 && (
                  <Divider label="" borderColor="gray-100" />
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SimilarThreads;