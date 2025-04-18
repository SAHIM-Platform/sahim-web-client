"use client";

import DiscussionPageContent from "@/components/app/pages/DiscussionPageContent";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuthRedirect from "@/hooks/UseAuthRedirect";
import { use } from "react";

interface DiscussionPageProps {
  params: Promise<{ discussionId: string }>;
}

export default function DiscussionPage({ params }: DiscussionPageProps) {
  const { discussionId } = use(params);
  const isLoading = useAuthRedirect();

  if (isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (!discussionId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500">هذه المناقشة غير موجودة</p>
      </div>
    )
  }

  return <DiscussionPageContent discussionId={discussionId} />;
}
