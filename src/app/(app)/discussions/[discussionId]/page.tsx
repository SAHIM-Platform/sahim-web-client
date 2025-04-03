import DiscussionPageContent from "@/components/app/pages/DiscussionPageContent";

interface DiscussionPageProps {
  params: Promise<{ discussionId?: string }>;
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { discussionId } = await params;

  if (!discussionId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500">هذه المناقشة غير موجودة</p>
      </div>
    )
  }

  return <DiscussionPageContent discussionId={discussionId} />;
}
