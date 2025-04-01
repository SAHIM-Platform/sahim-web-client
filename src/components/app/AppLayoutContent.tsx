"use client";

import { useState } from "react";
import AppNavbar from "./AppNavbar/AppNavbar";
import { useSearchShortcuts } from "@/hooks/useSearchShortcuts";
import AppMenuSidebar from "./AppMenuSidebar";
import AppInfoSidebar from "./AppInfoSidebar";
import Container from "../Container";

export default function AppLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useSearchShortcuts(isSearchFocused, setIsSearchFocused);

  return (
    <div className="flex-1 min-h-screen bg-[#fafafa]">
      <AppNavbar
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
      />

      <AppMenuSidebar />

      <AppInfoSidebar />

      <div className="lg:pr-[280px] xl:pl-[320px]">
        <main className="pb-24 pt-36 min-h-screen h-full">
          <div className="px-4">
            <Container narrow className="min-h-full">
              {children}
            </Container>
          </div>
        </main>
      </div>
    </div>
  );
} 