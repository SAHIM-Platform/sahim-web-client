import { Search } from "lucide-react";
import Input from "../Input";
import { cn } from "@/utils/utils";
import { useEffect, useRef } from "react";

interface SearchFieldProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  shortcut?: string;
  shortcutLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  className?: string;
  variant?: "default" | "modal";
}

function SearchField({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder = "ابحث في المناقشات ...",
  shortcut,
  shortcutLabel,
  onKeyDown,
  autoFocus,
  className,
  variant = "default"
}: SearchFieldProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        onSearch();
      }, 500);
    }
  };

  const shortcutElement = shortcut ? (
    <div className="flex items-center gap-1 text-xs text-gray-400 mx-3">
      <kbd className={cn(
        "py-0.5 px-1.5 rounded text-xs font-medium text-gray-500",
        variant === "modal" ? "bg-white shadow-sm" : "bg-gray-50 border border-gray-100",
        "shadow-sm",
      )}>
        {shortcut}
      </kbd>
      {shortcutLabel && <span>{shortcutLabel}</span>}
    </div>
  ) : undefined;

  return (
    <Input
      startIcon={<Search className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      endIcon={shortcutElement}
      inputSize='default'
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      className={cn(
        variant === "modal" && "bg-gray-50",
        className
      )}
    />
  );
}

export default SearchField;
