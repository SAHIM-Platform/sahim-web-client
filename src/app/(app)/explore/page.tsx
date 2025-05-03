"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAuthLoadingOrRedirecting } from "@/utils/loading";

export default function ExplorePage() {
  if (isAuthLoadingOrRedirecting()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <ThreadListing />
  )
}
