"use client";

import ItemNotFound from "@/components/App/NotFound/ItemNotFound";
import DiscussionPageContent from "@/components/App/pages/DiscussionPageContent";
import LoadingSpinner from "@/components/LoadingSpinner";
import RESPONSE_MESSAGES from "@/utils/constants/RESPONSE_MESSAGES";
import { use } from "react";
import { useLoading } from "@/hooks";

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
      <ItemNotFound description={RESPONSE_MESSAGES.thread.NOT_FOUND} />
    )
  }

  return <DiscussionPageContent discussionId={discussionId} />;
}
