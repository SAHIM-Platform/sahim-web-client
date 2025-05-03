"use client";

import ItemNotFound from "@/components/app/NotFound/ItemNotFound";
import DiscussionPageContent from "@/components/app/pages/DiscussionPageContent";
import LoadingSpinner from "@/components/LoadingSpinner";
import ERROR_MESSAGES from "@/utils/api/ERROR_MESSAGES";
import { isAuthLoadingOrRedirecting } from "@/utils/loading";
import { use } from "react";

interface DiscussionPageProps {
  params: Promise<{ discussionId: string }>;
}
export default function DiscussionPage({ params }: DiscussionPageProps) {
  const { discussionId } = use(params);

  if (isAuthLoadingOrRedirecting()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (!discussionId) {
    return (
      <ItemNotFound description={ERROR_MESSAGES.thread.NOT_FOUND} />
    )
  }

  return <DiscussionPageContent discussionId={discussionId} />;
}
