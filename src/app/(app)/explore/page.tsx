"use client";
import ThreadListing from "@/components/App/ThreadListing/ThreadListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLoading } from "@/hooks";

export default function ExplorePage() {
  const { isAuthLoadingOrRedirecting } = useLoading();

  if (isAuthLoadingOrRedirecting) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <ThreadListing />
  )
}
