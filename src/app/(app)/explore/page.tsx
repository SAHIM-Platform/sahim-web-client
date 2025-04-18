"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseAuthRedirect";

export default function ExplorePage() {
  const { auth } = useAuth();
  const isLoading = useAuthRedirect();

  if (auth.loading || isLoading) {
    return <LoadingSpinner size="xl" color="primary" fullScreen={true} />;
  }

  return (
    <ThreadListing />
  )
}
