"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import useAuth from "@/hooks/useAuth";
import useAuthRedirect from "@/hooks/UseRedirect";

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  useAuthRedirect(isAuthenticated);

  return (
    <ThreadListing />
  )
}
