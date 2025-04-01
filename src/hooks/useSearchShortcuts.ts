import { useEffect } from "react";

export function useSearchShortcuts(
  isSearchFocused: boolean,
  setIsSearchFocused: (value: boolean) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "/" && !isSearchFocused) {
        e.preventDefault();
        setIsSearchFocused(true);
      }

      if (e.key === "Escape" && isSearchFocused) {
        e.preventDefault();
        setIsSearchFocused(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused, setIsSearchFocused]);
}