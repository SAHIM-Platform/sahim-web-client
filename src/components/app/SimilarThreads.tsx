import { Fragment } from "react";
import { ThreadItemProps } from "./ThreadListing/ThreadItem";
import ThreadItemMinimal from "./ThreadListing/ThreadItemMinimal";
import Divider from "../Divider";

interface SimilarThreadsProps {
  threads: ThreadItemProps[];
  threadPageId: string;
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
            .filter(t => t.id !== threadPageId)
            .map((thread: ThreadItemProps, index) => (
              <Fragment key={thread.id}>
                <ThreadItemMinimal
                  id={thread.id}
                  repliesCount={thread.repliesCount}
                  timestamp={thread.timestamp}
                  title={thread.title as string}
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