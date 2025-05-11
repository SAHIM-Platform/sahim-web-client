"use client";

import ItemNotFound from '@/components/OnlyApp/NotFound/ItemNotFound';
import ThreadListing from '@/components/OnlyApp/ThreadListing/ThreadListing';
import UserProfileHeader from '@/components/OnlyApp/UserProfile/UserProfileHeader';
import { userService } from '@/services/userService';
import { use, useCallback, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { useAuth, useAuthLoading } from '@/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Profile } from '@/types/api/user';
import { Thread } from '@/types';

interface UserProfileData {
  user: Profile;
  threads: Thread[];
  threadsMeta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function DiscussionPage({ params }: UserProfilePageProps) {
  const { username } = use(params);
  const searchParams = useSearchParams();
  const { auth } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthLoadingOrRedirecting } = useAuthLoading();

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await userService.getUserProfileByUsername(username, {
        sort: searchParams.get('sort') as 'latest' | 'oldest' | 'most_commented' | 'most_voted' || 'latest',
        page: Number(searchParams.get('page')) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        category_id: Number(searchParams.get('category_id')) || undefined,
        includeThreads: true,
        search: searchParams.get('search') || undefined,
      });
      
      if (result.success && result.data?.user) {
        setProfile({
          user: result.data.user,
          threads: result.data.threads || [],
          threadsMeta: result.data.threadsMeta || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          }
        });
      } else {
        setError(result.error?.message || 'حدث خطأ أثناء تحميل الملف الشخصي');
      }
    } catch {
      setError('حدث خطأ أثناء تحميل الملف الشخصي');
    } finally {
      setIsLoading(false);
    }
  }, [username, searchParams]);

  useEffect(() => {
    loadProfile();
  }, [username, searchParams, loadProfile]);

  if (isLoading || isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (error || !profile) {
    return <ItemNotFound description={error || "لا يوجد مستخدم بهذا الاسم"} />;
  }

  const { user, threadsMeta } = profile;
  const showSettings = auth.user && auth.user.username === user.username;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfileHeader
        name={user.name}
        username={user.username}
        role={user.role}
        department={user?.department}
        threadsCount={threadsMeta.total}
        showSettings={showSettings}
      />
      
      <div className="container mx-auto py-4">
        <ThreadListing displayHeader={false} username={username} />
      </div>
    </div>
  );
} 