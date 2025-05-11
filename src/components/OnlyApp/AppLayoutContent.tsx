"use client";

import { useState } from "react";
import AppNavbar from "./AppNavbar/AppNavbar";
import AppMenuSidebar from "./AppMenuSidebar";
import AppInfoSidebar from "./AppInfoSidebar";
import Container from "../Container";
import { useSearchShortcuts } from "@/hooks";
import { GlobalAdminAlert } from "./GlobalAlert";

export default function AppLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuSidebarOpen, setIsMenuSidebarOpen] = useState(false);
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);

  useSearchShortcuts(isSearchFocused, setIsSearchFocused);

  return (
    <div className="flex-1 min-h-screen bg-[#fafafa]">
      <AppNavbar
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        onToggleMenuSidebar={() => setIsMenuSidebarOpen(prev => !prev)}
        onToggleInfoSidebar={() => setIsInfoSidebarOpen(prev => !prev)}
      />

      <AppMenuSidebar
        isOpen={isMenuSidebarOpen}
        onClose={() => setIsMenuSidebarOpen(false)}
      />

      {/* <AppInfoSidebar
        isOpen={isInfoSidebarOpen}
        onClose={() => setIsInfoSidebarOpen(false)}
      /> */}

      <div className="lg:pr-[280px] xl:pl-[320px]">
        <main className="pb-24 pt-36 min-h-screen h-full">
          <div className="px-4">
            <Container narrow className="min-h-full">
              <GlobalAdminAlert />
              {children}
            </Container>
          </div>
        </main>
      </div>
    </div>
  );
} 