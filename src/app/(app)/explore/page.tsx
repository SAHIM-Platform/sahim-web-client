"use client";
import ThreadListing from "@/components/app/ThreadListing/ThreadListing";
import useAuthRedirect from "@/hooks/UseRedirect";

export default function ExplorePage() {
useAuthRedirect(() => false);

  return (
    <ThreadListing />
  )
}
