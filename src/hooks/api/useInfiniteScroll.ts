import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ hasMore, isLoading, onLoadMore }: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current && targetRef.current) {
        observerRef.current.unobserve(targetRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return targetRef;
}
