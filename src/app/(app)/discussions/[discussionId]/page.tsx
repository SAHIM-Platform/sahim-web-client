"use client";

import ItemNotFound from "@/components/App/NotFound/ItemNotFound";
import DiscussionPageContent from "@/components/App/pages/DiscussionPageContent";
import LoadingSpinner from "@/components/LoadingSpinner";
import ERROR_MESSAGES from "@/utils/constants/ERROR_MESSAGES";
import { useLoading } from "@/hooks/useLoading";
import { use } from "react";

interface DiscussionPageProps {
  params: Promise<{ discussionId: string }>;
}

export default function DiscussionPage({ params }: DiscussionPageProps) {
  const { discussionId } = use(params);
  const { isAuthLoadingOrRedirecting } = useLoading();

  if (isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (!discussionId) {
    return (
      <ItemNotFound description={ERROR_MESSAGES.thread.NOT_FOUND} />
    )
  }

  return <DiscussionPageContent discussionId={discussionId} />;
}
