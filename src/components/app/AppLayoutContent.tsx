"use client";

import { useState } from "react";
import AppNavbar from "./AppNavbar/AppNavbar";
import { useSearchShortcuts } from "@/hooks/useSearchShortcuts";
import AppMenuSidebar from "./AppMenuSidebar";
import AppInfoSidebar from "./AppInfoSidebar";

export default function AppLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useSearchShortcuts(isSearchFocused, setIsSearchFocused);

  return (
    <div className="flex-1 min-h-screen bg-[#fbfcfd]">
      <AppNavbar
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />

      <AppMenuSidebar />

      <AppInfoSidebar />
    </div>
  );
} 