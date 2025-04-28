"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import { checkAuthLoadingWithRedirect } from "@/utils/loading";

export default function ExplorePage() {
  if (checkAuthLoadingWithRedirect()) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <ThreadListing />
  )
}
