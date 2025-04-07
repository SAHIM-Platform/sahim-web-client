"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const useAuthRedirect = (isAuthenticated: () => boolean): void => {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (isAuthenticated()) {
      if (pathName === "/login" || pathName === "/signup")
        router.push("/explore");
    } else {
      if (
        pathName.startsWith("/explore") || pathName.startsWith("/discussion")) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathName, router]);
};

export default useAuthRedirect;
