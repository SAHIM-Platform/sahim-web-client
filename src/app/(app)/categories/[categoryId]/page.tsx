'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ThreadItem from '@/components/OnlyApp/ThreadListing/ThreadItem';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorAlert from '@/components/Form/ErrorAlert';
import { Thread } from '@/types';
import { fetchThreads } from '@/services/thread/threadService';
import { Hash } from 'lucide-react';
import { fetchCategories } from '@/services/thread/categoryService';
import { useAuthLoading } from '@/hooks';

export default function CategoryDiscussionsPage() {
  const { isAuthLoadingOrRedirecting } = useAuthLoading();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch category name
        const categoriesResponse = await fetchCategories();
        if (categoriesResponse.success) {
          const category = categoriesResponse.data.find(c => c.category_id === parseInt(categoryId));
          if (category) {
            setCategoryName(category.name);
          }
        }

        // Fetch threads
        const threadsResponse = await fetchThreads({ category_id: parseInt(categoryId) });
        if (threadsResponse.success) {
          setThreads(threadsResponse.data);
        } else {
          setError(threadsResponse.error?.message || 'حدث خطأ أثناء جلب المناقشات');
        }
      } catch (err) {
        setError('حدث خطأ غير متوقع');
        console.error('Error fetching category data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="space-y-6">
      {categoryName && (
        <div className="flex items-center gap-2 text-gray-900">
          <Hash className="w-5 h-5" />
          <h1 className="text-xl font-semibold">التصنيف: {categoryName}</h1>
        </div>
      )}

      <div className="space-y-4">
        {threads.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد مناقشات في هذا التصنيف</p>
        ) : (
          threads.map((thread) => (
            <ThreadItem
              key={thread.thread_id}
              {...thread}
              showFullContent={false}
            />
          ))
        )}
      </div>
    </div>
  );
} 