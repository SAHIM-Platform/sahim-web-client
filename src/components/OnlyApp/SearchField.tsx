import { Search } from "lucide-react";
import Input from "../Input";
import { cn } from "@/utils/utils";
import { useEffect, useRef } from "react";
import Button from "../Button";

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
  isLoading?: boolean;
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
  variant = "default",
  isLoading = false
}: SearchFieldProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef(searchQuery);

  useEffect(() => {
    const timeout = debounceTimeout.current;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    currentQueryRef.current = value;
  };

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    onKeyDown?.(e);
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
    <div className="flex gap-2">
      <Input
        startIcon={<Search className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        endIcon={shortcutElement}
        inputSize='default'
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        className={cn(
          variant === "modal" && "bg-gray-50",
          className
        )}
      />
      <Button
        onClick={handleSearch}
        isLoading={isLoading}
        disabled={!searchQuery.trim()}
        className="whitespace-nowrap"
      >
        بحث
      </Button>
    </div>
  );
}

export default SearchField;
