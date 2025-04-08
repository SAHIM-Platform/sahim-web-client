"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseRedirect";

export default function ExplorePage() {
  const { isAuthenticated, auth } = useAuth();
  useAuthRedirect(isAuthenticated);

  if (auth.loading) {
    return <LoadingSpinner size="lg" color="primary" fullScreen={true} />;
  }

  return (
    <ThreadListing />
  )
}
